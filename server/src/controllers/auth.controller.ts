import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken, getTokenExpiry } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role, department, employeeId } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      errorResponse(res, 'Email already in use', 409);
      return;
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'EMPLOYEE', department, employeeId },
      select: { id: true, name: true, email: true, role: true, department: true, createdAt: true },
    });

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email, role: user.role });
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: getTokenExpiry('7d') },
    });

    // Welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'welcome',
        module: 'AUTH',
        title: 'Welcome to EcoSphere!',
        message: `Hi ${name}, your account is set up. Start tracking your ESG impact today!`,
        actionLabel: 'Get Started',
      },
    });

    successResponse(res, { user, accessToken, refreshToken }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email, role: user.role });
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: getTokenExpiry('7d') },
    });

    const { password: _, ...safeUser } = user;
    successResponse(res, { user: safeUser, accessToken, refreshToken }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      errorResponse(res, 'Refresh token required', 400);
      return;
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      errorResponse(res, 'Invalid or expired refresh token', 401);
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.isActive) {
      errorResponse(res, 'User not found', 401);
      return;
    }

    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    const newAccessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const newRefreshToken = signRefreshToken({ userId: user.id, email: user.email, role: user.role });
    await prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: user.id, expiresAt: getTokenExpiry('7d') },
    });

    successResponse(res, { accessToken: newAccessToken, refreshToken: newRefreshToken }, 'Tokens refreshed');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true, name: true, email: true, role: true, department: true,
        employeeId: true, level: true, totalXp: true, streak: true,
        avatarUrl: true, isActive: true, createdAt: true, updatedAt: true,
        userBadges: { include: { badge: true } },
        _count: { select: { participations: true, challengeParticipations: true } },
      },
    });
    if (!user) { errorResponse(res, 'User not found', 404); return; }
    successResponse(res, user, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, department, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { name, department, avatarUrl },
      select: { id: true, name: true, email: true, role: true, department: true, avatarUrl: true, updatedAt: true },
    });
    successResponse(res, user, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) { errorResponse(res, 'User not found', 404); return; }

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) { errorResponse(res, 'Current password is incorrect', 400); return; }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

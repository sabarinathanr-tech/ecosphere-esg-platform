import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '../utils/response';

// ─── CSR ACTIVITIES ──────────────────────────────────────────────────────────

export const getCSRActivities = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }, { organizer: { contains: search, mode: 'insensitive' } }];
    if (req.query.category) where.category = req.query.category;
    if (req.query.status) where.status = req.query.status;

    const [data, total] = await Promise.all([
      prisma.cSRActivity.findMany({
        where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: { _count: { select: { participations: true } } },
      }),
      prisma.cSRActivity.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'CSR activities retrieved');
  } catch (error) { next(error); }
};

export const getCSRActivityById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const activity = await prisma.cSRActivity.findUnique({
      where: { id: req.params.id },
      include: { participations: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } } },
    });
    if (!activity) { errorResponse(res, 'CSR activity not found', 404); return; }
    successResponse(res, activity, 'CSR activity retrieved');
  } catch (error) { next(error); }
};

export const createCSRActivity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    const activity = await prisma.cSRActivity.create({ data });
    successResponse(res, activity, 'CSR activity created', 201);
  } catch (error) { next(error); }
};

export const updateCSRActivity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    const activity = await prisma.cSRActivity.update({ where: { id: req.params.id }, data });
    successResponse(res, activity, 'CSR activity updated');
  } catch (error) { next(error); }
};

export const deleteCSRActivity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.cSRActivity.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'CSR activity deleted');
  } catch (error) { next(error); }
};

// ─── EMPLOYEE PARTICIPATION ──────────────────────────────────────────────────

export const getParticipations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (req.query.userId) where.userId = req.query.userId;
    if (req.query.activityId) where.activityId = req.query.activityId;
    if (req.query.activityType) where.activityType = req.query.activityType;
    if (req.query.status) where.status = req.query.status;

    const [data, total] = await Promise.all([
      prisma.employeeParticipation.findMany({
        where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          activity: { select: { id: true, title: true, category: true } },
          verifiedBy: { select: { id: true, name: true } },
        },
      }),
      prisma.employeeParticipation.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Participations retrieved');
  } catch (error) { next(error); }
};

export const getParticipationById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const p = await prisma.employeeParticipation.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, name: true } }, activity: true, verifiedBy: { select: { id: true, name: true } } },
    });
    if (!p) { errorResponse(res, 'Participation not found', 404); return; }
    successResponse(res, p, 'Participation retrieved');
  } catch (error) { next(error); }
};

export const createParticipation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    const p = await prisma.employeeParticipation.create({ data, include: { user: { select: { id: true, name: true } }, activity: { select: { id: true, title: true } } } });

    // Award XP to user
    if (p.xpEarned > 0) {
      await prisma.user.update({ where: { id: p.userId }, data: { totalXp: { increment: p.xpEarned } } });
    }
    successResponse(res, p, 'Participation created', 201);
  } catch (error) { next(error); }
};

export const updateParticipation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    const p = await prisma.employeeParticipation.update({ where: { id: req.params.id }, data });
    successResponse(res, p, 'Participation updated');
  } catch (error) { next(error); }
};

export const deleteParticipation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.employeeParticipation.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Participation deleted');
  } catch (error) { next(error); }
};

// ─── TRAINING PROGRAMS ────────────────────────────────────────────────────────

export const getTrainingPrograms = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { instructor: { contains: search, mode: 'insensitive' } }];
    if (req.query.category) where.category = req.query.category;
    if (req.query.status) where.status = req.query.status;
    if (req.query.mandatory !== undefined) where.mandatory = req.query.mandatory === 'true';

    const [data, total] = await Promise.all([
      prisma.trainingProgram.findMany({ where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder } }),
      prisma.trainingProgram.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Training programs retrieved');
  } catch (error) { next(error); }
};

export const getTrainingProgramById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const program = await prisma.trainingProgram.findUnique({ where: { id: req.params.id } });
    if (!program) { errorResponse(res, 'Training program not found', 404); return; }
    successResponse(res, program, 'Training program retrieved');
  } catch (error) { next(error); }
};

export const createTrainingProgram = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    const program = await prisma.trainingProgram.create({ data });
    successResponse(res, program, 'Training program created', 201);
  } catch (error) { next(error); }
};

export const updateTrainingProgram = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    const program = await prisma.trainingProgram.update({ where: { id: req.params.id }, data });
    successResponse(res, program, 'Training program updated');
  } catch (error) { next(error); }
};

export const deleteTrainingProgram = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.trainingProgram.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Training program deleted');
  } catch (error) { next(error); }
};

// ─── DIVERSITY STATS ──────────────────────────────────────────────────────────

export const getDiversityStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalUsers, totalDepts, trainingStats, participationStats] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.department.count({ where: { status: 'ACTIVE' } }),
      prisma.trainingProgram.aggregate({ _sum: { enrolled: true, completed: true }, _avg: { rating: true } }),
      prisma.employeeParticipation.groupBy({ by: ['activityType'], _count: true }),
    ]);

    const completionRate = trainingStats._sum.enrolled
      ? ((trainingStats._sum.completed || 0) / trainingStats._sum.enrolled) * 100
      : 0;

    successResponse(res, {
      totalEmployees: totalUsers,
      totalDepartments: totalDepts,
      trainingCompletionRate: Math.round(completionRate * 10) / 10,
      avgTrainingRating: trainingStats._avg.rating || 0,
      participationByType: participationStats,
    }, 'Diversity stats retrieved');
  } catch (error) { next(error); }
};

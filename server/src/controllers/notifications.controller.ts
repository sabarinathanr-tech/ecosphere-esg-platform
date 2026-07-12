import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '../utils/response';

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const userId = req.user!.userId;
    const where: any = { userId };
    if (req.query.read !== undefined) where.read = req.query.read === 'true';
    if (req.query.module) where.module = req.query.module;

    const [data, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved',
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), unreadCount },
    });
  } catch (error) { next(error); }
};

export const markNotificationRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notification) { errorResponse(res, 'Notification not found', 404); return; }
    if (notification.userId !== req.user!.userId) { errorResponse(res, 'Unauthorized', 403); return; }

    const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
    successResponse(res, updated, 'Notification marked as read');
  } catch (error) { next(error); }
};

export const markAllRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await prisma.notification.updateMany({
      where: { userId: req.user!.userId, read: false },
      data: { read: true },
    });
    successResponse(res, { count: result.count }, 'All notifications marked as read');
  } catch (error) { next(error); }
};

export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notification) { errorResponse(res, 'Notification not found', 404); return; }
    if (notification.userId !== req.user!.userId) { errorResponse(res, 'Unauthorized', 403); return; }

    await prisma.notification.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Notification deleted');
  } catch (error) { next(error); }
};

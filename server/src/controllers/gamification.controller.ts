import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '../utils/response';

// ─── CHALLENGES ───────────────────────────────────────────────────────────────

export const getChallenges = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    if (req.query.category) where.category = req.query.category;
    if (req.query.status) where.status = req.query.status;

    const [data, total] = await Promise.all([
      prisma.challenge.findMany({
        where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
          createdBy: { select: { id: true, name: true } },
          _count: { select: { participations: true } },
        },
      }),
      prisma.challenge.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Challenges retrieved');
  } catch (error) { next(error); }
};

export const getChallengeById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: { select: { id: true, name: true } },
        participations: { include: { user: { select: { id: true, name: true, avatarUrl: true } } }, take: 10 },
        _count: { select: { participations: true } },
      },
    });
    if (!challenge) { errorResponse(res, 'Challenge not found', 404); return; }
    successResponse(res, challenge, 'Challenge retrieved');
  } catch (error) { next(error); }
};

export const createChallenge = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body, createdById: req.user!.userId };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    const challenge = await prisma.challenge.create({ data, include: { createdBy: { select: { id: true, name: true } } } });
    successResponse(res, challenge, 'Challenge created', 201);
  } catch (error) { next(error); }
};

export const updateChallenge = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    const challenge = await prisma.challenge.update({ where: { id: req.params.id }, data });
    successResponse(res, challenge, 'Challenge updated');
  } catch (error) { next(error); }
};

export const deleteChallenge = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.challenge.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Challenge deleted');
  } catch (error) { next(error); }
};

// ─── CHALLENGE PARTICIPATION ──────────────────────────────────────────────────

export const getChallengeParticipations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (req.query.challengeId) where.challengeId = req.query.challengeId;
    if (req.query.userId) where.userId = req.query.userId;
    if (req.query.status) where.status = req.query.status;

    const [data, total] = await Promise.all([
      prisma.challengeParticipation.findMany({
        where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
          challenge: { select: { id: true, title: true, category: true, xpReward: true } },
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.challengeParticipation.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Challenge participations retrieved');
  } catch (error) { next(error); }
};

export const getChallengeParticipationById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cp = await prisma.challengeParticipation.findUnique({
      where: { id: req.params.id },
      include: { challenge: true, user: { select: { id: true, name: true } } },
    });
    if (!cp) { errorResponse(res, 'Challenge participation not found', 404); return; }
    successResponse(res, cp, 'Challenge participation retrieved');
  } catch (error) { next(error); }
};

export const createChallengeParticipation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cp = await prisma.challengeParticipation.create({
      data: req.body,
      include: { challenge: { select: { id: true, title: true } }, user: { select: { id: true, name: true } } },
    });
    successResponse(res, cp, 'Joined challenge', 201);
  } catch (error) { next(error); }
};

export const updateChallengeParticipation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    const existing = await prisma.challengeParticipation.findUnique({ where: { id: req.params.id }, include: { challenge: true } });
    if (!existing) { errorResponse(res, 'Participation not found', 404); return; }

    if (data.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      data.completionDate = new Date();
      data.xpEarned = existing.challenge.xpReward;
      await prisma.user.update({ where: { id: existing.userId }, data: { totalXp: { increment: existing.challenge.xpReward } } });

      // Notification
      await prisma.notification.create({
        data: {
          userId: existing.userId,
          type: 'challenge_completed',
          module: 'GAMIFICATION',
          title: '🏆 Challenge Completed!',
          message: `You completed "${existing.challenge.title}" and earned ${existing.challenge.xpReward} XP!`,
          actionLabel: 'View Rewards',
        },
      });
    }

    const cp = await prisma.challengeParticipation.update({ where: { id: req.params.id }, data });
    successResponse(res, cp, 'Challenge participation updated');
  } catch (error) { next(error); }
};

export const deleteChallengeParticipation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.challengeParticipation.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Challenge participation deleted');
  } catch (error) { next(error); }
};

// ─── BADGES ───────────────────────────────────────────────────────────────────

export const getBadges = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    if (req.query.category) where.category = req.query.category;
    if (req.query.rarity) where.rarity = req.query.rarity;

    const [data, total] = await Promise.all([
      prisma.badge.findMany({ where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder }, include: { _count: { select: { userBadges: true } } } }),
      prisma.badge.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Badges retrieved');
  } catch (error) { next(error); }
};

export const getBadgeById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const badge = await prisma.badge.findUnique({ where: { id: req.params.id }, include: { _count: { select: { userBadges: true } } } });
    if (!badge) { errorResponse(res, 'Badge not found', 404); return; }
    successResponse(res, badge, 'Badge retrieved');
  } catch (error) { next(error); }
};

export const createBadge = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const badge = await prisma.badge.create({ data: req.body });
    successResponse(res, badge, 'Badge created', 201);
  } catch (error) { next(error); }
};

export const updateBadge = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const badge = await prisma.badge.update({ where: { id: req.params.id }, data: req.body });
    successResponse(res, badge, 'Badge updated');
  } catch (error) { next(error); }
};

export const deleteBadge = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.badge.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Badge deleted');
  } catch (error) { next(error); }
};

export const awardBadge = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.body;
    const { id: badgeId } = req.params;
    const userBadge = await prisma.userBadge.create({ data: { userId, badgeId } });
    await prisma.badge.update({ where: { id: badgeId }, data: { totalAwarded: { increment: 1 } } });
    successResponse(res, userBadge, 'Badge awarded', 201);
  } catch (error) { next(error); }
};

// ─── REWARDS ──────────────────────────────────────────────────────────────────

export const getRewards = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    if (req.query.category) where.category = req.query.category;
    if (req.query.status) where.status = req.query.status;

    const [data, total] = await Promise.all([
      prisma.reward.findMany({ where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder }, include: { _count: { select: { redemptions: true } } } }),
      prisma.reward.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Rewards retrieved');
  } catch (error) { next(error); }
};

export const getRewardById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reward = await prisma.reward.findUnique({ where: { id: req.params.id } });
    if (!reward) { errorResponse(res, 'Reward not found', 404); return; }
    successResponse(res, reward, 'Reward retrieved');
  } catch (error) { next(error); }
};

export const createReward = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.validUntil) data.validUntil = new Date(data.validUntil);
    const reward = await prisma.reward.create({ data });
    successResponse(res, reward, 'Reward created', 201);
  } catch (error) { next(error); }
};

export const updateReward = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.validUntil) data.validUntil = new Date(data.validUntil);
    const reward = await prisma.reward.update({ where: { id: req.params.id }, data });
    successResponse(res, reward, 'Reward updated');
  } catch (error) { next(error); }
};

export const deleteReward = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.reward.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Reward deleted');
  } catch (error) { next(error); }
};

// ─── REWARD REDEMPTIONS ───────────────────────────────────────────────────────

export const getRedemptions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (req.query.userId) where.userId = req.query.userId;
    if (req.query.rewardId) where.rewardId = req.query.rewardId;
    if (req.query.status) where.status = req.query.status;

    const [data, total] = await Promise.all([
      prisma.rewardRedemption.findMany({
        where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
          reward: { select: { id: true, title: true, category: true } },
          user: { select: { id: true, name: true, email: true } },
          approvedBy: { select: { id: true, name: true } },
        },
      }),
      prisma.rewardRedemption.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Redemptions retrieved');
  } catch (error) { next(error); }
};

export const getRedemptionById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const redemption = await prisma.rewardRedemption.findUnique({
      where: { id: req.params.id },
      include: { reward: true, user: { select: { id: true, name: true } }, approvedBy: { select: { id: true, name: true } } },
    });
    if (!redemption) { errorResponse(res, 'Redemption not found', 404); return; }
    successResponse(res, redemption, 'Redemption retrieved');
  } catch (error) { next(error); }
};

export const createRedemption = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.body.userId || req.user!.userId;
    const reward = await prisma.reward.findUnique({ where: { id: req.body.rewardId } });
    if (!reward || reward.status !== 'AVAILABLE') { errorResponse(res, 'Reward not available', 400); return; }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { errorResponse(res, 'User not found', 404); return; }
    if (user.totalXp < reward.xpCost) { errorResponse(res, 'Insufficient XP', 400); return; }

    const redemption = await prisma.$transaction(async (tx) => {
      const r = await tx.rewardRedemption.create({
        data: { rewardId: req.body.rewardId, userId, xpSpent: reward.xpCost, monetaryValue: reward.monetaryValue },
      });
      await tx.user.update({ where: { id: userId }, data: { totalXp: { decrement: reward.xpCost } } });
      await tx.reward.update({ where: { id: reward.id }, data: { totalRedeemed: { increment: 1 } } });
      return r;
    });

    successResponse(res, redemption, 'Reward redeemed successfully', 201);
  } catch (error) { next(error); }
};

export const updateRedemption = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.status === 'APPROVED') { data.approvedById = req.user!.userId; }
    if (data.status === 'FULFILLED') { data.fulfilledDate = new Date(); }
    const redemption = await prisma.rewardRedemption.update({ where: { id: req.params.id }, data });
    successResponse(res, redemption, 'Redemption updated');
  } catch (error) { next(error); }
};

export const deleteRedemption = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.rewardRedemption.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Redemption deleted');
  } catch (error) { next(error); }
};

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────

export const getLeaderboard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { period, department, limit = '20' } = req.query as any;
    const take = Math.min(parseInt(limit) || 20, 100);

    const where: any = { isActive: true };
    if (department) where.department = department;

    const users = await prisma.user.findMany({
      where,
      take,
      orderBy: { totalXp: 'desc' },
      select: {
        id: true, name: true, email: true, department: true,
        totalXp: true, level: true, streak: true, avatarUrl: true,
        _count: { select: { userBadges: true, challengeParticipations: true } },
      },
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    successResponse(res, leaderboard, 'Leaderboard retrieved');
  } catch (error) { next(error); }
};

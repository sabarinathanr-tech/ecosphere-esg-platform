import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '../utils/response';

// ─── EMISSION FACTORS ───────────────────────────────────────────────────────

export const getEmissionFactors = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { source: { contains: search, mode: 'insensitive' } }];
    if (req.query.category) where.category = req.query.category;
    if (req.query.scope) where.scope = req.query.scope;
    if (req.query.isActive !== undefined) where.isActive = req.query.isActive === 'true';

    const [data, total] = await Promise.all([
      prisma.emissionFactor.findMany({ where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder } }),
      prisma.emissionFactor.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Emission factors retrieved');
  } catch (error) { next(error); }
};

export const getEmissionFactorById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const factor = await prisma.emissionFactor.findUnique({ where: { id: req.params.id } });
    if (!factor) { errorResponse(res, 'Emission factor not found', 404); return; }
    successResponse(res, factor, 'Emission factor retrieved');
  } catch (error) { next(error); }
};

export const createEmissionFactor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const factor = await prisma.emissionFactor.create({ data: req.body });
    successResponse(res, factor, 'Emission factor created', 201);
  } catch (error) { next(error); }
};

export const updateEmissionFactor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const factor = await prisma.emissionFactor.update({ where: { id: req.params.id }, data: req.body });
    successResponse(res, factor, 'Emission factor updated');
  } catch (error) { next(error); }
};

export const deleteEmissionFactor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.emissionFactor.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Emission factor deleted');
  } catch (error) { next(error); }
};

// ─── CARBON TRANSACTIONS ────────────────────────────────────────────────────

export const getCarbonTransactions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ activity: { contains: search, mode: 'insensitive' } }, { notes: { contains: search, mode: 'insensitive' } }];
    if (req.query.departmentId) where.departmentId = req.query.departmentId;
    if (req.query.scope) where.scope = req.query.scope;
    if (req.query.status) where.status = req.query.status;
    if (req.query.startDate && req.query.endDate) {
      where.date = { gte: new Date(req.query.startDate as string), lte: new Date(req.query.endDate as string) };
    }

    const [data, total] = await Promise.all([
      prisma.carbonTransaction.findMany({
        where, skip, take: limit,
        orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: { department: { select: { id: true, name: true } }, createdBy: { select: { id: true, name: true } }, factor: { select: { id: true, name: true } } },
      }),
      prisma.carbonTransaction.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Carbon transactions retrieved');
  } catch (error) { next(error); }
};

export const getCarbonTransactionById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tx = await prisma.carbonTransaction.findUnique({
      where: { id: req.params.id },
      include: { department: true, createdBy: { select: { id: true, name: true, email: true } }, verifiedBy: { select: { id: true, name: true } }, factor: true },
    });
    if (!tx) { errorResponse(res, 'Transaction not found', 404); return; }
    successResponse(res, tx, 'Carbon transaction retrieved');
  } catch (error) { next(error); }
};

export const createCarbonTransaction = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tx = await prisma.carbonTransaction.create({
      data: { ...req.body, createdById: req.user!.userId, date: new Date(req.body.date) },
      include: { department: true, createdBy: { select: { id: true, name: true } } },
    });
    successResponse(res, tx, 'Carbon transaction created', 201);
  } catch (error) { next(error); }
};

export const updateCarbonTransaction = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    if (data.status === 'VERIFIED') { data.verifiedById = req.user!.userId; data.verifiedAt = new Date(); }
    const tx = await prisma.carbonTransaction.update({ where: { id: req.params.id }, data });
    successResponse(res, tx, 'Carbon transaction updated');
  } catch (error) { next(error); }
};

export const deleteCarbonTransaction = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.carbonTransaction.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Carbon transaction deleted');
  } catch (error) { next(error); }
};

// ─── PRODUCT ESG PROFILES ────────────────────────────────────────────────────

export const getProductProfiles = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ productName: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }, { category: { contains: search, mode: 'insensitive' } }];
    if (req.query.status) where.status = req.query.status;
    if (req.query.category) where.category = { contains: req.query.category as string, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      prisma.productESGProfile.findMany({ where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder } }),
      prisma.productESGProfile.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Product profiles retrieved');
  } catch (error) { next(error); }
};

export const getProductProfileById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await prisma.productESGProfile.findUnique({ where: { id: req.params.id } });
    if (!profile) { errorResponse(res, 'Product profile not found', 404); return; }
    successResponse(res, profile, 'Product profile retrieved');
  } catch (error) { next(error); }
};

export const createProductProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await prisma.productESGProfile.create({ data: req.body });
    successResponse(res, profile, 'Product profile created', 201);
  } catch (error) { next(error); }
};

export const updateProductProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await prisma.productESGProfile.update({ where: { id: req.params.id }, data: req.body });
    successResponse(res, profile, 'Product profile updated');
  } catch (error) { next(error); }
};

export const deleteProductProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.productESGProfile.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Product profile deleted');
  } catch (error) { next(error); }
};

// ─── SUSTAINABILITY GOALS ────────────────────────────────────────────────────

export const getSustainabilityGoals = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    if (req.query.category) where.category = req.query.category;
    if (req.query.status) where.status = req.query.status;
    if (req.query.departmentId) where.departmentId = req.query.departmentId;

    const [data, total] = await Promise.all([
      prisma.sustainabilityGoal.findMany({
        where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: { owner: { select: { id: true, name: true } }, department: { select: { id: true, name: true } } },
      }),
      prisma.sustainabilityGoal.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Sustainability goals retrieved');
  } catch (error) { next(error); }
};

export const getSustainabilityGoalById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const goal = await prisma.sustainabilityGoal.findUnique({
      where: { id: req.params.id },
      include: { owner: { select: { id: true, name: true, email: true } }, department: true },
    });
    if (!goal) { errorResponse(res, 'Sustainability goal not found', 404); return; }
    successResponse(res, goal, 'Sustainability goal retrieved');
  } catch (error) { next(error); }
};

export const createSustainabilityGoal = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { targetValue, currentValue = 0 } = req.body;
    const progress = targetValue > 0 ? Math.min(100, (currentValue / targetValue) * 100) : 0;
    const goal = await prisma.sustainabilityGoal.create({
      data: { ...req.body, progress },
      include: { owner: { select: { id: true, name: true } }, department: { select: { id: true, name: true } } },
    });
    successResponse(res, goal, 'Sustainability goal created', 201);
  } catch (error) { next(error); }
};

export const updateSustainabilityGoal = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const existing = await prisma.sustainabilityGoal.findUnique({ where: { id: req.params.id } });
    if (!existing) { errorResponse(res, 'Goal not found', 404); return; }

    const targetValue = req.body.targetValue ?? existing.targetValue;
    const currentValue = req.body.currentValue ?? existing.currentValue;
    const progress = targetValue > 0 ? Math.min(100, (currentValue / targetValue) * 100) : 0;

    const goal = await prisma.sustainabilityGoal.update({
      where: { id: req.params.id },
      data: { ...req.body, progress },
    });
    successResponse(res, goal, 'Sustainability goal updated');
  } catch (error) { next(error); }
};

export const deleteSustainabilityGoal = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.sustainabilityGoal.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Sustainability goal deleted');
  } catch (error) { next(error); }
};

import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '../utils/response';

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────

export const getDepartments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }, { head: { contains: search, mode: 'insensitive' } }];
    if (req.query.status) where.status = req.query.status;

    const [data, total] = await Promise.all([
      prisma.department.findMany({ where, skip, take: limit, orderBy: { [sortBy || 'name']: sortOrder } }),
      prisma.department.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Departments retrieved');
  } catch (error) { next(error); }
};

export const getDepartmentById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dept = await prisma.department.findUnique({ where: { id: req.params.id } });
    if (!dept) { errorResponse(res, 'Department not found', 404); return; }
    successResponse(res, dept, 'Department retrieved');
  } catch (error) { next(error); }
};

export const createDepartment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dept = await prisma.department.create({ data: { ...req.body, code: req.body.code.toUpperCase() } });
    successResponse(res, dept, 'Department created', 201);
  } catch (error) { next(error); }
};

export const updateDepartment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body.code ? { ...req.body, code: req.body.code.toUpperCase() } : req.body;
    const dept = await prisma.department.update({ where: { id: req.params.id }, data });
    successResponse(res, dept, 'Department updated');
  } catch (error) { next(error); }
};

export const deleteDepartment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.department.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Department deleted');
  } catch (error) { next(error); }
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    if (req.query.module) where.module = req.query.module;
    if (req.query.status) where.status = req.query.status;

    const [data, total] = await Promise.all([
      prisma.category.findMany({ where, skip, take: limit, orderBy: { [sortBy || 'name']: sortOrder } }),
      prisma.category.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Categories retrieved');
  } catch (error) { next(error); }
};

export const getCategoryById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cat = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!cat) { errorResponse(res, 'Category not found', 404); return; }
    successResponse(res, cat, 'Category retrieved');
  } catch (error) { next(error); }
};

export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cat = await prisma.category.create({ data: req.body });
    successResponse(res, cat, 'Category created', 201);
  } catch (error) { next(error); }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cat = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
    successResponse(res, cat, 'Category updated');
  } catch (error) { next(error); }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Category deleted');
  } catch (error) { next(error); }
};

// ─── USERS (admin) ────────────────────────────────────────────────────────────

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }];
    if (req.query.role) where.role = req.query.role;
    if (req.query.department) where.department = req.query.department;
    if (req.query.isActive !== undefined) where.isActive = req.query.isActive === 'true';

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: limit,
        orderBy: { [sortBy || 'createdAt']: sortOrder },
        select: { id: true, name: true, email: true, role: true, department: true, employeeId: true, level: true, totalXp: true, streak: true, avatarUrl: true, isActive: true, createdAt: true },
      }),
      prisma.user.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Users retrieved');
  } catch (error) { next(error); }
};

export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, role: true, department: true, employeeId: true, level: true, totalXp: true, streak: true, avatarUrl: true, isActive: true, createdAt: true, updatedAt: true, userBadges: { include: { badge: true } } },
    });
    if (!user) { errorResponse(res, 'User not found', 404); return; }
    successResponse(res, user, 'User retrieved');
  } catch (error) { next(error); }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { password, ...data } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, name: true, email: true, role: true, department: true, isActive: true, updatedAt: true },
    });
    successResponse(res, user, 'User updated');
  } catch (error) { next(error); }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } });
    successResponse(res, null, 'User deactivated');
  } catch (error) { next(error); }
};

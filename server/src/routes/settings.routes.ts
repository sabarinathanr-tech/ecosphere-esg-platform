import { Router } from 'express';
import {
  getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment,
  getCategories, getCategoryById, createCategory, updateCategory, deleteCategory,
  getUsers, getUserById, updateUser, deleteUser,
} from '../controllers/settings.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  createDepartmentSchema, updateDepartmentSchema,
  createCategorySchema, updateCategorySchema,
} from '../schemas';

const router = Router();
router.use(authenticate);

// Departments
router.get('/departments', getDepartments);
router.get('/departments/:id', getDepartmentById);
router.post('/departments', authorize('ADMIN'), validateBody(createDepartmentSchema), createDepartment);
router.put('/departments/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateDepartmentSchema), updateDepartment);
router.delete('/departments/:id', authorize('ADMIN'), deleteDepartment);

// Categories
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', authorize('ADMIN'), validateBody(createCategorySchema), createCategory);
router.put('/categories/:id', authorize('ADMIN'), validateBody(updateCategorySchema), updateCategory);
router.delete('/categories/:id', authorize('ADMIN'), deleteCategory);

// Users (admin)
router.get('/users', authorize('ADMIN', 'MANAGER'), getUsers);
router.get('/users/:id', authorize('ADMIN', 'MANAGER'), getUserById);
router.put('/users/:id', authorize('ADMIN'), updateUser);
router.delete('/users/:id', authorize('ADMIN'), deleteUser);

export default router;

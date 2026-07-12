import { Router } from 'express';
import {
  getEmissionFactors, getEmissionFactorById, createEmissionFactor, updateEmissionFactor, deleteEmissionFactor,
  getCarbonTransactions, getCarbonTransactionById, createCarbonTransaction, updateCarbonTransaction, deleteCarbonTransaction,
  getProductProfiles, getProductProfileById, createProductProfile, updateProductProfile, deleteProductProfile,
  getSustainabilityGoals, getSustainabilityGoalById, createSustainabilityGoal, updateSustainabilityGoal, deleteSustainabilityGoal,
} from '../controllers/environment.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  createEmissionFactorSchema, updateEmissionFactorSchema,
  createCarbonTransactionSchema, updateCarbonTransactionSchema,
  createProductProfileSchema, updateProductProfileSchema,
  createSustainabilityGoalSchema, updateSustainabilityGoalSchema,
} from '../schemas';

const router = Router();
router.use(authenticate);

// Emission Factors
router.get('/emission-factors', getEmissionFactors);
router.get('/emission-factors/:id', getEmissionFactorById);
router.post('/emission-factors', authorize('ADMIN', 'MANAGER'), validateBody(createEmissionFactorSchema), createEmissionFactor);
router.put('/emission-factors/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateEmissionFactorSchema), updateEmissionFactor);
router.delete('/emission-factors/:id', authorize('ADMIN'), deleteEmissionFactor);

// Carbon Transactions
router.get('/carbon-transactions', getCarbonTransactions);
router.get('/carbon-transactions/:id', getCarbonTransactionById);
router.post('/carbon-transactions', authorize('ADMIN', 'MANAGER', 'EMPLOYEE'), validateBody(createCarbonTransactionSchema), createCarbonTransaction);
router.put('/carbon-transactions/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateCarbonTransactionSchema), updateCarbonTransaction);
router.delete('/carbon-transactions/:id', authorize('ADMIN'), deleteCarbonTransaction);

// Product ESG Profiles
router.get('/product-profiles', getProductProfiles);
router.get('/product-profiles/:id', getProductProfileById);
router.post('/product-profiles', authorize('ADMIN', 'MANAGER'), validateBody(createProductProfileSchema), createProductProfile);
router.put('/product-profiles/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateProductProfileSchema), updateProductProfile);
router.delete('/product-profiles/:id', authorize('ADMIN'), deleteProductProfile);

// Sustainability Goals
router.get('/sustainability-goals', getSustainabilityGoals);
router.get('/sustainability-goals/:id', getSustainabilityGoalById);
router.post('/sustainability-goals', authorize('ADMIN', 'MANAGER'), validateBody(createSustainabilityGoalSchema), createSustainabilityGoal);
router.put('/sustainability-goals/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateSustainabilityGoalSchema), updateSustainabilityGoal);
router.delete('/sustainability-goals/:id', authorize('ADMIN'), deleteSustainabilityGoal);

export default router;

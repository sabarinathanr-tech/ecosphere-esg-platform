import { Router } from 'express';
import {
  getCSRActivities, getCSRActivityById, createCSRActivity, updateCSRActivity, deleteCSRActivity,
  getParticipations, getParticipationById, createParticipation, updateParticipation, deleteParticipation,
  getTrainingPrograms, getTrainingProgramById, createTrainingProgram, updateTrainingProgram, deleteTrainingProgram,
  getDiversityStats,
} from '../controllers/social.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  createCSRActivitySchema, updateCSRActivitySchema,
  createParticipationSchema, updateParticipationSchema,
  createTrainingProgramSchema, updateTrainingProgramSchema,
} from '../schemas';

const router = Router();
router.use(authenticate);

// CSR Activities
router.get('/csr-activities', getCSRActivities);
router.get('/csr-activities/:id', getCSRActivityById);
router.post('/csr-activities', authorize('ADMIN', 'MANAGER'), validateBody(createCSRActivitySchema), createCSRActivity);
router.put('/csr-activities/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateCSRActivitySchema), updateCSRActivity);
router.delete('/csr-activities/:id', authorize('ADMIN'), deleteCSRActivity);

// Employee Participation
router.get('/employee-participation', getParticipations);
router.get('/employee-participation/:id', getParticipationById);
router.post('/employee-participation', authorize('ADMIN', 'MANAGER', 'EMPLOYEE'), validateBody(createParticipationSchema), createParticipation);
router.put('/employee-participation/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateParticipationSchema), updateParticipation);
router.delete('/employee-participation/:id', authorize('ADMIN'), deleteParticipation);

// Training Programs
router.get('/training-programs', getTrainingPrograms);
router.get('/training-programs/:id', getTrainingProgramById);
router.post('/training-programs', authorize('ADMIN', 'MANAGER'), validateBody(createTrainingProgramSchema), createTrainingProgram);
router.put('/training-programs/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateTrainingProgramSchema), updateTrainingProgram);
router.delete('/training-programs/:id', authorize('ADMIN'), deleteTrainingProgram);

// Diversity Stats
router.get('/diversity/stats', getDiversityStats);

export default router;

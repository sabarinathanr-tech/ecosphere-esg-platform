import { Router } from 'express';
import {
  getEnvironmentalReport,
  getSocialReport,
  getGovernanceReport,
  getESGSummary,
} from '../controllers/reports.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/reports/environmental', getEnvironmentalReport);
router.get('/reports/social', getSocialReport);
router.get('/reports/governance', getGovernanceReport);
router.get('/reports/esg-summary', getESGSummary);

export default router;

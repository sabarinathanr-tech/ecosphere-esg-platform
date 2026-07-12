import { Router } from 'express';
import {
  getPolicies, getPolicyById, createPolicy, updatePolicy, deletePolicy,
  getAcknowledgements, getAcknowledgementById, createAcknowledgement, updateAcknowledgement, deleteAcknowledgement,
  getAudits, getAuditById, createAudit, updateAudit, deleteAudit,
  getComplianceIssues, getComplianceIssueById, createComplianceIssue, updateComplianceIssue, deleteComplianceIssue,
} from '../controllers/governance.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  createPolicySchema, updatePolicySchema,
  createAcknowledgementSchema, updateAcknowledgementSchema,
  createAuditSchema, updateAuditSchema,
  createComplianceIssueSchema, updateComplianceIssueSchema,
} from '../schemas';

const router = Router();
router.use(authenticate);

// Policies
router.get('/policies', getPolicies);
router.get('/policies/:id', getPolicyById);
router.post('/policies', authorize('ADMIN', 'MANAGER'), validateBody(createPolicySchema), createPolicy);
router.put('/policies/:id', authorize('ADMIN', 'MANAGER'), validateBody(updatePolicySchema), updatePolicy);
router.delete('/policies/:id', authorize('ADMIN'), deletePolicy);

// Policy Acknowledgements
router.get('/policy-acknowledgements', getAcknowledgements);
router.get('/policy-acknowledgements/:id', getAcknowledgementById);
router.post('/policy-acknowledgements', validateBody(createAcknowledgementSchema), createAcknowledgement);
router.put('/policy-acknowledgements/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateAcknowledgementSchema), updateAcknowledgement);
router.delete('/policy-acknowledgements/:id', authorize('ADMIN'), deleteAcknowledgement);

// Audits
router.get('/audits', getAudits);
router.get('/audits/:id', getAuditById);
router.post('/audits', authorize('ADMIN', 'MANAGER'), validateBody(createAuditSchema), createAudit);
router.put('/audits/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateAuditSchema), updateAudit);
router.delete('/audits/:id', authorize('ADMIN'), deleteAudit);

// Compliance Issues
router.get('/compliance-issues', getComplianceIssues);
router.get('/compliance-issues/:id', getComplianceIssueById);
router.post('/compliance-issues', validateBody(createComplianceIssueSchema), createComplianceIssue);
router.put('/compliance-issues/:id', authorize('ADMIN', 'MANAGER'), validateBody(updateComplianceIssueSchema), updateComplianceIssue);
router.delete('/compliance-issues/:id', authorize('ADMIN'), deleteComplianceIssue);

export default router;

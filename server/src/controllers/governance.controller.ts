import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '../utils/response';

// ─── POLICIES ─────────────────────────────────────────────────────────────────

export const getPolicies = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { owner: { contains: search, mode: 'insensitive' } }];
    if (req.query.category) where.category = req.query.category;
    if (req.query.status) where.status = req.query.status;
    if (req.query.departmentId) where.departmentId = req.query.departmentId;
    if (req.query.mandatory !== undefined) where.mandatory = req.query.mandatory === 'true';

    const [data, total] = await Promise.all([
      prisma.policy.findMany({
        where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: { department: { select: { id: true, name: true } }, _count: { select: { acknowledgements: true } } },
      }),
      prisma.policy.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Policies retrieved');
  } catch (error) { next(error); }
};

export const getPolicyById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const policy = await prisma.policy.findUnique({
      where: { id: req.params.id },
      include: {
        department: true,
        acknowledgements: { include: { user: { select: { id: true, name: true, avatarUrl: true } } }, take: 20 },
      },
    });
    if (!policy) { errorResponse(res, 'Policy not found', 404); return; }
    successResponse(res, policy, 'Policy retrieved');
  } catch (error) { next(error); }
};

export const createPolicy = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.effectiveDate) data.effectiveDate = new Date(data.effectiveDate);
    if (data.reviewDate) data.reviewDate = new Date(data.reviewDate);
    const policy = await prisma.policy.create({
      data,
      include: { department: { select: { id: true, name: true } } },
    });
    successResponse(res, policy, 'Policy created', 201);
  } catch (error) { next(error); }
};

export const updatePolicy = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.effectiveDate) data.effectiveDate = new Date(data.effectiveDate);
    if (data.reviewDate) data.reviewDate = new Date(data.reviewDate);
    const policy = await prisma.policy.update({ where: { id: req.params.id }, data });
    successResponse(res, policy, 'Policy updated');
  } catch (error) { next(error); }
};

export const deletePolicy = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.policy.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Policy deleted');
  } catch (error) { next(error); }
};

// ─── POLICY ACKNOWLEDGEMENTS ─────────────────────────────────────────────────

export const getAcknowledgements = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (req.query.policyId) where.policyId = req.query.policyId;
    if (req.query.userId) where.userId = req.query.userId;
    if (req.query.status) where.status = req.query.status;

    const [data, total] = await Promise.all([
      prisma.policyAcknowledgement.findMany({
        where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
          policy: { select: { id: true, title: true, category: true } },
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      }),
      prisma.policyAcknowledgement.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Acknowledgements retrieved');
  } catch (error) { next(error); }
};

export const getAcknowledgementById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ack = await prisma.policyAcknowledgement.findUnique({
      where: { id: req.params.id },
      include: { policy: true, user: { select: { id: true, name: true, email: true } } },
    });
    if (!ack) { errorResponse(res, 'Acknowledgement not found', 404); return; }
    successResponse(res, ack, 'Acknowledgement retrieved');
  } catch (error) { next(error); }
};

export const createAcknowledgement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ack = await prisma.policyAcknowledgement.upsert({
      where: { policyId_userId: { policyId: req.body.policyId, userId: req.body.userId } },
      create: { ...req.body, acknowledgedAt: new Date(), status: 'ACKNOWLEDGED' },
      update: { ...req.body, acknowledgedAt: new Date(), status: 'ACKNOWLEDGED' },
    });

    // Update policy stats
    const policy = await prisma.policy.findUnique({ where: { id: req.body.policyId } });
    if (policy) {
      const ackCount = await prisma.policyAcknowledgement.count({
        where: { policyId: req.body.policyId, status: 'ACKNOWLEDGED' },
      });
      const rate = policy.totalStaff > 0 ? (ackCount / policy.totalStaff) * 100 : 0;
      await prisma.policy.update({
        where: { id: req.body.policyId },
        data: { totalAcknowledged: ackCount, acknowledgementRate: Math.round(rate * 10) / 10 },
      });
    }

    successResponse(res, ack, 'Policy acknowledged', 201);
  } catch (error) { next(error); }
};

export const updateAcknowledgement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.acknowledgedAt) data.acknowledgedAt = new Date(data.acknowledgedAt);
    const ack = await prisma.policyAcknowledgement.update({ where: { id: req.params.id }, data });
    successResponse(res, ack, 'Acknowledgement updated');
  } catch (error) { next(error); }
};

export const deleteAcknowledgement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.policyAcknowledgement.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Acknowledgement deleted');
  } catch (error) { next(error); }
};

// ─── AUDITS ───────────────────────────────────────────────────────────────────

export const getAudits = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { auditor: { contains: search, mode: 'insensitive' } }];
    if (req.query.type) where.type = req.query.type;
    if (req.query.status) where.status = req.query.status;
    if (req.query.departmentId) where.departmentId = req.query.departmentId;

    const [data, total] = await Promise.all([
      prisma.audit.findMany({
        where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: { department: { select: { id: true, name: true } } },
      }),
      prisma.audit.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Audits retrieved');
  } catch (error) { next(error); }
};

export const getAuditById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const audit = await prisma.audit.findUnique({ where: { id: req.params.id }, include: { department: true } });
    if (!audit) { errorResponse(res, 'Audit not found', 404); return; }
    successResponse(res, audit, 'Audit retrieved');
  } catch (error) { next(error); }
};

export const createAudit = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.scheduledDate) data.scheduledDate = new Date(data.scheduledDate);
    if (data.completedDate) data.completedDate = new Date(data.completedDate);
    const audit = await prisma.audit.create({ data, include: { department: { select: { id: true, name: true } } } });
    successResponse(res, audit, 'Audit created', 201);
  } catch (error) { next(error); }
};

export const updateAudit = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.scheduledDate) data.scheduledDate = new Date(data.scheduledDate);
    if (data.completedDate) data.completedDate = new Date(data.completedDate);
    const audit = await prisma.audit.update({ where: { id: req.params.id }, data });
    successResponse(res, audit, 'Audit updated');
  } catch (error) { next(error); }
};

export const deleteAudit = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.audit.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Audit deleted');
  } catch (error) { next(error); }
};

// ─── COMPLIANCE ISSUES ────────────────────────────────────────────────────────

export const getComplianceIssues = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(req.query);
    const where: any = {};
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    if (req.query.severity) where.severity = req.query.severity;
    if (req.query.status) where.status = req.query.status;
    if (req.query.source) where.source = req.query.source;
    if (req.query.departmentId) where.departmentId = req.query.departmentId;

    const [data, total] = await Promise.all([
      prisma.complianceIssue.findMany({
        where, skip, take: limit, orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
          raisedBy: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true } },
          department: { select: { id: true, name: true } },
        },
      }),
      prisma.complianceIssue.count({ where }),
    ]);
    paginatedResponse(res, data, total, page, limit, 'Compliance issues retrieved');
  } catch (error) { next(error); }
};

export const getComplianceIssueById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const issue = await prisma.complianceIssue.findUnique({
      where: { id: req.params.id },
      include: { raisedBy: { select: { id: true, name: true, email: true } }, assignedTo: { select: { id: true, name: true, email: true } }, department: true },
    });
    if (!issue) { errorResponse(res, 'Compliance issue not found', 404); return; }
    successResponse(res, issue, 'Compliance issue retrieved');
  } catch (error) { next(error); }
};

export const createComplianceIssue = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body, raisedById: req.body.raisedById || req.user!.userId };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    const issue = await prisma.complianceIssue.create({ data });
    successResponse(res, issue, 'Compliance issue created', 201);
  } catch (error) { next(error); }
};

export const updateComplianceIssue = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data: any = { ...req.body };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    const issue = await prisma.complianceIssue.update({ where: { id: req.params.id }, data });
    successResponse(res, issue, 'Compliance issue updated');
  } catch (error) { next(error); }
};

export const deleteComplianceIssue = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.complianceIssue.delete({ where: { id: req.params.id } });
    successResponse(res, null, 'Compliance issue deleted');
  } catch (error) { next(error); }
};

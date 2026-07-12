import { z } from 'zod';

// Pagination query schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE', 'VIEWER']).optional(),
  department: z.string().optional(),
  employeeId: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  department: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number'),
});

// Emission Factor schemas
export const createEmissionFactorSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['STATIONARY', 'MOBILE', 'ELECTRICITY', 'FUGITIVE', 'TRAVEL', 'WASTE', 'OTHER']),
  scope: z.enum(['SCOPE_1', 'SCOPE_2', 'SCOPE_3']),
  unit: z.string().min(1),
  factor: z.number().positive(),
  source: z.string().min(1),
  year: z.number().int().min(2000).max(2030),
  isActive: z.boolean().optional().default(true),
});

export const updateEmissionFactorSchema = createEmissionFactorSchema.partial();

// Carbon Transaction schemas
export const createCarbonTransactionSchema = z.object({
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  departmentId: z.string().optional().nullable(),
  activity: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  emissionFactor: z.number().positive(),
  totalEmissions: z.number().positive(),
  scope: z.enum(['SCOPE_1', 'SCOPE_2', 'SCOPE_3']),
  notes: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'VERIFIED', 'REJECTED']).optional(),
});

export const updateCarbonTransactionSchema = createCarbonTransactionSchema.partial();

// Product ESG Profile schemas
export const createProductProfileSchema = z.object({
  productName: z.string().min(1),
  sku: z.string().min(1),
  category: z.string().min(1),
  carbonFootprint: z.number().min(0),
  recyclability: z.number().min(0).max(100),
  renewableEnergy: z.number().min(0).max(100),
  waterUsage: z.number().min(0),
  overallScore: z.number().min(0).max(100),
  certifications: z.array(z.string()).default([]),
  status: z.enum(['CERTIFIED', 'UNDER_REVIEW', 'PENDING', 'DRAFT']).optional(),
});

export const updateProductProfileSchema = createProductProfileSchema.partial();

// Sustainability Goal schemas
export const createSustainabilityGoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.enum(['CARBON', 'WATER', 'WASTE', 'ENERGY', 'BIODIVERSITY']),
  targetValue: z.number().positive(),
  currentValue: z.number().min(0).optional(),
  unit: z.string().min(1),
  targetYear: z.number().int().min(2024).max(2050),
  status: z.enum(['ON_TRACK', 'AT_RISK', 'BEHIND', 'ACHIEVED']).optional(),
  ownerId: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
  sdgAlignment: z.array(z.number().int().min(1).max(17)).default([]),
});

export const updateSustainabilityGoalSchema = createSustainabilityGoalSchema.partial();

// CSR Activity schemas
export const createCSRActivitySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.enum(['EDUCATION', 'ENVIRONMENT', 'HEALTHCARE', 'COMMUNITY', 'SKILLS']),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  targetParticipants: z.number().int().positive(),
  actualParticipants: z.number().int().min(0).optional(),
  budget: z.number().min(0),
  spent: z.number().min(0).optional(),
  location: z.string().optional().nullable(),
  organizer: z.string().optional().nullable(),
  status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  impactScore: z.number().min(0).max(10).optional().nullable(),
  sdgGoals: z.array(z.number().int().min(1).max(17)).default([]),
});

export const updateCSRActivitySchema = createCSRActivitySchema.partial();

// Employee Participation schemas
export const createParticipationSchema = z.object({
  userId: z.string(),
  activityId: z.string().optional().nullable(),
  activityType: z.enum(['CSR', 'TRAINING', 'CHALLENGE', 'AUDIT']),
  date: z.string(),
  hours: z.number().positive(),
  xpEarned: z.number().int().min(0).optional(),
  status: z.enum(['ATTENDED', 'ABSENT', 'PENDING', 'EXCUSED']).optional(),
  verifiedById: z.string().optional().nullable(),
});

export const updateParticipationSchema = createParticipationSchema.partial();

// Training Program schemas
export const createTrainingProgramSchema = z.object({
  title: z.string().min(1),
  category: z.enum(['ESG_AWARENESS', 'COMPLIANCE', 'SAFETY', 'LEADERSHIP', 'TECHNICAL', 'SUSTAINABILITY']),
  instructor: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  duration: z.number().int().positive(),
  enrolled: z.number().int().min(0).optional(),
  completed: z.number().int().min(0).optional(),
  mandatory: z.boolean().optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  rating: z.number().min(0).max(5).optional().nullable(),
});

export const updateTrainingProgramSchema = createTrainingProgramSchema.partial();

// Policy schemas
export const createPolicySchema = z.object({
  title: z.string().min(1),
  category: z.enum(['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'ETHICS', 'SAFETY', 'DATA_PRIVACY']),
  version: z.string().optional(),
  owner: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
  effectiveDate: z.string(),
  reviewDate: z.string(),
  totalStaff: z.number().int().min(0).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'ARCHIVED']).optional(),
  mandatory: z.boolean().optional(),
});

export const updatePolicySchema = createPolicySchema.partial();

// Policy Acknowledgement schemas
export const createAcknowledgementSchema = z.object({
  policyId: z.string(),
  userId: z.string(),
  method: z.enum(['ELECTRONIC', 'PHYSICAL']).optional(),
  status: z.enum(['ACKNOWLEDGED', 'PENDING', 'OVERDUE']).optional(),
});

export const updateAcknowledgementSchema = z.object({
  method: z.enum(['ELECTRONIC', 'PHYSICAL']).optional(),
  status: z.enum(['ACKNOWLEDGED', 'PENDING', 'OVERDUE']).optional(),
  acknowledgedAt: z.string().optional().nullable(),
});

// Audit schemas
export const createAuditSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['INTERNAL', 'EXTERNAL', 'REGULATORY', 'THIRD_PARTY']),
  standard: z.string().optional().nullable(),
  auditor: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
  scheduledDate: z.string(),
  completedDate: z.string().optional().nullable(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED']).optional(),
  findings: z.number().int().min(0).optional(),
  criticalFindings: z.number().int().min(0).optional(),
  score: z.number().min(0).max(100).optional().nullable(),
});

export const updateAuditSchema = createAuditSchema.partial();

// Compliance Issue schemas
export const createComplianceIssueSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  source: z.enum(['AUDIT', 'SELF_ASSESSMENT', 'REGULATORY', 'EMPLOYEE_REPORT']),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  category: z.string().optional().nullable(),
  raisedById: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED']).optional(),
  actionPlan: z.string().optional().nullable(),
});

export const updateComplianceIssueSchema = createComplianceIssueSchema.partial();

// Challenge schemas
export const createChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.enum(['CARBON', 'WATER', 'WASTE', 'ENERGY', 'DIVERSITY', 'SAFETY']),
  startDate: z.string(),
  endDate: z.string(),
  targetValue: z.number().positive(),
  unit: z.string().min(1),
  xpReward: z.number().int().min(0).optional(),
  badgeReward: z.string().optional().nullable(),
  maxParticipants: z.number().int().positive().optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'ARCHIVED']).optional(),
  departmentIds: z.array(z.string()).default([]),
});

export const updateChallengeSchema = createChallengeSchema.partial();

// Challenge Participation schemas
export const createChallengeParticipationSchema = z.object({
  challengeId: z.string(),
  userId: z.string(),
  progress: z.number().min(0).max(100).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'DROPPED', 'PENDING_VERIFICATION']).optional(),
});

export const updateChallengeParticipationSchema = z.object({
  progress: z.number().min(0).max(100).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'DROPPED', 'PENDING_VERIFICATION']).optional(),
  xpEarned: z.number().int().min(0).optional(),
  rank: z.number().int().positive().optional().nullable(),
});

// Badge schemas
export const createBadgeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  category: z.enum(['ENVIRONMENT', 'SOCIAL', 'GOVERNANCE', 'PARTICIPATION', 'ACHIEVEMENT']),
  xpRequired: z.number().int().min(0).optional(),
  criteria: z.string().optional().nullable(),
  rarity: z.enum(['COMMON', 'RARE', 'EPIC', 'LEGENDARY']).optional(),
});

export const updateBadgeSchema = createBadgeSchema.partial();

// Reward schemas
export const createRewardSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.enum(['VOUCHER', 'EXPERIENCE', 'MERCHANDISE', 'RECOGNITION', 'TIME_OFF']),
  xpCost: z.number().int().positive(),
  monetaryValue: z.number().min(0).optional(),
  stock: z.number().int().optional(),
  validUntil: z.string().optional().nullable(),
  status: z.enum(['AVAILABLE', 'OUT_OF_STOCK', 'COMING_SOON']).optional(),
});

export const updateRewardSchema = createRewardSchema.partial();

// Reward Redemption schemas
export const createRedemptionSchema = z.object({
  rewardId: z.string(),
  userId: z.string().optional(),
});

export const updateRedemptionSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'FULFILLED', 'REJECTED']),
  approvedById: z.string().optional().nullable(),
});

// Department schemas
export const createDepartmentSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).toUpperCase(),
  head: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  employeeCount: z.number().int().min(0).optional(),
  esgScore: z.number().min(0).max(100).optional(),
  carbonEmissions: z.number().min(0).optional(),
  participationRate: z.number().min(0).max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1),
  module: z.enum(['ENVIRONMENT', 'SOCIAL', 'GOVERNANCE', 'GAMIFICATION']),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

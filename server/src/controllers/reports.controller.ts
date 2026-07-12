import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';

export const getEnvironmentalReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { period, department } = req.query as any;
    const where: any = { status: 'VERIFIED' };
    if (department) where.departmentId = department;
    if (period) {
      const months = period === 'yearly' ? 12 : period === 'quarterly' ? 3 : 1;
      where.date = { gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000) };
    }

    const [
      totalEmissions,
      emissionsByScope,
      emissionsByMonth,
      productProfiles,
      goals,
    ] = await Promise.all([
      prisma.carbonTransaction.aggregate({ where, _sum: { totalEmissions: true }, _count: true }),
      prisma.carbonTransaction.groupBy({ by: ['scope'], where, _sum: { totalEmissions: true } }),
      prisma.carbonTransaction.groupBy({
        by: ['scope'],
        where,
        _sum: { totalEmissions: true },
      }),
      prisma.productESGProfile.aggregate({ _avg: { overallScore: true, carbonFootprint: true, recyclability: true } }),
      prisma.sustainabilityGoal.groupBy({ by: ['status'], _count: true }),
    ]);

    successResponse(res, {
      totalEmissions: totalEmissions._sum.totalEmissions || 0,
      transactionCount: totalEmissions._count,
      emissionsByScope,
      productMetrics: productProfiles,
      goalsByStatus: goals,
    }, 'Environmental report generated');
  } catch (error) { next(error); }
};

export const getSocialReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { period } = req.query as any;
    const where: any = {};
    if (period) {
      const months = period === 'yearly' ? 12 : period === 'quarterly' ? 3 : 1;
      where.startDate = { gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000) };
    }

    const [csrStats, trainingStats, participationStats, userStats] = await Promise.all([
      prisma.cSRActivity.aggregate({ where, _sum: { budget: true, spent: true, actualParticipants: true }, _count: true }),
      prisma.trainingProgram.aggregate({ _sum: { enrolled: true, completed: true }, _avg: { rating: true, duration: true }, _count: true }),
      prisma.employeeParticipation.groupBy({ by: ['activityType'], _count: true, _sum: { xpEarned: true, hours: true } }),
      prisma.user.aggregate({ where: { isActive: true }, _count: true, _avg: { totalXp: true, level: true } }),
    ]);

    const completionRate = trainingStats._sum.enrolled
      ? ((trainingStats._sum.completed || 0) / trainingStats._sum.enrolled) * 100
      : 0;

    successResponse(res, {
      csrActivities: {
        total: csrStats._count,
        totalBudget: csrStats._sum.budget || 0,
        totalSpent: csrStats._sum.spent || 0,
        totalParticipants: csrStats._sum.actualParticipants || 0,
      },
      training: {
        total: trainingStats._count,
        totalEnrolled: trainingStats._sum.enrolled || 0,
        totalCompleted: trainingStats._sum.completed || 0,
        completionRate: Math.round(completionRate * 10) / 10,
        avgRating: trainingStats._avg.rating || 0,
        avgDurationHours: trainingStats._avg.duration || 0,
      },
      participationByType: participationStats,
      employees: {
        total: userStats._count,
        avgXp: Math.round(userStats._avg.totalXp || 0),
        avgLevel: Math.round((userStats._avg.level || 1) * 10) / 10,
      },
    }, 'Social report generated');
  } catch (error) { next(error); }
};

export const getGovernanceReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { period } = req.query as any;

    const [policyStats, auditStats, complianceStats, ackStats] = await Promise.all([
      prisma.policy.groupBy({ by: ['status'], _count: true }),
      prisma.audit.groupBy({ by: ['status'], _count: true }),
      prisma.complianceIssue.groupBy({ by: ['severity', 'status'], _count: true }),
      prisma.policyAcknowledgement.groupBy({ by: ['status'], _count: true }),
    ]);

    const totalPolicies = await prisma.policy.count();
    const activePolicies = await prisma.policy.count({ where: { status: 'ACTIVE' } });
    const avgAckRate = await prisma.policy.aggregate({ _avg: { acknowledgementRate: true } });
    const openIssues = await prisma.complianceIssue.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } });
    const criticalIssues = await prisma.complianceIssue.count({ where: { severity: 'CRITICAL', status: { in: ['OPEN', 'IN_PROGRESS'] } } });

    successResponse(res, {
      policies: {
        total: totalPolicies,
        active: activePolicies,
        avgAcknowledgementRate: Math.round((avgAckRate._avg.acknowledgementRate || 0) * 10) / 10,
        byStatus: policyStats,
      },
      audits: { byStatus: auditStats },
      compliance: {
        openIssues,
        criticalIssues,
        byStatus: complianceStats,
      },
    }, 'Governance report generated');
  } catch (error) { next(error); }
};

export const getESGSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { period } = req.query as any;

    const [
      totalEmissions,
      goalsOnTrack,
      totalGoals,
      csrParticipation,
      activeEmployees,
      activePolicies,
      avgAckRate,
      openCompliance,
      activeChallenges,
      totalXp,
    ] = await Promise.all([
      prisma.carbonTransaction.aggregate({ where: { status: 'VERIFIED' }, _sum: { totalEmissions: true } }),
      prisma.sustainabilityGoal.count({ where: { status: 'ON_TRACK' } }),
      prisma.sustainabilityGoal.count(),
      prisma.employeeParticipation.count({ where: { status: 'ATTENDED' } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.policy.count({ where: { status: 'ACTIVE' } }),
      prisma.policy.aggregate({ _avg: { acknowledgementRate: true } }),
      prisma.complianceIssue.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      prisma.challenge.count({ where: { status: 'ACTIVE' } }),
      prisma.user.aggregate({ _sum: { totalXp: true }, _avg: { totalXp: true } }),
    ]);

    // Environmental: weighted avg of goal attainment + emission intensity proxy
    const goalScore = totalGoals > 0 ? (goalsOnTrack / totalGoals) * 100 : 50;
    const emissionProxy = Math.min(100, Math.max(0, 80 - ((totalEmissions._sum.totalEmissions || 0) / 5000)));
    const environmentScore = Math.round(goalScore * 0.6 + emissionProxy * 0.4);

    // Social: CSR participation rate scaled generously to 0-100
    const participationRate = activeEmployees > 0 ? Math.min(100, (csrParticipation / activeEmployees) * 200) : 50;
    const socialScore = Math.round(Math.min(100, Math.max(0, participationRate)));

    // Governance: ack rate minus penalty per open compliance issue
    const ackScore = avgAckRate._avg.acknowledgementRate || 0;
    const governanceScore = Math.round(Math.min(100, Math.max(0, ackScore - openCompliance * 1.5)));

    const overallESGScore = Math.round((environmentScore + socialScore + governanceScore) / 3);

    successResponse(res, {
      overallESGScore,
      environmental: {
        score: Math.round(environmentScore),
        totalEmissions: totalEmissions._sum.totalEmissions || 0,
        goalsOnTrack,
        totalGoals,
      },
      social: {
        score: Math.round(socialScore),
        activeEmployees,
        csrParticipation,
      },
      governance: {
        score: Math.round(governanceScore),
        activePolicies,
        avgAcknowledgementRate: Math.round((avgAckRate._avg.acknowledgementRate || 0) * 10) / 10,
        openComplianceIssues: openCompliance,
      },
      gamification: {
        activeChallenges,
        totalXpEarned: totalXp._sum.totalXp || 0,
        avgXpPerEmployee: Math.round(totalXp._avg.totalXp || 0),
      },
    }, 'ESG summary retrieved');
  } catch (error) { next(error); }
};

import { PrismaClient, Role, EmissionCategory, Scope, TransactionStatus, ProductStatus,
  GoalCategory, GoalStatus, CSRCategory, CSRStatus, ActivityType, ParticipationStatus,
  TrainingCategory, TrainingStatus, PolicyCategory, PolicyStatus, AcknowledgementMethod,
  AcknowledgementStatus, AuditType, AuditStatus, ComplianceSource, Severity, ComplianceStatus,
  ChallengeCategory, ChallengeStatus, BadgeCategory, Rarity, RewardCategory, RewardStatus,
  DepartmentStatus, Module, CategoryStatus
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('🌱 Starting EcoSphere ESG Platform seed...\n');

  // ─── CLEAN UP ────────────────────────────────────────────────────────────────
  await prisma.notification.deleteMany();
  await prisma.rewardRedemption.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.challengeParticipation.deleteMany();
  await prisma.policyAcknowledgement.deleteMany();
  await prisma.employeeParticipation.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.carbonTransaction.deleteMany();
  await prisma.sustainabilityGoal.deleteMany();
  await prisma.productESGProfile.deleteMany();
  await prisma.emissionFactor.deleteMany();
  await prisma.cSRActivity.deleteMany();
  await prisma.trainingProgram.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.audit.deleteMany();
  await prisma.complianceIssue.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  console.log('✅ Cleaned existing data\n');

  // ─── DEPARTMENTS (10) ──────────────────────────────────────────────────────
  const departments = await Promise.all([
    prisma.department.create({ data: { name: 'Operations', code: 'OPS', head: 'Sarah Chen', location: 'HQ Floor 3', employeeCount: 45, esgScore: 82.5, carbonEmissions: 1250.5, participationRate: 88.2, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Engineering', code: 'ENG', head: 'Marcus Williams', location: 'Tech Park B2', employeeCount: 68, esgScore: 79.3, carbonEmissions: 980.2, participationRate: 91.5, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Human Resources', code: 'HR', head: 'Priya Sharma', location: 'HQ Floor 1', employeeCount: 22, esgScore: 91.2, carbonEmissions: 320.8, participationRate: 95.0, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Finance', code: 'FIN', head: 'Robert Kim', location: 'HQ Floor 4', employeeCount: 35, esgScore: 75.8, carbonEmissions: 510.3, participationRate: 82.1, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Marketing', code: 'MKT', head: 'Aisha Johnson', location: 'Creative Hub', employeeCount: 28, esgScore: 85.7, carbonEmissions: 420.6, participationRate: 89.3, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Supply Chain', code: 'SCM', head: 'David Park', location: 'Logistics Center', employeeCount: 52, esgScore: 70.4, carbonEmissions: 2180.9, participationRate: 76.5, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Research & Development', code: 'RND', head: 'Elena Martinez', location: 'Innovation Lab', employeeCount: 40, esgScore: 88.9, carbonEmissions: 650.1, participationRate: 93.8, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Legal & Compliance', code: 'LGL', head: 'James O\'Brien', location: 'HQ Floor 5', employeeCount: 18, esgScore: 94.1, carbonEmissions: 180.4, participationRate: 97.2, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Customer Success', code: 'CS', head: 'Yuki Tanaka', location: 'Service Hub', employeeCount: 38, esgScore: 83.6, carbonEmissions: 560.7, participationRate: 87.4, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Facilities', code: 'FAC', head: 'Carlos Rodriguez', location: 'Building Management', employeeCount: 25, esgScore: 77.2, carbonEmissions: 3200.0, participationRate: 79.8, status: 'ACTIVE' } }),
  ]);
  console.log(`✅ Created ${departments.length} departments`);

  // ─── USERS (20) ──────────────────────────────────────────────────────────────
  const hashedAdmin = await hashPassword('Admin@123');
  const hashedDefault = await hashPassword('User@123');

  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Alex Thompson', email: 'admin@ecosphere.com', password: hashedAdmin, role: 'ADMIN', department: 'Legal & Compliance', employeeId: 'EMP001', level: 10, totalXp: 9850, streak: 45, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' } }),
    prisma.user.create({ data: { name: 'Sarah Chen', email: 'sarah.chen@ecosphere.com', password: hashedDefault, role: 'MANAGER', department: 'Operations', employeeId: 'EMP002', level: 8, totalXp: 7200, streak: 32, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' } }),
    prisma.user.create({ data: { name: 'Marcus Williams', email: 'marcus.w@ecosphere.com', password: hashedDefault, role: 'MANAGER', department: 'Engineering', employeeId: 'EMP003', level: 7, totalXp: 6500, streak: 28, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus' } }),
    prisma.user.create({ data: { name: 'Priya Sharma', email: 'priya.s@ecosphere.com', password: hashedDefault, role: 'MANAGER', department: 'Human Resources', employeeId: 'EMP004', level: 9, totalXp: 8100, streak: 38, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya' } }),
    prisma.user.create({ data: { name: 'Robert Kim', email: 'robert.kim@ecosphere.com', password: hashedDefault, role: 'MANAGER', department: 'Finance', employeeId: 'EMP005', level: 6, totalXp: 5400, streak: 21, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert' } }),
    prisma.user.create({ data: { name: 'Aisha Johnson', email: 'aisha.j@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Marketing', employeeId: 'EMP006', level: 5, totalXp: 4200, streak: 15, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aisha' } }),
    prisma.user.create({ data: { name: 'David Park', email: 'david.park@ecosphere.com', password: hashedDefault, role: 'MANAGER', department: 'Supply Chain', employeeId: 'EMP007', level: 6, totalXp: 5100, streak: 18, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' } }),
    prisma.user.create({ data: { name: 'Elena Martinez', email: 'elena.m@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Research & Development', employeeId: 'EMP008', level: 7, totalXp: 6800, streak: 29, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena' } }),
    prisma.user.create({ data: { name: 'James O\'Brien', email: 'james.ob@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Legal & Compliance', employeeId: 'EMP009', level: 4, totalXp: 3600, streak: 12, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' } }),
    prisma.user.create({ data: { name: 'Yuki Tanaka', email: 'yuki.t@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Customer Success', employeeId: 'EMP010', level: 5, totalXp: 4500, streak: 20, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yuki' } }),
    prisma.user.create({ data: { name: 'Carlos Rodriguez', email: 'carlos.r@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Facilities', employeeId: 'EMP011', level: 4, totalXp: 3200, streak: 9, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos' } }),
    prisma.user.create({ data: { name: 'Fatima Al-Rashid', email: 'fatima.ar@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Engineering', employeeId: 'EMP012', level: 6, totalXp: 5600, streak: 24, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima' } }),
    prisma.user.create({ data: { name: 'Liu Wei', email: 'liu.wei@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Operations', employeeId: 'EMP013', level: 5, totalXp: 4800, streak: 17, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liu' } }),
    prisma.user.create({ data: { name: 'Amara Okafor', email: 'amara.ok@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Marketing', employeeId: 'EMP014', level: 4, totalXp: 3900, streak: 13, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amara' } }),
    prisma.user.create({ data: { name: 'Thomas Müller', email: 'thomas.m@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Finance', employeeId: 'EMP015', level: 3, totalXp: 2800, streak: 8, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomas' } }),
    prisma.user.create({ data: { name: 'Sana Patel', email: 'sana.p@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Human Resources', employeeId: 'EMP016', level: 5, totalXp: 4300, streak: 16, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sana' } }),
    prisma.user.create({ data: { name: 'Noah Anderson', email: 'noah.a@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Supply Chain', employeeId: 'EMP017', level: 4, totalXp: 3500, streak: 11, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noah' } }),
    prisma.user.create({ data: { name: 'Isabella Costa', email: 'isabella.c@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Research & Development', employeeId: 'EMP018', level: 6, totalXp: 5200, streak: 22, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=isabella' } }),
    prisma.user.create({ data: { name: 'Raj Patel', email: 'raj.p@ecosphere.com', password: hashedDefault, role: 'VIEWER', department: 'Finance', employeeId: 'EMP019', level: 2, totalXp: 1500, streak: 5, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj' } }),
    prisma.user.create({ data: { name: 'Sophie Laurent', email: 'sophie.l@ecosphere.com', password: hashedDefault, role: 'EMPLOYEE', department: 'Customer Success', employeeId: 'EMP020', level: 4, totalXp: 3800, streak: 14, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie' } }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  const [admin, sarah, marcus, priya, robert, aisha, david, elena, james, yuki,
    carlos, fatima, liu, amara, thomas, sana, noah, isabella, raj, sophie] = users;

  // ─── EMISSION FACTORS (15) ────────────────────────────────────────────────────
  const emissionFactors = await Promise.all([
    prisma.emissionFactor.create({ data: { name: 'Natural Gas Combustion', category: 'STATIONARY', scope: 'SCOPE_1', unit: 'kWh', factor: 0.2034, source: 'IPCC 2021', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Diesel Combustion (Vehicle)', category: 'MOBILE', scope: 'SCOPE_1', unit: 'litre', factor: 2.6843, source: 'DEFRA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'UK Grid Electricity', category: 'ELECTRICITY', scope: 'SCOPE_2', unit: 'kWh', factor: 0.2331, source: 'DEFRA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'US Grid Electricity (National)', category: 'ELECTRICITY', scope: 'SCOPE_2', unit: 'kWh', factor: 0.3860, source: 'EPA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Refrigerant R-410A (Fugitive)', category: 'FUGITIVE', scope: 'SCOPE_1', unit: 'kg', factor: 2088.0, source: 'IPCC AR5', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Business Air Travel (Economy)', category: 'TRAVEL', scope: 'SCOPE_3', unit: 'km', factor: 0.1551, source: 'DEFRA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Business Air Travel (Business Class)', category: 'TRAVEL', scope: 'SCOPE_3', unit: 'km', factor: 0.4293, source: 'DEFRA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Municipal Solid Waste (Landfill)', category: 'WASTE', scope: 'SCOPE_3', unit: 'tonne', factor: 587.0, source: 'EPA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Petrol/Gasoline (Vehicle)', category: 'MOBILE', scope: 'SCOPE_1', unit: 'litre', factor: 2.3131, source: 'DEFRA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Coal Combustion (Steam)', category: 'STATIONARY', scope: 'SCOPE_1', unit: 'tonne', factor: 2401.0, source: 'IPCC 2021', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Purchased Steam', category: 'ELECTRICITY', scope: 'SCOPE_2', unit: 'kWh', factor: 0.2120, source: 'EPA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Train Travel (UK)', category: 'TRAVEL', scope: 'SCOPE_3', unit: 'km', factor: 0.0357, source: 'DEFRA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'LPG Combustion', category: 'STATIONARY', scope: 'SCOPE_1', unit: 'litre', factor: 1.5551, source: 'DEFRA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Paper Waste (Recycled)', category: 'WASTE', scope: 'SCOPE_3', unit: 'tonne', factor: 21.2, source: 'DEFRA 2023', year: 2023, isActive: true } }),
    prisma.emissionFactor.create({ data: { name: 'Water Treatment', category: 'OTHER', scope: 'SCOPE_3', unit: 'm3', factor: 0.344, source: 'Water UK 2023', year: 2023, isActive: true } }),
  ]);
  console.log(`✅ Created ${emissionFactors.length} emission factors`);

  // ─── CARBON TRANSACTIONS (20) ─────────────────────────────────────────────────
  const carbonTransactions = await Promise.all([
    prisma.carbonTransaction.create({ data: { date: new Date('2024-01-15'), departmentId: departments[9].id, activity: 'Office HVAC System', categoryId: emissionFactors[0].id, quantity: 15000, unit: 'kWh', emissionFactor: 0.2034, totalEmissions: 3051.0, scope: 'SCOPE_1', status: 'VERIFIED', createdById: admin.id, verifiedById: admin.id, verifiedAt: new Date('2024-01-20'), notes: 'Monthly natural gas consumption for HQ heating' } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-01-20'), departmentId: departments[5].id, activity: 'Fleet Vehicle Operations', categoryId: emissionFactors[1].id, quantity: 8500, unit: 'litre', emissionFactor: 2.6843, totalEmissions: 22816.55, scope: 'SCOPE_1', status: 'VERIFIED', createdById: david.id, verifiedById: admin.id, verifiedAt: new Date('2024-01-25'), notes: 'Diesel consumption for delivery fleet' } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-01-31'), departmentId: departments[0].id, activity: 'Monthly Electricity', categoryId: emissionFactors[2].id, quantity: 42000, unit: 'kWh', emissionFactor: 0.2331, totalEmissions: 9790.2, scope: 'SCOPE_2', status: 'VERIFIED', createdById: sarah.id, verifiedById: admin.id, verifiedAt: new Date('2024-02-05') } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-02-10'), departmentId: departments[1].id, activity: 'Data Center Power', categoryId: emissionFactors[2].id, quantity: 28000, unit: 'kWh', emissionFactor: 0.2331, totalEmissions: 6526.8, scope: 'SCOPE_2', status: 'VERIFIED', createdById: marcus.id, verifiedById: admin.id, verifiedAt: new Date('2024-02-15') } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-02-15'), departmentId: departments[6].id, activity: 'International Conference Travel', categoryId: emissionFactors[5].id, quantity: 45000, unit: 'km', emissionFactor: 0.1551, totalEmissions: 6979.5, scope: 'SCOPE_3', status: 'VERIFIED', createdById: elena.id, verifiedById: admin.id, verifiedAt: new Date('2024-02-20'), notes: 'Business class flights to Singapore summit' } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-02-28'), departmentId: departments[0].id, activity: 'Office Waste - Landfill', categoryId: emissionFactors[7].id, quantity: 2.5, unit: 'tonne', emissionFactor: 587.0, totalEmissions: 1467.5, scope: 'SCOPE_3', status: 'SUBMITTED', createdById: sarah.id } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-03-05'), departmentId: departments[5].id, activity: 'Supplier Logistics - Air Freight', categoryId: emissionFactors[5].id, quantity: 125000, unit: 'km', emissionFactor: 0.1551, totalEmissions: 19387.5, scope: 'SCOPE_3', status: 'VERIFIED', createdById: david.id, verifiedById: admin.id, verifiedAt: new Date('2024-03-10') } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-03-15'), departmentId: departments[9].id, activity: 'Air Conditioning Refrigerant Leak', categoryId: emissionFactors[4].id, quantity: 3.5, unit: 'kg', emissionFactor: 2088.0, totalEmissions: 7308.0, scope: 'SCOPE_1', status: 'VERIFIED', createdById: carlos.id, verifiedById: admin.id, verifiedAt: new Date('2024-03-18'), notes: 'Emergency maintenance - R-410A refrigerant loss' } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-03-31'), departmentId: departments[3].id, activity: 'Office Electricity - Q1', categoryId: emissionFactors[2].id, quantity: 12500, unit: 'kWh', emissionFactor: 0.2331, totalEmissions: 2913.75, scope: 'SCOPE_2', status: 'VERIFIED', createdById: robert.id, verifiedById: sarah.id, verifiedAt: new Date('2024-04-05') } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-04-10'), departmentId: departments[1].id, activity: 'Employee Commute (Company Cars)', categoryId: emissionFactors[8].id, quantity: 32000, unit: 'litre', emissionFactor: 2.3131, totalEmissions: 74019.2, scope: 'SCOPE_3', status: 'SUBMITTED', createdById: marcus.id, notes: 'Estimated annual commute emissions' } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-04-20'), departmentId: departments[4].id, activity: 'Marketing Event - Print & Materials', categoryId: emissionFactors[13].id, quantity: 1.2, unit: 'tonne', emissionFactor: 21.2, totalEmissions: 25.44, scope: 'SCOPE_3', status: 'DRAFT', createdById: aisha.id } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-05-01'), departmentId: departments[2].id, activity: 'Paper Usage - Office', categoryId: emissionFactors[13].id, quantity: 0.8, unit: 'tonne', emissionFactor: 21.2, totalEmissions: 16.96, scope: 'SCOPE_3', status: 'VERIFIED', createdById: priya.id, verifiedById: admin.id, verifiedAt: new Date('2024-05-08') } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-05-15'), departmentId: departments[6].id, activity: 'Lab Equipment Power', categoryId: emissionFactors[3].id, quantity: 18500, unit: 'kWh', emissionFactor: 0.386, totalEmissions: 7141.0, scope: 'SCOPE_2', status: 'VERIFIED', createdById: elena.id, verifiedById: admin.id, verifiedAt: new Date('2024-05-20') } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-05-30'), departmentId: departments[5].id, activity: 'Cold Chain Refrigeration', categoryId: emissionFactors[4].id, quantity: 12.0, unit: 'kg', emissionFactor: 2088.0, totalEmissions: 25056.0, scope: 'SCOPE_1', status: 'VERIFIED', createdById: david.id, verifiedById: admin.id, verifiedAt: new Date('2024-06-03') } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-06-10'), departmentId: departments[0].id, activity: 'Water Treatment - HQ', categoryId: emissionFactors[14].id, quantity: 4500, unit: 'm3', emissionFactor: 0.344, totalEmissions: 1548.0, scope: 'SCOPE_3', status: 'SUBMITTED', createdById: sarah.id } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-06-20'), departmentId: departments[1].id, activity: 'Server Room Cooling', categoryId: emissionFactors[2].id, quantity: 9800, unit: 'kWh', emissionFactor: 0.2331, totalEmissions: 2284.38, scope: 'SCOPE_2', status: 'VERIFIED', createdById: marcus.id, verifiedById: admin.id, verifiedAt: new Date('2024-06-25') } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-07-01'), departmentId: departments[8].id, activity: 'Customer Office Visits', categoryId: emissionFactors[11].id, quantity: 28500, unit: 'km', emissionFactor: 0.0357, totalEmissions: 1017.45, scope: 'SCOPE_3', status: 'DRAFT', createdById: yuki.id } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-07-15'), departmentId: departments[9].id, activity: 'LPG for Catering', categoryId: emissionFactors[12].id, quantity: 850, unit: 'litre', emissionFactor: 1.5551, totalEmissions: 1321.835, scope: 'SCOPE_1', status: 'SUBMITTED', createdById: carlos.id } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-07-28'), departmentId: departments[3].id, activity: 'Business Travel - Regional', categoryId: emissionFactors[5].id, quantity: 18000, unit: 'km', emissionFactor: 0.1551, totalEmissions: 2791.8, scope: 'SCOPE_3', status: 'VERIFIED', createdById: robert.id, verifiedById: admin.id, verifiedAt: new Date('2024-08-02') } }),
    prisma.carbonTransaction.create({ data: { date: new Date('2024-08-10'), departmentId: departments[6].id, activity: 'R&D Prototype Manufacturing', categoryId: emissionFactors[10].id, quantity: 3200, unit: 'kWh', emissionFactor: 0.212, totalEmissions: 678.4, scope: 'SCOPE_2', status: 'SUBMITTED', createdById: elena.id } }),
  ]);
  console.log(`✅ Created ${carbonTransactions.length} carbon transactions`);

  // ─── PRODUCT ESG PROFILES (10) ────────────────────────────────────────────────
  const productProfiles = await Promise.all([
    prisma.productESGProfile.create({ data: { productName: 'EcoTech Laptop Pro X1', sku: 'ETP-X1-2024', category: 'Electronics', carbonFootprint: 285.5, recyclability: 78.5, renewableEnergy: 65.2, waterUsage: 12.8, overallScore: 82.4, certifications: ['TCO Certified', 'EPEAT Gold', 'Energy Star'], status: 'CERTIFIED' } }),
    prisma.productESGProfile.create({ data: { productName: 'GreenPack Office Paper', sku: 'GP-A4-500', category: 'Office Supplies', carbonFootprint: 0.85, recyclability: 95.0, renewableEnergy: 80.0, waterUsage: 45.2, overallScore: 88.7, certifications: ['FSC Certified', 'ISO 14001', 'Cradle to Cradle'], status: 'CERTIFIED' } }),
    prisma.productESGProfile.create({ data: { productName: 'Solar-Powered Desk Lamp', sku: 'SDL-300W', category: 'Lighting', carbonFootprint: 12.3, recyclability: 72.0, renewableEnergy: 100.0, waterUsage: 0.5, overallScore: 91.2, certifications: ['CE Mark', 'RoHS'], status: 'CERTIFIED' } }),
    prisma.productESGProfile.create({ data: { productName: 'Biodegradable Packaging Film', sku: 'BPF-100M', category: 'Packaging', carbonFootprint: 2.1, recyclability: 88.0, renewableEnergy: 45.0, waterUsage: 18.5, overallScore: 79.5, certifications: ['EN 13432', 'ASTM D6400'], status: 'UNDER_REVIEW' } }),
    prisma.productESGProfile.create({ data: { productName: 'Electric Forklift EF-5000', sku: 'EF-5000-LI', category: 'Heavy Equipment', carbonFootprint: 1850.0, recyclability: 85.0, renewableEnergy: 0.0, waterUsage: 85.0, overallScore: 72.3, certifications: ['ISO 3691', 'CE Mark'], status: 'CERTIFIED' } }),
    prisma.productESGProfile.create({ data: { productName: 'Cloud Server Module CS-M2', sku: 'CSM-2TB-2024', category: 'IT Infrastructure', carbonFootprint: 420.0, recyclability: 68.0, renewableEnergy: 55.0, waterUsage: 180.0, overallScore: 69.8, certifications: ['ISO 14001', 'Energy Star'], status: 'UNDER_REVIEW' } }),
    prisma.productESGProfile.create({ data: { productName: 'Bamboo Office Furniture Set', sku: 'BOF-SET-6PC', category: 'Furniture', carbonFootprint: 45.0, recyclability: 90.0, renewableEnergy: 70.0, waterUsage: 120.0, overallScore: 86.5, certifications: ['FSC Certified', 'Greenguard Gold'], status: 'CERTIFIED' } }),
    prisma.productESGProfile.create({ data: { productName: 'EcoClean Industrial Detergent', sku: 'ECD-5L-2024', category: 'Cleaning Products', carbonFootprint: 3.8, recyclability: 65.0, renewableEnergy: 40.0, waterUsage: 25.0, overallScore: 61.2, certifications: ['EU Ecolabel'], status: 'PENDING' } }),
    prisma.productESGProfile.create({ data: { productName: 'Smart Energy Monitor SE-100', sku: 'SEM-100-WiFi', category: 'IoT Devices', carbonFootprint: 8.5, recyclability: 75.0, renewableEnergy: 30.0, waterUsage: 2.1, overallScore: 74.8, certifications: ['CE Mark', 'FCC'], status: 'DRAFT' } }),
    prisma.productESGProfile.create({ data: { productName: 'Recycled Aluminium Panels', sku: 'RAP-2M-STD', category: 'Construction Materials', carbonFootprint: 185.0, recyclability: 98.0, renewableEnergy: 25.0, waterUsage: 320.0, overallScore: 77.3, certifications: ['ISO 9001', 'ISO 14001', 'LEED Compatible'], status: 'CERTIFIED' } }),
  ]);
  console.log(`✅ Created ${productProfiles.length} product ESG profiles`);

  // ─── SUSTAINABILITY GOALS (10) ────────────────────────────────────────────────
  const goals = await Promise.all([
    prisma.sustainabilityGoal.create({ data: { title: 'Net Zero Carbon Emissions by 2030', description: 'Achieve net zero carbon emissions across all operations including Scope 1, 2, and 3', category: 'CARBON', targetValue: 0, currentValue: 45280.5, unit: 'tCO2e', targetYear: 2030, progress: 35.2, status: 'ON_TRACK', ownerId: admin.id, departmentId: departments[0].id, sdgAlignment: [13, 7, 11] } }),
    prisma.sustainabilityGoal.create({ data: { title: 'Reduce Water Consumption by 40%', description: 'Reduce total water usage compared to 2022 baseline of 125,000 m³', category: 'WATER', targetValue: 75000, currentValue: 98500, unit: 'm3', targetYear: 2026, progress: 62.7, status: 'ON_TRACK', ownerId: sarah.id, departmentId: departments[9].id, sdgAlignment: [6, 12] } }),
    prisma.sustainabilityGoal.create({ data: { title: 'Zero Waste to Landfill', description: 'Divert 100% of operational waste from landfill through reduce, reuse, and recycle', category: 'WASTE', targetValue: 0, currentValue: 12.5, unit: 'tonne/month', targetYear: 2027, progress: 45.8, status: 'AT_RISK', ownerId: david.id, departmentId: departments[5].id, sdgAlignment: [12, 11] } }),
    prisma.sustainabilityGoal.create({ data: { title: '100% Renewable Energy by 2028', description: 'Transition all energy procurement to 100% renewable sources (wind, solar, hydro)', category: 'ENERGY', targetValue: 100, currentValue: 42.5, unit: '%', targetYear: 2028, progress: 42.5, status: 'ON_TRACK', ownerId: marcus.id, departmentId: departments[1].id, sdgAlignment: [7, 13] } }),
    prisma.sustainabilityGoal.create({ data: { title: 'Plant 50,000 Trees by 2025', description: 'Biodiversity restoration through tree planting in deforested areas', category: 'BIODIVERSITY', targetValue: 50000, currentValue: 38500, unit: 'trees', targetYear: 2025, progress: 77.0, status: 'ON_TRACK', ownerId: elena.id, sdgAlignment: [15, 13, 11] } }),
    prisma.sustainabilityGoal.create({ data: { title: 'Reduce Scope 1 Emissions by 60%', description: 'Cut direct emissions from owned/controlled sources vs 2020 baseline', category: 'CARBON', targetValue: 15000, currentValue: 28500, unit: 'tCO2e', targetYear: 2026, progress: 40.5, status: 'BEHIND', ownerId: admin.id, departmentId: departments[5].id, sdgAlignment: [13] } }),
    prisma.sustainabilityGoal.create({ data: { title: 'Achieve LEED Platinum for HQ', description: 'Upgrade headquarters building to LEED Platinum certification', category: 'ENERGY', targetValue: 1, currentValue: 0, unit: 'certification', targetYear: 2025, progress: 65.0, status: 'AT_RISK', ownerId: carlos.id, departmentId: departments[9].id, sdgAlignment: [7, 11] } }),
    prisma.sustainabilityGoal.create({ data: { title: 'Supply Chain Emissions Reduction 30%', description: 'Work with top 50 suppliers to reduce Scope 3 supply chain emissions', category: 'CARBON', targetValue: 45000, currentValue: 68000, unit: 'tCO2e', targetYear: 2027, progress: 28.3, status: 'AT_RISK', ownerId: david.id, departmentId: departments[5].id, sdgAlignment: [12, 13, 17] } }),
    prisma.sustainabilityGoal.create({ data: { title: 'Recycled Materials Usage 75%', description: 'Increase use of recycled or sustainable materials in product manufacturing', category: 'WASTE', targetValue: 75, currentValue: 68.5, unit: '%', targetYear: 2025, progress: 91.3, status: 'ON_TRACK', ownerId: elena.id, departmentId: departments[6].id, sdgAlignment: [12, 9] } }),
    prisma.sustainabilityGoal.create({ data: { title: 'Carbon Neutral Logistics by 2026', description: 'Offset all logistics and transportation carbon emissions through certified programs', category: 'CARBON', targetValue: 0, currentValue: 35000, unit: 'tCO2e', targetYear: 2026, progress: 22.5, status: 'BEHIND', ownerId: david.id, departmentId: departments[5].id, sdgAlignment: [13, 11] } }),
  ]);
  console.log(`✅ Created ${goals.length} sustainability goals`);

  // ─── CSR ACTIVITIES (10) ──────────────────────────────────────────────────────
  const csrActivities = await Promise.all([
    prisma.cSRActivity.create({ data: { title: 'Community Forest Restoration Project', description: 'Plant native trees and restore 50 hectares of deforested land in partnership with local environmental groups', category: 'ENVIRONMENT', startDate: new Date('2024-03-01'), endDate: new Date('2024-11-30'), targetParticipants: 200, actualParticipants: 178, budget: 85000, spent: 72500, location: 'Green Valley Nature Reserve', organizer: 'EcoSphere Sustainability Team', status: 'ACTIVE', impactScore: 9.2, sdgGoals: [15, 13, 11] } }),
    prisma.cSRActivity.create({ data: { title: 'STEM Scholarship Program 2024', description: 'Fund 20 university scholarships for underprivileged students pursuing environmental science degrees', category: 'EDUCATION', startDate: new Date('2024-01-15'), endDate: new Date('2024-12-31'), targetParticipants: 20, actualParticipants: 20, budget: 200000, spent: 200000, location: 'Multiple Universities', organizer: 'HR Department', status: 'ACTIVE', impactScore: 9.8, sdgGoals: [4, 10, 17] } }),
    prisma.cSRActivity.create({ data: { title: 'Mobile Health Clinic Initiative', description: 'Deploy mobile medical units to provide free healthcare to 5 underserved communities', category: 'HEALTHCARE', startDate: new Date('2024-02-01'), endDate: new Date('2024-08-31'), targetParticipants: 5000, actualParticipants: 4350, budget: 350000, spent: 298000, location: 'Regional Rural Areas', organizer: 'Operations Division', status: 'COMPLETED', impactScore: 9.5, sdgGoals: [3, 10] } }),
    prisma.cSRActivity.create({ data: { title: 'Digital Skills Bootcamp for Youth', description: '3-month coding and digital skills training for 100 unemployed youth aged 18-25', category: 'SKILLS', startDate: new Date('2024-04-01'), endDate: new Date('2024-06-30'), targetParticipants: 100, actualParticipants: 87, budget: 120000, spent: 115000, location: 'EcoSphere Training Center', organizer: 'Engineering Department', status: 'COMPLETED', impactScore: 8.7, sdgGoals: [4, 8, 10] } }),
    prisma.cSRActivity.create({ data: { title: 'Food Bank Partnership Drive', description: 'Monthly food collection drives and volunteer cooking sessions for local food bank', category: 'COMMUNITY', startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), targetParticipants: 150, actualParticipants: 132, budget: 45000, spent: 38500, location: 'City Food Bank Network', organizer: 'HR Department', status: 'ACTIVE', impactScore: 8.3, sdgGoals: [2, 1, 11] } }),
    prisma.cSRActivity.create({ data: { title: 'Ocean Plastic Cleanup Campaign', description: 'Partner with coastal communities to remove plastic waste from 15km of coastline', category: 'ENVIRONMENT', startDate: new Date('2024-06-01'), endDate: new Date('2024-09-30'), targetParticipants: 300, actualParticipants: 265, budget: 65000, spent: 58000, location: 'Coastal Region - 5 Beaches', organizer: 'Supply Chain Dept', status: 'COMPLETED', impactScore: 9.0, sdgGoals: [14, 12, 13] } }),
    prisma.cSRActivity.create({ data: { title: 'Elderly Care Digital Literacy', description: 'Teach 200 senior citizens to use smartphones and internet for healthcare access', category: 'SKILLS', startDate: new Date('2024-05-01'), endDate: new Date('2024-10-31'), targetParticipants: 200, actualParticipants: 156, budget: 30000, spent: 24500, location: 'Community Centers (6 locations)', organizer: 'Customer Success Team', status: 'ACTIVE', impactScore: 7.9, sdgGoals: [3, 4, 10] } }),
    prisma.cSRActivity.create({ data: { title: 'Urban Garden & Composting Hub', description: 'Create 3 community gardens and establish composting programs in urban neighborhoods', category: 'ENVIRONMENT', startDate: new Date('2024-07-01'), endDate: new Date('2024-12-31'), targetParticipants: 80, actualParticipants: 45, budget: 55000, spent: 32000, location: 'Downtown Community Plots', organizer: 'Facilities Management', status: 'ACTIVE', impactScore: 7.5, sdgGoals: [11, 12, 2] } }),
    prisma.cSRActivity.create({ data: { title: 'Women in Tech Mentorship Program', description: 'Connect 50 female engineering students with senior female tech professionals for year-long mentorship', category: 'SKILLS', startDate: new Date('2024-02-15'), endDate: new Date('2025-02-14'), targetParticipants: 50, actualParticipants: 48, budget: 25000, spent: 18500, location: 'Virtual & HQ Office', organizer: 'Human Resources', status: 'ACTIVE', impactScore: 8.5, sdgGoals: [5, 4, 8] } }),
    prisma.cSRActivity.create({ data: { title: 'Renewable Energy Education for Schools', description: 'Install solar kits and deliver ESG curriculum to 25 local schools', category: 'EDUCATION', startDate: new Date('2024-09-01'), endDate: new Date('2025-06-30'), targetParticipants: 2500, actualParticipants: 0, budget: 180000, spent: 45000, location: 'Metropolitan School District', organizer: 'R&D Department', status: 'PLANNING', impactScore: null, sdgGoals: [4, 7, 13] } }),
  ]);
  console.log(`✅ Created ${csrActivities.length} CSR activities`);

  // ─── TRAINING PROGRAMS (10) ────────────────────────────────────────────────────
  const trainingPrograms = await Promise.all([
    prisma.trainingProgram.create({ data: { title: 'ESG Fundamentals & Reporting Standards', category: 'ESG_AWARENESS', instructor: 'Dr. Anna Fischer', startDate: new Date('2024-02-01'), endDate: new Date('2024-02-03'), duration: 16, enrolled: 145, completed: 138, mandatory: true, status: 'COMPLETED', rating: 4.7 } }),
    prisma.trainingProgram.create({ data: { title: 'ISO 14001 Environmental Management', category: 'COMPLIANCE', instructor: 'Prof. James Chen', startDate: new Date('2024-03-10'), endDate: new Date('2024-03-12'), duration: 24, enrolled: 52, completed: 50, mandatory: true, status: 'COMPLETED', rating: 4.5 } }),
    prisma.trainingProgram.create({ data: { title: 'Workplace Safety & Hazard Management', category: 'SAFETY', instructor: 'Sarah Mitchell', startDate: new Date('2024-04-15'), endDate: new Date('2024-04-16'), duration: 8, enrolled: 220, completed: 215, mandatory: true, status: 'COMPLETED', rating: 4.3 } }),
    prisma.trainingProgram.create({ data: { title: 'Sustainable Leadership Accelerator', category: 'LEADERSHIP', instructor: 'Dr. Michael Okonkwo', startDate: new Date('2024-05-20'), endDate: new Date('2024-05-24'), duration: 40, enrolled: 28, completed: 25, mandatory: false, status: 'COMPLETED', rating: 4.9 } }),
    prisma.trainingProgram.create({ data: { title: 'Carbon Footprint Calculation & Reporting', category: 'TECHNICAL', instructor: 'Emma Rodriguez', startDate: new Date('2024-06-10'), endDate: new Date('2024-06-11'), duration: 12, enrolled: 78, completed: 72, mandatory: true, status: 'COMPLETED', rating: 4.6 } }),
    prisma.trainingProgram.create({ data: { title: 'Circular Economy & Waste Reduction', category: 'SUSTAINABILITY', instructor: 'Dr. Yusuf Al-Amin', startDate: new Date('2024-07-08'), endDate: new Date('2024-07-09'), duration: 16, enrolled: 65, completed: 0, mandatory: false, status: 'IN_PROGRESS', rating: null } }),
    prisma.trainingProgram.create({ data: { title: 'Data Privacy & GDPR Compliance', category: 'COMPLIANCE', instructor: 'Laura Schneider', startDate: new Date('2024-08-05'), endDate: new Date('2024-08-05'), duration: 4, enrolled: 280, completed: 0, mandatory: true, status: 'SCHEDULED', rating: null } }),
    prisma.trainingProgram.create({ data: { title: 'Biodiversity & Natural Capital', category: 'SUSTAINABILITY', instructor: 'Dr. Priya Nair', startDate: new Date('2024-09-15'), endDate: new Date('2024-09-17'), duration: 20, enrolled: 35, completed: 0, mandatory: false, status: 'SCHEDULED', rating: null } }),
    prisma.trainingProgram.create({ data: { title: 'Anti-Corruption & Business Ethics', category: 'COMPLIANCE', instructor: 'Bartholomew Kent', startDate: new Date('2024-10-01'), endDate: new Date('2024-10-02'), duration: 8, enrolled: 180, completed: 0, mandatory: true, status: 'SCHEDULED', rating: null } }),
    prisma.trainingProgram.create({ data: { title: 'Green Supply Chain Management', category: 'TECHNICAL', instructor: 'Dr. Sofia Petrov', startDate: new Date('2024-11-10'), endDate: new Date('2024-11-12'), duration: 24, enrolled: 42, completed: 0, mandatory: false, status: 'SCHEDULED', rating: null } }),
  ]);
  console.log(`✅ Created ${trainingPrograms.length} training programs`);

  // ─── POLICIES (10) ────────────────────────────────────────────────────────────
  const policies = await Promise.all([
    prisma.policy.create({ data: { title: 'Environmental Management Policy', category: 'ENVIRONMENTAL', version: '3.2', owner: 'Chief Sustainability Officer', departmentId: departments[0].id, effectiveDate: new Date('2024-01-01'), reviewDate: new Date('2024-12-31'), acknowledgementRate: 94.5, totalAcknowledged: 283, totalStaff: 299, status: 'ACTIVE', mandatory: true } }),
    prisma.policy.create({ data: { title: 'Code of Business Ethics & Conduct', category: 'ETHICS', version: '2.1', owner: 'General Counsel', departmentId: departments[7].id, effectiveDate: new Date('2024-01-01'), reviewDate: new Date('2025-01-01'), acknowledgementRate: 97.3, totalAcknowledged: 291, totalStaff: 299, status: 'ACTIVE', mandatory: true } }),
    prisma.policy.create({ data: { title: 'Health & Safety Policy', category: 'SAFETY', version: '4.0', owner: 'Head of Operations', departmentId: departments[0].id, effectiveDate: new Date('2024-01-01'), reviewDate: new Date('2024-06-30'), acknowledgementRate: 99.0, totalAcknowledged: 296, totalStaff: 299, status: 'ACTIVE', mandatory: true } }),
    prisma.policy.create({ data: { title: 'Data Privacy & Information Security Policy', category: 'DATA_PRIVACY', version: '2.5', owner: 'Chief Information Security Officer', departmentId: departments[1].id, effectiveDate: new Date('2024-01-01'), reviewDate: new Date('2024-12-31'), acknowledgementRate: 91.6, totalAcknowledged: 274, totalStaff: 299, status: 'ACTIVE', mandatory: true } }),
    prisma.policy.create({ data: { title: 'Anti-Corruption & Bribery Policy', category: 'GOVERNANCE', version: '1.8', owner: 'Chief Compliance Officer', departmentId: departments[7].id, effectiveDate: new Date('2024-01-01'), reviewDate: new Date('2024-12-31'), acknowledgementRate: 88.6, totalAcknowledged: 265, totalStaff: 299, status: 'ACTIVE', mandatory: true } }),
    prisma.policy.create({ data: { title: 'Supplier Sustainability Standards', category: 'ENVIRONMENTAL', version: '1.3', owner: 'Head of Supply Chain', departmentId: departments[5].id, effectiveDate: new Date('2024-03-01'), reviewDate: new Date('2025-03-01'), acknowledgementRate: 72.4, totalAcknowledged: 38, totalStaff: 52, status: 'ACTIVE', mandatory: false } }),
    prisma.policy.create({ data: { title: 'Diversity, Equity & Inclusion Policy', category: 'SOCIAL', version: '2.0', owner: 'Head of Human Resources', departmentId: departments[2].id, effectiveDate: new Date('2024-01-01'), reviewDate: new Date('2024-12-31'), acknowledgementRate: 93.0, totalAcknowledged: 278, totalStaff: 299, status: 'ACTIVE', mandatory: true } }),
    prisma.policy.create({ data: { title: 'Carbon Offsetting & Net Zero Strategy', category: 'ENVIRONMENTAL', version: '1.0', owner: 'Sustainability Manager', departmentId: departments[0].id, effectiveDate: new Date('2024-06-01'), reviewDate: new Date('2025-06-01'), acknowledgementRate: 45.2, totalAcknowledged: 135, totalStaff: 299, status: 'UNDER_REVIEW', mandatory: false } }),
    prisma.policy.create({ data: { title: 'Modern Slavery & Human Rights Policy', category: 'SOCIAL', version: '1.5', owner: 'General Counsel', departmentId: departments[7].id, effectiveDate: new Date('2024-01-01'), reviewDate: new Date('2024-12-31'), acknowledgementRate: 85.3, totalAcknowledged: 255, totalStaff: 299, status: 'ACTIVE', mandatory: true } }),
    prisma.policy.create({ data: { title: 'ESG Reporting & Disclosure Framework', category: 'GOVERNANCE', version: '1.2', owner: 'Chief Financial Officer', departmentId: departments[3].id, effectiveDate: new Date('2024-01-01'), reviewDate: new Date('2024-12-31'), acknowledgementRate: 62.5, totalAcknowledged: 50, totalStaff: 80, status: 'DRAFT', mandatory: false } }),
  ]);
  console.log(`✅ Created ${policies.length} policies`);

  // ─── AUDITS (10) ──────────────────────────────────────────────────────────────
  const audits = await Promise.all([
    prisma.audit.create({ data: { title: 'Annual ISO 14001 Certification Audit', type: 'EXTERNAL', standard: 'ISO 14001:2015', auditor: 'Bureau Veritas', departmentId: departments[0].id, scheduledDate: new Date('2024-03-15'), completedDate: new Date('2024-03-17'), status: 'COMPLETED', findings: 12, criticalFindings: 1, score: 87.5 } }),
    prisma.audit.create({ data: { title: 'Q1 Internal Safety & Compliance Review', type: 'INTERNAL', standard: 'ISO 45001:2018', auditor: 'Internal Audit Team', departmentId: departments[9].id, scheduledDate: new Date('2024-04-01'), completedDate: new Date('2024-04-03'), status: 'COMPLETED', findings: 8, criticalFindings: 0, score: 91.0 } }),
    prisma.audit.create({ data: { title: 'Supply Chain ESG Assessment', type: 'THIRD_PARTY', standard: 'EcoVadis Assessment', auditor: 'EcoVadis SAS', departmentId: departments[5].id, scheduledDate: new Date('2024-05-10'), completedDate: new Date('2024-05-12'), status: 'COMPLETED', findings: 18, criticalFindings: 3, score: 72.0 } }),
    prisma.audit.create({ data: { title: 'GRI Standards Compliance Review', type: 'EXTERNAL', standard: 'GRI Standards 2021', auditor: 'KPMG Sustainability', departmentId: departments[3].id, scheduledDate: new Date('2024-06-20'), completedDate: new Date('2024-06-22'), status: 'COMPLETED', findings: 6, criticalFindings: 0, score: 94.5 } }),
    prisma.audit.create({ data: { title: 'GDPR & Data Privacy Audit', type: 'REGULATORY', standard: 'GDPR 2016/679', auditor: 'DPC External Review', departmentId: departments[1].id, scheduledDate: new Date('2024-07-15'), status: 'IN_PROGRESS', findings: 3, criticalFindings: 1 } }),
    prisma.audit.create({ data: { title: 'Carbon Accounting Verification', type: 'THIRD_PARTY', standard: 'ISO 14064-3', auditor: 'SGS Group', departmentId: departments[0].id, scheduledDate: new Date('2024-08-01'), status: 'SCHEDULED', findings: 0, criticalFindings: 0 } }),
    prisma.audit.create({ data: { title: 'Financial Integrity & Anti-Corruption', type: 'INTERNAL', standard: 'ISO 37001:2016', auditor: 'Internal Audit Team', departmentId: departments[3].id, scheduledDate: new Date('2024-08-20'), status: 'SCHEDULED', findings: 0, criticalFindings: 0 } }),
    prisma.audit.create({ data: { title: 'Biodiversity Impact Assessment', type: 'EXTERNAL', standard: 'TNFD Framework', auditor: 'WWF Consulting', scheduledDate: new Date('2024-09-10'), status: 'SCHEDULED', findings: 0, criticalFindings: 0 } }),
    prisma.audit.create({ data: { title: 'Social Impact & Human Rights Due Diligence', type: 'THIRD_PARTY', standard: 'UN Guiding Principles', auditor: 'BSR', departmentId: departments[2].id, scheduledDate: new Date('2024-10-05'), status: 'SCHEDULED', findings: 0, criticalFindings: 0 } }),
    prisma.audit.create({ data: { title: 'Energy Management System Audit', type: 'EXTERNAL', standard: 'ISO 50001:2018', auditor: 'DNV GL', departmentId: departments[1].id, scheduledDate: new Date('2024-06-01'), status: 'OVERDUE', findings: 0, criticalFindings: 0 } }),
  ]);
  console.log(`✅ Created ${audits.length} audits`);

  // ─── COMPLIANCE ISSUES (10) ───────────────────────────────────────────────────
  const complianceIssues = await Promise.all([
    prisma.complianceIssue.create({ data: { title: 'Refrigerant R-410A Leak - Facilities', description: 'Uncontrolled release of 3.5kg R-410A from HVAC unit exceeding threshold limits', source: 'AUDIT', severity: 'HIGH', category: 'Environmental', raisedById: admin.id, assignedToId: carlos.id, departmentId: departments[9].id, raisedDate: new Date('2024-03-18'), dueDate: new Date('2024-04-18'), status: 'RESOLVED', actionPlan: 'Replace aging HVAC unit, implement quarterly refrigerant leak testing, train maintenance staff' } }),
    prisma.complianceIssue.create({ data: { title: 'Supplier Non-Compliance - Child Labor Risk', description: 'Tier 2 supplier in Southeast Asia flagged for child labor concerns during third-party audit', source: 'AUDIT', severity: 'CRITICAL', category: 'Social', raisedById: admin.id, assignedToId: david.id, departmentId: departments[5].id, raisedDate: new Date('2024-05-12'), dueDate: new Date('2024-06-12'), status: 'IN_PROGRESS', actionPlan: 'Immediate supplier audit, engage local NGO for worker protection, establish alternative sourcing' } }),
    prisma.complianceIssue.create({ data: { title: 'GDPR Breach - Customer Data Export', description: 'Unauthorized export of 1,200 customer records to unsecured external drive', source: 'EMPLOYEE_REPORT', severity: 'CRITICAL', category: 'Data Privacy', raisedById: james.id, assignedToId: marcus.id, departmentId: departments[1].id, raisedDate: new Date('2024-07-02'), dueDate: new Date('2024-07-16'), status: 'IN_PROGRESS', actionPlan: 'Immediate investigation, notify DPA within 72 hours, implement DLP controls, mandatory training' } }),
    prisma.complianceIssue.create({ data: { title: 'Wastewater Discharge Non-Compliance', description: 'pH levels in wastewater discharge exceeded permitted limits of 6-9 for 3 consecutive measurements', source: 'REGULATORY', severity: 'HIGH', category: 'Environmental', raisedById: admin.id, assignedToId: carlos.id, departmentId: departments[9].id, raisedDate: new Date('2024-04-25'), dueDate: new Date('2024-05-25'), status: 'RESOLVED', actionPlan: 'Install automated pH monitoring, upgrade treatment system, notify environmental agency' } }),
    prisma.complianceIssue.create({ data: { title: 'Incomplete Policy Acknowledgements', description: 'Anti-corruption policy acknowledgement rate below 90% threshold with 35 overdue staff', source: 'SELF_ASSESSMENT', severity: 'MEDIUM', category: 'Governance', raisedById: priya.id, assignedToId: james.id, departmentId: departments[7].id, raisedDate: new Date('2024-06-15'), dueDate: new Date('2024-07-15'), status: 'IN_PROGRESS', actionPlan: 'Send reminder emails, escalate to line managers, set 2-week deadline for completion' } }),
    prisma.complianceIssue.create({ data: { title: 'Missing Safety Signage - Warehouse', description: '15 safety signage points found missing or damaged during internal inspection', source: 'AUDIT', severity: 'MEDIUM', category: 'Safety', raisedById: sarah.id, assignedToId: carlos.id, departmentId: departments[9].id, raisedDate: new Date('2024-04-02'), dueDate: new Date('2024-04-30'), status: 'CLOSED', actionPlan: 'Replace all damaged signs within 2 weeks, implement monthly signage inspection checklist' } }),
    prisma.complianceIssue.create({ data: { title: 'Carbon Reporting Gap - Q4 2023', description: 'Missing Scope 3 transportation data for Q4 2023 creating reporting gap', source: 'SELF_ASSESSMENT', severity: 'LOW', category: 'Environmental', raisedById: elena.id, assignedToId: david.id, departmentId: departments[5].id, raisedDate: new Date('2024-02-10'), dueDate: new Date('2024-03-31'), status: 'CLOSED', actionPlan: 'Gather historical data from logistics partners, implement real-time data collection system' } }),
    prisma.complianceIssue.create({ data: { title: 'Diversity Reporting Non-Compliance', description: 'Annual diversity report not submitted to regulatory body by required deadline', source: 'REGULATORY', severity: 'HIGH', category: 'Social', raisedById: james.id, assignedToId: priya.id, departmentId: departments[2].id, raisedDate: new Date('2024-05-30'), dueDate: new Date('2024-06-15'), status: 'RESOLVED', actionPlan: 'Submit report with late filing, pay regulatory fine, implement compliance calendar' } }),
    prisma.complianceIssue.create({ data: { title: 'Unsegregated Hazardous Waste', description: 'Hazardous chemical waste found mixed with general waste in R&D lab disposal area', source: 'EMPLOYEE_REPORT', severity: 'CRITICAL', category: 'Environmental', raisedById: fatima.id, assignedToId: elena.id, departmentId: departments[6].id, raisedDate: new Date('2024-07-08'), dueDate: new Date('2024-07-22'), status: 'OPEN', actionPlan: 'Immediate segregation, engage licensed hazardous waste disposal company, retrain R&D staff' } }),
    prisma.complianceIssue.create({ data: { title: 'Export Controls Compliance Gap', description: 'Dual-use technology exported to restricted country without proper licensing review', source: 'AUDIT', severity: 'CRITICAL', category: 'Governance', raisedById: james.id, assignedToId: admin.id, departmentId: departments[7].id, raisedDate: new Date('2024-07-15'), dueDate: new Date('2024-08-01'), status: 'OPEN', actionPlan: 'Halt exports pending review, engage export control attorney, implement pre-shipment screening' } }),
  ]);
  console.log(`✅ Created ${complianceIssues.length} compliance issues`);

  // ─── CHALLENGES (8) ───────────────────────────────────────────────────────────
  const challenges = await Promise.all([
    prisma.challenge.create({ data: { title: 'Zero Single-Use Plastics Month', description: 'Go 30 days without using single-use plastics at work — bring reusable cups, bags, and containers', category: 'WASTE', startDate: new Date('2024-07-01'), endDate: new Date('2024-07-31'), targetValue: 30, currentValue: 22, unit: 'days', xpReward: 500, badgeReward: 'Plastic-Free Champion', maxParticipants: 200, status: 'ACTIVE', createdById: admin.id, departmentIds: departments.map(d => d.id) } }),
    prisma.challenge.create({ data: { title: 'Cycle to Work Challenge', description: 'Commute by bicycle for at least 15 days this month. Track your kilometers and CO2 saved!', category: 'CARBON', startDate: new Date('2024-06-01'), endDate: new Date('2024-06-30'), targetValue: 15, currentValue: 15, unit: 'days', xpReward: 750, badgeReward: 'Green Commuter', maxParticipants: 100, status: 'COMPLETED', createdById: admin.id, departmentIds: [] } }),
    prisma.challenge.create({ data: { title: 'Energy Audit Sprint', description: 'Identify and report 3 energy waste points in your workspace. Earn XP for each verified finding!', category: 'ENERGY', startDate: new Date('2024-05-01'), endDate: new Date('2024-05-31'), targetValue: 3, currentValue: 3, unit: 'findings', xpReward: 300, maxParticipants: 300, status: 'COMPLETED', createdById: marcus.id, departmentIds: [] } }),
    prisma.challenge.create({ data: { title: 'Water Conservation Heroes', description: 'Reduce water usage in your work area by 20% and document your strategies', category: 'WATER', startDate: new Date('2024-08-01'), endDate: new Date('2024-08-31'), targetValue: 20, currentValue: 0, unit: '% reduction', xpReward: 600, maxParticipants: 150, status: 'DRAFT', createdById: admin.id, departmentIds: [] } }),
    prisma.challenge.create({ data: { title: 'Diversity Champion Initiative', description: 'Participate in 3 DEI learning sessions and mentor a colleague from underrepresented group', category: 'DIVERSITY', startDate: new Date('2024-07-15'), endDate: new Date('2024-09-15'), targetValue: 3, currentValue: 1, unit: 'sessions', xpReward: 800, badgeReward: 'Inclusion Leader', maxParticipants: 50, status: 'ACTIVE', createdById: priya.id, departmentIds: [departments[2].id, departments[0].id] } }),
    prisma.challenge.create({ data: { title: 'Safety Observation Reporter', description: 'Submit 5 safety improvement suggestions through the safety portal during the quarter', category: 'SAFETY', startDate: new Date('2024-07-01'), endDate: new Date('2024-09-30'), targetValue: 5, currentValue: 2, unit: 'reports', xpReward: 450, maxParticipants: 200, status: 'ACTIVE', createdById: admin.id, departmentIds: [] } }),
    prisma.challenge.create({ data: { title: 'Digital Detox & Paper Reduction', description: 'Go paperless for all internal communications for a full month. Track and share your savings!', category: 'WASTE', startDate: new Date('2024-09-01'), endDate: new Date('2024-09-30'), targetValue: 100, currentValue: 0, unit: '% digital', xpReward: 400, maxParticipants: 250, status: 'DRAFT', createdById: admin.id, departmentIds: [] } }),
    prisma.challenge.create({ data: { title: 'Green Lunch Initiative', description: 'Choose plant-based or locally sourced meals for lunch every day for 3 weeks', category: 'CARBON', startDate: new Date('2024-04-01'), endDate: new Date('2024-04-21'), targetValue: 21, currentValue: 21, unit: 'days', xpReward: 350, badgeReward: 'Conscious Consumer', maxParticipants: 180, status: 'ARCHIVED', createdById: admin.id, departmentIds: [] } }),
  ]);
  console.log(`✅ Created ${challenges.length} challenges`);

  // ─── BADGES (12) ──────────────────────────────────────────────────────────────
  const badges = await Promise.all([
    prisma.badge.create({ data: { name: 'Green Pioneer', description: 'First to complete an environmental challenge', icon: '🌱', category: 'ENVIRONMENT', xpRequired: 500, criteria: 'Complete your first environmental challenge', totalAwarded: 45, rarity: 'COMMON' } }),
    prisma.badge.create({ data: { name: 'Carbon Crusher', description: 'Verified a carbon reduction of over 10 tCO2e', icon: '⚡', category: 'ENVIRONMENT', xpRequired: 1000, criteria: 'Contribute to verified carbon reduction greater than 10 tCO2e', totalAwarded: 18, rarity: 'RARE' } }),
    prisma.badge.create({ data: { name: 'Zero Waste Warrior', description: 'Completed 5 waste reduction challenges', icon: '♻️', category: 'ENVIRONMENT', xpRequired: 2500, criteria: 'Complete 5 or more waste reduction challenges', totalAwarded: 12, rarity: 'RARE' } }),
    prisma.badge.create({ data: { name: 'Community Builder', description: 'Participated in 3 CSR activities', icon: '🤝', category: 'SOCIAL', xpRequired: 750, criteria: 'Participate in 3 or more CSR activities', totalAwarded: 67, rarity: 'COMMON' } }),
    prisma.badge.create({ data: { name: 'Learning Enthusiast', description: 'Completed 5 ESG training programs', icon: '📚', category: 'SOCIAL', xpRequired: 1200, criteria: 'Complete 5 ESG-related training programs', totalAwarded: 35, rarity: 'RARE' } }),
    prisma.badge.create({ data: { name: 'Policy Champion', description: 'Acknowledged all mandatory policies within 24 hours', icon: '📋', category: 'GOVERNANCE', xpRequired: 500, criteria: 'Acknowledge all mandatory policies within 24 hours of publication', totalAwarded: 89, rarity: 'COMMON' } }),
    prisma.badge.create({ data: { name: 'Compliance Guardian', description: 'Reported 3 compliance issues that led to improvements', icon: '🛡️', category: 'GOVERNANCE', xpRequired: 1500, criteria: 'File 3 compliance reports that result in verified corrective actions', totalAwarded: 8, rarity: 'EPIC' } }),
    prisma.badge.create({ data: { name: 'ESG Excellence Award', description: 'Maintained 90%+ participation rate for 6 consecutive months', icon: '🏆', category: 'ACHIEVEMENT', xpRequired: 5000, criteria: 'Maintain 90%+ activity participation for 6 consecutive months', totalAwarded: 3, rarity: 'LEGENDARY' } }),
    prisma.badge.create({ data: { name: 'Challenge Master', description: 'Won 3 organization-wide challenges', icon: '🎯', category: 'ACHIEVEMENT', xpRequired: 3000, criteria: 'Finish in top 3 of 3 organization-wide challenges', totalAwarded: 6, rarity: 'EPIC' } }),
    prisma.badge.create({ data: { name: 'Streak Setter', description: 'Maintained a 30-day engagement streak', icon: '🔥', category: 'PARTICIPATION', xpRequired: 2000, criteria: 'Log activity every day for 30 consecutive days', totalAwarded: 22, rarity: 'RARE' } }),
    prisma.badge.create({ data: { name: 'Team Player', description: 'Participated in 10 team challenges', icon: '👥', category: 'PARTICIPATION', xpRequired: 1800, criteria: 'Participate in 10 or more team-based challenges', totalAwarded: 15, rarity: 'RARE' } }),
    prisma.badge.create({ data: { name: 'Sustainability Legend', description: 'Earned 10,000 XP total through ESG actions', icon: '🌍', category: 'ACHIEVEMENT', xpRequired: 10000, criteria: 'Accumulate 10,000 or more total XP points', totalAwarded: 1, rarity: 'LEGENDARY' } }),
  ]);
  console.log(`✅ Created ${badges.length} badges`);

  // ─── REWARDS (8) ──────────────────────────────────────────────────────────────
  const rewards = await Promise.all([
    prisma.reward.create({ data: { title: 'Extra Day Off (Eco-Leave)', description: 'Earn one additional day of paid leave to spend on volunteering or personal sustainability projects', category: 'TIME_OFF', xpCost: 2000, monetaryValue: 250, stock: -1, status: 'AVAILABLE' } }),
    prisma.reward.create({ data: { title: 'Amazon Voucher £50', description: 'Shop sustainably with a £50 Amazon voucher for eco-friendly products', category: 'VOUCHER', xpCost: 1000, monetaryValue: 50, stock: 50, totalRedeemed: 23, validUntil: new Date('2024-12-31'), status: 'AVAILABLE' } }),
    prisma.reward.create({ data: { title: 'Electric Bike 1-Month Trial', description: 'Free 1-month electric bike subscription to replace car commutes', category: 'EXPERIENCE', xpCost: 3000, monetaryValue: 150, stock: 10, totalRedeemed: 4, status: 'AVAILABLE' } }),
    prisma.reward.create({ data: { title: 'EcoSphere Branded Eco-Kit', description: 'Premium eco-kit with bamboo water bottle, reusable bags, beeswax wraps, and seed packet', category: 'MERCHANDISE', xpCost: 500, monetaryValue: 45, stock: 200, totalRedeemed: 87, status: 'AVAILABLE' } }),
    prisma.reward.create({ data: { title: 'CEO Recognition Letter & LinkedIn Shoutout', description: 'Personal recognition from the CEO with a public LinkedIn post celebrating your ESG contributions', category: 'RECOGNITION', xpCost: 1500, monetaryValue: 0, stock: -1, status: 'AVAILABLE' } }),
    prisma.reward.create({ data: { title: 'Sustainability Conference Ticket', description: 'All-inclusive ticket to GreenBiz or similar major sustainability conference', category: 'EXPERIENCE', xpCost: 5000, monetaryValue: 800, stock: 5, totalRedeemed: 2, validUntil: new Date('2024-11-30'), status: 'AVAILABLE' } }),
    prisma.reward.create({ data: { title: 'Organic Lunch Voucher Pack (5x)', description: '5 vouchers for the eco-certified organic restaurant in the office building', category: 'VOUCHER', xpCost: 750, monetaryValue: 75, stock: 100, totalRedeemed: 42, status: 'AVAILABLE' } }),
    prisma.reward.create({ data: { title: 'Solar Charging Backpack', description: 'Premium backpack with integrated solar panel for charging devices sustainably', category: 'MERCHANDISE', xpCost: 2500, monetaryValue: 180, stock: 0, totalRedeemed: 15, status: 'OUT_OF_STOCK' } }),
  ]);
  console.log(`✅ Created ${rewards.length} rewards`);

  // ─── CATEGORIES ────────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Energy & Utilities', module: 'ENVIRONMENT', color: '#F59E0B', description: 'Electricity, gas, steam, and water usage emissions', status: 'ACTIVE' } }),
    prisma.category.create({ data: { name: 'Transport & Logistics', module: 'ENVIRONMENT', color: '#3B82F6', description: 'Vehicle fleet, shipping, and business travel emissions', status: 'ACTIVE' } }),
    prisma.category.create({ data: { name: 'Waste Management', module: 'ENVIRONMENT', color: '#10B981', description: 'Solid waste, hazardous waste, and recycling activities', status: 'ACTIVE' } }),
    prisma.category.create({ data: { name: 'Employee Wellbeing', module: 'SOCIAL', color: '#8B5CF6', description: 'Health, safety, and wellness programs', status: 'ACTIVE' } }),
    prisma.category.create({ data: { name: 'Community Engagement', module: 'SOCIAL', color: '#EC4899', description: 'CSR activities and community support initiatives', status: 'ACTIVE' } }),
    prisma.category.create({ data: { name: 'Training & Development', module: 'SOCIAL', color: '#06B6D4', description: 'Learning, certification, and skills development programs', status: 'ACTIVE' } }),
    prisma.category.create({ data: { name: 'Risk Management', module: 'GOVERNANCE', color: '#EF4444', description: 'Compliance, audit, and risk mitigation activities', status: 'ACTIVE' } }),
    prisma.category.create({ data: { name: 'Policy & Ethics', module: 'GOVERNANCE', color: '#6366F1', description: 'Corporate policies and ethical business conduct', status: 'ACTIVE' } }),
    prisma.category.create({ data: { name: 'Carbon Reduction', module: 'GAMIFICATION', color: '#22C55E', description: 'Challenges focused on reducing carbon emissions', status: 'ACTIVE' } }),
    prisma.category.create({ data: { name: 'Sustainable Lifestyle', module: 'GAMIFICATION', color: '#84CC16', description: 'Challenges for sustainable personal habits', status: 'ACTIVE' } }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // ─── EMPLOYEE PARTICIPATIONS (15) ─────────────────────────────────────────────
  const employeeParticipations = await Promise.all([
    prisma.employeeParticipation.create({ data: { userId: aisha.id, activityId: csrActivities[0].id, activityType: 'CSR', date: new Date('2024-03-15'), hours: 8, xpEarned: 200, status: 'ATTENDED', verifiedById: sarah.id } }),
    prisma.employeeParticipation.create({ data: { userId: liu.id, activityId: csrActivities[0].id, activityType: 'CSR', date: new Date('2024-03-15'), hours: 8, xpEarned: 200, status: 'ATTENDED', verifiedById: sarah.id } }),
    prisma.employeeParticipation.create({ data: { userId: fatima.id, activityId: csrActivities[3].id, activityType: 'CSR', date: new Date('2024-04-01'), hours: 16, xpEarned: 350, status: 'ATTENDED', verifiedById: marcus.id } }),
    prisma.employeeParticipation.create({ data: { userId: yuki.id, activityId: csrActivities[4].id, activityType: 'CSR', date: new Date('2024-01-20'), hours: 4, xpEarned: 100, status: 'ATTENDED', verifiedById: priya.id } }),
    prisma.employeeParticipation.create({ data: { userId: amara.id, activityId: csrActivities[4].id, activityType: 'CSR', date: new Date('2024-02-20'), hours: 4, xpEarned: 100, status: 'ATTENDED', verifiedById: priya.id } }),
    prisma.employeeParticipation.create({ data: { userId: elena.id, activityType: 'TRAINING', date: new Date('2024-02-01'), hours: 16, xpEarned: 300, status: 'ATTENDED', verifiedById: admin.id } }),
    prisma.employeeParticipation.create({ data: { userId: marcus.id, activityType: 'TRAINING', date: new Date('2024-02-01'), hours: 16, xpEarned: 300, status: 'ATTENDED', verifiedById: admin.id } }),
    prisma.employeeParticipation.create({ data: { userId: sarah.id, activityType: 'TRAINING', date: new Date('2024-03-10'), hours: 24, xpEarned: 450, status: 'ATTENDED', verifiedById: admin.id } }),
    prisma.employeeParticipation.create({ data: { userId: david.id, activityId: csrActivities[5].id, activityType: 'CSR', date: new Date('2024-06-10'), hours: 8, xpEarned: 200, status: 'ATTENDED', verifiedById: admin.id } }),
    prisma.employeeParticipation.create({ data: { userId: noah.id, activityId: csrActivities[5].id, activityType: 'CSR', date: new Date('2024-06-10'), hours: 8, xpEarned: 200, status: 'ATTENDED', verifiedById: admin.id } }),
    prisma.employeeParticipation.create({ data: { userId: isabella.id, activityType: 'TRAINING', date: new Date('2024-05-20'), hours: 40, xpEarned: 800, status: 'ATTENDED', verifiedById: admin.id } }),
    prisma.employeeParticipation.create({ data: { userId: sana.id, activityId: csrActivities[8].id, activityType: 'CSR', date: new Date('2024-03-01'), hours: 6, xpEarned: 150, status: 'ATTENDED', verifiedById: priya.id } }),
    prisma.employeeParticipation.create({ data: { userId: thomas.id, activityType: 'AUDIT', date: new Date('2024-04-01'), hours: 8, xpEarned: 250, status: 'ATTENDED', verifiedById: admin.id } }),
    prisma.employeeParticipation.create({ data: { userId: sophie.id, activityId: csrActivities[6].id, activityType: 'CSR', date: new Date('2024-05-10'), hours: 3, xpEarned: 75, status: 'ATTENDED', verifiedById: yuki.id } }),
    prisma.employeeParticipation.create({ data: { userId: raj.id, activityType: 'TRAINING', date: new Date('2024-04-15'), hours: 8, xpEarned: 150, status: 'PENDING' } }),
  ]);
  console.log(`✅ Created ${employeeParticipations.length} employee participations`);

  // ─── CHALLENGE PARTICIPATIONS ────────────────────────────────────────────────
  await Promise.all([
    prisma.challengeParticipation.create({ data: { challengeId: challenges[0].id, userId: aisha.id, progress: 75, status: 'ACTIVE' } }),
    prisma.challengeParticipation.create({ data: { challengeId: challenges[0].id, userId: fatima.id, progress: 90, status: 'ACTIVE' } }),
    prisma.challengeParticipation.create({ data: { challengeId: challenges[0].id, userId: yuki.id, progress: 60, status: 'ACTIVE' } }),
    prisma.challengeParticipation.create({ data: { challengeId: challenges[1].id, userId: marcus.id, progress: 100, xpEarned: 750, status: 'COMPLETED', completionDate: new Date('2024-06-28'), rank: 1 } }),
    prisma.challengeParticipation.create({ data: { challengeId: challenges[1].id, userId: elena.id, progress: 100, xpEarned: 750, status: 'COMPLETED', completionDate: new Date('2024-06-29'), rank: 2 } }),
    prisma.challengeParticipation.create({ data: { challengeId: challenges[2].id, userId: sarah.id, progress: 100, xpEarned: 300, status: 'COMPLETED', rank: 1 } }),
    prisma.challengeParticipation.create({ data: { challengeId: challenges[4].id, userId: sana.id, progress: 33, status: 'ACTIVE' } }),
    prisma.challengeParticipation.create({ data: { challengeId: challenges[5].id, userId: carlos.id, progress: 40, status: 'ACTIVE' } }),
    prisma.challengeParticipation.create({ data: { challengeId: challenges[5].id, userId: noah.id, progress: 60, status: 'ACTIVE' } }),
  ]);
  console.log('✅ Created challenge participations');

  // ─── USER BADGES ─────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.userBadge.create({ data: { userId: admin.id, badgeId: badges[5].id, earnedDate: new Date('2024-01-02') } }),
    prisma.userBadge.create({ data: { userId: admin.id, badgeId: badges[7].id, earnedDate: new Date('2024-06-01') } }),
    prisma.userBadge.create({ data: { userId: sarah.id, badgeId: badges[0].id, earnedDate: new Date('2024-01-15') } }),
    prisma.userBadge.create({ data: { userId: sarah.id, badgeId: badges[3].id, earnedDate: new Date('2024-03-20') } }),
    prisma.userBadge.create({ data: { userId: sarah.id, badgeId: badges[9].id, earnedDate: new Date('2024-04-15') } }),
    prisma.userBadge.create({ data: { userId: marcus.id, badgeId: badges[8].id, earnedDate: new Date('2024-06-30') } }),
    prisma.userBadge.create({ data: { userId: marcus.id, badgeId: badges[0].id, earnedDate: new Date('2024-06-30') } }),
    prisma.userBadge.create({ data: { userId: elena.id, badgeId: badges[4].id, earnedDate: new Date('2024-05-25') } }),
    prisma.userBadge.create({ data: { userId: priya.id, badgeId: badges[3].id, earnedDate: new Date('2024-02-10') } }),
    prisma.userBadge.create({ data: { userId: aisha.id, badgeId: badges[3].id, earnedDate: new Date('2024-04-01') } }),
    prisma.userBadge.create({ data: { userId: james.id, badgeId: badges[5].id, earnedDate: new Date('2024-01-03') } }),
    prisma.userBadge.create({ data: { userId: james.id, badgeId: badges[6].id, earnedDate: new Date('2024-07-10') } }),
  ]);
  console.log('✅ Created user badges');

  // ─── POLICY ACKNOWLEDGEMENTS ─────────────────────────────────────────────────
  const allUserIds = users.map(u => u.id);
  const mandatoryPolicies = policies.filter(p => p.mandatory);
  const ackPromises: Promise<any>[] = [];
  for (const policy of mandatoryPolicies.slice(0, 4)) {
    for (const userId of allUserIds.slice(0, 15)) {
      ackPromises.push(
        prisma.policyAcknowledgement.create({
          data: {
            policyId: policy.id,
            userId,
            acknowledgedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            method: Math.random() > 0.2 ? 'ELECTRONIC' : 'PHYSICAL',
            status: 'ACKNOWLEDGED',
          },
        })
      );
    }
  }
  await Promise.all(ackPromises);
  console.log('✅ Created policy acknowledgements');

  // ─── REWARD REDEMPTIONS ───────────────────────────────────────────────────────
  await Promise.all([
    prisma.rewardRedemption.create({ data: { rewardId: rewards[3].id, userId: aisha.id, xpSpent: 500, monetaryValue: 45, status: 'FULFILLED', approvedById: admin.id, fulfilledDate: new Date('2024-03-15') } }),
    prisma.rewardRedemption.create({ data: { rewardId: rewards[1].id, userId: marcus.id, xpSpent: 1000, monetaryValue: 50, status: 'FULFILLED', approvedById: admin.id, fulfilledDate: new Date('2024-07-05') } }),
    prisma.rewardRedemption.create({ data: { rewardId: rewards[6].id, userId: elena.id, xpSpent: 750, monetaryValue: 75, status: 'APPROVED', approvedById: admin.id } }),
    prisma.rewardRedemption.create({ data: { rewardId: rewards[0].id, userId: sarah.id, xpSpent: 2000, monetaryValue: 250, status: 'PENDING' } }),
    prisma.rewardRedemption.create({ data: { rewardId: rewards[3].id, userId: priya.id, xpSpent: 500, monetaryValue: 45, status: 'FULFILLED', approvedById: admin.id, fulfilledDate: new Date('2024-05-20') } }),
  ]);
  console.log('✅ Created reward redemptions');

  // ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.notification.create({ data: { userId: admin.id, type: 'system', module: 'GOVERNANCE', title: '🚨 Critical Compliance Issue', message: 'A new critical compliance issue has been raised: Export Controls Compliance Gap. Immediate action required.', read: false, actionLabel: 'View Issue' } }),
    prisma.notification.create({ data: { userId: sarah.id, type: 'challenge', module: 'GAMIFICATION', title: '🏆 New Challenge Available!', message: 'The Zero Single-Use Plastics Month challenge is now active. Join 150 others already participating!', read: false, actionLabel: 'Join Challenge' } }),
    prisma.notification.create({ data: { userId: david.id, type: 'compliance', module: 'GOVERNANCE', title: '⚠️ Supplier ESG Risk Alert', message: 'Your Tier 2 supplier compliance issue is due in 5 days. Update the action plan now.', read: true, actionLabel: 'Update Issue' } }),
    prisma.notification.create({ data: { userId: marcus.id, type: 'achievement', module: 'GAMIFICATION', title: '🎖️ Challenge Completed!', message: 'You completed the Cycle to Work Challenge and earned 750 XP! Check your new rank on the leaderboard.', read: true, actionLabel: 'View Leaderboard' } }),
    prisma.notification.create({ data: { userId: priya.id, type: 'policy', module: 'GOVERNANCE', title: '📋 Policy Acknowledgement Overdue', message: '35 employees have not acknowledged the Anti-Corruption Policy. Send reminders now.', read: false, actionLabel: 'Send Reminders' } }),
    prisma.notification.create({ data: { userId: elena.id, type: 'goal', module: 'ENVIRONMENT', title: '🎯 Goal Milestone Reached!', message: 'The "Plant 50,000 Trees" goal has reached 77% completion! Great team effort!', read: false, actionLabel: 'View Goal' } }),
    prisma.notification.create({ data: { userId: james.id, type: 'badge', module: 'GAMIFICATION', title: '🛡️ New Badge Earned!', message: 'You\'ve earned the Compliance Guardian badge for your outstanding compliance reporting!', read: false, actionLabel: 'View Badges' } }),
    prisma.notification.create({ data: { userId: admin.id, type: 'audit', module: 'GOVERNANCE', title: '📊 Audit Report Available', message: 'The ISO 14001 Annual Certification Audit report is now available. Score: 87.5/100.', read: true, actionLabel: 'View Audit' } }),
  ]);
  console.log('✅ Created notifications');

  console.log('\n🎉 EcoSphere ESG Platform seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`  • Departments: ${departments.length}`);
  console.log(`  • Users: ${users.length}`);
  console.log(`  • Emission Factors: ${emissionFactors.length}`);
  console.log(`  • Carbon Transactions: ${carbonTransactions.length}`);
  console.log(`  • Product ESG Profiles: ${productProfiles.length}`);
  console.log(`  • Sustainability Goals: ${goals.length}`);
  console.log(`  • CSR Activities: ${csrActivities.length}`);
  console.log(`  • Training Programs: ${trainingPrograms.length}`);
  console.log(`  • Policies: ${policies.length}`);
  console.log(`  • Audits: ${audits.length}`);
  console.log(`  • Compliance Issues: ${complianceIssues.length}`);
  console.log(`  • Challenges: ${challenges.length}`);
  console.log(`  • Badges: ${badges.length}`);
  console.log(`  • Rewards: ${rewards.length}`);
  console.log(`  • Categories: ${categories.length}`);
  console.log('\n🔑 Default Admin Credentials:');
  console.log('  Email: admin@ecosphere.com');
  console.log('  Password: Admin@123');
  console.log('\n🌐 Start server with: npm run dev');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

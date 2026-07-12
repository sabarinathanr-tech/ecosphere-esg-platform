import {
  LayoutDashboard,
  Leaf,
  Users,
  Shield,
  Trophy,
  BarChart3,
  Settings,
  User,
  Zap,
  Target,
  Activity,
  FileText,
  BookOpen,
  ClipboardCheck,
  AlertTriangle,
  Star,
  Award,
  Gift,
  RotateCcw,
  List,
  BarChart2,
  PieChart,
  FileBarChart,
  Wrench,
  Building2,
  Tag,
  Bell,
  Factory,
  Recycle,
  Package,
  UserCheck,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export interface NavChild {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  color: string;
  badge?: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-emerald-400",
  },
  {
    label: "Environment",
    icon: Leaf,
    color: "text-emerald-400",
    children: [
      { label: "Emission Factors", href: "/environment/emission-factors", icon: Factory },
      { label: "Carbon Transactions", href: "/environment/carbon-transactions", icon: Recycle },
      { label: "Product ESG Profiles", href: "/environment/product-profiles", icon: Package },
      { label: "Sustainability Goals", href: "/environment/sustainability-goals", icon: Target },
    ],
  },
  {
    label: "Social",
    icon: Users,
    color: "text-sky-400",
    children: [
      { label: "CSR Activities", href: "/social/csr-activities", icon: Activity },
      { label: "Employee Participation", href: "/social/employee-participation", icon: UserCheck },
      { label: "Diversity", href: "/social/diversity", icon: Users },
      { label: "Training", href: "/social/training", icon: GraduationCap },
    ],
  },
  {
    label: "Governance",
    icon: Shield,
    color: "text-purple-400",
    children: [
      { label: "Policies", href: "/governance/policies", icon: FileText },
      { label: "Policy Acknowledgements", href: "/governance/policy-acknowledgements", icon: BookOpen },
      { label: "Audits", href: "/governance/audits", icon: ClipboardCheck },
      { label: "Compliance Issues", href: "/governance/compliance-issues", icon: AlertTriangle },
    ],
  },
  {
    label: "Gamification",
    icon: Trophy,
    color: "text-orange-400",
    children: [
      { label: "Challenges", href: "/gamification/challenges", icon: Zap },
      { label: "Challenge Participation", href: "/gamification/challenge-participation", icon: Star },
      { label: "Badges", href: "/gamification/badges", icon: Award },
      { label: "Rewards", href: "/gamification/rewards", icon: Gift },
      { label: "Reward Redemption", href: "/gamification/reward-redemption", icon: RotateCcw },
      { label: "Leaderboard", href: "/gamification/leaderboard", icon: List },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    color: "text-slate-400",
    children: [
      { label: "Environmental", href: "/reports/environmental", icon: BarChart2 },
      { label: "Social", href: "/reports/social", icon: PieChart },
      { label: "Governance", href: "/reports/governance", icon: FileBarChart },
      { label: "ESG Summary", href: "/reports/esg-summary", icon: BarChart3 },
      { label: "Custom Builder", href: "/reports/custom-builder", icon: Wrench },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    color: "text-slate-400",
    children: [
      { label: "Departments", href: "/settings/departments", icon: Building2 },
      { label: "Categories", href: "/settings/categories", icon: Tag },
      { label: "ESG Configuration", href: "/settings/esg-configuration", icon: Settings },
      { label: "Notification Settings", href: "/settings/notification-settings", icon: Bell },
    ],
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    color: "text-slate-400",
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    color: "text-slate-400",
  },
];

export const ESG_COLORS = {
  environment: "#10b981",
  social: "#38bdf8",
  governance: "#a78bfa",
  gamification: "#f97316",
  reports: "#94a3b8",
  success: "#22c55e",
  danger: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
} as const;

export const CHART_COLORS = [
  "#10b981",
  "#38bdf8",
  "#a78bfa",
  "#f97316",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
];

export const SEVERITY_LEVELS = ["Critical", "High", "Medium", "Low"] as const;
export const CHALLENGE_STATUSES = ["Draft", "Active", "Under Review", "Completed", "Archived"] as const;
export const POLICY_STATUSES = ["Draft", "Active", "Archived"] as const;
export const AUDIT_STATUSES = ["Scheduled", "In Progress", "Completed", "Overdue"] as const;

export const COMPANY_NAME = "EcoSphere";
export const APP_VERSION = "2.0.4";

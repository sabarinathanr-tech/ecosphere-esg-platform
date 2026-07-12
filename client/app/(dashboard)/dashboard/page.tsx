"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Users,
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Trophy,
  Target,
  ArrowRight,
  Activity,
  BarChart3,
  ExternalLink,
  Plus,
  FileText,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn, formatNumber, getScoreColor } from "@/lib/utils";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const carbonTrendData = [
  { month: "Jan", actual: 1240, target: 1200, baseline: 1400 },
  { month: "Feb", actual: 1180, target: 1160, baseline: 1400 },
  { month: "Mar", actual: 1320, target: 1120, baseline: 1400 },
  { month: "Apr", actual: 1090, target: 1080, baseline: 1400 },
  { month: "May", actual: 1050, target: 1040, baseline: 1400 },
  { month: "Jun", actual: 980, target: 1000, baseline: 1400 },
  { month: "Jul", actual: 920, target: 960, baseline: 1400 },
];

const departmentRankingData = [
  { dept: "Engineering", score: 91, fill: "#10b981" },
  { dept: "HR", score: 87, fill: "#38bdf8" },
  { dept: "Finance", score: 82, fill: "#a78bfa" },
  { dept: "Operations", score: 76, fill: "#f97316" },
  { dept: "Marketing", score: 71, fill: "#f59e0b" },
  { dept: "Manufacturing", score: 64, fill: "#ef4444" },
];

const csrParticipationData = [
  { name: "Tree Plantation Drive", participants: 142, target: 150, dept: "All" },
  { name: "Digital Literacy Camp", participants: 89, target: 100, dept: "HR" },
  { name: "River Cleanup Campaign", participants: 67, target: 80, dept: "Ops" },
  { name: "Solar Panel Initiative", participants: 45, target: 60, dept: "Eng" },
];

const scoreDistributionData = [
  { name: "Excellent (80+)", value: 34, color: "#10b981" },
  { name: "Good (60-79)", value: 28, color: "#38bdf8" },
  { name: "Fair (40-59)", value: 22, color: "#f59e0b" },
  { name: "Poor (<40)", value: 16, color: "#ef4444" },
];

const leaderboardData = [
  { rank: 1, name: "Priya Sharma", dept: "Engineering", xp: 4280, badge: "🌟 Eco Champion", change: "+12" },
  { rank: 2, name: "Rahul Mehta", dept: "HR", xp: 3940, badge: "🌿 Green Leader", change: "+8" },
  { rank: 3, name: "Ananya Patel", dept: "Finance", xp: 3720, badge: "♻️ Recycler", change: "+15" },
  { rank: 4, name: "Karthik Raj", dept: "Operations", xp: 3510, badge: "💧 Water Saver", change: "-2" },
  { rank: 5, name: "Deepa Nair", dept: "Marketing", xp: 3290, badge: "🌱 Seedling", change: "+5" },
];

const recentActivity = [
  { id: 1, type: "policy", action: "Anti-Corruption Policy acknowledged by 94% of staff", time: "2 hours ago", icon: FileText, color: "text-purple-400" },
  { id: 2, type: "challenge", action: "Zero Waste Week challenge reached 100% participation", time: "4 hours ago", icon: Trophy, color: "text-orange-400" },
  { id: 3, type: "emission", action: "Carbon emissions reduced 8% vs last month in Manufacturing", time: "6 hours ago", icon: Leaf, color: "text-emerald-400" },
  { id: 4, type: "audit", action: "ISO 14001 environmental audit scheduled for Aug 15", time: "1 day ago", icon: Shield, color: "text-purple-400" },
  { id: 5, type: "csr", action: "Digital Literacy Camp completed — 89 employees participated", time: "2 days ago", icon: Users, color: "text-sky-400" },
];

const complianceAlerts = [
  { id: 1, title: "ISO 14001 Audit Finding", severity: "high", due: "3 days", status: "Overdue", owner: "Rajesh Kumar" },
  { id: 2, title: "Waste Disposal Report Missing", severity: "medium", due: "7 days", status: "Pending", owner: "Sunita Rao" },
  { id: 3, title: "Energy Audit Compliance", severity: "low", due: "15 days", status: "In Progress", owner: "Manish Singh" },
];

const challengeProgress = [
  { name: "Zero Waste Week", progress: 100, status: "Completed", participants: 142 },
  { name: "Green Commute Challenge", progress: 67, status: "Active", participants: 89 },
  { name: "Energy Audit Sprint", progress: 45, status: "Active", participants: 56 },
  { name: "Sustainability Hackathon", progress: 20, status: "Draft", participants: 0 },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

function ScoreCard({ title, score, maxScore, change, icon, color, bgColor, description }: ScoreCardProps) {
  const pct = (score / maxScore) * 100;
  const positive = change >= 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <Card hover className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at top right, ${bgColor} 0%, transparent 70%)`,
          }}
        />
        <CardContent className="relative p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-600 text-slate-500 uppercase tracking-wider">{title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={cn("text-3xl font-700 tabular-nums", color)}>
                  {score}
                </span>
                <span className="text-sm text-slate-600">/ {maxScore}</span>
              </div>
            </div>
            <div
              className="size-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              {icon}
            </div>
          </div>
          <Progress value={pct} variant={
            color.includes("emerald") ? "environment" :
            color.includes("sky") ? "social" :
            color.includes("purple") ? "governance" : "default"
          } size="sm" className="mb-3" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{description}</span>
            <div className={cn("flex items-center gap-1 text-xs font-600", positive ? "text-emerald-400" : "text-red-400")}>
              {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {positive ? "+" : ""}{change}%
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="rounded-xl border border-white/8 p-3 text-xs shadow-[var(--shadow-elevated)]"
        style={{ backgroundColor: "var(--bg-elevated)" }}
      >
        <p className="font-600 text-white mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mt-1">
            <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400 capitalize">{entry.dataKey}:</span>
            <span className="font-600 text-white">{entry.value} tCO₂e</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-screen-2xl"
    >
      {/* Page Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-700 text-white">ESG Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Executive overview for Q3 2026 · Last updated July 12, 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="size-3.5" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="size-3.5" />
            Quick Action
          </Button>
        </div>
      </motion.div>

      {/* Score Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <ScoreCard
          title="Overall ESG Score"
          score={81}
          maxScore={100}
          change={3.2}
          icon={<BarChart3 className="size-5 text-emerald-400" />}
          color="text-emerald-400"
          bgColor="rgba(16,185,129,0.12)"
          description="Top 15% in industry"
        />
        <ScoreCard
          title="Environmental Score"
          score={74}
          maxScore={100}
          change={5.8}
          icon={<Leaf className="size-5 text-emerald-400" />}
          color="text-emerald-400"
          bgColor="rgba(16,185,129,0.12)"
          description="Carbon -18% vs baseline"
        />
        <ScoreCard
          title="Social Score"
          score={86}
          maxScore={100}
          change={2.1}
          icon={<Users className="size-5 text-sky-400" />}
          color="text-sky-400"
          bgColor="rgba(56,189,248,0.12)"
          description="94% CSR participation"
        />
        <ScoreCard
          title="Governance Score"
          score={88}
          maxScore={100}
          change={-1.4}
          icon={<Shield className="size-5 text-purple-400" />}
          color="text-purple-400"
          bgColor="rgba(167,139,250,0.12)"
          description="3 open compliance issues"
        />
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Carbon Trend */}
        <motion.div variants={item} className="xl:col-span-2">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Carbon Emissions Trend</CardTitle>
                  <CardDescription>Monthly actual vs target (tCO₂e)</CardDescription>
                </div>
                <Badge variant="environment" dot>
                  -18% vs baseline
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={carbonTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="transparent"
                    name="Baseline"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="#38bdf8"
                    strokeWidth={1.5}
                    fill="url(#targetGrad)"
                    name="Target"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#actualGrad)"
                    dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#0B0F17" }}
                    name="Actual"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-5 mt-2">
                {[
                  { color: "#10b981", label: "Actual" },
                  { color: "#38bdf8", label: "Target" },
                  { color: "rgba(255,255,255,0.2)", label: "Baseline", dashed: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div
                      className={cn("h-0.5 w-6 rounded-full", item.dashed && "border-t border-dashed")}
                      style={{ backgroundColor: item.dashed ? undefined : item.color, borderColor: item.dashed ? item.color : undefined }}
                    />
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Department Ranking */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department Ranking</CardTitle>
                  <CardDescription>ESG score by department</CardDescription>
                </div>
                <Link href="/reports/esg-summary">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                    View all <ArrowRight className="size-3" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {departmentRankingData.map((dept, index) => (
                  <div key={dept.dept} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-4 tabular-nums">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-600 text-slate-300 truncate">{dept.dept}</span>
                        <span className="text-xs font-700 tabular-nums" style={{ color: dept.fill }}>
                          {dept.score}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dept.score}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: dept.fill }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Leaderboard */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="size-4 text-orange-400" />
                    Leaderboard
                  </CardTitle>
                  <CardDescription>Top performers this month</CardDescription>
                </div>
                <Link href="/gamification/leaderboard">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    Full board <ArrowRight className="size-3" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-1">
                {leaderboardData.map((entry) => (
                  <motion.div
                    key={entry.rank}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-white/4 transition-colors cursor-pointer"
                  >
                    <div
                      className={cn(
                        "size-6 rounded-full flex items-center justify-center text-xs font-700 shrink-0",
                        entry.rank === 1 && "bg-amber-500/20 text-amber-400",
                        entry.rank === 2 && "bg-slate-500/20 text-slate-400",
                        entry.rank === 3 && "bg-orange-500/20 text-orange-400",
                        entry.rank > 3 && "bg-white/6 text-slate-500"
                      )}
                    >
                      {entry.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-600 text-slate-200 truncate">{entry.name}</span>
                        <span className="text-xs hidden sm:block">{entry.badge}</span>
                      </div>
                      <span className="text-xs text-slate-600">{entry.dept}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-700 text-orange-400 tabular-nums">
                        {formatNumber(entry.xp, 0)} XP
                      </div>
                      <div className={cn("text-xs font-600", entry.change.startsWith("+") ? "text-emerald-400" : "text-red-400")}>
                        {entry.change}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Distribution */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Employee ESG performance spread</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={scoreDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-elevated)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {scoreDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="min-w-0">
                      <span className="text-xs text-slate-500 block truncate">{item.name}</span>
                      <span className="text-xs font-700 tabular-nums" style={{ color: item.color }}>
                        {item.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Alerts */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-amber-400" />
                    Compliance Alerts
                  </CardTitle>
                  <CardDescription>Issues requiring attention</CardDescription>
                </div>
                <Link href="/governance/compliance-issues">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    View all <ArrowRight className="size-3" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {complianceAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    whileHover={{ x: 2 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/4 hover:border-white/8 transition-all cursor-pointer"
                  >
                    <div
                      className={cn(
                        "size-2 rounded-full mt-1.5 shrink-0",
                        alert.severity === "high" && "bg-red-400",
                        alert.severity === "medium" && "bg-amber-400",
                        alert.severity === "low" && "bg-blue-400"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-600 text-slate-200 leading-snug">{alert.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">Owner: {alert.owner}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        variant={
                          alert.status === "Overdue" ? "destructive" :
                          alert.status === "In Progress" ? "warning" : "info"
                        }
                        className="text-xs"
                      >
                        {alert.status}
                      </Badge>
                      <p className="text-xs text-slate-600 mt-1">{alert.due}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="size-4 text-slate-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest updates across all modules</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-0">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    whileHover={{ x: 2 }}
                    className="flex items-start gap-3 py-3 border-b border-white/4 last:border-0 cursor-pointer hover:bg-white/2 -mx-5 px-5 transition-colors"
                  >
                    <div
                      className="size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    >
                      <activity.icon className={cn("size-3.5", activity.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 leading-relaxed">{activity.action}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Challenge Progress + Quick Actions */}
        <div className="space-y-4">
          {/* Challenge Progress */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="size-4 text-orange-400" />
                      Active Challenges
                    </CardTitle>
                    <CardDescription>Gamification progress this cycle</CardDescription>
                  </div>
                  <Link href="/gamification/challenges">
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                      Manage <ArrowRight className="size-3" />
                    </button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-3">
                  {challengeProgress.map((challenge) => (
                    <div key={challenge.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-600 text-slate-300">{challenge.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600">{challenge.participants} members</span>
                          <Badge
                            variant={
                              challenge.status === "Completed" ? "success" :
                              challenge.status === "Active" ? "default" : "secondary"
                            }
                            dot
                            className="text-xs"
                          >
                            {challenge.status}
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={challenge.progress}
                        variant={challenge.status === "Completed" ? "environment" : "gamification"}
                        size="sm"
                        showLabel
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Log Carbon Transaction", icon: Leaf, href: "/environment/carbon-transactions", color: "text-emerald-400", bg: "rgba(16,185,129,0.08)" },
                    { label: "Add CSR Activity", icon: Users, href: "/social/csr-activities", color: "text-sky-400", bg: "rgba(56,189,248,0.08)" },
                    { label: "Create Challenge", icon: Zap, href: "/gamification/challenges", color: "text-orange-400", bg: "rgba(249,115,22,0.08)" },
                    { label: "New Audit", icon: Shield, href: "/governance/audits", color: "text-purple-400", bg: "rgba(167,139,250,0.08)" },
                    { label: "Generate Report", icon: BarChart3, href: "/reports/esg-summary", color: "text-slate-400", bg: "rgba(148,163,184,0.08)" },
                    { label: "Set Goals", icon: Target, href: "/environment/sustainability-goals", color: "text-emerald-400", bg: "rgba(16,185,129,0.08)" },
                  ].map((action) => (
                    <Link key={action.label} href={action.href}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2.5 p-3 rounded-xl border border-white/6 hover:border-white/10 cursor-pointer transition-all"
                        style={{ backgroundColor: action.bg }}
                      >
                        <action.icon className={cn("size-4 shrink-0", action.color)} />
                        <span className="text-xs font-600 text-slate-300 leading-tight">{action.label}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

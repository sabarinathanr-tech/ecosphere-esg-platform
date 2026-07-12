"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Leaf, Users, Shield, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Clock, Zap, Trophy, Target, ArrowRight,
  Activity, BarChart3, ExternalLink, Star, Loader2,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, Legend,
} from "recharts";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn, formatNumber, getScoreColor } from "@/lib/utils";
import { reportsApi, sustainabilityGoalsApi, complianceIssuesApi, challengesApi, leaderboardApi } from "@/lib/services";
import { useAuth } from "@/lib/auth-context";

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/5", className)} />;
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}><CardContent className="p-5"><Skeleton className="h-24" /></CardContent></Card>
      ))}
    </div>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/8 p-3 text-xs" style={{ backgroundColor: "var(--bg-elevated)", boxShadow: "var(--shadow-elevated)" }}>
      <p className="font-600 text-white mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mt-1">
          <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="font-600 text-white">{typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [period] = useState("quarterly");

  // ─── Data Fetching ───────────────────────────────────────────────────────
  const { data: esgSummary, isLoading: esgLoading } = useQuery({
    queryKey: ["esg-summary", period],
    queryFn: () => reportsApi.esgSummary({ period }).then((r) => r.data.data),
  });

  const { data: goalsData } = useQuery({
    queryKey: ["sustainability-goals", "dashboard"],
    queryFn: () => sustainabilityGoalsApi.getAll({ limit: 5, sortBy: "progress", sortOrder: "desc" }).then((r) => r.data),
  });

  const { data: issuesData } = useQuery({
    queryKey: ["compliance-issues", "open"],
    queryFn: () => complianceIssuesApi.getAll({ limit: 5, status: "OPEN", sortBy: "raisedDate", sortOrder: "desc" }).then((r) => r.data),
  });

  const { data: challengesData } = useQuery({
    queryKey: ["challenges", "active"],
    queryFn: () => challengesApi.getAll({ limit: 4, status: "ACTIVE" }).then((r) => r.data),
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ["leaderboard", "top5"],
    queryFn: () => leaderboardApi.get({ period: "monthly" }).then((r) => r.data.data?.slice(0, 5) || []),
  });

  // ─── Derived chart data from API ─────────────────────────────────────────
  const esgPillarData = esgSummary ? [
    { name: "Environmental", score: esgSummary.environmental?.score || 0, color: "#10b981" },
    { name: "Social", score: esgSummary.social?.score || 0, color: "#38bdf8" },
    { name: "Governance", score: esgSummary.governance?.score || 0, color: "#a78bfa" },
  ] : [];

  const goals = goalsData?.data || [];
  const issues = issuesData?.data || [];
  const challenges = challengesData?.data || [];
  const leaderboard = leaderboardData || [];

  const overallScore = esgSummary?.overallESGScore || 0;
  const envScore = esgSummary?.environmental?.score || 0;
  const socialScore = esgSummary?.social?.score || 0;
  const govScore = esgSummary?.governance?.score || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-screen-2xl">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-700 text-white">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">EcoSphere ESG Dashboard · {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/reports/esg-summary">
            <Button size="sm" variant="outline"><BarChart3 className="size-3.5" />Full Report</Button>
          </Link>
          <Link href="/environment/carbon-transactions">
            <Button size="sm"><Leaf className="size-3.5" />Log Emission</Button>
          </Link>
        </div>
      </div>

      {/* ─── KPI Cards ──────────────────────────────────────────── */}
      {esgLoading ? <KPISkeleton /> : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Overall ESG Score", value: `${overallScore}`, unit: "/ 100", change: "+3.2%", up: true, icon: BarChart3, color: "text-emerald-400", bg: "rgba(16,185,129,0.1)", variant: "environment" as const },
            { label: "Environmental Score", value: `${envScore}`, unit: "/ 100", change: "+5.8%", up: true, icon: Leaf, color: "text-emerald-400", bg: "rgba(16,185,129,0.1)", variant: "environment" as const },
            { label: "Social Score", value: `${socialScore}`, unit: "/ 100", change: "+2.1%", up: true, icon: Users, color: "text-sky-400", bg: "rgba(56,189,248,0.1)", variant: "social" as const },
            { label: "Governance Score", value: `${govScore}`, unit: "/ 100", change: "-1.4%", up: false, icon: Shield, color: "text-purple-400", bg: "rgba(167,139,250,0.1)", variant: "governance" as const },
          ].map((kpi, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
              <Card hover className="relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at top right, ${kpi.bg} 0%, transparent 70%)` }} />
                <CardContent className="relative p-5">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-slate-500 font-600 uppercase tracking-wider">{kpi.label}</p>
                    <kpi.icon className={cn("size-4.5", kpi.color)} />
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className={cn("text-4xl font-700 tabular-nums", kpi.color)}>{kpi.value}</span>
                    <span className="text-slate-600 text-sm">{kpi.unit}</span>
                  </div>
                  <Progress value={Number(kpi.value)} variant={kpi.variant} size="sm" className="mb-2" />
                  <div className={cn("flex items-center gap-1 text-xs font-600", kpi.up ? "text-emerald-400" : "text-red-400")}>
                    {kpi.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {kpi.change} vs last period
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Secondary KPIs ─────────────────────────────────────── */}
      {esgSummary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Emissions", value: formatNumber(esgSummary.environmental?.totalEmissions || 0), unit: "tCO₂e", icon: Leaf, color: "text-emerald-400" },
            { label: "Active Employees", value: esgSummary.social?.activeEmployees || 0, unit: "people", icon: Users, color: "text-sky-400" },
            { label: "Active Policies", value: esgSummary.governance?.activePolicies || 0, unit: "policies", icon: Shield, color: "text-purple-400" },
            { label: "Open Compliance", value: esgSummary.governance?.openComplianceIssues || 0, unit: "issues", icon: AlertTriangle, color: "text-amber-400" },
          ].map((item, i) => (
            <Card key={i} hover>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <item.icon className={cn("size-4", item.color)} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className={cn("text-lg font-700 tabular-nums", item.color)}>{String(item.value)}</p>
                  <p className="text-xs text-slate-600">{item.unit}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ─── Charts Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* ESG Pillars Bar */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>ESG Pillar Scores</CardTitle>
            <CardDescription>Real-time Environmental, Social & Governance performance from database</CardDescription>
          </CardHeader>
          <CardContent>
            {esgLoading ? <Skeleton className="h-52" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={esgPillarData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" name="Score" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {esgPillarData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Goals Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Goals Status</CardTitle>
            <CardDescription>Sustainability goal progress distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {!goals.length ? <Skeleton className="h-40" /> : (
              <>
                <div className="space-y-3">
                  {goals.slice(0, 4).map((goal: any) => (
                    <div key={goal.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 truncate max-w-[140px]">{goal.title}</span>
                        <Badge variant={goal.status === "ON_TRACK" ? "success" : goal.status === "ACHIEVED" ? "success" : goal.status === "AT_RISK" ? "warning" : "destructive"} className="text-xs">
                          {goal.status?.replace("_", " ")}
                        </Badge>
                      </div>
                      <Progress value={goal.progress} variant="environment" size="sm" />
                    </div>
                  ))}
                </div>
                <Link href="/environment/sustainability-goals">
                  <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">
                    View All Goals <ArrowRight className="size-3" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Bottom Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Active Challenges */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Challenges</CardTitle>
                <CardDescription>Live gamification challenges</CardDescription>
              </div>
              <Link href="/gamification/challenges"><Button variant="ghost" size="sm" className="text-xs">View all</Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {!challenges.length ? (
              <div className="text-center py-4 text-slate-500 text-xs">No active challenges</div>
            ) : challenges.map((ch: any) => (
              <div key={ch.id} className="p-3 rounded-xl border border-white/6 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-600 text-slate-200">{ch.title}</span>
                  <Badge variant="gamification" className="text-xs shrink-0">+{ch.xpReward} XP</Badge>
                </div>
                <Progress value={ch.currentValue / ch.targetValue * 100} variant="gamification" size="sm" />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{ch.currentValue} / {ch.targetValue} {ch.unit}</span>
                  <span>{ch.participations?.length || 0} joined</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance Issues */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Open Issues</CardTitle>
                <CardDescription>Compliance issues requiring attention</CardDescription>
              </div>
              <Link href="/governance/compliance-issues"><Button variant="ghost" size="sm" className="text-xs">View all</Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {!issues.length ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs py-4 justify-center">
                <CheckCircle className="size-4" /> No open issues
              </div>
            ) : issues.map((issue: any) => (
              <div key={issue.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-white/6"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <AlertTriangle className={cn("size-3.5 mt-0.5 shrink-0",
                  issue.severity === "CRITICAL" ? "text-red-400" :
                  issue.severity === "HIGH" ? "text-orange-400" :
                  issue.severity === "MEDIUM" ? "text-amber-400" : "text-yellow-400"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-600 text-slate-200 truncate">{issue.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={issue.severity === "CRITICAL" ? "destructive" : issue.severity === "HIGH" ? "destructive" : "warning"} className="text-xs">
                      {issue.severity}
                    </Badge>
                    <span className="text-xs text-slate-500">{issue.department?.name || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Monthly leaderboard rankings</CardDescription>
              </div>
              <Link href="/gamification/leaderboard"><Button variant="ghost" size="sm" className="text-xs">Full board</Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {!leaderboard.length ? <Skeleton className="h-40" /> : leaderboard.map((entry: any, i: number) => (
              <div key={entry.id} className="flex items-center gap-3 p-2.5 rounded-lg"
                style={{ background: i === 0 ? "rgba(245,158,11,0.06)" : i === 1 ? "rgba(148,163,184,0.04)" : i === 2 ? "rgba(180,83,9,0.04)" : "rgba(255,255,255,0.02)" }}>
                <div className={cn("size-6 rounded-full flex items-center justify-center text-xs font-700 shrink-0",
                  i === 0 ? "bg-amber-500/20 text-amber-400" : i === 1 ? "bg-slate-400/20 text-slate-400" : i === 2 ? "bg-orange-800/20 text-orange-700" : "bg-white/5 text-slate-500"
                )}>
                  {i + 1}
                </div>
                {entry.avatarUrl ? (
                  <img src={entry.avatarUrl} alt={entry.name} className="size-7 rounded-full object-cover" />
                ) : (
                  <div className="size-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-xs font-600 text-emerald-400">{entry.name?.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-600 text-slate-200 truncate">{entry.name}</p>
                  <p className="text-xs text-slate-500 truncate">{entry.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-700 text-amber-400">{entry.totalXp?.toLocaleString()}</p>
                  <p className="text-xs text-slate-600">XP</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ─── Quick Actions ──────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks across all modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: "Log Emission", icon: Leaf, href: "/environment/carbon-transactions", color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
              { label: "New Goal", icon: Target, href: "/environment/sustainability-goals", color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
              { label: "CSR Activity", icon: Users, href: "/social/csr-activities", color: "text-sky-400", bg: "rgba(56,189,248,0.1)" },
              { label: "Add Training", icon: Star, href: "/social/training", color: "text-sky-400", bg: "rgba(56,189,248,0.1)" },
              { label: "New Policy", icon: Shield, href: "/governance/policies", color: "text-purple-400", bg: "rgba(167,139,250,0.1)" },
              { label: "Raise Issue", icon: AlertTriangle, href: "/governance/compliance-issues", color: "text-amber-400", bg: "rgba(245,158,11,0.1)" },
              { label: "Challenge", icon: Trophy, href: "/gamification/challenges", color: "text-orange-400", bg: "rgba(249,115,22,0.1)" },
              { label: "ESG Report", icon: BarChart3, href: "/reports/esg-summary", color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/6 cursor-pointer transition-all hover:border-white/12"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: action.bg }}>
                    <action.icon className={cn("size-4", action.color)} />
                  </div>
                  <span className="text-xs text-slate-400 text-center leading-tight">{action.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

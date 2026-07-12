"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Download,
  TrendingUp,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const policyAcknowledgement = [
  { policy: "Anti-Corruption", rate: 97 },
  { policy: "Data Privacy", rate: 94 },
  { policy: "Environmental", rate: 91 },
  { policy: "Code of Conduct", rate: 88 },
  { policy: "Safety", rate: 96 },
  { policy: "Whistleblower", rate: 79 },
];

const auditHistory = [
  { month: "Jan", findings: 4, critical: 0, score: 92 },
  { month: "Feb", findings: 2, critical: 0, score: 95 },
  { month: "Mar", findings: 6, critical: 1, score: 88 },
  { month: "Apr", findings: 3, critical: 0, score: 93 },
  { month: "May", findings: 5, critical: 1, score: 87 },
  { month: "Jun", findings: 2, critical: 0, score: 96 },
  { month: "Jul", findings: 3, critical: 1, score: 89 },
];

const complianceByCategory = [
  { name: "Environmental", compliant: 94, total: 100, color: "#10b981" },
  { name: "Social", compliant: 88, total: 100, color: "#38bdf8" },
  { name: "Governance", compliant: 91, total: 100, color: "#a78bfa" },
  { name: "Safety", compliant: 96, total: 100, color: "#f59e0b" },
  { name: "Financial", compliant: 99, total: 100, color: "#3b82f6" },
];

const issueSeverity = [
  { name: "Critical", value: 2, color: "#ef4444" },
  { name: "High", value: 4, color: "#f97316" },
  { name: "Medium", value: 6, color: "#f59e0b" },
  { name: "Low", value: 12, color: "#3b82f6" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-white/8 p-3 text-xs" style={{ backgroundColor: "var(--bg-elevated)" }}>
        <p className="font-600 text-white mb-2">{label}</p>
        {payload.map((e: any) => (
          <div key={e.dataKey} className="flex items-center gap-2 mt-1">
            <div className="size-2 rounded-full" style={{ backgroundColor: e.color }} />
            <span className="text-slate-400">{e.name}:</span>
            <span className="font-600 text-white">{e.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function GovernanceReportPage() {
  const [period, setPeriod] = useState("2026-q2");

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2">
            <Shield className="size-5 text-purple-400" />
            Governance Report
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Policies, audits, compliance & risk metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-q2">Q2 2026</SelectItem>
              <SelectItem value="2026-q1">Q1 2026</SelectItem>
              <SelectItem value="2025">FY 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => toast.success("Exported")}><Download className="size-3.5" />PDF</Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Exported")}><Download className="size-3.5" />Excel</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Governance Score", value: "88 / 100", icon: Shield, color: "text-purple-400", bg: "rgba(167,139,250,0.1)", sub: "-1.4% vs last period" },
          { label: "Policy Compliance", value: "91%", icon: FileText, color: "text-emerald-400", bg: "rgba(16,185,129,0.1)", sub: "+2% vs last period" },
          { label: "Audits Completed", value: "19 / 25", icon: ClipboardCheck, color: "text-sky-400", bg: "rgba(56,189,248,0.1)", sub: "6 scheduled" },
          { label: "Open Compliance Issues", value: "12", icon: AlertTriangle, color: "text-amber-400", bg: "rgba(245,158,11,0.1)", sub: "2 critical" },
        ].map((kpi, i) => (
          <Card key={i} hover>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{kpi.label}</p>
                  <p className={cn("text-2xl font-700 mt-1 tabular-nums", kpi.color)}>{kpi.value}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{kpi.sub}</p>
                </div>
                <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                  <kpi.icon className={cn("size-4.5", kpi.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Audit Findings & Compliance Score</CardTitle>
            <CardDescription>Monthly audit findings vs compliance score trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={auditHistory} margin={{ top: 4, right: 40, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[70, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="findings" name="Findings" fill="#a78bfa" radius={[3, 3, 0, 0]} maxBarSize={30} />
                <Line yAxisId="right" type="monotone" dataKey="score" name="Compliance Score" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Severity Mix</CardTitle>
            <CardDescription>Open compliance issues by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={issueSeverity} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                  {issueSeverity.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {issueSeverity.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-slate-500">{s.name}</span>
                  <span className="text-xs font-700 ml-auto" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Acknowledgement + Compliance by Category */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Policy Acknowledgement Rates</CardTitle>
            <CardDescription>% of employees who have acknowledged each policy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {policyAcknowledgement.map((p) => (
              <div key={p.policy} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-28 shrink-0">{p.policy}</span>
                <Progress value={p.rate} variant="governance" size="sm" className="flex-1" />
                <span className="text-xs font-700 text-purple-400 tabular-nums w-10 text-right">{p.rate}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Rate by Category</CardTitle>
            <CardDescription>Percentage compliant per governance area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {complianceByCategory.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-600 text-slate-300">{c.name}</span>
                  <span className="text-xs font-700 tabular-nums" style={{ color: c.color }}>{c.compliant}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.compliant}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

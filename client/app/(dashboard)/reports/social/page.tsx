"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  Heart,
  BookOpen,
  Activity,
  Star,
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const csrData = [
  { month: "Jan", activities: 3, participants: 210, hours: 840 },
  { month: "Feb", activities: 2, participants: 145, hours: 580 },
  { month: "Mar", activities: 4, participants: 380, hours: 1520 },
  { month: "Apr", activities: 3, participants: 290, hours: 1160 },
  { month: "May", activities: 5, participants: 420, hours: 1680 },
  { month: "Jun", activities: 4, participants: 360, hours: 1440 },
  { month: "Jul", activities: 3, participants: 280, hours: 1120 },
];

const genderDiversity = [
  { name: "Male", value: 58, color: "#38bdf8" },
  { name: "Female", value: 40, color: "#f472b6" },
  { name: "Non-Binary", value: 2, color: "#a78bfa" },
];

const deptParticipation = [
  { dept: "Engineering", rate: 94 },
  { dept: "HR", rate: 88 },
  { dept: "Finance", rate: 82 },
  { dept: "Ops", rate: 76 },
  { dept: "Marketing", rate: 71 },
  { dept: "Sales", rate: 65 },
];

const trainingCompletion = [
  { category: "ESG Awareness", completion: 96 },
  { category: "Compliance", completion: 89 },
  { category: "Safety", completion: 94 },
  { category: "Leadership", completion: 72 },
  { category: "Technical", completion: 81 },
  { category: "Sustainability", completion: 78 },
];

const socialRadar = [
  { subject: "CSR Engagement", value: 86 },
  { subject: "Gender Diversity", value: 74 },
  { subject: "Training Rate", completion: 87, value: 87 },
  { subject: "Employee Wellbeing", value: 79 },
  { subject: "Community Impact", value: 82 },
  { subject: "Inclusion Index", value: 71 },
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
            <span className="font-600 text-white">{e.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function SocialReportPage() {
  const [period, setPeriod] = useState("2026-q2");

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2">
            <Users className="size-5 text-sky-400" />
            Social Report
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">CSR, diversity, training & employee engagement</p>
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
          <Button variant="outline" size="sm" onClick={() => toast.success("Social report exported")}><Download className="size-3.5" />PDF</Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Exported to Excel")}><Download className="size-3.5" />Excel</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Social Score", value: "86 / 100", change: "+2.1%", up: true, icon: Star, color: "text-sky-400", bg: "rgba(56,189,248,0.1)" },
          { label: "CSR Participation", value: "94%", change: "+3.4%", up: true, icon: Heart, color: "text-pink-400", bg: "rgba(244,114,182,0.1)" },
          { label: "Training Completion", value: "87%", change: "+5%", up: true, icon: BookOpen, color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
          { label: "Community Beneficiaries", value: "2,840", change: "+18%", up: true, icon: Activity, color: "text-orange-400", bg: "rgba(249,115,22,0.1)" },
        ].map((kpi, i) => (
          <Card key={i} hover>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{kpi.label}</p>
                  <p className={cn("text-2xl font-700 mt-1 tabular-nums", kpi.color)}>{kpi.value}</p>
                </div>
                <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                  <kpi.icon className={cn("size-4.5", kpi.color)} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs font-600 text-emerald-400">
                <TrendingUp className="size-3" />{kpi.change} vs last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>CSR Activity Trend</CardTitle>
            <CardDescription>Monthly participants and volunteer hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={csrData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="participants" name="Participants" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3, fill: "#38bdf8", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="hours" name="Vol. Hours" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Workforce diversity breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={genderDiversity} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {genderDiversity.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {genderDiversity.map(g => (
                <div key={g.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: g.color }} />
                    <span className="text-xs text-slate-500">{g.name}</span>
                  </div>
                  <span className="text-xs font-700 tabular-nums" style={{ color: g.color }}>{g.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Department Participation Rate</CardTitle>
            <CardDescription>CSR + training engagement by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {deptParticipation.map((d) => (
              <div key={d.dept} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-20 shrink-0">{d.dept}</span>
                <Progress value={d.rate} variant="social" size="sm" className="flex-1" />
                <span className="text-xs font-700 text-sky-400 tabular-nums w-10 text-right">{d.rate}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Completion by Category</CardTitle>
            <CardDescription>Completion rate for each training type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trainingCompletion} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="completion" name="Completion %" fill="#38bdf8" radius={[0, 4, 4, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Social Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Social Performance Radar</CardTitle>
          <CardDescription>Multi-dimensional social responsibility score (out of 100)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={socialRadar}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
              <Radar name="Social Score" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Leaf,
  Users,
  Shield,
  Trophy,
  TrendingUp,
  TrendingDown,
  Star,
  Award,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const esgTrend = [
  { month: "Jan", env: 68, social: 81, gov: 90, overall: 79 },
  { month: "Feb", env: 70, social: 83, gov: 89, overall: 80 },
  { month: "Mar", env: 72, social: 84, gov: 88, overall: 81 },
  { month: "Apr", env: 71, social: 84, gov: 89, overall: 81 },
  { month: "May", env: 73, social: 85, gov: 88, overall: 82 },
  { month: "Jun", env: 74, social: 86, gov: 88, overall: 83 },
  { month: "Jul", env: 74, social: 86, gov: 88, overall: 83 },
];

const radarData = [
  { subject: "Carbon Reduction", value: 74 },
  { subject: "Renewable Energy", value: 52 },
  { subject: "Water Stewardship", value: 71 },
  { subject: "Waste Management", value: 68 },
  { subject: "CSR Engagement", value: 86 },
  { subject: "Gender Diversity", value: 74 },
  { subject: "Training & Dev", value: 87 },
  { subject: "Policy Compliance", value: 91 },
  { subject: "Audit Score", value: 89 },
  { subject: "Issue Resolution", value: 82 },
];

const deptEsgScores = [
  { dept: "Engineering", env: 88, social: 92, gov: 95, overall: 91 },
  { dept: "HR", env: 82, social: 90, gov: 91, overall: 87 },
  { dept: "Finance", env: 79, social: 83, gov: 86, overall: 82 },
  { dept: "Operations", env: 72, social: 78, gov: 82, overall: 76 },
  { dept: "Marketing", env: 68, social: 74, gov: 75, overall: 71 },
  { dept: "Manufacturing", env: 61, social: 67, gov: 70, overall: 64 },
];

const industryBenchmark = [
  { category: "Overall ESG", company: 83, industry: 71, leader: 94 },
  { category: "Environmental", company: 74, industry: 68, leader: 89 },
  { category: "Social", company: 86, industry: 72, leader: 91 },
  { category: "Governance", company: 88, industry: 78, leader: 96 },
];

export default function ESGSummaryPage() {
  const [period, setPeriod] = useState("2026-q2");

  const TrendIcon = ({ v }: { v: number }) =>
    v > 0 ? <TrendingUp className="size-3 text-emerald-400" /> :
    v < 0 ? <TrendingDown className="size-3 text-red-400" /> :
    <Minus className="size-3 text-slate-500" />;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2">
            <BarChart3 className="size-5 text-emerald-400" />
            ESG Summary Report
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Consolidated Environmental, Social & Governance performance</p>
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
          <Button variant="outline" size="sm" onClick={() => toast.success("BRSR report exported")}><Download className="size-3.5" />BRSR</Button>
          <Button size="sm" onClick={() => toast.success("ESG summary PDF exported")}><Download className="size-3.5" />Full Report</Button>
        </div>
      </div>

      {/* Score Pillars */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Overall ESG Score", score: 83, prev: 80, change: 3.2, icon: BarChart3, color: "text-emerald-400", bg: "#10b981", variant: "environment" as const },
          { label: "Environmental", score: 74, prev: 68, change: 5.8, icon: Leaf, color: "text-emerald-400", bg: "#10b981", variant: "environment" as const },
          { label: "Social", score: 86, prev: 81, change: 2.1, icon: Users, color: "text-sky-400", bg: "#38bdf8", variant: "social" as const },
          { label: "Governance", score: 88, prev: 90, change: -1.4, icon: Shield, color: "text-purple-400", bg: "#a78bfa", variant: "governance" as const },
        ].map((p, i) => (
          <motion.div key={i} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
            <Card hover className="relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at top right, ${p.bg}40 0%, transparent 70%)` }} />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs text-slate-500 font-600 uppercase tracking-wider">{p.label}</p>
                  <p.icon className={cn("size-4.5", p.color)} />
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={cn("text-4xl font-700 tabular-nums", p.color)}>{p.score}</span>
                  <span className="text-slate-600 text-sm">/ 100</span>
                </div>
                <Progress value={p.score} variant={p.variant} size="sm" className="mb-2" />
                <div className={cn("flex items-center gap-1 text-xs font-600", p.change >= 0 ? "text-emerald-400" : "text-red-400")}>
                  <TrendIcon v={p.change} />
                  {p.change >= 0 ? "+" : ""}{p.change}% from {p.prev} last period
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ESG Trend + Radar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>ESG Score Trend</CardTitle>
            <CardDescription>Monthly E / S / G performance (Jan–Jul 2026)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={esgTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="env" name="Environmental" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }} />
                <Line type="monotone" dataKey="social" name="Social" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3, fill: "#38bdf8", strokeWidth: 0 }} />
                <Line type="monotone" dataKey="gov" name="Governance" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }} />
                <Line type="monotone" dataKey="overall" name="Overall" stroke="#f97316" strokeWidth={2.5} strokeDasharray="5 3" dot={{ r: 3, fill: "#f97316", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-5 mt-2">
              {[{ c: "#10b981", l: "Environmental" }, { c: "#38bdf8", l: "Social" }, { c: "#a78bfa", l: "Governance" }, { c: "#f97316", l: "Overall" }].map(leg => (
                <div key={leg.l} className="flex items-center gap-1.5">
                  <div className="h-0.5 w-5 rounded-full" style={{ backgroundColor: leg.c }} />
                  <span className="text-xs text-slate-500">{leg.l}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ESG Spider Chart</CardTitle>
            <CardDescription>10-dimension performance map</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 9 }} />
                <Radar name="Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Industry Benchmark + Dept Scores */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Industry Benchmark Comparison</CardTitle>
            <CardDescription>EcoSphere vs industry average vs industry leader</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={industryBenchmark} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="company" name="EcoSphere" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={24} />
                <Bar dataKey="industry" name="Industry Avg" fill="rgba(255,255,255,0.12)" radius={[3, 3, 0, 0]} maxBarSize={24} />
                <Bar dataKey="leader" name="Leader" fill="rgba(56,189,248,0.4)" radius={[3, 3, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department ESG Scores</CardTitle>
            <CardDescription>Overall ESG performance by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {deptEsgScores.map((d, i) => (
              <div key={d.dept} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-4 tabular-nums">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-600 text-slate-300">{d.dept}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600">E:{d.env}</span>
                      <span className="text-xs text-slate-600">S:{d.social}</span>
                      <span className="text-xs text-slate-600">G:{d.gov}</span>
                      <span className={cn("text-xs font-700 tabular-nums", d.overall >= 80 ? "text-emerald-400" : d.overall >= 70 ? "text-amber-400" : "text-red-400")}>
                        {d.overall}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.overall}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      className={cn("h-full rounded-full", d.overall >= 80 ? "bg-emerald-500" : d.overall >= 70 ? "bg-amber-500" : "bg-red-500")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

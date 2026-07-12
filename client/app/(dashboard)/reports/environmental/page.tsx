"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  FileText,
  TrendingDown,
  TrendingUp,
  Leaf,
  Zap,
  Droplets,
  Recycle,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn, formatNumber } from "@/lib/utils";
import { toast } from "sonner";

const carbonByMonth = [
  { month: "Jan", scope1: 3240, scope2: 12800, scope3: 2100, total: 18140 },
  { month: "Feb", scope1: 3180, scope2: 11900, scope3: 1940, total: 17020 },
  { month: "Mar", scope1: 3600, scope2: 13200, scope3: 2400, total: 19200 },
  { month: "Apr", scope1: 3100, scope2: 12100, scope3: 1900, total: 17100 },
  { month: "May", scope1: 2900, scope2: 11400, scope3: 1800, total: 16100 },
  { month: "Jun", scope1: 2700, scope2: 10800, scope3: 1650, total: 15150 },
  { month: "Jul", scope1: 2400, scope2: 10100, scope3: 1580, total: 14080 },
];

const emissionsByDept = [
  { dept: "Manufacturing", emissions: 8420 },
  { dept: "IT Operations", emissions: 5620 },
  { dept: "Logistics", emissions: 4180 },
  { dept: "Facilities", emissions: 2340 },
  { dept: "HR & Admin", emissions: 1280 },
  { dept: "Sales", emissions: 960 },
];

const scopeBreakdown = [
  { name: "Scope 1 - Direct", value: 23, color: "#10b981" },
  { name: "Scope 2 - Energy", value: 64, color: "#38bdf8" },
  { name: "Scope 3 - Value Chain", value: 13, color: "#a78bfa" },
];

const energyData = [
  { month: "Jan", renewable: 28, nonRenewable: 72 },
  { month: "Feb", renewable: 31, nonRenewable: 69 },
  { month: "Mar", renewable: 33, nonRenewable: 67 },
  { month: "Apr", renewable: 38, nonRenewable: 62 },
  { month: "May", renewable: 42, nonRenewable: 58 },
  { month: "Jun", renewable: 47, nonRenewable: 53 },
  { month: "Jul", renewable: 52, nonRenewable: 48 },
];

const envGoals = [
  { goal: "Carbon Neutrality", target: 2035, progress: 34, unit: "% reduction achieved" },
  { goal: "100% Renewable Energy", target: 2028, progress: 52, unit: "% renewable mix" },
  { goal: "Zero Waste to Landfill", target: 2030, progress: 68, unit: "% diverted" },
  { goal: "Water Usage Reduction 30%", target: 2027, progress: 71, unit: "% reduced" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-white/8 p-3 text-xs" style={{ backgroundColor: "var(--bg-elevated)", boxShadow: "var(--shadow-elevated)" }}>
        <p className="font-600 text-white mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mt-1">
            <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="font-600 text-white">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function EnvironmentalReportPage() {
  const [period, setPeriod] = useState("2026-q2");
  const [dept, setDept] = useState("all");

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2">
            <Leaf className="size-5 text-emerald-400" />
            Environmental Report
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">GHG emissions, energy, water & waste metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="it">IT Operations</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-q2">Q2 2026</SelectItem>
              <SelectItem value="2026-q1">Q1 2026</SelectItem>
              <SelectItem value="2025">FY 2025</SelectItem>
              <SelectItem value="2024">FY 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => toast.success("Report exported as PDF")}><Download className="size-3.5" />PDF</Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Exported to Excel")}><Download className="size-3.5" />Excel</Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total GHG Emissions", value: "14.1 tCO₂e", subVal: "This month", change: "-6.2%", up: false, icon: Leaf, color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
          { label: "Renewable Energy Share", value: "52%", subVal: "+4% vs last month", change: "+4%", up: true, icon: Zap, color: "text-amber-400", bg: "rgba(245,158,11,0.1)" },
          { label: "Water Consumption", value: "8,420 kL", subVal: "This month", change: "-12.3%", up: false, icon: Droplets, color: "text-sky-400", bg: "rgba(56,189,248,0.1)" },
          { label: "Waste Diverted", value: "68%", subVal: "Recycled / Composted", change: "+8%", up: true, icon: Recycle, color: "text-purple-400", bg: "rgba(167,139,250,0.1)" },
        ].map((kpi, i) => (
          <Card key={i} hover>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{kpi.label}</p>
                  <p className={cn("text-2xl font-700 mt-1 tabular-nums", kpi.color)}>{kpi.value}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{kpi.subVal}</p>
                </div>
                <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.bg }}>
                  <kpi.icon className={cn("size-4.5", kpi.color)} />
                </div>
              </div>
              <div className={cn("flex items-center gap-1 mt-2 text-xs font-600", !kpi.up ? "text-emerald-400" : kpi.up ? "text-emerald-400" : "text-red-400")}>
                {kpi.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {kpi.change} vs previous period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>GHG Emissions Trend by Scope</CardTitle>
            <CardDescription>Monthly breakdown — Scope 1 / 2 / 3 (kgCO₂e)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={carbonByMonth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  {[
                    { id: "s1", color: "#10b981" },
                    { id: "s2", color: "#38bdf8" },
                    { id: "s3", color: "#a78bfa" },
                  ].map(g => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={g.color} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="scope1" name="Scope 1" stroke="#10b981" fill="url(#s1)" strokeWidth={2} />
                <Area type="monotone" dataKey="scope2" name="Scope 2" stroke="#38bdf8" fill="url(#s2)" strokeWidth={2} />
                <Area type="monotone" dataKey="scope3" name="Scope 3" stroke="#a78bfa" fill="url(#s3)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scope Distribution</CardTitle>
            <CardDescription>Percentage share by scope type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={scopeBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {scopeBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {scopeBreakdown.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-slate-500">{s.name}</span>
                  </div>
                  <span className="text-xs font-700 tabular-nums" style={{ color: s.color }}>{s.value}%</span>
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
            <CardTitle>Emissions by Department</CardTitle>
            <CardDescription>Total kgCO₂e per department (Jul 2026)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={emissionsByDept} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="dept" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="emissions" name="Emissions" fill="#10b981" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Renewable Energy Mix</CardTitle>
            <CardDescription>Monthly renewable vs non-renewable share (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={energyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="renewable" name="Renewable %" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={30} stackId="a" />
                <Bar dataKey="nonRenewable" name="Non-Renewable %" fill="rgba(255,255,255,0.08)" radius={[3, 3, 0, 0]} maxBarSize={30} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Environmental Goals Progress</CardTitle>
              <CardDescription>Long-term sustainability targets</CardDescription>
            </div>
            <Button variant="outline" size="sm"><ExternalLink className="size-3.5" />View All Goals</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {envGoals.map((goal) => (
              <div key={goal.goal} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-600 text-slate-200">{goal.goal}</span>
                  <Badge variant="secondary">Target: {goal.target}</Badge>
                </div>
                <Progress value={goal.progress} variant="environment" size="md" showLabel />
                <p className="text-xs text-slate-500">{goal.progress}% — {goal.unit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

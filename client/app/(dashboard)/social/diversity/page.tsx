"use client";
import React from "react";
import { motion } from "framer-motion";
import { Users, Download, TrendingUp } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DataTable, type Column } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const genderData = [{ name: "Male", value: 58, color: "#38bdf8" }, { name: "Female", value: 40, color: "#f472b6" }, { name: "Non-Binary", value: 2, color: "#a78bfa" }];
const ageData = [{ group: "18-24", count: 12 }, { group: "25-34", count: 38 }, { group: "35-44", count: 29 }, { group: "45-54", count: 16 }, { group: "55+", count: 5 }];
const deptDiversity = [
  { dept: "Engineering", male: 72, female: 26, nb: 2 }, { dept: "HR", male: 32, female: 66, nb: 2 },
  { dept: "Finance", male: 55, female: 43, nb: 2 }, { dept: "Operations", male: 68, female: 30, nb: 2 },
  { dept: "Marketing", male: 44, female: 54, nb: 2 }, { dept: "Manufacturing", male: 82, female: 17, nb: 1 },
];

interface DeptRow { dept: string; male: number; female: number; nb: number; total: number; womenLeadership: number; }
const tableData: DeptRow[] = deptDiversity.map(d => ({ ...d, total: d.male + d.female + d.nb, womenLeadership: Math.round(d.female * 0.35 + Math.random() * 5) }));

export default function DiversityPage() {
  const cols: Column<DeptRow>[] = [
    { key: "dept", label: "Department", sortable: true },
    { key: "male", label: "Male %", sortable: true, render: (v) => <span className="text-sky-400 font-600 text-xs tabular-nums">{Number(v)}%</span> },
    { key: "female", label: "Female %", sortable: true, render: (v) => <span className="text-pink-400 font-600 text-xs tabular-nums">{Number(v)}%</span> },
    { key: "nb", label: "Non-Binary %", render: (v) => <span className="text-purple-400 font-600 text-xs tabular-nums">{Number(v)}%</span> },
    { key: "womenLeadership", label: "Women in Leadership", sortable: true, render: (v) => (
      <div className="w-24"><Progress value={Number(v)} variant="social" size="sm" /><span className="text-xs text-slate-500 mt-0.5 block">{Number(v)}%</span></div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Users className="size-5 text-sky-400" />Diversity & Inclusion</h1>
          <p className="text-sm text-slate-500 mt-0.5">Workforce diversity metrics, representation & inclusion indices</p></div>
        <Button variant="outline" size="sm" onClick={() => toast.success("D&I report exported")}><Download className="size-3.5" />Export</Button>
      </div>

      {/* Hero KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Female Workforce", v: "40%", trend: "+2.4%", c: "text-pink-400", bg: "rgba(244,114,182,0.1)" },
          { l: "Women in Leadership", v: "34%", trend: "+3.1%", c: "text-purple-400", bg: "rgba(167,139,250,0.1)" },
          { l: "D&I Score", v: "74 / 100", trend: "+5pts", c: "text-sky-400", bg: "rgba(56,189,248,0.1)" },
          { l: "Inclusion Index", v: "71%", trend: "+1.8%", c: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-600"><TrendingUp className="size-3" />{k.trend} vs last year</div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Pie */}
        <Card>
          <CardHeader><CardTitle>Gender Distribution</CardTitle><CardDescription>Overall workforce composition</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={genderData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {genderData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} /></PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {genderData.map(g => (
                <div key={g.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="size-2 rounded-full" style={{ backgroundColor: g.color }} /><span className="text-xs text-slate-500">{g.name}</span></div>
                  <span className="text-xs font-700 tabular-nums" style={{ color: g.color }}>{g.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Age */}
        <Card>
          <CardHeader><CardTitle>Age Distribution</CardTitle><CardDescription>Workforce age group breakdown</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="group" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="count" name="Employees %" fill="#38bdf8" radius={[3, 3, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dept Gender Split */}
        <Card>
          <CardHeader><CardTitle>Gender by Department</CardTitle><CardDescription>Male / Female split per dept</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {deptDiversity.map(d => (
              <div key={d.dept}>
                <div className="flex justify-between mb-1"><span className="text-xs text-slate-400">{d.dept}</span>
                  <span className="text-xs text-slate-600">{d.female}% F · {d.male}% M</span></div>
                <div className="h-2 rounded-full overflow-hidden flex">
                  <div className="h-full bg-pink-500 rounded-l-full" style={{ width: `${d.female}%` }} />
                  <div className="h-full bg-sky-500 rounded-r-full" style={{ width: `${d.male}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card><CardContent className="p-5">
        <DataTable columns={cols} data={tableData} searchPlaceholder="Search departments..." searchKeys={["dept"] as any} />
      </CardContent></Card>
    </motion.div>
  );
}


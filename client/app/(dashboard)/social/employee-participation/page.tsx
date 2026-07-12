"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Filter, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";

interface EmployeeParticipation {
  id: string; employeeName: string; employeeId: string; department: string;
  activity: string; activityType: "CSR" | "Training" | "Challenge" | "Audit";
  date: string; hours: number; xpEarned: number;
  status: "Attended" | "Absent" | "Pending" | "Excused"; verifiedBy: string;
}

const DATA: EmployeeParticipation[] = [
  { id: "EP001", employeeName: "Priya Sharma", employeeId: "EMP042", department: "Engineering", activity: "Tree Plantation Drive", activityType: "CSR", date: "2026-07-10", hours: 4, xpEarned: 200, status: "Attended", verifiedBy: "Rajesh K" },
  { id: "EP002", employeeName: "Rahul Mehta", employeeId: "EMP018", department: "HR", activity: "ISO 14001 Training", activityType: "Training", date: "2026-07-08", hours: 8, xpEarned: 400, status: "Attended", verifiedBy: "Sunita R" },
  { id: "EP003", employeeName: "Ananya Patel", employeeId: "EMP076", department: "Finance", activity: "Zero Waste Week Challenge", activityType: "Challenge", date: "2026-07-05", hours: 1, xpEarned: 500, status: "Attended", verifiedBy: "Auto" },
  { id: "EP004", employeeName: "Karthik Raj", employeeId: "EMP031", department: "Operations", activity: "Fire Safety Audit", activityType: "Audit", date: "2026-07-03", hours: 6, xpEarned: 300, status: "Attended", verifiedBy: "Deepa N" },
  { id: "EP005", employeeName: "Deepa Nair", employeeId: "EMP055", department: "Marketing", activity: "Digital Literacy Camp", activityType: "CSR", date: "2026-06-28", hours: 4, xpEarned: 200, status: "Attended", verifiedBy: "Rahul M" },
  { id: "EP006", employeeName: "Vijay Kumar", employeeId: "EMP089", department: "Manufacturing", activity: "Safety Training", activityType: "Training", date: "2026-06-25", hours: 6, xpEarned: 300, status: "Attended", verifiedBy: "Sunita R" },
  { id: "EP007", employeeName: "Sunita Rao", employeeId: "EMP012", department: "HR", activity: "River Cleanup Campaign", activityType: "CSR", date: "2026-07-05", hours: 3, xpEarned: 150, status: "Absent", verifiedBy: "—" },
  { id: "EP008", employeeName: "Meera Joshi", employeeId: "EMP067", department: "Facilities", activity: "Green Commute Challenge", activityType: "Challenge", date: "2026-07-01", hours: 0, xpEarned: 150, status: "Attended", verifiedBy: "Auto" },
  { id: "EP009", employeeName: "Arun Krishnan", employeeId: "EMP033", department: "Engineering", activity: "ISO 14001 Training", activityType: "Training", date: "2026-07-08", hours: 8, xpEarned: 400, status: "Pending", verifiedBy: "—" },
  { id: "EP010", employeeName: "Nithya Devi", employeeId: "EMP091", department: "Finance", activity: "Blood Donation Drive", activityType: "CSR", date: "2026-06-01", hours: 2, xpEarned: 100, status: "Attended", verifiedBy: "Deepa N" },
  { id: "EP011", employeeName: "Sathish M", employeeId: "EMP044", department: "Operations", activity: "Green Commute Challenge", activityType: "Challenge", date: "2026-07-01", hours: 0, xpEarned: 150, status: "Attended", verifiedBy: "Auto" },
  { id: "EP012", employeeName: "Lakshmi Priya", employeeId: "EMP028", department: "Marketing", activity: "Compliance Training", activityType: "Training", date: "2026-06-20", hours: 4, xpEarned: 200, status: "Excused", verifiedBy: "HR" },
];

const deptData = [
  { dept: "Engineering", rate: 94 }, { dept: "HR", rate: 88 }, { dept: "Finance", rate: 82 },
  { dept: "Operations", rate: 76 }, { dept: "Marketing", rate: 71 }, { dept: "Manufacturing", rate: 65 }, { dept: "Facilities", rate: 84 },
];

export default function EmployeeParticipationPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const filtered = typeFilter === "all" ? DATA : DATA.filter(d => d.activityType === typeFilter);

  const columns: Column<EmployeeParticipation>[] = [
    { key: "employeeName", label: "Employee", sortable: true, render: (_, r) => (
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0">
          <span className="text-xs font-700 text-sky-400">{r.employeeName.split(" ").map(n=>n[0]).join("")}</span>
        </div>
        <div><p className="text-xs font-600 text-slate-200">{r.employeeName}</p><p className="text-xs text-slate-600">{r.employeeId} · {r.department}</p></div>
      </div>
    )},
    { key: "activity", label: "Activity", render: (v, r) => (
      <div><p className="text-xs text-slate-300">{String(v)}</p><Badge variant={r.activityType === "CSR" ? "social" : r.activityType === "Training" ? "governance" : r.activityType === "Challenge" ? "gamification" : "secondary"} className="text-xs mt-0.5">{r.activityType}</Badge></div>
    )},
    { key: "date", label: "Date", sortable: true, render: (v) => <span className="text-xs text-slate-400">{formatDate(String(v))}</span> },
    { key: "hours", label: "Hours", sortable: true, render: (v) => <span className="text-xs tabular-nums text-slate-300">{Number(v)}h</span> },
    { key: "xpEarned", label: "XP Earned", sortable: true, render: (v) => <span className="text-xs tabular-nums font-700 text-orange-400">{Number(v)} XP</span> },
    { key: "status", label: "Status", render: (v) => (
      <Badge variant={v === "Attended" ? "success" : v === "Absent" ? "destructive" : v === "Excused" ? "warning" : "info"} dot>{String(v)}</Badge>
    )},
    { key: "verifiedBy", label: "Verified By", render: (v) => <span className="text-xs text-slate-500">{String(v)}</span> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><UserCheck className="size-5 text-sky-400" />Employee Participation</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track employee engagement across CSR, training, challenges & audits</p></div>
        <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Total Records", v: "342", c: "text-sky-400" }, { l: "Avg Volunteer Hours", v: "4.2h", c: "text-emerald-400" },
          { l: "Top Department", v: "Engineering", c: "text-purple-400", s: "94% participation" }, { l: "XP Distributed", v: "48,200", c: "text-orange-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
            {k.s && <p className="text-xs text-slate-600 mt-0.5">{k.s}</p>}
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Department Participation Rate</CardTitle><CardDescription>% of employees participated in at least one activity</CardDescription></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={deptData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="dept" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="rate" name="Participation %" fill="#38bdf8" radius={[3, 3, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={filtered}
          searchPlaceholder="Search by name, activity, department..."
          searchKeys={["employeeName", "activity", "department", "status"] as any}
          actions={
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {["CSR","Training","Challenge","Audit"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          } />
      </CardContent></Card>
    </motion.div>
  );
}


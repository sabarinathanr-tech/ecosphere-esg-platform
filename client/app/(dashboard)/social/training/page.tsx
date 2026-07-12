"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Plus, Download, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface TrainingProgram {
  id: string; title: string; category: string; instructor: string;
  startDate: string; endDate: string; duration: number; enrolled: number;
  completed: number; actualCompletion: number; mandatory: boolean;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"; rating: number;
}

const PROGRAMS: TrainingProgram[] = [
  { id: "T001", title: "ESG Fundamentals & BRSR Reporting", category: "ESG Awareness", instructor: "Dr. Priya Venkat", startDate: "2026-07-01", endDate: "2026-07-03", duration: 24, enrolled: 142, completed: 138, actualCompletion: 97, mandatory: true, status: "Completed", rating: 4.8 },
  { id: "T002", title: "ISO 14001:2015 Environmental Management", category: "Compliance", instructor: "Rajesh Kumar", startDate: "2026-07-08", endDate: "2026-07-09", duration: 16, enrolled: 68, completed: 61, actualCompletion: 90, mandatory: true, status: "Completed", rating: 4.5 },
  { id: "T003", title: "Workplace Safety & OHSAS 18001", category: "Safety", instructor: "Suresh Babu", startDate: "2026-07-15", endDate: "2026-07-16", duration: 12, enrolled: 89, completed: 42, actualCompletion: 47, mandatory: true, status: "In Progress", rating: 0 },
  { id: "T004", title: "ESG Leadership for Managers", category: "Leadership", instructor: "Dr. Ananya P", startDate: "2026-07-20", endDate: "2026-07-21", duration: 16, enrolled: 28, completed: 0, actualCompletion: 0, mandatory: false, status: "Scheduled", rating: 0 },
  { id: "T005", title: "Carbon Accounting & GHG Protocol", category: "Sustainability", instructor: "Karthik Raj", startDate: "2026-06-10", endDate: "2026-06-11", duration: 16, enrolled: 45, completed: 43, actualCompletion: 96, mandatory: false, status: "Completed", rating: 4.6 },
  { id: "T006", title: "Data Privacy & GDPR Compliance", category: "Compliance", instructor: "Meera Joshi", startDate: "2026-06-20", endDate: "2026-06-20", duration: 8, enrolled: 220, completed: 204, actualCompletion: 93, mandatory: true, status: "Completed", rating: 4.2 },
  { id: "T007", title: "Python for ESG Data Analysis", category: "Technical", instructor: "Arun Krishnan", startDate: "2026-08-05", endDate: "2026-08-07", duration: 24, enrolled: 32, completed: 0, actualCompletion: 0, mandatory: false, status: "Scheduled", rating: 0 },
  { id: "T008", title: "Diversity, Equity & Inclusion Workshop", category: "ESG Awareness", instructor: "Sunita Rao", startDate: "2026-05-15", endDate: "2026-05-15", duration: 8, enrolled: 180, completed: 164, actualCompletion: 91, mandatory: true, status: "Completed", rating: 4.4 },
  { id: "T009", title: "Supply Chain Sustainability", category: "Sustainability", instructor: "Deepa Nair", startDate: "2026-08-20", endDate: "2026-08-21", duration: 16, enrolled: 24, completed: 0, actualCompletion: 0, mandatory: false, status: "Scheduled", rating: 0 },
  { id: "T010", title: "First Aid & Emergency Response", category: "Safety", instructor: "External Trainer", startDate: "2026-06-01", endDate: "2026-06-01", duration: 8, enrolled: 120, completed: 118, actualCompletion: 98, mandatory: true, status: "Completed", rating: 4.7 },
];

const monthlyHours = [
  { month: "Jan", hours: 480 }, { month: "Feb", hours: 320 }, { month: "Mar", hours: 640 },
  { month: "Apr", hours: 280 }, { month: "May", hours: 520 }, { month: "Jun", hours: 680 }, { month: "Jul", hours: 420 },
];

const deptCompletion = [
  { dept: "Engineering", rate: 96 }, { dept: "HR", rate: 94 }, { dept: "Finance", rate: 89 },
  { dept: "Operations", rate: 84 }, { dept: "Marketing", rate: 79 }, { dept: "Manufacturing", rate: 71 },
];

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} className={cn("size-3", s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-700")} />
    ))}
    {rating > 0 && <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>}
  </div>
);

export default function TrainingPage() {
  const [addOpen, setAddOpen] = useState(false);

  const columns: Column<TrainingProgram>[] = [
    { key: "title", label: "Program", sortable: true, render: (_, r) => (
      <div className="max-w-48">
        <p className="text-xs font-600 text-slate-200 leading-snug">{r.title}</p>
        <p className="text-xs text-slate-600">{r.category} · {r.instructor}</p>
      </div>
    )},
    { key: "mandatory", label: "Type", render: (v) => (
      <Badge variant={v ? "destructive" : "secondary"} className="text-xs">{v ? "Mandatory" : "Optional"}</Badge>
    )},
    { key: "duration", label: "Duration", render: (v) => <span className="text-xs tabular-nums text-slate-400">{Number(v)}h</span> },
    { key: "enrolled", label: "Enrolled", sortable: true, render: (v, r) => (
      <div><span className="text-xs font-600 text-sky-400 tabular-nums">{Number(v)}</span></div>
    )},
    { key: "actualCompletion", label: "Completion", sortable: true, render: (v) => (
      <div className="w-20">
        <Progress value={Number(v)} variant={Number(v) >= 80 ? "environment" : Number(v) >= 50 ? "warning" : "danger"} size="sm" />
        <span className="text-xs text-slate-500 mt-0.5 block">{Number(v)}%</span>
      </div>
    )},
    { key: "startDate", label: "Date", render: (v) => <span className="text-xs text-slate-400">{formatDate(String(v))}</span> },
    { key: "status", label: "Status", render: (v) => (
      <Badge variant={v === "Completed" ? "success" : v === "In Progress" ? "default" : v === "Scheduled" ? "info" : "destructive"} dot>{String(v)}</Badge>
    )},
    { key: "rating", label: "Rating", render: (v) => Number(v) > 0 ? <RatingStars rating={Number(v)} /> : <span className="text-xs text-slate-600">—</span> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><GraduationCap className="size-5 text-sky-400" />Training & Development</h1>
          <p className="text-sm text-slate-500 mt-0.5">ESG training programs, completion tracking & feedback</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Add Training</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Total Programs", v: "24", c: "text-sky-400" }, { l: "Completion Rate", v: "87%", c: "text-emerald-400" },
          { l: "Mandatory Trainings", v: "8", c: "text-red-400" }, { l: "Average Rating", v: "4.3 / 5", c: "text-amber-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Monthly Training Hours</CardTitle><CardDescription>Total hours completed per month</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthlyHours} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="hours" name="Training Hours" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3, fill: "#38bdf8", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Completion by Department</CardTitle><CardDescription>Overall training completion rate</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {deptCompletion.map(d => (
              <div key={d.dept} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-24 shrink-0">{d.dept}</span>
                <Progress value={d.rate} variant="social" size="sm" className="flex-1" />
                <span className="text-xs font-700 text-sky-400 tabular-nums w-10 text-right">{d.rate}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={PROGRAMS}
          searchPlaceholder="Search programs..." searchKeys={["title", "category", "instructor", "status"] as any} />
      </CardContent></Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Add Training Program</DialogTitle><DialogDescription>Schedule a new ESG training or compliance program</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Program Title</label><Input placeholder="e.g., ISO 14001 Environmental Management" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Category</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["ESG Awareness","Compliance","Safety","Leadership","Technical","Sustainability"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Instructor</label><Input placeholder="Name or External Trainer" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Start Date</label><Input type="date" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">End Date</label><Input type="date" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Duration (hours)</label><Input type="number" placeholder="e.g., 8" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Max Enrollment</label><Input type="number" placeholder="e.g., 50" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Training program scheduled"); }}>Schedule Training</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}


"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";

interface ChallengeParticipation {
  id: string; challengeId: string; challengeName: string;
  employeeName: string; employeeId: string; department: string;
  joinedDate: string; completionDate?: string;
  progress: number; xpEarned: number;
  status: "Active" | "Completed" | "Dropped" | "Pending Verification";
  rank?: number; badge?: string;
}

const DATA: ChallengeParticipation[] = [
  { id: "CP001", challengeId: "CH001", challengeName: "Zero Single-Use Plastics Week", employeeName: "Priya Sharma", employeeId: "EMP042", department: "Engineering", joinedDate: "2026-07-07", progress: 100, xpEarned: 500, status: "Completed", rank: 1, badge: "♻️", completionDate: "2026-07-13" },
  { id: "CP002", challengeId: "CH002", challengeName: "Green Commute July", employeeName: "Rahul Mehta", employeeId: "EMP018", department: "HR", joinedDate: "2026-07-01", progress: 63, xpEarned: 0, status: "Active" },
  { id: "CP003", challengeId: "CH001", challengeName: "Zero Single-Use Plastics Week", employeeName: "Karthik Raj", employeeId: "EMP031", department: "Operations", joinedDate: "2026-07-07", progress: 85, xpEarned: 0, status: "Pending Verification" },
  { id: "CP004", challengeId: "CH003", challengeName: "Water Conservation Sprint", employeeName: "Meera Joshi", employeeId: "EMP067", department: "Facilities", joinedDate: "2026-07-01", progress: 72, xpEarned: 0, status: "Active" },
  { id: "CP005", challengeId: "CH002", challengeName: "Green Commute July", employeeName: "Ananya Patel", employeeId: "EMP076", department: "Finance", joinedDate: "2026-07-01", progress: 55, xpEarned: 0, status: "Active" },
  { id: "CP006", challengeId: "CH004", challengeName: "Energy Dashboard 100 Days", employeeName: "Vijay Kumar", employeeId: "EMP089", department: "Manufacturing", joinedDate: "2026-04-01", progress: 100, xpEarned: 1000, status: "Completed", rank: 3, badge: "⚡", completionDate: "2026-07-09" },
  { id: "CP007", challengeId: "CH001", challengeName: "Zero Single-Use Plastics Week", employeeName: "Sunita Rao", employeeId: "EMP012", department: "HR", joinedDate: "2026-07-07", progress: 40, xpEarned: 0, status: "Dropped" },
  { id: "CP008", challengeId: "CH004", challengeName: "Energy Dashboard 100 Days", employeeName: "Deepa Nair", employeeId: "EMP055", department: "Marketing", joinedDate: "2026-04-01", progress: 100, xpEarned: 1000, status: "Completed", rank: 2, badge: "⚡", completionDate: "2026-07-08" },
  { id: "CP009", challengeId: "CH003", challengeName: "Water Conservation Sprint", employeeName: "Arun Krishnan", employeeId: "EMP033", department: "Engineering", joinedDate: "2026-07-01", progress: 80, xpEarned: 0, status: "Active" },
  { id: "CP010", challengeId: "CH002", challengeName: "Green Commute July", employeeName: "Nithya Devi", employeeId: "EMP091", department: "Finance", joinedDate: "2026-07-01", progress: 70, xpEarned: 0, status: "Active" },
  { id: "CP011", challengeId: "CH005", challengeName: "Diversity Reading Challenge", employeeName: "Sathish M", employeeId: "EMP044", department: "Operations", joinedDate: "2026-06-01", progress: 100, xpEarned: 300, status: "Completed", rank: 5, completionDate: "2026-06-28" },
  { id: "CP012", challengeId: "CH001", challengeName: "Zero Single-Use Plastics Week", employeeName: "Lakshmi Priya", employeeId: "EMP028", department: "Marketing", joinedDate: "2026-07-07", progress: 92, xpEarned: 0, status: "Pending Verification" },
  { id: "CP013", challengeId: "CH007", challengeName: "Safety Near-Miss Reporting", employeeName: "Suresh Balan", employeeId: "EMP074", department: "Engineering", joinedDate: "2026-07-01", progress: 100, xpEarned: 200, status: "Completed", rank: 1, completionDate: "2026-07-03" },
  { id: "CP014", challengeId: "CH003", challengeName: "Water Conservation Sprint", employeeName: "Kavitha R", employeeId: "EMP062", department: "Facilities", joinedDate: "2026-07-01", progress: 65, xpEarned: 0, status: "Active" },
  { id: "CP015", challengeId: "CH002", challengeName: "Green Commute July", employeeName: "Mohan Das", employeeId: "EMP051", department: "Manufacturing", joinedDate: "2026-07-01", progress: 48, xpEarned: 0, status: "Active" },
];

export default function ChallengeParticipationPage() {
  const [selected, setSelected] = useState<ChallengeParticipation | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? DATA : DATA.filter(d => d.status === statusFilter);

  const columns: Column<ChallengeParticipation>[] = [
    { key: "employeeName", label: "Employee", sortable: true, render: (_, r) => (
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
          <span className="text-xs font-700 text-orange-400">{r.employeeName.split(" ").map(n=>n[0]).join("")}</span>
        </div>
        <div><p className="text-xs font-600 text-slate-200">{r.employeeName}</p><p className="text-xs text-slate-600">{r.employeeId} · {r.department}</p></div>
      </div>
    )},
    { key: "challengeName", label: "Challenge", render: (v, r) => (
      <div className="max-w-40"><p className="text-xs text-slate-300 leading-snug">{String(v)}</p><p className="text-xs text-slate-600">{r.challengeId}</p></div>
    )},
    { key: "joinedDate", label: "Joined", render: (v) => <span className="text-xs text-slate-400">{formatDate(String(v))}</span> },
    { key: "progress", label: "Progress", sortable: true, render: (v) => (
      <div className="w-24"><Progress value={Number(v)} variant="gamification" size="sm" /><span className="text-xs text-slate-500 mt-0.5 block">{Number(v)}%</span></div>
    )},
    { key: "xpEarned", label: "XP Earned", sortable: true, render: (v, r) => (
      Number(v) > 0 ? <span className="text-xs font-700 text-orange-400 tabular-nums">+{Number(v)} XP</span>
      : r.badge ? <span className="text-lg">{r.badge}</span> : <span className="text-xs text-slate-600">—</span>
    )},
    { key: "rank", label: "Rank", render: (v) => (
      v ? <span className={cn("text-sm font-700 tabular-nums", Number(v) === 1 ? "text-amber-400" : Number(v) === 2 ? "text-slate-300" : Number(v) === 3 ? "text-orange-600" : "text-slate-500")}>#{Number(v)}</span>
      : <span className="text-xs text-slate-600">—</span>
    )},
    { key: "status", label: "Status", render: (v) => (
      <Badge variant={v === "Completed" ? "success" : v === "Active" ? "default" : v === "Dropped" ? "destructive" : "warning"} dot>{String(v)}</Badge>
    )},
    { key: "id", label: "", render: (_, r) => (
      <button onClick={() => setSelected(r)} className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-all"><Eye className="size-3.5" /></button>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Activity className="size-5 text-orange-400" />Challenge Participation</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track employee engagement across all active challenges</p></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { l: "Total Records", v: DATA.length, c: "text-orange-400" },
          { l: "Active Participants", v: DATA.filter(d=>d.status==="Active").length, c: "text-emerald-400" },
          { l: "Completed", v: DATA.filter(d=>d.status==="Completed").length, c: "text-sky-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={filtered}
          searchPlaceholder="Search by employee, challenge..." searchKeys={["employeeName","challengeName","department","status"] as any}
          actions={
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {["Active","Completed","Dropped","Pending Verification"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          } />
      </CardContent></Card>

      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{selected.employeeName}</DialogTitle><DialogDescription>{selected.employeeId} · {selected.department}</DialogDescription></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { l: "Challenge", v: selected.challengeName }, { l: "Status", v: selected.status },
                  { l: "Joined", v: formatDate(selected.joinedDate) },
                  { l: "Completed", v: selected.completionDate ? formatDate(selected.completionDate) : "In Progress" },
                  { l: "XP Earned", v: selected.xpEarned > 0 ? `${selected.xpEarned} XP` : "Pending" },
                  { l: "Rank", v: selected.rank ? `#${selected.rank}` : "—" },
                ].map(f => <div key={f.l}><p className="text-xs text-slate-500 mb-0.5">{f.l}</p><p className="text-sm font-600 text-slate-200">{f.v}</p></div>)}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Progress</p>
                <Progress value={selected.progress} variant="gamification" size="lg" showLabel />
              </div>
              {selected.badge && <div className="text-center text-4xl">{selected.badge}</div>}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}


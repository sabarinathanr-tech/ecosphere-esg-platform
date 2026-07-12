"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Plus, Download, Calendar, Eye, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Audit {
  id: string; title: string; type: "Internal" | "External" | "Regulatory" | "Third-Party";
  standard: string; auditor: string; department: string;
  scheduledDate: string; completedDate?: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Overdue" | "Cancelled";
  findings: number; criticalFindings: number; score?: number;
}

const AUDITS: Audit[] = [
  { id: "AUD001", title: "ISO 14001 Environmental Audit", type: "External", standard: "ISO 14001:2015", auditor: "Bureau Veritas", department: "All", scheduledDate: "2026-08-15", status: "Scheduled", findings: 0, criticalFindings: 0 },
  { id: "AUD002", title: "BRSR Disclosure Verification", type: "External", standard: "BRSR 2024", auditor: "Deloitte India", department: "Finance", scheduledDate: "2026-09-01", status: "Scheduled", findings: 0, criticalFindings: 0 },
  { id: "AUD003", title: "Fire Safety Audit", type: "Regulatory", standard: "NBC 2016", auditor: "Fire Dept Inspector", department: "Facilities", scheduledDate: "2026-07-20", status: "Scheduled", findings: 0, criticalFindings: 0 },
  { id: "AUD004", title: "Internal Carbon Accounting Audit", type: "Internal", standard: "GHG Protocol", auditor: "Karthik Raj", department: "Sustainability", scheduledDate: "2026-07-10", completedDate: "2026-07-11", status: "Completed", findings: 4, criticalFindings: 0, score: 88 },
  { id: "AUD005", title: "SOC 2 Type II Audit", type: "Third-Party", standard: "SOC 2", auditor: "EY India", department: "IT", scheduledDate: "2026-06-01", completedDate: "2026-06-28", status: "Completed", findings: 2, criticalFindings: 0, score: 94 },
  { id: "AUD006", title: "ESG Data Integrity Audit", type: "Internal", standard: "GRI Standards", auditor: "Priya Sharma", department: "Sustainability", scheduledDate: "2026-05-15", completedDate: "2026-05-16", status: "Completed", findings: 6, criticalFindings: 1, score: 82 },
  { id: "AUD007", title: "Energy Audit (BEE Compliance)", type: "Regulatory", standard: "BEE 2023", auditor: "BEE Designated Energy Auditor", department: "Manufacturing", scheduledDate: "2026-06-10", completedDate: "2026-06-12", status: "Completed", findings: 8, criticalFindings: 2, score: 76 },
  { id: "AUD008", title: "Supplier Code of Conduct Audit", type: "Internal", standard: "ISO 20400", auditor: "Deepa Nair", department: "Procurement", scheduledDate: "2026-04-20", completedDate: "2026-04-21", status: "Completed", findings: 3, criticalFindings: 0, score: 91 },
  { id: "AUD009", title: "OHSAS 18001 Safety Audit", type: "External", standard: "ISO 45001", auditor: "SGS India", department: "Manufacturing", scheduledDate: "2026-04-01", completedDate: "2026-04-03", status: "Completed", findings: 5, criticalFindings: 1, score: 85 },
  { id: "AUD010", title: "POSH Compliance Audit", type: "Regulatory", standard: "POSH Act 2013", auditor: "External Counsel", department: "HR", scheduledDate: "2026-03-15", status: "Overdue", findings: 0, criticalFindings: 0 },
];

const upcoming = AUDITS.filter(a => a.status === "Scheduled").slice(0, 3);

export default function AuditsPage() {
  const [addOpen, setAddOpen] = useState(false);

  const columns: Column<Audit>[] = [
    { key: "title", label: "Audit Name", sortable: true, render: (_, r) => (
      <div><p className="text-xs font-600 text-slate-200 max-w-48 leading-snug">{r.title}</p><p className="text-xs text-slate-600">{r.id} · {r.standard}</p></div>
    )},
    { key: "type", label: "Type", render: (v) => (
      <Badge variant={v === "External" ? "governance" : v === "Regulatory" ? "destructive" : v === "Third-Party" ? "social" : "secondary"}>{String(v)}</Badge>
    )},
    { key: "auditor", label: "Auditor", render: (v, r) => <div><p className="text-xs text-slate-300">{String(v)}</p><p className="text-xs text-slate-600">{r.department}</p></div> },
    { key: "scheduledDate", label: "Scheduled", sortable: true, render: (v) => <span className="text-xs text-slate-400">{formatDate(String(v))}</span> },
    { key: "status", label: "Status", render: (v) => (
      <Badge variant={v === "Completed" ? "success" : v === "In Progress" ? "default" : v === "Scheduled" ? "info" : v === "Overdue" ? "destructive" : "secondary"} dot>{String(v)}</Badge>
    )},
    { key: "findings", label: "Findings", sortable: true, render: (v, r) => (
      <div className="flex items-center gap-1.5">
        <span className="text-xs tabular-nums text-slate-300">{Number(v)}</span>
        {r.criticalFindings > 0 && <Badge variant="destructive" className="text-xs py-0">{r.criticalFindings} critical</Badge>}
      </div>
    )},
    { key: "score", label: "Score", sortable: true, render: (v) => (
      v !== undefined && v !== null ? <span className={cn("text-sm font-700 tabular-nums", Number(v) >= 90 ? "text-emerald-400" : Number(v) >= 80 ? "text-amber-400" : "text-red-400")}>{Number(v)}</span>
      : <span className="text-xs text-slate-600">—</span>
    )},
    { key: "id", label: "", render: (_, r) => (
      <div className="flex gap-1">
        <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-all"><Eye className="size-3.5" /></button>
        <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><ClipboardCheck className="size-5 text-purple-400" />Audits</h1>
          <p className="text-sm text-slate-500 mt-0.5">Internal, external & regulatory audit management</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Schedule Audit</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Total Audits", v: AUDITS.length, c: "text-purple-400" },
          { l: "Completed", v: AUDITS.filter(a=>a.status==="Completed").length, c: "text-emerald-400" },
          { l: "Scheduled", v: AUDITS.filter(a=>a.status==="Scheduled").length, c: "text-sky-400" },
          { l: "Critical Findings", v: AUDITS.reduce((s,a)=>s+a.criticalFindings,0), c: "text-red-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Upcoming Timeline */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="size-4 text-purple-400" />Upcoming Audits</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcoming.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="rounded-xl border border-white/8 p-4 bg-white/3 hover:bg-white/5 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={a.type === "External" ? "governance" : a.type === "Regulatory" ? "destructive" : "secondary"}>{a.type}</Badge>
                    <span className="text-xs text-slate-500">{formatDate(a.scheduledDate)}</span>
                  </div>
                  <p className="text-sm font-600 text-white leading-snug">{a.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{a.auditor}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{a.standard}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={AUDITS}
          searchPlaceholder="Search audits..." searchKeys={["title","type","auditor","department","standard","status"] as any} />
      </CardContent></Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Schedule Audit</DialogTitle><DialogDescription>Plan a new internal or external audit</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Audit Title</label><Input placeholder="e.g., ISO 14001 Annual Audit" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Audit Type</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Internal","External","Regulatory","Third-Party"].map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Standard</label><Input placeholder="e.g., ISO 14001:2015" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Auditor / Firm</label><Input placeholder="Name or firm" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Department</label><Input placeholder="Department or All" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Scheduled Date</label><Input type="date" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Audit scheduled successfully"); }}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}


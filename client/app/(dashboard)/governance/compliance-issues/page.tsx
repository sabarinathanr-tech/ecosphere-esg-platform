"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Plus, Download, Eye, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ComplianceIssue {
  id: string; title: string; description: string;
  source: "Audit" | "Self-Assessment" | "Regulatory" | "Employee Report";
  severity: "Critical" | "High" | "Medium" | "Low";
  category: "Environmental" | "Social" | "Governance" | "Safety" | "Financial";
  raisedBy: string; assignedTo: string; department: string;
  raisedDate: string; dueDate: string; resolvedDate?: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed" | "Escalated";
  actionPlan?: string;
}

const ISSUES: ComplianceIssue[] = [
  { id: "CI001", title: "Scope 1 Emission Factor Not Updated", description: "Natural gas emission factor is using 2022 data. Must be updated to IPCC AR6 values.", source: "Audit", severity: "High", category: "Environmental", raisedBy: "Priya Sharma", assignedTo: "Karthik Raj", department: "Sustainability", raisedDate: "2026-07-01", dueDate: "2026-07-15", status: "In Progress" },
  { id: "CI002", title: "POSH Training Overdue – 48 Employees", description: "48 employees have not completed mandatory POSH awareness training.", source: "Self-Assessment", severity: "Critical", category: "Social", raisedBy: "Sunita Rao", assignedTo: "Rahul Mehta", department: "HR", raisedDate: "2026-06-25", dueDate: "2026-07-10", status: "Escalated" },
  { id: "CI003", title: "Wastewater Discharge Non-Compliance", description: "Effluent BOD levels exceeded TNPCB limits by 18% in June audit.", source: "Regulatory", severity: "Critical", category: "Environmental", raisedBy: "TNPCB Inspector", assignedTo: "Suresh Babu", department: "Manufacturing", raisedDate: "2026-06-28", dueDate: "2026-07-05", status: "Open" },
  { id: "CI004", title: "Missing Supplier ESG Certifications", description: "12 tier-1 suppliers lack valid ISO 14001 certificates for FY 2026.", source: "Audit", severity: "Medium", category: "Governance", raisedBy: "Deepa Nair", assignedTo: "Deepa Nair", department: "Procurement", raisedDate: "2026-06-20", dueDate: "2026-08-01", status: "In Progress" },
  { id: "CI005", title: "Fire Extinguisher Inspection Missed", description: "3 floors did not receive monthly fire extinguisher inspection in June.", source: "Self-Assessment", severity: "High", category: "Safety", raisedBy: "Meera Joshi", assignedTo: "Vijay Kumar", department: "Facilities", raisedDate: "2026-07-02", dueDate: "2026-07-08", status: "Resolved", resolvedDate: "2026-07-07" },
  { id: "CI006", title: "Carbon Credit Register Not Maintained", description: "No formal register exists for tracking carbon offset purchases.", source: "Audit", severity: "Medium", category: "Environmental", raisedBy: "Karthik Raj", assignedTo: "Ananya Patel", department: "Finance", raisedDate: "2026-06-15", dueDate: "2026-07-30", status: "Open" },
  { id: "CI007", title: "Whistleblower Reports Not Logged", description: "2 informal whistleblower complaints were not formally logged in Q2.", source: "Employee Report", severity: "High", category: "Governance", raisedBy: "Anonymous", assignedTo: "Sunita Rao", department: "HR", raisedDate: "2026-06-10", dueDate: "2026-06-20", status: "Resolved", resolvedDate: "2026-06-18" },
  { id: "CI008", title: "Diversity Ratio Below Target in Tech Roles", description: "Female representation in engineering is 26% vs 30% target.", source: "Self-Assessment", severity: "Low", category: "Social", raisedBy: "Rahul Mehta", assignedTo: "Rahul Mehta", department: "HR", raisedDate: "2026-06-01", dueDate: "2026-12-31", status: "In Progress" },
  { id: "CI009", title: "HAZMAT Storage SOP Violation", description: "Chemical storage in Block C not following OSHA SOP for hazardous materials.", source: "Audit", severity: "High", category: "Safety", raisedBy: "Suresh Babu", assignedTo: "Vijay Kumar", department: "Manufacturing", raisedDate: "2026-05-25", dueDate: "2026-06-10", status: "Resolved", resolvedDate: "2026-06-09" },
  { id: "CI010", title: "Tax Filing Discrepancy – CSR Spend", description: "CSR expenditure reporting in Form AOC-1 has ₹2.4L discrepancy.", source: "Regulatory", severity: "Medium", category: "Financial", raisedBy: "Auditor", assignedTo: "Nithya Devi", department: "Finance", raisedDate: "2026-05-20", dueDate: "2026-06-15", status: "Closed" },
  { id: "CI011", title: "Energy Metering Sub-Meters Missing", description: "4 production lines lack individual energy metering as required by ISO 50001.", source: "Audit", severity: "Low", category: "Environmental", raisedBy: "Karthik Raj", assignedTo: "Suresh Babu", department: "Manufacturing", raisedDate: "2026-05-15", dueDate: "2026-09-30", status: "Open" },
  { id: "CI012", title: "Board ESG Committee Charter Not Updated", description: "ESG committee charter was last updated in 2022. Requires annual review.", source: "Self-Assessment", severity: "Low", category: "Governance", raisedBy: "Priya Sharma", assignedTo: "Rajesh Kumar", department: "Legal", raisedDate: "2026-05-01", dueDate: "2026-06-30", status: "Resolved", resolvedDate: "2026-06-25" },
];

const severityColors = { Critical: "#ef4444", High: "#f97316", Medium: "#f59e0b", Low: "#3b82f6" } as const;
const severityDist = Object.entries({ Critical: 2, High: 4, Medium: 4, Low: 4 }).map(([name, value]) => ({ name, value }));

export default function ComplianceIssuesPage() {
  const [addOpen, setAddOpen] = useState(false);

  const columns: Column<ComplianceIssue>[] = [
    { key: "id", label: "ID", render: (v) => <span className="text-xs font-700 text-slate-500 tabular-nums">{String(v)}</span> },
    { key: "title", label: "Issue", sortable: true, render: (_, r) => (
      <div className="max-w-48"><p className="text-xs font-600 text-slate-200 leading-snug">{r.title}</p><p className="text-xs text-slate-600">{r.source}</p></div>
    )},
    { key: "severity", label: "Severity", sortable: true, render: (v) => (
      <div className="flex items-center gap-1.5">
        <div className="size-2 rounded-full" style={{ backgroundColor: severityColors[v as keyof typeof severityColors] }} />
        <span className="text-xs font-600" style={{ color: severityColors[v as keyof typeof severityColors] }}>{String(v)}</span>
      </div>
    )},
    { key: "category", label: "Category", render: (v) => (
      <Badge variant={v === "Environmental" ? "environment" : v === "Social" ? "social" : v === "Governance" ? "governance" : v === "Safety" ? "warning" : "secondary"}>{String(v)}</Badge>
    )},
    { key: "assignedTo", label: "Assigned To", render: (v, r) => <div><p className="text-xs text-slate-300">{String(v)}</p><p className="text-xs text-slate-600">{r.department}</p></div> },
    { key: "dueDate", label: "Due Date", sortable: true, render: (v) => <span className="text-xs text-slate-400">{formatDate(String(v))}</span> },
    { key: "status", label: "Status", render: (v) => (
      <Badge variant={v === "Open" ? "destructive" : v === "In Progress" ? "warning" : v === "Resolved" || v === "Closed" ? "success" : "default"} dot>{String(v)}</Badge>
    )},
    { key: "id", label: "", render: (_, r) => (
      <div className="flex gap-1">
        <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-all"><Eye className="size-3.5" /></button>
        {(r.status === "Open" || r.status === "In Progress") && (
          <button onClick={() => toast.success(`Issue ${r.id} marked as resolved`)} className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><CheckCircle className="size-3.5" /></button>
        )}
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><AlertTriangle className="size-5 text-amber-400" />Compliance Issues</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track, prioritize and resolve governance & regulatory issues</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Raise Issue</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Open Issues", v: ISSUES.filter(i=>i.status==="Open").length, c: "text-red-400", bg: "bg-red-500/10" },
          { l: "Critical Issues", v: ISSUES.filter(i=>i.severity==="Critical").length, c: "text-red-400", bg: "bg-red-500/10" },
          { l: "In Progress", v: ISSUES.filter(i=>i.status==="In Progress"||i.status==="Escalated").length, c: "text-amber-400", bg: "bg-amber-500/10" },
          { l: "Resolved This Month", v: ISSUES.filter(i=>i.status==="Resolved"||i.status==="Closed").length, c: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Severity Distribution</CardTitle><CardDescription>Open issues by severity level</CardDescription></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={severityDist} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="value" name="Issues" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {severityDist.map((entry, i) => (
                  <Cell key={i} fill={severityColors[entry.name as keyof typeof severityColors]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={ISSUES}
          searchPlaceholder="Search issues..." searchKeys={["title","severity","category","assignedTo","status","source"] as any} />
      </CardContent></Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Raise Compliance Issue</DialogTitle><DialogDescription>Log a new governance or regulatory compliance issue</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Issue Title</label><Input placeholder="Short, clear description of the issue" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Severity</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Critical","High","Medium","Low"].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Category</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Environmental","Social","Governance","Safety","Financial"].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Source</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Audit","Self-Assessment","Regulatory","Employee Report"].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Assign To</label><Input placeholder="Employee name" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Due Date</label><Input type="date" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Compliance issue raised"); }}>Raise Issue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}


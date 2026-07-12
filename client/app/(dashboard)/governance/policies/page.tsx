"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Plus, Download, Eye, Edit, Trash2, FileText } from "lucide-react";
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

interface Policy {
  id: string; title: string; category: string; version: string; owner: string; department: string;
  effectiveDate: string; reviewDate: string; acknowledgementRate: number;
  totalAcknowledged: number; totalStaff: number;
  status: "Draft" | "Active" | "Under Review" | "Archived"; mandatory: boolean;
}

const POLICIES: Policy[] = [
  { id: "POL001", title: "Anti-Corruption & Bribery Policy", category: "Governance", version: "v3.1", owner: "Rajesh Kumar", department: "Legal", effectiveDate: "2025-01-01", reviewDate: "2026-12-31", acknowledgementRate: 97, totalAcknowledged: 485, totalStaff: 500, status: "Active", mandatory: true },
  { id: "POL002", title: "Environmental Management Policy", category: "Environmental", version: "v2.4", owner: "Priya Sharma", department: "Sustainability", effectiveDate: "2025-03-01", reviewDate: "2026-06-30", acknowledgementRate: 91, totalAcknowledged: 455, totalStaff: 500, status: "Active", mandatory: true },
  { id: "POL003", title: "Data Privacy & GDPR Policy", category: "Data Privacy", version: "v4.0", owner: "Meera Joshi", department: "IT", effectiveDate: "2025-06-01", reviewDate: "2026-05-31", acknowledgementRate: 94, totalAcknowledged: 470, totalStaff: 500, status: "Active", mandatory: true },
  { id: "POL004", title: "Workplace Safety & Health Policy", category: "Safety", version: "v2.1", owner: "Suresh Babu", department: "HR", effectiveDate: "2025-01-01", reviewDate: "2027-01-01", acknowledgementRate: 96, totalAcknowledged: 480, totalStaff: 500, status: "Active", mandatory: true },
  { id: "POL005", title: "Code of Business Conduct", category: "Ethics", version: "v5.0", owner: "Sunita Rao", department: "HR", effectiveDate: "2024-01-01", reviewDate: "2026-01-01", acknowledgementRate: 88, totalAcknowledged: 440, totalStaff: 500, status: "Under Review", mandatory: true },
  { id: "POL006", title: "Supplier Sustainability Policy", category: "Environmental", version: "v1.2", owner: "Deepa Nair", department: "Procurement", effectiveDate: "2025-07-01", reviewDate: "2027-06-30", acknowledgementRate: 72, totalAcknowledged: 36, totalStaff: 50, status: "Active", mandatory: false },
  { id: "POL007", title: "Whistleblower Protection Policy", category: "Governance", version: "v2.0", owner: "Ananya Patel", department: "Legal", effectiveDate: "2025-01-01", reviewDate: "2027-01-01", acknowledgementRate: 79, totalAcknowledged: 395, totalStaff: 500, status: "Active", mandatory: false },
  { id: "POL008", title: "Carbon Neutrality Roadmap Policy", category: "Environmental", version: "v1.0", owner: "Karthik Raj", department: "Sustainability", effectiveDate: "2026-01-01", reviewDate: "2028-12-31", acknowledgementRate: 0, totalAcknowledged: 0, totalStaff: 500, status: "Draft", mandatory: false },
  { id: "POL009", title: "Diversity, Equity & Inclusion Policy", category: "Social", version: "v1.5", owner: "Rahul Mehta", department: "HR", effectiveDate: "2024-06-01", reviewDate: "2026-05-31", acknowledgementRate: 85, totalAcknowledged: 425, totalStaff: 500, status: "Under Review", mandatory: false },
  { id: "POL010", title: "Remote Work & Digital Ethics Policy", category: "Governance", version: "v1.1", owner: "Vijay Kumar", department: "IT", effectiveDate: "2025-04-01", reviewDate: "2027-03-31", acknowledgementRate: 93, totalAcknowledged: 186, totalStaff: 200, status: "Active", mandatory: false },
];

export default function PoliciesPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [viewPolicy, setViewPolicy] = useState<Policy | null>(null);

  const columns: Column<Policy>[] = [
    { key: "title", label: "Policy Name", sortable: true, render: (_, r) => (
      <div><p className="text-xs font-600 text-slate-200 max-w-48 leading-snug">{r.title}</p><p className="text-xs text-slate-600">{r.id} · v{r.version}</p></div>
    )},
    { key: "category", label: "Category", sortable: true, render: (v) => (
      <Badge variant={v === "Environmental" ? "environment" : v === "Social" ? "social" : v === "Governance" || v === "Ethics" ? "governance" : v === "Safety" ? "warning" : "info"}>{String(v)}</Badge>
    )},
    { key: "owner", label: "Owner", render: (v, r) => <div><p className="text-xs text-slate-300">{String(v)}</p><p className="text-xs text-slate-600">{r.department}</p></div> },
    { key: "acknowledgementRate", label: "Acknowledgement", sortable: true, render: (v, r) => (
      <div className="w-28">
        <div className="flex justify-between text-xs mb-1"><span className="text-slate-600">{r.totalAcknowledged}/{r.totalStaff}</span><span className="font-700 text-purple-400">{Number(v)}%</span></div>
        <Progress value={Number(v)} variant="governance" size="sm" />
      </div>
    )},
    { key: "reviewDate", label: "Review Date", sortable: true, render: (v) => <span className="text-xs text-slate-400">{formatDate(String(v))}</span> },
    { key: "status", label: "Status", render: (v) => (
      <Badge variant={v === "Active" ? "success" : v === "Draft" ? "secondary" : v === "Under Review" ? "warning" : "outline"} dot>{String(v)}</Badge>
    )},
    { key: "mandatory", label: "Mandatory", render: (v) => (
      <Badge variant={v ? "destructive" : "secondary"}>{v ? "Yes" : "No"}</Badge>
    )},
    { key: "id", label: "", render: (_, r) => (
      <div className="flex gap-1">
        <button onClick={() => setViewPolicy(r)} className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-all"><Eye className="size-3.5" /></button>
        <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit className="size-3.5" /></button>
        <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><FileText className="size-5 text-purple-400" />Policies</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage governance policies, versions & acknowledgements</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />New Policy</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Total Policies", v: POLICIES.length, c: "text-purple-400" },
          { l: "Active Policies", v: POLICIES.filter(p=>p.status==="Active").length, c: "text-emerald-400" },
          { l: "Avg Acknowledgement", v: Math.round(POLICIES.filter(p=>p.acknowledgementRate>0).reduce((s,p)=>s+p.acknowledgementRate,0)/POLICIES.filter(p=>p.acknowledgementRate>0).length) + "%", c: "text-sky-400" },
          { l: "Expiring This Month", v: "3", c: "text-amber-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={POLICIES}
          searchPlaceholder="Search policies..." searchKeys={["title","category","owner","department","status"] as any} />
      </CardContent></Card>

      {/* View Dialog */}
      {viewPolicy && (
        <Dialog open={!!viewPolicy} onOpenChange={() => setViewPolicy(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewPolicy.title}</DialogTitle>
              <DialogDescription>{viewPolicy.id} · Version {viewPolicy.version}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {[
                { l: "Category", v: viewPolicy.category }, { l: "Owner", v: viewPolicy.owner },
                { l: "Department", v: viewPolicy.department }, { l: "Status", v: viewPolicy.status },
                { l: "Effective Date", v: formatDate(viewPolicy.effectiveDate) }, { l: "Review Date", v: formatDate(viewPolicy.reviewDate) },
                { l: "Acknowledgement", v: `${viewPolicy.acknowledgementRate}% (${viewPolicy.totalAcknowledged}/${viewPolicy.totalStaff})` },
                { l: "Mandatory", v: viewPolicy.mandatory ? "Yes" : "No" },
              ].map(f => (
                <div key={f.l}><p className="text-xs text-slate-500 mb-0.5">{f.l}</p><p className="text-sm font-600 text-slate-200">{f.v}</p></div>
              ))}
            </div>
            <div className="mt-2"><p className="text-xs text-slate-500 mb-1.5">Acknowledgement Progress</p>
              <Progress value={viewPolicy.acknowledgementRate} variant="governance" size="lg" showLabel /></div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Create New Policy</DialogTitle><DialogDescription>Add a governance or compliance policy</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Policy Title</label><Input placeholder="e.g., Anti-Corruption Policy" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Category</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Environmental","Social","Governance","Ethics","Safety","Data Privacy"].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Policy Owner</label><Input placeholder="Responsible person" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Effective Date</label><Input type="date" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Review Date</label><Input type="date" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Policy created successfully"); }}>Create Policy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}


"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Edit, Trash2, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Department {
  id: string; name: string; code: string; head: string; location: string;
  employeeCount: number; esgScore: number; carbonEmissions: number;
  participationRate: number; status: "Active" | "Inactive";
}

const DEPTS: Department[] = [
  { id: "D001", name: "Engineering", code: "ENG", head: "Priya Sharma", location: "Chennai HQ", employeeCount: 124, esgScore: 91, carbonEmissions: 1840, participationRate: 94, status: "Active" },
  { id: "D002", name: "Human Resources", code: "HR", head: "Sunita Rao", location: "Chennai HQ", employeeCount: 28, esgScore: 88, carbonEmissions: 420, participationRate: 88, status: "Active" },
  { id: "D003", name: "Finance & Accounts", code: "FIN", head: "Nithya Devi", location: "Chennai HQ", employeeCount: 42, esgScore: 85, carbonEmissions: 680, participationRate: 82, status: "Active" },
  { id: "D004", name: "Manufacturing", code: "MFG", head: "Vijay Kumar", location: "Hosur Plant", employeeCount: 186, esgScore: 72, carbonEmissions: 8420, participationRate: 71, status: "Active" },
  { id: "D005", name: "IT Operations", code: "ITO", head: "Arun Krishnan", location: "Chennai HQ", employeeCount: 68, esgScore: 87, carbonEmissions: 5620, participationRate: 90, status: "Active" },
  { id: "D006", name: "Logistics & Supply Chain", code: "LOG", head: "Karthik Raj", location: "Multi-location", employeeCount: 54, esgScore: 76, carbonEmissions: 4180, participationRate: 78, status: "Active" },
  { id: "D007", name: "Marketing & Sales", code: "MKT", head: "Deepa Nair", location: "Chennai HQ", employeeCount: 36, esgScore: 74, carbonEmissions: 960, participationRate: 71, status: "Active" },
  { id: "D008", name: "Facilities & Admin", code: "FAC", head: "Meera Joshi", location: "All Locations", employeeCount: 22, esgScore: 84, carbonEmissions: 2340, participationRate: 84, status: "Active" },
  { id: "D009", name: "Research & Development", code: "R&D", head: "Rahul Mehta", location: "Bangalore Office", employeeCount: 45, esgScore: 89, carbonEmissions: 720, participationRate: 92, status: "Active" },
  { id: "D010", name: "Legal & Compliance", code: "LEG", head: "Rajesh Kumar", location: "Chennai HQ", employeeCount: 12, esgScore: 93, carbonEmissions: 180, participationRate: 96, status: "Active" },
];

export default function DepartmentsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);

  const columns: Column<Department>[] = [
    { key: "name", label: "Department", sortable: true, render: (_, r) => (
      <div>
        <div className="flex items-center gap-2"><span className="text-xs font-700 text-slate-600 bg-white/5 rounded px-1.5 py-0.5 font-mono">{r.code}</span><span className="text-xs font-600 text-slate-200">{r.name}</span></div>
        <p className="text-xs text-slate-600 mt-0.5">{r.location}</p>
      </div>
    )},
    { key: "head", label: "Department Head", render: (v) => <span className="text-xs text-slate-300">{String(v)}</span> },
    { key: "employeeCount", label: "Employees", sortable: true, render: (v) => (
      <div className="flex items-center gap-1.5"><Users className="size-3.5 text-slate-600" /><span className="text-xs tabular-nums font-600 text-slate-300">{Number(v)}</span></div>
    )},
    { key: "esgScore", label: "ESG Score", sortable: true, render: (v) => (
      <span className={cn("text-sm font-700 tabular-nums", Number(v) >= 85 ? "text-emerald-400" : Number(v) >= 75 ? "text-amber-400" : "text-red-400")}>{Number(v)}</span>
    )},
    { key: "participationRate", label: "Participation", sortable: true, render: (v) => (
      <div className="w-24"><Progress value={Number(v)} variant="environment" size="sm" /><span className="text-xs text-slate-500 mt-0.5 block">{Number(v)}%</span></div>
    )},
    { key: "carbonEmissions", label: "Emissions (kgCO₂e)", sortable: true, render: (v) => <span className="text-xs tabular-nums text-slate-400">{Number(v).toLocaleString()}</span> },
    { key: "status", label: "Status", render: (v) => <Badge variant={v === "Active" ? "success" : "secondary"} dot>{String(v)}</Badge> },
    { key: "id", label: "", render: (_, r) => (
      <div className="flex gap-1">
        <button onClick={() => setEditDept(r)} className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit className="size-3.5" /></button>
        <button onClick={() => toast.error("Cannot delete a department with active employees")} className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Building2 className="size-5 text-slate-400" />Departments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage organizational departments and their ESG assignments</p></div>
        <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Add Department</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { l: "Total Departments", v: DEPTS.length, c: "text-white" },
          { l: "Total Employees", v: DEPTS.reduce((s,d)=>s+d.employeeCount,0).toLocaleString(), c: "text-sky-400" },
          { l: "Highest ESG Score", v: Math.max(...DEPTS.map(d=>d.esgScore)), c: "text-emerald-400" },
          { l: "Avg Participation", v: Math.round(DEPTS.reduce((s,d)=>s+d.participationRate,0)/DEPTS.length) + "%", c: "text-orange-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4"><p className="text-xs text-slate-500">{k.l}</p><p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p></CardContent></Card>
        ))}
      </div>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={DEPTS} searchPlaceholder="Search departments..." searchKeys={["name","code","head","location"] as any} />
      </CardContent></Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Department</DialogTitle><DialogDescription>Create a new organizational department</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Department Name</label><Input placeholder="e.g., Engineering" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Code</label><Input placeholder="e.g., ENG" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Department Head</label><Input placeholder="Name" /></div>
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Location</label><Input placeholder="e.g., Chennai HQ" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Department created"); }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editDept} onOpenChange={() => setEditDept(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Department</DialogTitle></DialogHeader>
          {editDept && <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Department Name</label><Input defaultValue={editDept.name} /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Code</label><Input defaultValue={editDept.code} /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Head</label><Input defaultValue={editDept.head} /></div>
          </div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDept(null)}>Cancel</Button>
            <Button onClick={() => { setEditDept(null); toast.success("Department updated"); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}


"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Category {
  id: string; name: string; module: "Environment" | "Social" | "Governance" | "Gamification";
  color: string; itemCount: number; description: string; status: "Active" | "Inactive";
}

const CATS: Category[] = [
  { id: "C001", name: "Stationary Combustion", module: "Environment", color: "#10b981", itemCount: 8, description: "Fuel combustion in boilers, furnaces, turbines", status: "Active" },
  { id: "C002", name: "Mobile Combustion", module: "Environment", color: "#10b981", itemCount: 5, description: "Vehicle and fleet fuel combustion", status: "Active" },
  { id: "C003", name: "Purchased Electricity", module: "Environment", color: "#38bdf8", itemCount: 4, description: "Electricity bought from the grid", status: "Active" },
  { id: "C004", name: "Fugitive Emissions", module: "Environment", color: "#10b981", itemCount: 3, description: "Refrigerant and gas leakages", status: "Active" },
  { id: "C005", name: "Business Travel", module: "Environment", color: "#a78bfa", itemCount: 6, description: "Flights, hotels and ground transport", status: "Active" },
  { id: "C006", name: "Waste Disposal", module: "Environment", color: "#f97316", itemCount: 4, description: "Landfill, recycling and incineration", status: "Active" },
  { id: "C007", name: "Education", module: "Social", color: "#38bdf8", itemCount: 4, description: "Literacy, digital, vocational programs", status: "Active" },
  { id: "C008", name: "Healthcare", module: "Social", color: "#f472b6", itemCount: 3, description: "Medical camps, blood donation, wellness", status: "Active" },
  { id: "C009", name: "Community", module: "Social", color: "#a78bfa", itemCount: 2, description: "Village, local community development", status: "Active" },
  { id: "C010", name: "ESG Awareness", module: "Social", color: "#38bdf8", itemCount: 5, description: "Training programs on ESG topics", status: "Active" },
  { id: "C011", name: "Ethics & Conduct", module: "Governance", color: "#a78bfa", itemCount: 3, description: "Anti-corruption, whistleblower policies", status: "Active" },
  { id: "C012", name: "Data Privacy", module: "Governance", color: "#a78bfa", itemCount: 2, description: "GDPR, DPDP Act compliance", status: "Active" },
  { id: "C013", name: "Carbon Challenges", module: "Gamification", color: "#f97316", itemCount: 6, description: "Carbon reduction challenge types", status: "Active" },
  { id: "C014", name: "Water Challenges", module: "Gamification", color: "#38bdf8", itemCount: 3, description: "Water conservation challenges", status: "Active" },
  { id: "C015", name: "Legacy Waste Category", module: "Environment", color: "#64748b", itemCount: 0, description: "Deprecated waste tracking category", status: "Inactive" },
];

const modVariant: Record<string, "environment" | "social" | "governance" | "gamification"> = {
  Environment: "environment", Social: "social", Governance: "governance", Gamification: "gamification"
};

export default function CategoriesPage() {
  const [addOpen, setAddOpen] = useState(false);

  const columns: Column<Category>[] = [
    { key: "name", label: "Category Name", sortable: true, render: (_, r) => (
      <div className="flex items-center gap-2">
        <div className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
        <div><p className="text-xs font-600 text-slate-200">{r.name}</p><p className="text-xs text-slate-600">{r.description}</p></div>
      </div>
    )},
    { key: "module", label: "Module", render: (v) => <Badge variant={modVariant[String(v)]}>{String(v)}</Badge> },
    { key: "itemCount", label: "Items", sortable: true, render: (v) => <span className="text-xs tabular-nums font-700 text-slate-300">{Number(v)}</span> },
    { key: "status", label: "Status", render: (v) => <Badge variant={v === "Active" ? "success" : "secondary"} dot>{String(v)}</Badge> },
    { key: "id", label: "", render: (_, r) => (
      <div className="flex gap-1">
        <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit className="size-3.5" /></button>
        <button onClick={() => r.itemCount > 0 ? toast.error("Cannot delete a category with items") : toast.success("Category deleted")} className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  const grouped = ["Environment", "Social", "Governance", "Gamification"].map(m => ({
    module: m, items: CATS.filter(c => c.module === m),
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Tag className="size-5 text-slate-400" />Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage classification categories across all ESG modules</p></div>
        <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Add Category</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {grouped.map(g => (
          <Card key={g.module} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{g.module}</p>
            <p className="text-2xl font-700 mt-1 text-white">{g.items.filter(i=>i.status==="Active").length} <span className="text-sm text-slate-600">active</span></p>
            <p className="text-xs text-slate-600 mt-0.5">{g.items.length} total categories</p>
          </CardContent></Card>
        ))}
      </div>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={CATS} searchPlaceholder="Search categories..." searchKeys={["name","module","description"] as any} />
      </CardContent></Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Category</DialogTitle><DialogDescription>Create a new classification category</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Category Name</label><Input placeholder="e.g., Stationary Combustion" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Module</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Environment","Social","Governance","Gamification"].map(m=><SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Color</label><Input type="color" defaultValue="#10b981" className="h-9 p-1" /></div>
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Description</label><Input placeholder="Brief description" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Category created"); }}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}


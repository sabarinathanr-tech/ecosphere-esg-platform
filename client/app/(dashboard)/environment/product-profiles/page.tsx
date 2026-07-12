"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Package, Plus, Download, Filter, Eye, Edit, Trash2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ProductESGProfile {
  id: string; productName: string; sku: string; category: string;
  carbonFootprint: number; recyclability: number; renewableEnergy: number;
  waterUsage: number; overallScore: number; certifications: string[];
  status: "Certified" | "Under Review" | "Pending" | "Draft"; lastReviewed: string;
}

const PRODUCTS: ProductESGProfile[] = [
  { id: "P001", productName: "EcoSolar Panel 400W", sku: "ESP-400W", category: "Renewable Energy", carbonFootprint: 0.42, recyclability: 89, renewableEnergy: 100, waterUsage: 12, overallScore: 94, certifications: ["ISO 14001", "Energy Star", "Green Label"], status: "Certified", lastReviewed: "2026-06-01" },
  { id: "P002", productName: "LED Streetlight 60W", sku: "LED-SL60", category: "Lighting", carbonFootprint: 0.18, recyclability: 82, renewableEnergy: 80, waterUsage: 4, overallScore: 88, certifications: ["BIS Certified", "Energy Star"], status: "Certified", lastReviewed: "2026-05-15" },
  { id: "P003", productName: "Recycled Kraft Boxes", sku: "RKB-M01", category: "Packaging", carbonFootprint: 0.08, recyclability: 98, renewableEnergy: 60, waterUsage: 8, overallScore: 91, certifications: ["Green Label", "FSC Certified"], status: "Certified", lastReviewed: "2026-06-10" },
  { id: "P004", productName: "Industrial Air Compressor", sku: "IAC-5HP", category: "Machinery", carbonFootprint: 2.14, recyclability: 65, renewableEnergy: 20, waterUsage: 45, overallScore: 58, certifications: ["BIS Certified"], status: "Under Review", lastReviewed: "2026-04-20" },
  { id: "P005", productName: "Biodegradable Packaging Film", sku: "BPF-100M", category: "Packaging", carbonFootprint: 0.12, recyclability: 95, renewableEnergy: 55, waterUsage: 6, overallScore: 87, certifications: ["Green Label"], status: "Certified", lastReviewed: "2026-06-05" },
  { id: "P006", productName: "Electric Forklift 3T", sku: "EFL-3T", category: "Material Handling", carbonFootprint: 0.65, recyclability: 72, renewableEnergy: 100, waterUsage: 18, overallScore: 79, certifications: ["ISO 14001", "Energy Star"], status: "Certified", lastReviewed: "2026-05-28" },
  { id: "P007", productName: "Water Recycling Unit", sku: "WRU-500L", category: "Water Management", carbonFootprint: 0.35, recyclability: 88, renewableEnergy: 45, waterUsage: -180, overallScore: 85, certifications: ["ISO 14001"], status: "Under Review", lastReviewed: "2026-03-12" },
  { id: "P008", productName: "Diesel Generator 50KVA", sku: "DG-50KVA", category: "Power", carbonFootprint: 4.82, recyclability: 55, renewableEnergy: 0, waterUsage: 22, overallScore: 34, certifications: [], status: "Pending", lastReviewed: "2026-01-08" },
  { id: "P009", productName: "Bamboo Office Furniture Set", sku: "BOF-SET1", category: "Furniture", carbonFootprint: 0.22, recyclability: 93, renewableEnergy: 70, waterUsage: 9, overallScore: 90, certifications: ["Green Label", "FSC Certified"], status: "Certified", lastReviewed: "2026-06-15" },
  { id: "P010", productName: "Thermal Insulation Panels", sku: "TIP-200MM", category: "Construction", carbonFootprint: 0.58, recyclability: 71, renewableEnergy: 35, waterUsage: 14, overallScore: 67, certifications: ["BIS Certified"], status: "Draft", lastReviewed: "2026-02-20" },
];

const kpiCards = [
  { label: "Total Products", value: "10", sub: "Across 7 categories", color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
  { label: "Avg ESG Score", value: "77.3", sub: "Out of 100", color: "text-sky-400", bg: "rgba(56,189,248,0.1)" },
  { label: "Certified Products", value: "6", sub: "60% of catalog", color: "text-purple-400", bg: "rgba(167,139,250,0.1)" },
];

export default function ProductProfilesPage() {
  const [addOpen, setAddOpen] = useState(false);

  const scoreColor = (s: number) => s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400";

  const columns: Column<ProductESGProfile>[] = [
    { key: "productName", label: "Product", sortable: true, render: (_, r) => (
      <div><p className="text-xs font-600 text-slate-200">{r.productName}</p><p className="text-xs text-slate-600">{r.sku} · {r.category}</p></div>
    )},
    { key: "carbonFootprint", label: "Carbon (kgCO₂e/u)", sortable: true, render: (v) => <span className="tabular-nums text-xs font-600 text-emerald-400">{Number(v).toFixed(2)}</span> },
    { key: "recyclability", label: "Recyclability", render: (v) => (
      <div className="w-24"><Progress value={Number(v)} variant="environment" size="sm" /><span className="text-xs text-slate-500 mt-0.5 block">{Number(v)}%</span></div>
    )},
    { key: "renewableEnergy", label: "Renewable %", sortable: true, render: (v) => <span className="tabular-nums text-xs text-amber-400 font-600">{Number(v)}%</span> },
    { key: "overallScore", label: "ESG Score", sortable: true, render: (v) => <span className={cn("text-sm font-700 tabular-nums", scoreColor(Number(v)))}>{Number(v)}</span> },
    { key: "certifications", label: "Certifications", render: (v) => (
      <div className="flex flex-wrap gap-1">
        {(v as string[]).map(c => <Badge key={c} variant="secondary" className="text-xs py-0">{c}</Badge>)}
        {(v as string[]).length === 0 && <span className="text-xs text-slate-600">None</span>}
      </div>
    )},
    { key: "status", label: "Status", sortable: true, render: (v) => (
      <Badge variant={v === "Certified" ? "success" : v === "Under Review" ? "warning" : v === "Pending" ? "info" : "secondary"} dot>{String(v)}</Badge>
    )},
    { key: "id", label: "", render: (_, r) => (
      <div className="flex gap-1">
        <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-all"><Eye className="size-3.5" /></button>
        <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit className="size-3.5" /></button>
        <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2"><Package className="size-5 text-emerald-400" />Product ESG Profiles</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track environmental impact across your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Add Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {kpiCards.map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className={cn("text-3xl font-700 mt-1 tabular-nums", k.color)}>{k.value}</p>
            <p className="text-xs text-slate-600 mt-0.5">{k.sub}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={PRODUCTS}
          searchPlaceholder="Search products..." searchKeys={["productName", "sku", "category", "status"] as any}
          actions={<Button variant="outline" size="sm"><Filter className="size-3.5" />Filter</Button>} />
      </CardContent></Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Add Product ESG Profile</DialogTitle><DialogDescription>Register a product for ESG lifecycle tracking</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Product Name</label><Input placeholder="e.g., EcoSolar Panel 400W" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">SKU</label><Input placeholder="e.g., ESP-400W" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Category</label>
              <Select><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>{["Renewable Energy","Lighting","Packaging","Machinery","Construction","Furniture"].map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Carbon Footprint (kgCO₂e/unit)</label><Input type="number" placeholder="0.00" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Recyclability (%)</label><Input type="number" placeholder="0–100" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Renewable Energy Used (%)</label><Input type="number" placeholder="0–100" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Water Usage (L/unit)</label><Input type="number" placeholder="Liters" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Product ESG profile created"); }}>Create Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}


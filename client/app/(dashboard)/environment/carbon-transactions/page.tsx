"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Recycle,
  Plus,
  TrendingDown,
  TrendingUp,
  Download,
  Filter,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface CarbonTransaction {
  id: string;
  date: string;
  department: string;
  activity: string;
  scope: "Scope 1" | "Scope 2" | "Scope 3";
  emissionFactor: string;
  quantity: number;
  unit: string;
  emissions: number;
  enteredBy: string;
  status: "Verified" | "Pending" | "Rejected";
  notes?: string;
}

const TRANSACTIONS: CarbonTransaction[] = [
  { id: "CT001", date: "2026-07-10", department: "Manufacturing", activity: "Natural Gas Combustion", scope: "Scope 1", emissionFactor: "EF001", quantity: 850, unit: "m³", emissions: 1873.4, enteredBy: "Rajesh Kumar", status: "Verified" },
  { id: "CT002", date: "2026-07-09", department: "IT Operations", activity: "Grid Electricity", scope: "Scope 2", emissionFactor: "EF002", quantity: 12400, unit: "kWh", emissions: 10118.4, enteredBy: "Priya S", status: "Verified" },
  { id: "CT003", date: "2026-07-08", department: "Logistics", activity: "Diesel Combustion", scope: "Scope 1", emissionFactor: "EF003", quantity: 340, unit: "L", emissions: 915.6, enteredBy: "Amit V", status: "Pending" },
  { id: "CT004", date: "2026-07-07", department: "HR", activity: "Employee Air Travel", scope: "Scope 3", emissionFactor: "EF004", quantity: 8200, unit: "pkm", emissions: 1599.0, enteredBy: "Sunita R", status: "Verified" },
  { id: "CT005", date: "2026-07-06", department: "Sales", activity: "Petrol Combustion", scope: "Scope 1", emissionFactor: "EF005", quantity: 120, unit: "L", emissions: 277.9, enteredBy: "Karthik M", status: "Verified" },
  { id: "CT006", date: "2026-07-05", department: "Finance", activity: "Grid Electricity", scope: "Scope 2", emissionFactor: "EF006", quantity: 4200, unit: "kWh", emissions: 2965.2, enteredBy: "Deepa N", status: "Rejected" },
  { id: "CT007", date: "2026-07-04", department: "Manufacturing", activity: "Refrigerant Leakage", scope: "Scope 1", emissionFactor: "EF007", quantity: 0.8, unit: "kg", emissions: 1144.0, enteredBy: "Rajesh K", status: "Pending" },
  { id: "CT008", date: "2026-07-03", department: "Facilities", activity: "Waste to Landfill", scope: "Scope 3", emissionFactor: "EF008", quantity: 850, unit: "kg", emissions: 396.95, enteredBy: "Meera J", status: "Verified" },
];

const monthlyData = [
  { month: "Feb", scope1: 3200, scope2: 12800, scope3: 2100 },
  { month: "Mar", scope1: 3600, scope2: 11900, scope3: 2400 },
  { month: "Apr", month_short: "Apr", scope1: 3100, scope2: 13200, scope3: 1900 },
  { month: "May", scope1: 2900, scope2: 12100, scope3: 2200 },
  { month: "Jun", scope1: 2700, scope2: 11400, scope3: 1800 },
  { month: "Jul", scope1: 2400, scope2: 10100, scope3: 1600 },
];

const totalEmissions = TRANSACTIONS.reduce((sum, t) => sum + t.emissions, 0);
const verifiedEmissions = TRANSACTIONS.filter(t => t.status === "Verified").reduce((sum, t) => sum + t.emissions, 0);

export default function CarbonTransactionsPage() {
  const [addOpen, setAddOpen] = useState(false);

  const columns: Column<CarbonTransaction>[] = [
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (val) => <span className="text-xs text-slate-400">{formatDate(String(val))}</span>,
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      render: (val) => <span className="font-600 text-slate-200 text-xs">{String(val)}</span>,
    },
    {
      key: "activity",
      label: "Activity",
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="text-xs text-slate-300">{String(val)}</span>
          <div className="text-xs text-slate-600">{row.id}</div>
        </div>
      ),
    },
    {
      key: "scope",
      label: "Scope",
      render: (val) => (
        <Badge variant={val === "Scope 1" ? "environment" : val === "Scope 2" ? "social" : "governance"}>
          {String(val)}
        </Badge>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      sortable: true,
      render: (val, row) => (
        <span className="text-xs tabular-nums text-slate-300">
          {Number(val).toFixed(1)} {row.unit}
        </span>
      ),
    },
    {
      key: "emissions",
      label: "Emissions (kgCO₂e)",
      sortable: true,
      render: (val) => (
        <span className="text-sm font-700 tabular-nums text-emerald-400">
          {Number(val).toLocaleString("en-IN", { maximumFractionDigits: 1 })}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (val) => (
        <Badge
          variant={val === "Verified" ? "success" : val === "Pending" ? "warning" : "destructive"}
          dot
        >
          {String(val)}
        </Badge>
      ),
    },
    {
      key: "enteredBy",
      label: "Entered By",
      render: (val) => <span className="text-xs text-slate-500">{String(val)}</span>,
    },
    {
      key: "id",
      label: "",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-all">
            <Eye className="size-3.5" />
          </button>
          <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
            <Edit className="size-3.5" />
          </button>
          <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2">
            <Recycle className="size-5 text-emerald-400" />
            Carbon Transactions
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track and verify GHG emissions across all departments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Log Transaction</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Emissions (Jul)", value: `${(totalEmissions / 1000).toFixed(1)} tCO₂e`, change: "-6.2%", positive: true, color: "text-emerald-400" },
          { label: "Verified Emissions", value: `${(verifiedEmissions / 1000).toFixed(1)} tCO₂e`, subtitle: `${Math.round((verifiedEmissions / totalEmissions) * 100)}% verified`, color: "text-sky-400" },
          { label: "Pending Verification", value: TRANSACTIONS.filter(t => t.status === "Pending").length, subtitle: "Transactions awaiting review", color: "text-amber-400" },
          { label: "Scope 1 Share", value: "23%", subtitle: "Direct emissions", color: "text-purple-400" },
        ].map((kpi, i) => (
          <Card key={i} hover>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
              <p className={cn("text-2xl font-700 tabular-nums", kpi.color)}>{kpi.value}</p>
              {kpi.change ? (
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="size-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-600">{kpi.change} vs last month</span>
                </div>
              ) : (
                <p className="text-xs text-slate-600 mt-1">{kpi.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Emissions by Scope</CardTitle>
          <CardDescription>kgCO₂e breakdown across all scopes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-elevated)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="scope1" name="Scope 1" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={40} />
              <Bar dataKey="scope2" name="Scope 2" fill="#38bdf8" radius={[3, 3, 0, 0]} maxBarSize={40} />
              <Bar dataKey="scope3" name="Scope 3" fill="#a78bfa" radius={[3, 3, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-5">
          <DataTable
            columns={columns}
            data={TRANSACTIONS}
            searchPlaceholder="Search transactions..."
            searchKeys={["department", "activity", "scope", "enteredBy", "status"] as any}
            actions={
              <>
                <Button variant="outline" size="sm"><Filter className="size-3.5" />Filter</Button>
              </>
            }
          />
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Log Carbon Transaction</DialogTitle>
            <DialogDescription>Record a new GHG emission entry</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Department</label>
              <Select><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {["Manufacturing", "IT Operations", "Logistics", "HR", "Sales", "Finance", "Facilities"].map(d => (
                    <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Date</label>
              <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Emission Factor</label>
              <Select><SelectTrigger><SelectValue placeholder="Select emission factor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ef001">EF001 — Natural Gas Combustion (Scope 1)</SelectItem>
                  <SelectItem value="ef002">EF002 — Grid Electricity South India (Scope 2)</SelectItem>
                  <SelectItem value="ef003">EF003 — Diesel Combustion (Scope 1)</SelectItem>
                  <SelectItem value="ef004">EF004 — Employee Air Travel (Scope 3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Quantity</label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Unit</label>
              <Input placeholder="kWh / L / m³" disabled />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Notes (optional)</label>
              <Input placeholder="Additional context or remarks" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Carbon transaction logged successfully"); }}>
              Log Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}


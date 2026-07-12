"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Factory,
  Plus,
  TrendingDown,
  TrendingUp,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Leaf,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Progress } from "@/components/ui/progress";
import { cn, formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  scope: "Scope 1" | "Scope 2" | "Scope 3";
  factor: number;
  unit: string;
  source: string;
  validFrom: string;
  validTo: string;
  status: "Active" | "Inactive" | "Draft";
  region: string;
}

const EMISSION_FACTORS: EmissionFactor[] = [
  { id: "EF001", name: "Natural Gas Combustion", category: "Stationary Combustion", scope: "Scope 1", factor: 2.204, unit: "kgCO₂e/m³", source: "GHG Protocol 2024", validFrom: "2024-01-01", validTo: "2024-12-31", status: "Active", region: "India" },
  { id: "EF002", name: "Grid Electricity (South India)", category: "Purchased Electricity", scope: "Scope 2", factor: 0.816, unit: "kgCO₂e/kWh", source: "CEA 2024", validFrom: "2024-01-01", validTo: "2024-12-31", status: "Active", region: "Tamil Nadu" },
  { id: "EF003", name: "Diesel Combustion (Transport)", category: "Mobile Combustion", scope: "Scope 1", factor: 2.693, unit: "kgCO₂e/L", source: "IPCC AR6", validFrom: "2024-01-01", validTo: "2024-12-31", status: "Active", region: "Global" },
  { id: "EF004", name: "Employee Air Travel (Domestic)", category: "Business Travel", scope: "Scope 3", factor: 0.195, unit: "kgCO₂e/pkm", source: "Defra 2024", validFrom: "2024-01-01", validTo: "2024-12-31", status: "Active", region: "India" },
  { id: "EF005", name: "Petrol Combustion", category: "Mobile Combustion", scope: "Scope 1", factor: 2.316, unit: "kgCO₂e/L", source: "IPCC AR6", validFrom: "2024-01-01", validTo: "2024-12-31", status: "Active", region: "Global" },
  { id: "EF006", name: "Grid Electricity (National)", category: "Purchased Electricity", scope: "Scope 2", factor: 0.706, unit: "kgCO₂e/kWh", source: "CEA 2024", validFrom: "2024-01-01", validTo: "2024-12-31", status: "Active", region: "India" },
  { id: "EF007", name: "Refrigerant R-134a (Leakage)", category: "Fugitive Emissions", scope: "Scope 1", factor: 1430, unit: "kgCO₂e/kg", source: "IPCC AR6", validFrom: "2024-01-01", validTo: "2024-12-31", status: "Active", region: "Global" },
  { id: "EF008", name: "Waste to Landfill (General)", category: "Waste Disposal", scope: "Scope 3", factor: 0.467, unit: "kgCO₂e/kg", source: "Defra 2024", validFrom: "2024-01-01", validTo: "2024-12-31", status: "Draft", region: "India" },
  { id: "EF009", name: "Supply Chain Logistics (Road)", category: "Upstream Transport", scope: "Scope 3", factor: 0.107, unit: "kgCO₂e/tonne-km", source: "Defra 2024", validFrom: "2023-01-01", validTo: "2023-12-31", status: "Inactive", region: "India" },
  { id: "EF010", name: "LPG Combustion", category: "Stationary Combustion", scope: "Scope 1", factor: 1.630, unit: "kgCO₂e/L", source: "GHG Protocol 2024", validFrom: "2024-01-01", validTo: "2024-12-31", status: "Active", region: "Global" },
];

const scopeStats = [
  { scope: "Scope 1", count: 5, coverage: "Direct emissions", color: "#10b981" },
  { scope: "Scope 2", count: 2, coverage: "Purchased energy", color: "#38bdf8" },
  { scope: "Scope 3", count: 3, coverage: "Value chain", color: "#a78bfa" },
];

export default function EmissionFactorsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<EmissionFactor | null>(null);

  const columns: Column<EmissionFactor>[] = [
    {
      key: "name",
      label: "Factor Name",
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="text-sm font-600 text-slate-200">{row.name}</span>
          <div className="text-xs text-slate-600 mt-0.5">{row.id} · {row.category}</div>
        </div>
      ),
    },
    {
      key: "scope",
      label: "Scope",
      sortable: true,
      render: (val) => (
        <Badge
          variant={
            val === "Scope 1" ? "environment" :
            val === "Scope 2" ? "social" : "governance"
          }
        >
          {String(val)}
        </Badge>
      ),
    },
    {
      key: "factor",
      label: "EF Value",
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="text-sm font-700 text-emerald-400 tabular-nums">{Number(val).toFixed(3)}</span>
          <span className="text-xs text-slate-600 ml-1">{row.unit}</span>
        </div>
      ),
    },
    { key: "region", label: "Region", sortable: true },
    {
      key: "source",
      label: "Source",
      render: (val) => <span className="text-xs text-slate-500">{String(val)}</span>,
    },
    {
      key: "validTo",
      label: "Valid To",
      sortable: true,
      render: (val) => <span className="text-xs">{formatDate(String(val))}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (val) => (
        <Badge
          variant={
            val === "Active" ? "success" :
            val === "Inactive" ? "secondary" : "warning"
          }
          dot
        >
          {String(val)}
        </Badge>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-all"
            onClick={(e) => { e.stopPropagation(); setSelectedFactor(row); }}
          >
            <Eye className="size-3.5" />
          </button>
          <button className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
            <Edit className="size-3.5" />
          </button>
          <button className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
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
            <Factory className="size-5 text-emerald-400" />
            Emission Factors
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage GHG emission factors across all scopes and categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-3.5" />
            Export
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-3.5" />
            Add Factor
          </Button>
        </div>
      </div>

      {/* Scope Stats */}
      <div className="grid grid-cols-3 gap-4">
        {scopeStats.map((stat) => (
          <Card key={stat.scope} hover>
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className="size-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Leaf className="size-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{stat.scope}</p>
                <p className="text-2xl font-700 tabular-nums" style={{ color: stat.color }}>
                  {stat.count}
                </p>
                <p className="text-xs text-slate-600">{stat.coverage}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-5">
          <DataTable
            columns={columns}
            data={EMISSION_FACTORS}
            searchPlaceholder="Search emission factors..."
            searchKeys={["name", "category", "scope", "source", "region"] as any}
            actions={
              <Button variant="outline" size="sm">
                <Filter className="size-3.5" />
                Filter
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* Add Factor Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Emission Factor</DialogTitle>
            <DialogDescription>
              Create a new GHG emission factor for carbon accounting
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Factor Name</label>
              <Input placeholder="e.g., Grid Electricity (South India)" />
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Scope</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select scope" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="scope1">Scope 1 — Direct</SelectItem>
                  <SelectItem value="scope2">Scope 2 — Indirect Energy</SelectItem>
                  <SelectItem value="scope3">Scope 3 — Value Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Category</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="stationary">Stationary Combustion</SelectItem>
                  <SelectItem value="mobile">Mobile Combustion</SelectItem>
                  <SelectItem value="electricity">Purchased Electricity</SelectItem>
                  <SelectItem value="fugitive">Fugitive Emissions</SelectItem>
                  <SelectItem value="travel">Business Travel</SelectItem>
                  <SelectItem value="waste">Waste Disposal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">EF Value (kgCO₂e)</label>
              <Input type="number" placeholder="e.g., 0.816" />
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Unit</label>
              <Input placeholder="e.g., kgCO₂e/kWh" />
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Source / Reference</label>
              <Input placeholder="e.g., CEA 2024, GHG Protocol" />
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Region</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="tn">Tamil Nadu</SelectItem>
                  <SelectItem value="mh">Maharashtra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Valid From</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-xs font-600 text-slate-400 mb-1.5 block">Valid To</label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setAddOpen(false);
              toast.success("Emission factor created successfully");
            }}>
              Create Factor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Factor Dialog */}
      {selectedFactor && (
        <Dialog open={!!selectedFactor} onOpenChange={() => setSelectedFactor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedFactor.name}</DialogTitle>
              <DialogDescription>{selectedFactor.id} · {selectedFactor.category}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Scope", value: selectedFactor.scope },
                { label: "Region", value: selectedFactor.region },
                { label: "EF Value", value: `${selectedFactor.factor} ${selectedFactor.unit}` },
                { label: "Source", value: selectedFactor.source },
                { label: "Valid From", value: formatDate(selectedFactor.validFrom) },
                { label: "Valid To", value: formatDate(selectedFactor.validTo) },
                { label: "Status", value: selectedFactor.status },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-slate-500 mb-0.5">{field.label}</p>
                  <p className="text-sm font-600 text-slate-200">{field.value}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}


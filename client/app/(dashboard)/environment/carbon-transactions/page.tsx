"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Recycle, Plus, TrendingDown, Download, Filter, Edit, Trash2, CheckCircle, X, Loader2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { toast } from "sonner";
import { carbonTransactionsApi, emissionFactorsApi, departmentsApi } from "@/lib/services";
import { useAuth } from "@/lib/auth-context";

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/5", className)} />;
}

const SCOPE_COLORS: Record<string, string> = {
  SCOPE_1: "#10b981", SCOPE_2: "#38bdf8", SCOPE_3: "#a78bfa",
};

export default function CarbonTransactionsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [form, setForm] = useState({ date: "", departmentId: "", activity: "", categoryId: "", quantity: "", unit: "kWh", scope: "SCOPE_2", notes: "" });

  // ─── Queries ───────────────────────────────────────────────────────────────
  const { data: txData, isLoading } = useQuery({
    queryKey: ["carbon-transactions", scopeFilter, statusFilter],
    queryFn: () => carbonTransactionsApi.getAll({
      limit: 100,
      ...(scopeFilter !== "all" && { scope: scopeFilter }),
      ...(statusFilter !== "all" && { status: statusFilter }),
    }).then(r => r.data),
  });

  const { data: factorsData } = useQuery({
    queryKey: ["emission-factors-all"],
    queryFn: () => emissionFactorsApi.getAll({ limit: 100 }).then(r => r.data.data || []),
  });

  const { data: deptsData } = useQuery({
    queryKey: ["departments-all"],
    queryFn: () => departmentsApi.getAll({ limit: 100 }).then(r => r.data.data || []),
  });

  const transactions = txData?.data || [];
  const totalEmissions = transactions.reduce((s: number, t: any) => s + (t.totalEmissions || 0), 0);
  const scope1 = transactions.filter((t: any) => t.scope === "SCOPE_1").reduce((s: number, t: any) => s + t.totalEmissions, 0);
  const scope2 = transactions.filter((t: any) => t.scope === "SCOPE_2").reduce((s: number, t: any) => s + t.totalEmissions, 0);
  const scope3 = transactions.filter((t: any) => t.scope === "SCOPE_3").reduce((s: number, t: any) => s + t.totalEmissions, 0);
  const pending = transactions.filter((t: any) => t.status === "SUBMITTED").length;

  const scopeChartData = [
    { name: "Scope 1", value: Math.round(scope1), color: SCOPE_COLORS.SCOPE_1 },
    { name: "Scope 2", value: Math.round(scope2), color: SCOPE_COLORS.SCOPE_2 },
    { name: "Scope 3", value: Math.round(scope3), color: SCOPE_COLORS.SCOPE_3 },
  ];

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: (data: any) => carbonTransactionsApi.create(data),
    onSuccess: () => {
      toast.success("Carbon transaction logged successfully");
      qc.invalidateQueries({ queryKey: ["carbon-transactions"] });
      setAddOpen(false);
      setForm({ date: "", departmentId: "", activity: "", categoryId: "", quantity: "", unit: "kWh", scope: "SCOPE_2", notes: "" });
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || "Failed to create transaction"),
  });

  const verifyMut = useMutation({
    mutationFn: (id: string) => carbonTransactionsApi.verify(id),
    onSuccess: () => { toast.success("Transaction verified"); qc.invalidateQueries({ queryKey: ["carbon-transactions"] }); },
    onError: () => toast.error("Failed to verify transaction"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => carbonTransactionsApi.delete(id),
    onSuccess: () => { toast.success("Transaction deleted"); qc.invalidateQueries({ queryKey: ["carbon-transactions"] }); setDeleteId(null); },
    onError: () => toast.error("Failed to delete transaction"),
  });

  const handleCreate = () => {
    if (!form.date || !form.activity || !form.quantity) { toast.error("Fill all required fields"); return; }
    const factor = factorsData?.find((f: any) => f.id === form.categoryId);
    const totalEmissions = factor ? parseFloat(form.quantity) * factor.factor : parseFloat(form.quantity) * 0.2331;
    createMut.mutate({ ...form, quantity: parseFloat(form.quantity), emissionFactor: factor?.factor || 0.2331, totalEmissions, createdById: user?.id });
  };

  // ─── Columns ───────────────────────────────────────────────────────────────
  const columns: Column<any>[] = [
    { key: "date", label: "Date", render: r => <span className="text-xs text-slate-400">{formatDate(r.date)}</span> },
    { key: "activity", label: "Activity", render: r => <div><p className="text-sm font-600 text-slate-200">{r.activity}</p><p className="text-xs text-slate-500">{r.department?.name || "—"}</p></div> },
    { key: "scope", label: "Scope", render: r => (
      <Badge style={{ background: `${SCOPE_COLORS[r.scope]}20`, color: SCOPE_COLORS[r.scope] }} className="text-xs">
        {r.scope?.replace("_", " ")}
      </Badge>
    )},
    { key: "quantity", label: "Quantity", render: r => <span className="text-sm tabular-nums">{formatNumber(r.quantity)} {r.unit}</span> },
    { key: "totalEmissions", label: "Emissions (tCO₂e)", render: r => <span className="text-sm font-600 text-emerald-400 tabular-nums">{formatNumber(r.totalEmissions)}</span> },
    { key: "status", label: "Status", render: r => (
      <Badge variant={r.status === "VERIFIED" ? "success" : r.status === "SUBMITTED" ? "warning" : r.status === "DRAFT" ? "secondary" : "destructive"}>
        {r.status}
      </Badge>
    )},
    { key: "actions", label: "", render: r => (
      <div className="flex items-center gap-1 justify-end">
        {r.status !== "VERIFIED" && user?.role !== "VIEWER" && (
          <Button size="sm" variant="ghost" onClick={() => verifyMut.mutate(r.id)} className="text-xs text-emerald-400 hover:text-emerald-300">
            <CheckCircle className="size-3" />
          </Button>
        )}
        {(user?.role === "ADMIN" || r.createdById === user?.id) && (
          <Button size="sm" variant="ghost" onClick={() => setDeleteId(r.id)} className="text-xs text-red-400 hover:text-red-300">
            <Trash2 className="size-3" />
          </Button>
        )}
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2"><Recycle className="size-5 text-emerald-400" />Carbon Transactions</h1>
          <p className="text-sm text-slate-500 mt-0.5">Log, track and verify emission data across all scopes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export CSV</Button>
          {user?.role !== "VIEWER" && (
            <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Log Emission</Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Emissions", value: `${formatNumber(totalEmissions)} tCO₂e`, sub: "All scopes combined", color: "text-emerald-400" },
          { label: "Scope 1 (Direct)", value: `${formatNumber(scope1)} tCO₂e`, sub: "Owned/controlled sources", color: "text-emerald-400" },
          { label: "Scope 2 (Indirect)", value: `${formatNumber(scope2)} tCO₂e`, sub: "Purchased electricity", color: "text-sky-400" },
          { label: "Pending Review", value: pending.toString(), sub: "Awaiting verification", color: "text-amber-400" },
        ].map((card, i) => (
          <Card key={i} hover>
            <CardContent className="p-5">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-600">{card.label}</p>
              <p className={cn("text-2xl font-700 tabular-nums mb-1", card.color)}>{card.value}</p>
              <p className="text-xs text-slate-600">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scope Chart + Filters Row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <Card className="xl:col-span-3">
          <CardHeader><CardTitle>Emissions by Scope</CardTitle><CardDescription>tCO₂e breakdown across all 3 emission scopes</CardDescription></CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-40" /> : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={scopeChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" name="tCO₂e" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {scopeChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Scope Split</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {scopeChartData.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{s.name}</span>
                  <span className="font-600 text-white">{totalEmissions > 0 ? Math.round(s.value / totalEmissions * 100) : 0}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${totalEmissions > 0 ? s.value / totalEmissions * 100 : 0}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-500" />
          <span className="text-xs text-slate-500">Filter by:</span>
        </div>
        {["all", "SCOPE_1", "SCOPE_2", "SCOPE_3"].map(s => (
          <Button key={s} size="sm" variant={scopeFilter === s ? "default" : "outline"}
            onClick={() => setScopeFilter(s)} className="text-xs">
            {s === "all" ? "All Scopes" : s.replace("_", " ")}
          </Button>
        ))}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 text-xs h-8"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? <div className="p-8"><Skeleton className="h-64" /></div> : (
            <DataTable data={transactions} columns={columns} searchPlaceholder="Search transactions..." emptyMessage="No carbon transactions found" />
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Log Carbon Emission</DialogTitle>
            <DialogDescription>Record a new carbon emission transaction for verification.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1.5 block">Activity Description *</label>
              <Input placeholder="e.g. Monthly Electricity Consumption" value={form.activity} onChange={e => setForm(p => ({...p, activity: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Date *</label>
              <Input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Scope *</label>
              <Select value={form.scope} onValueChange={v => setForm(p => ({...p, scope: v}))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCOPE_1">Scope 1 — Direct</SelectItem>
                  <SelectItem value="SCOPE_2">Scope 2 — Indirect (Electricity)</SelectItem>
                  <SelectItem value="SCOPE_3">Scope 3 — Value Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Department</label>
              <Select value={form.departmentId} onValueChange={v => setForm(p => ({...p, departmentId: v}))}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {(deptsData || []).map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Emission Factor</label>
              <Select value={form.categoryId} onValueChange={v => setForm(p => ({...p, categoryId: v}))}>
                <SelectTrigger><SelectValue placeholder="Select factor..." /></SelectTrigger>
                <SelectContent>
                  {(factorsData || []).map((f: any) => <SelectItem key={f.id} value={f.id}>{f.name} ({f.factor} kg/{f.unit})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Quantity *</label>
              <Input type="number" placeholder="0.00" value={form.quantity} onChange={e => setForm(p => ({...p, quantity: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Unit</label>
              <Select value={form.unit} onValueChange={v => setForm(p => ({...p, unit: v}))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["kWh", "litre", "m³", "tonne", "km", "kg"].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1.5 block">Notes</label>
              <Input placeholder="Optional notes..." value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createMut.isPending}>
              {createMut.isPending ? <><Loader2 className="size-3.5 animate-spin" />Logging...</> : "Log Emission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>This action cannot be undone. The emission data will be permanently removed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteMut.mutate(deleteId!)} disabled={deleteMut.isPending}>
              {deleteMut.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Plus, Download, Play, Save, Trash2, BarChart3, Table, PieChart as PieChartIcon, LineChartIcon } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const METRICS = [
  { id: "carbon_total", label: "Total GHG Emissions", unit: "tCO₂e", module: "Environment" },
  { id: "carbon_scope1", label: "Scope 1 Emissions", unit: "tCO₂e", module: "Environment" },
  { id: "carbon_scope2", label: "Scope 2 Emissions", unit: "tCO₂e", module: "Environment" },
  { id: "energy_renewable", label: "Renewable Energy Share", unit: "%", module: "Environment" },
  { id: "water_consumption", label: "Water Consumption", unit: "kL", module: "Environment" },
  { id: "waste_diverted", label: "Waste Diverted", unit: "%", module: "Environment" },
  { id: "csr_participants", label: "CSR Participants", unit: "count", module: "Social" },
  { id: "training_completion", label: "Training Completion Rate", unit: "%", module: "Social" },
  { id: "gender_diversity", label: "Female Workforce", unit: "%", module: "Social" },
  { id: "policy_acknowledgement", label: "Policy Acknowledgement Rate", unit: "%", module: "Governance" },
  { id: "audit_score", label: "Average Audit Score", unit: "score", module: "Governance" },
  { id: "compliance_open", label: "Open Compliance Issues", unit: "count", module: "Governance" },
  { id: "esg_score", label: "Overall ESG Score", unit: "score", module: "Summary" },
];

const SAMPLE_DATA = {
  bar: [
    { name: "Jan", value: 18140 }, { name: "Feb", value: 17020 }, { name: "Mar", value: 19200 },
    { name: "Apr", value: 17100 }, { name: "May", value: 16100 }, { name: "Jun", value: 15150 }, { name: "Jul", value: 14080 },
  ],
  pie: [
    { name: "Scope 1", value: 23, color: "#10b981" },
    { name: "Scope 2", value: 64, color: "#38bdf8" },
    { name: "Scope 3", value: 13, color: "#a78bfa" },
  ],
};

const CHART_TYPES = [
  { id: "bar", label: "Bar Chart", Icon: BarChart3 },
  { id: "line", label: "Line Chart", Icon: LineChartIcon },
  { id: "pie", label: "Pie Chart", Icon: PieChartIcon },
  { id: "table", label: "Table", Icon: Table },
];

const SAVED_REPORTS = [
  { name: "Monthly Carbon Dashboard", metrics: ["Scope 1", "Scope 2", "Scope 3"], chart: "bar", created: "2026-07-01" },
  { name: "Q2 ESG Summary", metrics: ["Overall ESG", "E Score", "S Score", "G Score"], chart: "line", created: "2026-06-30" },
  { name: "Compliance Overview", metrics: ["Policy Ack", "Audit Score", "Open Issues"], chart: "table", created: "2026-06-25" },
];

export default function CustomBuilderPage() {
  const [reportName, setReportName] = useState("My Custom Report");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["carbon_total", "energy_renewable"]);
  const [chartType, setChartType] = useState("bar");
  const [period, setPeriod] = useState("2026-q2");
  const [showPreview, setShowPreview] = useState(false);

  const toggleMetric = (id: string) => {
    setSelectedMetrics(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Wrench className="size-5 text-slate-400" />Custom Report Builder</h1>
          <p className="text-sm text-slate-500 mt-0.5">Build, preview and export custom ESG reports</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setShowPreview(!showPreview); toast.success("Preview generated"); }}>
            <Play className="size-3.5" />{showPreview ? "Hide Preview" : "Preview"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success(`"${reportName}" saved`)}><Save className="size-3.5" />Save Report</Button>
          <Button size="sm" onClick={() => toast.success("Report exported as PDF")}><Download className="size-3.5" />Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="xl:col-span-1 space-y-4">
          <Card>
            <CardHeader><CardTitle>Report Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Report Name</label>
                <Input value={reportName} onChange={e => setReportName(e.target.value)} placeholder="Report name" /></div>
              <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Time Period</label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026-q2">Q2 2026</SelectItem>
                    <SelectItem value="2026-q1">Q1 2026</SelectItem>
                    <SelectItem value="2026-h1">H1 2026</SelectItem>
                    <SelectItem value="2025">FY 2025</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-600 text-slate-400 mb-1.5 block">Chart Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {CHART_TYPES.map(ct => (
                    <button key={ct.id} onClick={() => setChartType(ct.id)}
                      className={cn("flex items-center gap-2 p-2 rounded-lg border text-xs font-600 transition-all",
                        chartType === ct.id ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "border-white/8 text-slate-500 hover:text-slate-300 hover:bg-white/4")}>
                      <ct.Icon className="size-3.5" />{ct.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Select Metrics</CardTitle><CardDescription>{selectedMetrics.length} selected</CardDescription></CardHeader>
            <CardContent className="space-y-1 max-h-72 overflow-y-auto">
              {["Environment", "Social", "Governance", "Summary"].map(mod => (
                <div key={mod}>
                  <p className="text-xs font-700 text-slate-600 uppercase tracking-wider mt-2 mb-1.5">{mod}</p>
                  {METRICS.filter(m => m.module === mod).map(metric => (
                    <button key={metric.id} onClick={() => toggleMetric(metric.id)}
                      className={cn("w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all mb-0.5",
                        selectedMetrics.includes(metric.id) ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:bg-white/4 hover:text-slate-200")}>
                      <span>{metric.label}</span>
                      <span className="text-slate-600">{metric.unit}</span>
                    </button>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview Area */}
        <div className="xl:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>{reportName || "Untitled Report"}</CardTitle><CardDescription>Period: {period} · {selectedMetrics.length} metrics</CardDescription></div>
                <div className="flex gap-1">{selectedMetrics.slice(0, 3).map(m => {
                  const metric = METRICS.find(x => x.id === m);
                  return metric ? <Badge key={m} variant="secondary" className="text-xs">{metric.label}</Badge> : null;
                })}{selectedMetrics.length > 3 && <Badge variant="secondary">+{selectedMetrics.length - 3}</Badge>}</div>
              </div>
            </CardHeader>
            <CardContent>
              {chartType === "bar" && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={SAMPLE_DATA.bar} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                    <Bar dataKey="value" name="GHG Emissions (kgCO₂e)" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {chartType === "line" && (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={SAMPLE_DATA.bar} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                    <Line type="monotone" dataKey="value" name="Value" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              {chartType === "pie" && (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={SAMPLE_DATA.pie} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                      {SAMPLE_DATA.pie.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {chartType === "table" && (
                <div className="overflow-hidden rounded-lg border border-white/8">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-white/8 bg-white/3">
                      <th className="text-left px-4 py-2.5 text-slate-500 font-600">Metric</th>
                      <th className="text-right px-4 py-2.5 text-slate-500 font-600">Q2 2026</th>
                      <th className="text-right px-4 py-2.5 text-slate-500 font-600">Q1 2026</th>
                      <th className="text-right px-4 py-2.5 text-slate-500 font-600">Change</th>
                    </tr></thead>
                    <tbody>{selectedMetrics.slice(0, 6).map((m, i) => {
                      const metric = METRICS.find(x => x.id === m);
                      if (!metric) return null;
                      return <tr key={m} className="border-b border-white/5 hover:bg-white/3">
                        <td className="px-4 py-2.5 text-slate-300 font-600">{metric.label}</td>
                        <td className="px-4 py-2.5 text-right text-emerald-400 font-700 tabular-nums">{(Math.random() * 100).toFixed(1)}</td>
                        <td className="px-4 py-2.5 text-right text-slate-400 tabular-nums">{(Math.random() * 100).toFixed(1)}</td>
                        <td className="px-4 py-2.5 text-right text-emerald-400 tabular-nums">+{(Math.random() * 10).toFixed(1)}%</td>
                      </tr>;
                    })}</tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Reports */}
          <Card>
            <CardHeader><CardTitle>Saved Reports</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {SAVED_REPORTS.map(r => (
                <div key={r.name} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/6 hover:bg-white/5 transition-all">
                  <div>
                    <p className="text-sm font-600 text-white">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.metrics.join(", ")} · {r.chart} · {r.created}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.success("Report loaded")}>Load</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.success("Exported")}><Download className="size-3" /></Button>
                    <button className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Download, Filter, Heart, TreePine, BookOpen, Stethoscope, Building2, Wrench } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { toast } from "sonner";

type CSRCategory = "Education" | "Environment" | "Healthcare" | "Community" | "Skills";
type CSRStatus = "Planning" | "Active" | "Completed" | "Cancelled";

interface CSRActivity {
  id: string; title: string; description: string; category: CSRCategory;
  startDate: string; endDate: string; targetParticipants: number; actualParticipants: number;
  budget: number; spent: number; location: string; organizer: string;
  status: CSRStatus; impactScore: number; sdgGoals: string[];
}

const ACTIVITIES: CSRActivity[] = [
  { id: "CSR001", title: "Tree Plantation Drive", description: "Annual reforestation drive across 3 cities with employee volunteers.", category: "Environment", startDate: "2026-07-01", endDate: "2026-07-31", targetParticipants: 150, actualParticipants: 142, budget: 250000, spent: 218000, location: "Chennai, Bangalore, Hyderabad", organizer: "Priya Sharma", status: "Active", impactScore: 92, sdgGoals: ["SDG 13", "SDG 15"] },
  { id: "CSR002", title: "Digital Literacy Camp", description: "Teaching digital skills to underprivileged youth in rural areas.", category: "Education", startDate: "2026-06-15", endDate: "2026-07-15", targetParticipants: 100, actualParticipants: 89, budget: 180000, spent: 165000, location: "Tamil Nadu (Rural)", organizer: "Rahul Mehta", status: "Active", impactScore: 88, sdgGoals: ["SDG 4", "SDG 10"] },
  { id: "CSR003", title: "River Cleanup Campaign", description: "Cleaning Adyar river stretch with community participation.", category: "Environment", startDate: "2026-07-05", endDate: "2026-07-05", targetParticipants: 80, actualParticipants: 67, budget: 75000, spent: 52000, location: "Chennai", organizer: "Sunita Rao", status: "Active", impactScore: 79, sdgGoals: ["SDG 6", "SDG 14"] },
  { id: "CSR004", title: "Blood Donation Drive", description: "Quarterly blood donation camp in partnership with Chennai Blood Bank.", category: "Healthcare", startDate: "2026-06-01", endDate: "2026-06-01", targetParticipants: 200, actualParticipants: 218, budget: 50000, spent: 42000, location: "Chennai HQ", organizer: "Deepa Nair", status: "Completed", impactScore: 95, sdgGoals: ["SDG 3"] },
  { id: "CSR005", title: "Solar Panel for Village School", description: "Installing 10kW solar system in government school.", category: "Education", startDate: "2026-05-01", endDate: "2026-05-30", targetParticipants: 60, actualParticipants: 45, budget: 450000, spent: 420000, location: "Villupuram District", organizer: "Karthik Raj", status: "Completed", impactScore: 96, sdgGoals: ["SDG 7", "SDG 4"] },
  { id: "CSR006", title: "Women Entrepreneurship Workshop", description: "3-day skills workshop for women from self-help groups.", category: "Skills", startDate: "2026-08-10", endDate: "2026-08-12", targetParticipants: 75, actualParticipants: 0, budget: 120000, spent: 0, location: "Coimbatore", organizer: "Ananya Patel", status: "Planning", impactScore: 0, sdgGoals: ["SDG 5", "SDG 8"] },
  { id: "CSR007", title: "Community Health Check-Up Camp", description: "Free health screening for 500+ villagers with specialist doctors.", category: "Healthcare", startDate: "2026-09-01", endDate: "2026-09-02", targetParticipants: 500, actualParticipants: 0, budget: 320000, spent: 0, location: "Madurai", organizer: "Meera Joshi", status: "Planning", impactScore: 0, sdgGoals: ["SDG 3"] },
  { id: "CSR008", title: "Plastic-Free Awareness Drive", description: "School outreach program covering 20 schools on plastic alternatives.", category: "Community", startDate: "2026-04-01", endDate: "2026-04-30", targetParticipants: 2000, actualParticipants: 1840, budget: 90000, spent: 88000, location: "Chennai Schools", organizer: "Vijay Kumar", status: "Completed", impactScore: 87, sdgGoals: ["SDG 12", "SDG 14"] },
];

const catIcons: Record<CSRCategory, React.ElementType> = { Education: BookOpen, Environment: TreePine, Healthcare: Stethoscope, Community: Building2, Skills: Wrench };
const catColors: Record<CSRCategory, string> = { Education: "text-blue-400", Environment: "text-emerald-400", Healthcare: "text-pink-400", Community: "text-purple-400", Skills: "text-orange-400" };

const monthlyImpact = [
  { month: "Jan", participants: 210, activities: 3 },
  { month: "Feb", participants: 145, activities: 2 },
  { month: "Mar", participants: 380, activities: 4 },
  { month: "Apr", participants: 1840, activities: 3 },
  { month: "May", participants: 45, activities: 1 },
  { month: "Jun", participants: 307, activities: 2 },
  { month: "Jul", participants: 298, activities: 3 },
];

type TabType = "All" | "Active" | "Completed" | "Planning";

export default function CSRActivitiesPage() {
  const [tab, setTab] = useState<TabType>("All");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = tab === "All" ? ACTIVITIES : ACTIVITIES.filter(a => a.status === tab);
  const activeActivities = ACTIVITIES.filter(a => a.status === "Active");

  const columns: Column<CSRActivity>[] = [
    { key: "title", label: "Activity", sortable: true, render: (_, r) => (
      <div><p className="text-xs font-600 text-slate-200">{r.title}</p><p className="text-xs text-slate-600">{r.category} · {r.location}</p></div>
    )},
    { key: "category", label: "Category", render: (v) => {
      const Icon = catIcons[v as CSRCategory];
      return <div className="flex items-center gap-1.5"><Icon className={cn("size-3.5", catColors[v as CSRCategory])} /><span className="text-xs text-slate-400">{String(v)}</span></div>;
    }},
    { key: "actualParticipants", label: "Participants", sortable: true, render: (v, r) => (
      <div className="flex items-center gap-2"><span className="text-xs tabular-nums font-600 text-sky-400">{Number(v)}</span><span className="text-xs text-slate-600">/ {r.targetParticipants}</span></div>
    )},
    { key: "budget", label: "Budget (₹)", sortable: true, render: (v, r) => (
      <div><p className="text-xs tabular-nums text-emerald-400 font-600">₹{Number(r.spent).toLocaleString("en-IN")}</p><p className="text-xs text-slate-600">of ₹{Number(v).toLocaleString("en-IN")}</p></div>
    )},
    { key: "startDate", label: "Date", render: (v, r) => <span className="text-xs text-slate-400">{formatDate(String(v))}</span> },
    { key: "impactScore", label: "Impact", sortable: true, render: (v) => (
      Number(v) > 0 ? <span className={cn("text-sm font-700 tabular-nums", Number(v) >= 80 ? "text-emerald-400" : "text-amber-400")}>{Number(v)}</span>
      : <span className="text-xs text-slate-600">Pending</span>
    )},
    { key: "status", label: "Status", render: (v) => (
      <Badge variant={v === "Active" ? "default" : v === "Completed" ? "success" : v === "Planning" ? "info" : "destructive"} dot>{String(v)}</Badge>
    )},
    { key: "organizer", label: "Organizer", render: (v) => <span className="text-xs text-slate-500">{String(v)}</span> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Heart className="size-5 text-sky-400" />CSR Activities</h1>
          <p className="text-sm text-slate-500 mt-0.5">Corporate social responsibility programs & community impact</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Add Activity</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Total Activities", v: "18", s: "This year", c: "text-sky-400" },
          { l: "Currently Active", v: activeActivities.length, s: "In progress now", c: "text-emerald-400" },
          { l: "Community Beneficiaries", v: "2,840+", s: "Impacted this year", c: "text-purple-400" },
          { l: "Budget Utilized", v: "76%", s: "₹9.8L of ₹12.9L", c: "text-amber-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
            <p className="text-xs text-slate-600 mt-0.5">{k.s}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Active Activity Cards */}
      {activeActivities.length > 0 && (
        <div>
          <h2 className="text-sm font-600 text-slate-400 mb-3">Active Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeActivities.map((a, i) => {
              const Icon = catIcons[a.category];
              const ptPct = Math.min(100, (a.actualParticipants / a.targetParticipants) * 100);
              const budgetPct = Math.min(100, (a.spent / a.budget) * 100);
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card hover>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon className={cn("size-3.5", catColors[a.category])} />
                            <span className="text-xs text-slate-500">{a.category}</span>
                          </div>
                          <h3 className="text-sm font-700 text-white leading-snug">{a.title}</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{a.location}</p>
                        </div>
                        <Badge variant="default" dot className="shrink-0">Active</Badge>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Participants</span><span className="text-sky-400 font-600">{a.actualParticipants} / {a.targetParticipants}</span></div>
                        <Progress value={ptPct} variant="social" size="sm" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Budget Used</span><span className="text-emerald-400 font-600">₹{a.spent.toLocaleString("en-IN")}</span></div>
                        <Progress value={budgetPct} variant="environment" size="sm" />
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/6">
                        <span className="text-xs text-slate-600">{a.organizer}</span>
                        <div className="flex gap-1">{a.sdgGoals.map(s => <span key={s} className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">{s}</span>)}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chart + Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly CSR Impact</CardTitle>
          <CardDescription>Participants per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyImpact} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="participants" name="Participants" fill="#38bdf8" radius={[3, 3, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs + Table */}
      <div className="flex items-center gap-1 mb-0">
        {(["All", "Active", "Completed", "Planning"] as TabType[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-600 transition-all",
              tab === t ? "bg-sky-500/15 text-sky-400" : "text-slate-500 hover:text-slate-300")}>
            {t} <span className="ml-1 text-xs opacity-60">{t === "All" ? ACTIVITIES.length : ACTIVITIES.filter(a => a.status === t).length}</span>
          </button>
        ))}
      </div>
      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={filtered} searchPlaceholder="Search activities..." searchKeys={["title", "category", "organizer", "location", "status"] as any} />
      </CardContent></Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Add CSR Activity</DialogTitle><DialogDescription>Register a new corporate social responsibility program</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Activity Title</label><Input placeholder="e.g., Tree Plantation Drive 2026" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Category</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Education","Environment","Healthcare","Community","Skills"].map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Organizer</label><Input placeholder="Responsible employee" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Start Date</label><Input type="date" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">End Date</label><Input type="date" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Target Participants</label><Input type="number" placeholder="e.g., 100" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Budget (₹)</label><Input type="number" placeholder="e.g., 250000" /></div>
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Location</label><Input placeholder="City or venue" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("CSR activity created"); }}>Create Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}


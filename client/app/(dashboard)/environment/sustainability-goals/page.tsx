"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Download, Filter, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type GoalCategory = "Carbon" | "Water" | "Waste" | "Energy" | "Biodiversity";
type GoalStatus = "On Track" | "At Risk" | "Behind" | "Achieved";

interface SustainabilityGoal {
  id: string; title: string; description: string; category: GoalCategory;
  targetValue: number; currentValue: number; unit: string; targetYear: number;
  progress: number; status: GoalStatus; owner: string; department: string; sdgAlignment: string[];
}

const GOALS: SustainabilityGoal[] = [
  { id: "SG001", title: "Net Zero Emissions by 2030", description: "Achieve net-zero GHG emissions across all scopes", category: "Carbon", targetValue: 0, currentValue: 14080, unit: "tCO₂e/month", targetYear: 2030, progress: 34, status: "On Track", owner: "Rajesh Kumar", department: "Sustainability", sdgAlignment: ["SDG 13", "SDG 7"] },
  { id: "SG002", title: "Reduce Water Consumption 30%", description: "Reduce total water usage vs 2023 baseline", category: "Water", targetValue: 60000, currentValue: 74500, unit: "kL/year", targetYear: 2027, progress: 71, status: "On Track", owner: "Sunita Rao", department: "Operations", sdgAlignment: ["SDG 6", "SDG 12"] },
  { id: "SG003", title: "100% Renewable Energy", description: "All purchased electricity from renewable sources", category: "Energy", targetValue: 100, currentValue: 52, unit: "% renewable", targetYear: 2028, progress: 52, status: "At Risk", owner: "Priya Sharma", department: "Engineering", sdgAlignment: ["SDG 7", "SDG 13"] },
  { id: "SG004", title: "Zero Waste to Landfill", description: "Divert 100% of waste from landfill via recycling/composting", category: "Waste", targetValue: 100, currentValue: 68, unit: "% diverted", targetYear: 2030, progress: 68, status: "On Track", owner: "Meera Joshi", department: "Facilities", sdgAlignment: ["SDG 12", "SDG 11"] },
  { id: "SG005", title: "Carbon Intensity Reduction 50%", description: "Halve carbon intensity per unit of production", category: "Carbon", targetValue: 0.5, currentValue: 0.82, unit: "tCO₂e/unit", targetYear: 2026, progress: 36, status: "Behind", owner: "Karthik Raj", department: "Manufacturing", sdgAlignment: ["SDG 13", "SDG 9"] },
  { id: "SG006", title: "Plant 10,000 Trees", description: "Reforestation & biodiversity enhancement program", category: "Biodiversity", targetValue: 10000, currentValue: 6840, unit: "trees planted", targetYear: 2025, progress: 68, status: "Achieved", owner: "Ananya Patel", department: "CSR", sdgAlignment: ["SDG 15", "SDG 13"] },
  { id: "SG007", title: "Green Supplier Certification", description: "80% of key suppliers ESG certified by 2027", category: "Carbon", targetValue: 80, currentValue: 38, unit: "% certified", targetYear: 2027, progress: 47, status: "At Risk", owner: "Deepa Nair", department: "Procurement", sdgAlignment: ["SDG 12", "SDG 17"] },
  { id: "SG008", title: "ISO 14001 Full Certification", description: "Achieve ISO 14001 for all manufacturing sites", category: "Waste", targetValue: 100, currentValue: 100, unit: "% certified", targetYear: 2024, progress: 100, status: "Achieved", owner: "Rahul Mehta", department: "Quality", sdgAlignment: ["SDG 12", "SDG 9"] },
];

const CATEGORIES: (GoalCategory | "All")[] = ["All", "Carbon", "Water", "Waste", "Energy", "Biodiversity"];
const catColors: Record<GoalCategory, string> = {
  Carbon: "text-emerald-400", Water: "text-sky-400", Waste: "text-orange-400", Energy: "text-amber-400", Biodiversity: "text-green-400",
};
const catBg: Record<GoalCategory, string> = {
  Carbon: "bg-emerald-500/10", Water: "bg-sky-500/10", Waste: "bg-orange-500/10", Energy: "bg-amber-500/10", Biodiversity: "bg-green-500/10",
};

const statusConfig: Record<GoalStatus, { icon: React.ElementType; color: string; bg: string }> = {
  "On Track": { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  "At Risk": { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
  "Behind": { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
  "Achieved": { icon: CheckCircle, color: "text-sky-400", bg: "bg-sky-500/10" },
};

const summaryStats = [
  { label: "Total Goals", value: GOALS.length, color: "text-white" },
  { label: "On Track", value: GOALS.filter(g => g.status === "On Track").length, color: "text-emerald-400" },
  { label: "At Risk", value: GOALS.filter(g => g.status === "At Risk").length, color: "text-amber-400" },
  { label: "Achieved", value: GOALS.filter(g => g.status === "Achieved").length, color: "text-sky-400" },
];

export default function SustainabilityGoalsPage() {
  const [selectedCat, setSelectedCat] = useState<GoalCategory | "All">("All");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = selectedCat === "All" ? GOALS : GOALS.filter(g => g.category === selectedCat);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2"><Target className="size-5 text-emerald-400" />Sustainability Goals</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track long-term ESG targets and milestone progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Add Goal</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {summaryStats.map((s, i) => (
          <Card key={i} hover><CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={cn("text-3xl font-700 mt-1 tabular-nums", s.color)}>{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 border",
              selectedCat === cat ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-white/4 text-slate-400 border-white/8 hover:border-white/16 hover:text-white"
            )}>{cat}</button>
        ))}
      </div>

      {/* Goals Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((goal, i) => {
            const sc = statusConfig[goal.status];
            const Icon = sc.icon;
            return (
              <motion.div key={goal.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: i * 0.04 }}>
                <Card hover className="h-full">
                  <CardContent className="p-5 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge className={cn("text-xs", catBg[goal.category], catColors[goal.category], "border-transparent")}>{goal.category}</Badge>
                          <span className="text-xs text-slate-600">Target: {goal.targetYear}</span>
                        </div>
                        <h3 className="text-sm font-700 text-white leading-snug">{goal.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{goal.description}</p>
                      </div>
                      <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", sc.bg)}>
                        <Icon className={cn("size-4", sc.color)} />
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-500">Progress</span>
                        <span className={cn("text-sm font-700 tabular-nums", sc.color)}>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} variant={goal.status === "Achieved" ? "social" : goal.status === "At Risk" ? "warning" : goal.status === "Behind" ? "danger" : "environment"} size="md" />
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-slate-600">{goal.currentValue.toLocaleString()} {goal.unit}</span>
                        <span className="text-xs text-slate-600">Target: {goal.targetValue.toLocaleString()} {goal.unit}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/6">
                      <div className="flex items-center gap-1.5">
                        <div className="size-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-xs font-700 text-emerald-400">{goal.owner.split(" ").map(n=>n[0]).join("")}</span>
                        </div>
                        <span className="text-xs text-slate-500">{goal.owner}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {goal.sdgAlignment.map(sdg => (
                          <span key={sdg} className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">{sdg}</span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Add Sustainability Goal</DialogTitle><DialogDescription>Define a new long-term ESG target</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Goal Title</label><Input placeholder="e.g., Net Zero Emissions by 2030" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Category</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Carbon","Water","Waste","Energy","Biodiversity"].map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Target Year</label><Input type="number" placeholder="e.g., 2030" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Target Value</label><Input type="number" placeholder="Numeric target" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Unit</label><Input placeholder="e.g., tCO₂e, %, kL" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Owner</label><Input placeholder="Responsible person" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Department</label><Input placeholder="Department name" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddOpen(false); toast.success("Sustainability goal created"); }}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

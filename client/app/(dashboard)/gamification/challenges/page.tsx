"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Plus, Download, Zap, Calendar, Users, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type ChallengeStatus = "Draft" | "Active" | "Under Review" | "Completed" | "Archived";
type ChallengeCategory = "Carbon" | "Water" | "Waste" | "Energy" | "Diversity" | "Safety";

interface Challenge {
  id: string; title: string; description: string; category: ChallengeCategory;
  startDate: string; endDate: string; targetValue: number; currentValue: number;
  unit: string; xpReward: number; badgeReward?: string; participants: number;
  status: ChallengeStatus; createdBy: string; department: string[]; progress: number;
}

const CHALLENGES: Challenge[] = [
  { id: "CH001", title: "Zero Single-Use Plastics Week", description: "Eliminate all single-use plastics from your workspace for 7 days", category: "Waste", startDate: "2026-07-07", endDate: "2026-07-13", targetValue: 100, currentValue: 78, unit: "% plastic-free", xpReward: 500, badgeReward: "♻️", participants: 142, status: "Active", createdBy: "Priya Sharma", department: ["All"], progress: 78 },
  { id: "CH002", title: "Green Commute July", description: "Use public transport, cycling or walking for all work commutes this month", category: "Carbon", startDate: "2026-07-01", endDate: "2026-07-31", targetValue: 30, currentValue: 18, unit: "days green commute", xpReward: 750, badgeReward: "🚴", participants: 89, status: "Active", createdBy: "Karthik Raj", department: ["All"], progress: 60 },
  { id: "CH003", title: "Water Conservation Sprint", description: "Reduce water consumption in manufacturing by 10% vs baseline", category: "Water", startDate: "2026-07-01", endDate: "2026-07-31", targetValue: 10, currentValue: 7.2, unit: "% reduction", xpReward: 600, badgeReward: "💧", participants: 48, status: "Active", createdBy: "Sunita Rao", department: ["Manufacturing", "Facilities"], progress: 72 },
  { id: "CH004", title: "Energy Dashboard 100 Days", description: "Monitor and log your team energy usage every day for 100 days", category: "Energy", startDate: "2026-04-01", endDate: "2026-07-09", targetValue: 100, currentValue: 100, unit: "days logged", xpReward: 1000, badgeReward: "⚡", participants: 34, status: "Completed", createdBy: "Meera Joshi", department: ["IT", "Operations"], progress: 100 },
  { id: "CH005", title: "Diversity Reading Challenge", description: "Read 3 books on D&I, sustainability or social impact and share key learnings", category: "Diversity", startDate: "2026-06-01", endDate: "2026-06-30", targetValue: 3, currentValue: 3, unit: "books read", xpReward: 300, participants: 67, status: "Completed", createdBy: "Rahul Mehta", department: ["All"], progress: 100 },
  { id: "CH006", title: "Tree Adoption Program", description: "Adopt a tree sapling and track its growth over 6 months", category: "Carbon", startDate: "2026-08-01", endDate: "2027-01-31", targetValue: 200, currentValue: 0, unit: "trees adopted", xpReward: 1500, badgeReward: "🌳", participants: 0, status: "Draft", createdBy: "Ananya Patel", department: ["All"], progress: 0 },
  { id: "CH007", title: "Safety Near-Miss Reporting", description: "Report at least 1 safety near-miss observation this quarter", category: "Safety", startDate: "2026-07-01", endDate: "2026-09-30", targetValue: 500, currentValue: 112, unit: "reports submitted", xpReward: 200, badgeReward: "🦺", participants: 112, status: "Active", createdBy: "Suresh Babu", department: ["Manufacturing", "Facilities"], progress: 22 },
  { id: "CH008", title: "Paperless Office Sprint", description: "Go completely paperless for all internal communications for 2 weeks", category: "Waste", startDate: "2026-05-15", endDate: "2026-05-28", targetValue: 100, currentValue: 100, unit: "% paperless", xpReward: 400, badgeReward: "📄", participants: 186, status: "Archived", createdBy: "Deepa Nair", department: ["Finance", "HR", "Marketing"], progress: 100 },
];

const catColors: Record<ChallengeCategory, string> = {
  Carbon: "text-emerald-400", Water: "text-sky-400", Waste: "text-orange-400",
  Energy: "text-amber-400", Diversity: "text-purple-400", Safety: "text-red-400",
};
const catBg: Record<ChallengeCategory, string> = {
  Carbon: "bg-emerald-500/10 border-emerald-500/20", Water: "bg-sky-500/10 border-sky-500/20",
  Waste: "bg-orange-500/10 border-orange-500/20", Energy: "bg-amber-500/10 border-amber-500/20",
  Diversity: "bg-purple-500/10 border-purple-500/20", Safety: "bg-red-500/10 border-red-500/20",
};

const TABS: (ChallengeStatus | "All")[] = ["All", "Active", "Draft", "Under Review", "Completed", "Archived"];

export default function ChallengesPage() {
  const [tab, setTab] = useState<ChallengeStatus | "All">("All");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = tab === "All" ? CHALLENGES : CHALLENGES.filter(c => c.status === tab);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2"><Trophy className="size-5 text-orange-400" />Challenges</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gamified ESG challenges to drive employee engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Create Challenge</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Total Challenges", v: CHALLENGES.length, c: "text-orange-400" },
          { l: "Active Now", v: CHALLENGES.filter(c => c.status === "Active").length, c: "text-emerald-400" },
          { l: "Total Participants", v: CHALLENGES.reduce((s, c) => s + c.participants, 0).toLocaleString(), c: "text-sky-400" },
          { l: "XP Distributed", v: "48,200", c: "text-amber-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Tab Filter */}
      <div className="flex items-center gap-1 flex-wrap">
        {TABS.map(t => {
          const count = t === "All" ? CHALLENGES.length : CHALLENGES.filter(c => c.status === t).length;
          return (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-600 transition-all border",
                tab === t ? "bg-orange-500/15 text-orange-400 border-orange-500/30" : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/4")}>
              {t} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Challenge Cards */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((ch, i) => (
            <motion.div key={ch.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
              <Card hover className="h-full flex flex-col">
                <CardContent className="p-5 flex flex-col gap-4 flex-1">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    {ch.badgeReward && (
                      <div className="size-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xl shrink-0">{ch.badgeReward}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={cn("text-xs font-600 px-2 py-0.5 rounded-md border", catBg[ch.category], catColors[ch.category])}>{ch.category}</span>
                        <Badge variant={ch.status === "Active" ? "default" : ch.status === "Completed" ? "success" : ch.status === "Draft" ? "secondary" : ch.status === "Archived" ? "outline" : "warning"} dot>{ch.status}</Badge>
                      </div>
                      <h3 className="text-sm font-700 text-white leading-snug">{ch.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{ch.description}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  {ch.status !== "Draft" && (
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-700 text-orange-400">{ch.progress}%</span>
                      </div>
                      <Progress value={ch.progress} variant="gamification" size="md" />
                      <p className="text-xs text-slate-600 mt-1">{ch.currentValue} / {ch.targetValue} {ch.unit}</p>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500"><Users className="size-3" />{ch.participants}</div>
                      <div className="flex items-center gap-1 text-xs text-orange-400 font-700"><Zap className="size-3" />{ch.xpReward} XP</div>
                    </div>
                    <div className="text-xs text-slate-600">{formatDate(ch.endDate)}</div>
                  </div>

                  {/* Action */}
                  {ch.status === "Active" && (
                    <Button size="sm" className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20" onClick={() => toast.success(`Joined "${ch.title}"`)}>
                      Join Challenge
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Create Challenge</DialogTitle><DialogDescription>Design a new ESG gamification challenge</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Challenge Title</label><Input placeholder="e.g., Zero Single-Use Plastics Week" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Category</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Carbon","Water","Waste","Energy","Diversity","Safety"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">XP Reward</label><Input type="number" placeholder="e.g., 500" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Start Date</label><Input type="date" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">End Date</label><Input type="date" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Target Value</label><Input type="number" placeholder="Numeric goal" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Unit</label><Input placeholder="e.g., days, %, kg" /></div>
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Badge Emoji (optional)</label><Input placeholder="e.g., 🌱 🚴 ♻️" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => { setAddOpen(false); toast.success("Challenge created and saved as Draft"); }}>Create Challenge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

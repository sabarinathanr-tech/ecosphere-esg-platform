"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Plus, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BadgeCategory = "Environment" | "Social" | "Governance" | "Participation" | "Achievement";
type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

interface EsgBadge {
  id: string; name: string; description: string; icon: string;
  category: BadgeCategory; xpRequired: number; criteria: string;
  totalAwarded: number; rarity: Rarity; createdDate: string;
}

const BADGES: EsgBadge[] = [
  { id: "B001", name: "Green Pioneer", description: "First to complete a carbon reduction challenge", icon: "🌱", category: "Environment", xpRequired: 500, criteria: "Complete 1 Carbon category challenge", totalAwarded: 142, rarity: "Common", createdDate: "2025-01-01" },
  { id: "B002", name: "Carbon Crusader", description: "Reduced personal carbon footprint by 20%", icon: "⚡", category: "Environment", xpRequired: 1000, criteria: "Log Green Commute for 30 days", totalAwarded: 34, rarity: "Rare", createdDate: "2025-01-01" },
  { id: "B003", name: "Zero Waste Hero", description: "Achieved zero-waste status for an entire week", icon: "♻️", category: "Environment", xpRequired: 750, criteria: "Complete Zero Plastic Week challenge", totalAwarded: 89, rarity: "Rare", createdDate: "2025-03-01" },
  { id: "B004", name: "Community Champion", description: "Participated in 5 CSR activities", icon: "🤝", category: "Social", xpRequired: 500, criteria: "Attend 5 CSR activities in a calendar year", totalAwarded: 67, rarity: "Common", createdDate: "2025-01-01" },
  { id: "B005", name: "Inclusion Advocate", description: "Completed full D&I training suite", icon: "🌈", category: "Social", xpRequired: 300, criteria: "Complete all D&I training modules", totalAwarded: 218, rarity: "Common", createdDate: "2025-02-01" },
  { id: "B006", name: "Policy Guardian", description: "100% policy acknowledgement rate", icon: "📜", category: "Governance", xpRequired: 400, criteria: "Acknowledge all assigned policies within 30 days", totalAwarded: 312, rarity: "Common", createdDate: "2025-01-01" },
  { id: "B007", name: "Audit Ace", description: "Scored 95+ in compliance audit", icon: "✅", category: "Governance", xpRequired: 1500, criteria: "Department scores 95%+ in internal audit", totalAwarded: 12, rarity: "Epic", createdDate: "2025-06-01" },
  { id: "B008", name: "ESG Legend", description: "Top ESG performer for 3 consecutive quarters", icon: "👑", category: "Achievement", xpRequired: 5000, criteria: "Rank in top 3 on leaderboard for 3 consecutive quarters", totalAwarded: 3, rarity: "Legendary", createdDate: "2025-09-01" },
  { id: "B009", name: "Challenge Master", description: "Completed 10 challenges of any type", icon: "🏆", category: "Achievement", xpRequired: 2000, criteria: "Complete 10 different challenges", totalAwarded: 24, rarity: "Epic", createdDate: "2025-04-01" },
  { id: "B010", name: "Water Warden", description: "Contributed to 15% water reduction", icon: "💧", category: "Environment", xpRequired: 800, criteria: "Department reduces water by 15% vs baseline", totalAwarded: 18, rarity: "Rare", createdDate: "2025-05-01" },
  { id: "B011", name: "Safety Sentinel", description: "Reported 5 safety near-misses", icon: "🦺", category: "Participation", xpRequired: 300, criteria: "Submit 5 safety observation reports", totalAwarded: 112, rarity: "Common", createdDate: "2025-07-01" },
  { id: "B012", name: "ESG Evangelist", description: "Onboarded 10 colleagues to ESG programs", icon: "📣", category: "Participation", xpRequired: 600, criteria: "Refer 10 colleagues to ESG challenges", totalAwarded: 41, rarity: "Rare", createdDate: "2025-03-15" },
];

const rarityColors: Record<Rarity, { text: string; bg: string; border: string; glow: string }> = {
  Common: { text: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", glow: "" },
  Rare: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", glow: "shadow-blue-500/10" },
  Epic: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", glow: "shadow-purple-500/20" },
  Legendary: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", glow: "shadow-amber-500/30" },
};

const catList: (BadgeCategory | "All")[] = ["All", "Environment", "Social", "Governance", "Participation", "Achievement"];
const rarityList: (Rarity | "All")[] = ["All", "Common", "Rare", "Epic", "Legendary"];

export default function BadgesPage() {
  const [catFilter, setCatFilter] = useState<BadgeCategory | "All">("All");
  const [rarityFilter, setRarityFilter] = useState<Rarity | "All">("All");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = BADGES.filter(b =>
    (catFilter === "All" || b.category === catFilter) &&
    (rarityFilter === "All" || b.rarity === rarityFilter)
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Award className="size-5 text-orange-400" />Badges</h1>
          <p className="text-sm text-slate-500 mt-0.5">Design and manage ESG achievement badges</p></div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Create Badge</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { l: "Total Badges", v: BADGES.length, c: "text-orange-400" },
          { l: "Total Awarded", v: BADGES.reduce((s,b)=>s+b.totalAwarded,0).toLocaleString(), c: "text-emerald-400" },
          { l: "Legendary Badges", v: BADGES.filter(b=>b.rarity==="Legendary").length, c: "text-amber-400" },
          { l: "Epic Badges", v: BADGES.filter(b=>b.rarity==="Epic").length, c: "text-purple-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          {catList.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-600 transition-all border",
                catFilter === c ? "bg-orange-500/15 text-orange-400 border-orange-500/30" : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/4")}>{c}</button>
          ))}
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-1">
          {rarityList.map(r => (
            <button key={r} onClick={() => setRarityFilter(r)}
              className={cn("px-2.5 py-1 rounded-md text-xs font-600 transition-all",
                rarityFilter === r ? (r !== "All" ? cn(rarityColors[r as Rarity].bg, rarityColors[r as Rarity].text, "border", rarityColors[r as Rarity].border) : "bg-white/10 text-white") : "text-slate-600 hover:text-slate-400")}>{r}</button>
          ))}
        </div>
      </div>

      {/* Badge Grid */}
      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filtered.map((badge, i) => {
            const rc = rarityColors[badge.rarity];
            return (
              <motion.div key={badge.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04 }}>
                <Card hover className={cn("h-full border", rc.border, badge.rarity === "Legendary" ? "shadow-lg " + rc.glow : "")}>
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    {/* Icon */}
                    <div className={cn("size-14 rounded-2xl flex items-center justify-center text-3xl border", rc.bg, rc.border)}>
                      {badge.icon}
                    </div>
                    {/* Rarity */}
                    <span className={cn("text-xs font-700 px-2 py-0.5 rounded-full border", rc.bg, rc.text, rc.border)}>{badge.rarity}</span>
                    {/* Name & desc */}
                    <div>
                      <p className="text-sm font-700 text-white">{badge.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{badge.description}</p>
                    </div>
                    {/* Meta */}
                    <div className="w-full space-y-1.5 pt-2 border-t border-white/6">
                      <div className="flex justify-between text-xs"><span className="text-slate-600">XP Required</span><span className={cn("font-700", rc.text)}>{badge.xpRequired.toLocaleString()} XP</span></div>
                      <div className="flex justify-between text-xs"><span className="text-slate-600">Times Awarded</span><span className="text-slate-400 font-600">{badge.totalAwarded}</span></div>
                      <Badge variant={badge.category === "Environment" ? "environment" : badge.category === "Social" ? "social" : badge.category === "Governance" ? "governance" : "gamification"} className="w-full justify-center text-xs">{badge.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Create Badge</DialogTitle><DialogDescription>Design a new ESG achievement badge</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Badge Name</label><Input placeholder="e.g., Carbon Crusader" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Category</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Environment","Social","Governance","Participation","Achievement"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Rarity</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Common","Rare","Epic","Legendary"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Badge Icon (Emoji)</label><Input placeholder="e.g., 🌱 🏆 ⚡" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">XP Required</label><Input type="number" placeholder="e.g., 500" /></div>
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Award Criteria</label><Input placeholder="How to earn this badge" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => { setAddOpen(false); toast.success("Badge created successfully"); }}>Create Badge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

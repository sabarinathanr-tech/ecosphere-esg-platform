"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Plus, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type RewardCategory = "Voucher" | "Experience" | "Merchandise" | "Recognition" | "Time Off";

interface Reward {
  id: string; title: string; description: string; category: RewardCategory;
  xpCost: number; monetaryValue: number; stock: number;
  totalRedeemed: number; image: string; validUntil: string;
  status: "Available" | "Out of Stock" | "Coming Soon";
}

const REWARDS: Reward[] = [
  { id: "R001", title: "Amazon Gift Voucher ₹500", description: "Redeemable on Amazon India for any purchase", category: "Voucher", xpCost: 500, monetaryValue: 500, stock: 50, totalRedeemed: 142, image: "🛍️", validUntil: "2026-12-31", status: "Available" },
  { id: "R002", title: "Zomato Food Credits ₹300", description: "Order food from your favourite restaurants", category: "Voucher", xpCost: 300, monetaryValue: 300, stock: 80, totalRedeemed: 218, image: "🍕", validUntil: "2026-12-31", status: "Available" },
  { id: "R003", title: "Extra Day Off (Paid Leave)", description: "1 additional paid leave day added to your account", category: "Time Off", xpCost: 2000, monetaryValue: 2500, stock: 20, totalRedeemed: 8, image: "🏖️", validUntil: "2026-12-31", status: "Available" },
  { id: "R004", title: "EV Charging Session (5 free)", description: "5 free EV charging sessions at office EV station", category: "Experience", xpCost: 400, monetaryValue: 250, stock: 30, totalRedeemed: 34, image: "⚡", validUntil: "2026-12-31", status: "Available" },
  { id: "R005", title: "EcoSphere Branded Merch Kit", description: "Eco-friendly tote bag, tumbler & notebook set", category: "Merchandise", xpCost: 600, monetaryValue: 800, stock: 0, totalRedeemed: 67, image: "🎒", validUntil: "2026-12-31", status: "Out of Stock" },
  { id: "R006", title: "CEO Recognition Letter", description: "Personal appreciation letter from the CEO with LinkedIn shoutout", category: "Recognition", xpCost: 1500, monetaryValue: 0, stock: 10, totalRedeemed: 3, image: "📜", validUntil: "2026-12-31", status: "Available" },
  { id: "R007", title: "Wellness Spa Voucher ₹1000", description: "Relax with a spa day at partnered wellness centers", category: "Experience", xpCost: 1000, monetaryValue: 1000, stock: 15, totalRedeemed: 12, image: "🧖", validUntil: "2026-09-30", status: "Available" },
  { id: "R008", title: "ESG Course (Udemy/Coursera)", description: "Premium online course access on ESG, sustainability or climate", category: "Experience", xpCost: 800, monetaryValue: 1200, stock: 25, totalRedeemed: 19, image: "📚", validUntil: "2026-12-31", status: "Available" },
  { id: "R009", title: "Plant a Tree in Your Name", description: "A tree will be planted and tracked with GPS coordinates", category: "Recognition", xpCost: 150, monetaryValue: 100, stock: 500, totalRedeemed: 340, image: "🌳", validUntil: "2026-12-31", status: "Available" },
  { id: "R010", title: "Premium ESG Dashboard Access", description: "6-month personal premium ESG analytics dashboard", category: "Experience", xpCost: 1200, monetaryValue: 1500, stock: 0, totalRedeemed: 5, image: "📊", validUntil: "2026-12-31", status: "Coming Soon" },
];

const catList: (RewardCategory | "All")[] = ["All", "Voucher", "Experience", "Merchandise", "Recognition", "Time Off"];

export default function RewardsPage() {
  const [catFilter, setCatFilter] = useState<RewardCategory | "All">("All");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = catFilter === "All" ? REWARDS : REWARDS.filter(r => r.category === catFilter);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Gift className="size-5 text-orange-400" />Rewards Catalog</h1>
          <p className="text-sm text-slate-500 mt-0.5">XP-based rewards employees can redeem for their ESG contributions</p></div>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setAddOpen(true)}><Plus className="size-3.5" />Add Reward</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { l: "Total Rewards", v: REWARDS.length, c: "text-orange-400" },
          { l: "Available", v: REWARDS.filter(r=>r.status==="Available").length, c: "text-emerald-400" },
          { l: "Total Redeemed", v: REWARDS.reduce((s,r)=>s+r.totalRedeemed,0).toLocaleString(), c: "text-sky-400" },
          { l: "Rewards Value Pool", v: "₹2.4L", c: "text-amber-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1 flex-wrap">
        {catList.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-600 transition-all border",
              catFilter === c ? "bg-orange-500/15 text-orange-400 border-orange-500/30" : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/4")}>{c}</button>
        ))}
      </div>

      {/* Rewards Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((reward, i) => (
            <motion.div key={reward.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}>
              <Card hover className={cn("h-full relative overflow-hidden", reward.status === "Out of Stock" && "opacity-60")}>
                {reward.status !== "Available" && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant={reward.status === "Coming Soon" ? "info" : "secondary"}>{reward.status}</Badge>
                  </div>
                )}
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="size-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl shrink-0">{reward.image}</div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="gamification" className="mb-1 text-xs">{reward.category}</Badge>
                      <h3 className="text-sm font-700 text-white leading-snug">{reward.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{reward.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/6">
                    <div>
                      <p className="text-xs text-slate-600">XP Cost</p>
                      <p className="text-lg font-700 text-orange-400">{reward.xpCost.toLocaleString()} XP</p>
                    </div>
                    {reward.monetaryValue > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-slate-600">Value</p>
                        <p className="text-sm font-600 text-emerald-400">₹{reward.monetaryValue.toLocaleString("en-IN")}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">{reward.stock} in stock · {reward.totalRedeemed} redeemed</span>
                    <Button size="sm" disabled={reward.status !== "Available"}
                      className={cn("h-7 text-xs", reward.status === "Available" ? "bg-orange-500 hover:bg-orange-600 text-white" : "")}
                      onClick={() => toast.success(`Redeem request submitted for "${reward.title}"`)}>
                      Redeem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Reward</DialogTitle><DialogDescription>Add a new item to the rewards catalog</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs font-600 text-slate-400 mb-1.5 block">Reward Title</label><Input placeholder="e.g., Amazon Gift Voucher ₹500" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Category</label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Voucher","Experience","Merchandise","Recognition","Time Off"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Icon (Emoji)</label><Input placeholder="e.g., 🎁 🏖️" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">XP Cost</label><Input type="number" placeholder="e.g., 500" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Stock Quantity</label><Input type="number" placeholder="e.g., 50" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Monetary Value (₹)</label><Input type="number" placeholder="Optional" /></div>
            <div><label className="text-xs font-600 text-slate-400 mb-1.5 block">Valid Until</label><Input type="date" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => { setAddOpen(false); toast.success("Reward added to catalog"); }}>Add Reward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

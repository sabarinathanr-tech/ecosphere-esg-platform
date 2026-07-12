"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Edit, Camera, Save, Shield, Key, LogOut, CheckCircle, Mail, Phone, Building2, Zap, Award, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PROFILE = {
  name: "Priya Sharma", email: "priya.sharma@ecosphere.in", phone: "+91 98765 43210",
  employeeId: "EMP042", department: "Engineering", role: "ESG Manager",
  location: "Chennai HQ", joinDate: "2021-06-15",
  level: 12, totalXp: 8420, nextLevelXp: 9000, rank: 1,
  badgesEarned: 9, challengesCompleted: 14, streak: 42,
  esgScore: 94, contributions: 128, topBadge: "👑",
  bio: "Passionate about driving sustainable practices in enterprise technology. Leading EcoSphere's ESG transformation journey since 2021.",
};

const RECENT_BADGES = [
  { icon: "👑", name: "ESG Legend", rarity: "Legendary", earnedDate: "2026-07-01" },
  { icon: "♻️", name: "Zero Waste Hero", rarity: "Rare", earnedDate: "2026-07-13" },
  { icon: "⚡", name: "Energy Dashboard 100 Days", rarity: "Rare", earnedDate: "2026-07-09" },
  { icon: "🌱", name: "Green Pioneer", rarity: "Common", earnedDate: "2026-06-15" },
];

const ACTIVITY = [
  { action: "Completed Challenge", detail: "Zero Single-Use Plastics Week", xp: "+500 XP", time: "2h ago", color: "text-orange-400" },
  { action: "Badge Earned", detail: "Zero Waste Hero 🏆", xp: "", time: "1d ago", color: "text-amber-400" },
  { action: "Policy Acknowledged", detail: "Data Privacy & GDPR Policy", xp: "+50 XP", time: "2d ago", color: "text-purple-400" },
  { action: "CSR Activity", detail: "Tree Plantation Drive (4h)", xp: "+200 XP", time: "3d ago", color: "text-emerald-400" },
  { action: "Training Completed", detail: "ISO 14001 Environmental Audit", xp: "+400 XP", time: "5d ago", color: "text-sky-400" },
];

const rarityGradient: Record<string, string> = {
  Legendary: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  Epic: "from-purple-500/20 to-indigo-500/10 border-purple-500/30",
  Rare: "from-blue-500/20 to-sky-500/10 border-blue-500/30",
  Common: "from-white/5 to-white/3 border-white/8",
};

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(PROFILE.name);
  const [phone, setPhone] = useState(PROFILE.phone);
  const [bio, setBio] = useState(PROFILE.bio);

  const xpPct = (PROFILE.totalXp / PROFILE.nextLevelXp) * 100;

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    toast.success("Profile updated successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><User className="size-5 text-slate-400" />My Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your account, ESG progress and achievements</p></div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave}><Save className="size-3.5" />Save Changes</Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Edit className="size-3.5" />Edit Profile</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left - Profile Card */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {/* Avatar */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="size-20 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <span className="text-2xl font-700 text-white">{PROFILE.name.split(" ").map(n=>n[0]).join("")}</span>
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 size-6 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center hover:bg-slate-600 transition-all">
                      <Camera className="size-3 text-slate-300" />
                    </button>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-3xl">{PROFILE.topBadge}</p>
                  {editing ? (
                    <Input value={name} onChange={e => setName(e.target.value)} className="mt-2 text-center text-sm font-700 h-8" />
                  ) : (
                    <h2 className="text-lg font-700 text-white mt-1">{name}</h2>
                  )}
                  <p className="text-sm text-slate-400">{PROFILE.role}</p>
                  <Badge variant="environment" className="mt-1">{PROFILE.department}</Badge>
                </div>
              </div>

              {/* XP Bar */}
              <div className="mt-5 p-3 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 flex items-center gap-1"><Zap className="size-3 text-orange-400" />Level {PROFILE.level}</span>
                  <span className="font-700 text-orange-400">{PROFILE.totalXp.toLocaleString()} / {PROFILE.nextLevelXp.toLocaleString()} XP</span>
                </div>
                <Progress value={xpPct} variant="gamification" size="md" />
                <p className="text-xs text-slate-600 mt-1 text-right">{(PROFILE.nextLevelXp - PROFILE.totalXp).toLocaleString()} XP to Level {PROFILE.level + 1}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { l: "Rank", v: `#${PROFILE.rank}`, c: "text-amber-400", Icon: Trophy },
                  { l: "Badges", v: PROFILE.badgesEarned, c: "text-purple-400", Icon: Award },
                  { l: "Streak", v: `${PROFILE.streak}d 🔥`, c: "text-orange-400", Icon: TrendingUp },
                ].map(s => (
                  <div key={s.l} className="text-center p-2 rounded-xl bg-white/3 border border-white/6">
                    <p className={cn("text-lg font-700", s.c)}>{s.v}</p>
                    <p className="text-xs text-slate-600">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="mt-4 space-y-2 pt-4 border-t border-white/6">
                <div className="flex items-center gap-2 text-xs"><Mail className="size-3.5 text-slate-600" /><span className="text-slate-400">{PROFILE.email}</span></div>
                {editing ? (
                  <div className="flex items-center gap-2"><Phone className="size-3.5 text-slate-600 shrink-0" /><Input value={phone} onChange={e => setPhone(e.target.value)} className="h-7 text-xs flex-1" /></div>
                ) : (
                  <div className="flex items-center gap-2 text-xs"><Phone className="size-3.5 text-slate-600" /><span className="text-slate-400">{phone}</span></div>
                )}
                <div className="flex items-center gap-2 text-xs"><Building2 className="size-3.5 text-slate-600" /><span className="text-slate-400">{PROFILE.location}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={() => toast.info("Password reset email sent")}><Key className="size-3.5" />Change Password</Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={() => toast.info("2FA setup opened")}><Shield className="size-3.5" />Enable 2FA</Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs text-red-400 hover:text-red-300 hover:border-red-500/30" onClick={() => toast.error("Logged out")}><LogOut className="size-3.5" />Sign Out</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="xl:col-span-2 space-y-4">
          {/* Bio */}
          <Card>
            <CardHeader><CardTitle>About Me</CardTitle></CardHeader>
            <CardContent>
              {editing ? (
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                  className="w-full rounded-lg bg-white/4 border border-white/8 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none" />
              ) : <p className="text-sm text-slate-400 leading-relaxed">{bio}</p>}
            </CardContent>
          </Card>

          {/* ESG Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "ESG Score", v: PROFILE.esgScore, c: "text-emerald-400", suffix: "/100" },
              { l: "Challenges", v: PROFILE.challengesCompleted, c: "text-orange-400", suffix: " done" },
              { l: "Contributions", v: PROFILE.contributions, c: "text-sky-400", suffix: " total" },
              { l: "Total XP", v: PROFILE.totalXp.toLocaleString(), c: "text-amber-400", suffix: " XP" },
            ].map((s, i) => (
              <Card key={i} hover><CardContent className="p-4 text-center">
                <p className="text-xs text-slate-500">{s.l}</p>
                <p className={cn("text-2xl font-700 mt-1 tabular-nums", s.c)}>{s.v}<span className="text-xs text-slate-600">{s.suffix}</span></p>
              </CardContent></Card>
            ))}
          </div>

          {/* Badges */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Award className="size-4 text-amber-400" />Recent Badges</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {RECENT_BADGES.map(b => (
                  <div key={b.name} className={cn("rounded-xl border p-3 text-center bg-gradient-to-b", rarityGradient[b.rarity])}>
                    <div className="text-3xl mb-1.5">{b.icon}</div>
                    <p className="text-xs font-700 text-slate-200 leading-tight">{b.name}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{b.earnedDate}</p>
                    <span className={cn("text-xs font-600 mt-1 block", b.rarity === "Legendary" ? "text-amber-400" : b.rarity === "Epic" ? "text-purple-400" : b.rarity === "Rare" ? "text-blue-400" : "text-slate-500")}>{b.rarity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent className="divide-y divide-white/6 -mx-5 px-0">
              {ACTIVITY.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-xs font-600 text-slate-200">{a.action}</p>
                    <p className="text-xs text-slate-500">{a.detail}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    {a.xp && <p className={cn("text-xs font-700", a.color)}>{a.xp}</p>}
                    <p className="text-xs text-slate-600">{a.time}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

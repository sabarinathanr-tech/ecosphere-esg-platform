"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus, Zap, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number; employeeName: string; employeeId: string; department: string;
  totalXp: number; level: number; badgesEarned: number; challengesCompleted: number;
  streak: number; trend: "up" | "down" | "same"; trendValue: number; topBadge: string;
  nextLevelXp: number;
}

const ENTRIES: LeaderboardEntry[] = [
  { rank: 1, employeeName: "Priya Sharma", employeeId: "EMP042", department: "Engineering", totalXp: 8420, level: 12, badgesEarned: 9, challengesCompleted: 14, streak: 42, trend: "same", trendValue: 0, topBadge: "👑", nextLevelXp: 9000 },
  { rank: 2, employeeName: "Karthik Raj", employeeId: "EMP031", department: "Operations", totalXp: 7680, level: 11, badgesEarned: 8, challengesCompleted: 12, streak: 35, trend: "up", trendValue: 1, topBadge: "⚡", nextLevelXp: 8000 },
  { rank: 3, employeeName: "Ananya Patel", employeeId: "EMP076", department: "Finance", totalXp: 7210, level: 11, badgesEarned: 7, challengesCompleted: 11, streak: 28, trend: "up", trendValue: 2, topBadge: "🌱", nextLevelXp: 8000 },
  { rank: 4, employeeName: "Rahul Mehta", employeeId: "EMP018", department: "HR", totalXp: 6540, level: 10, badgesEarned: 6, challengesCompleted: 10, streak: 21, trend: "down", trendValue: 1, topBadge: "🤝", nextLevelXp: 7000 },
  { rank: 5, employeeName: "Deepa Nair", employeeId: "EMP055", department: "Marketing", totalXp: 6120, level: 10, badgesEarned: 6, challengesCompleted: 9, streak: 18, trend: "up", trendValue: 3, topBadge: "♻️", nextLevelXp: 7000 },
  { rank: 6, employeeName: "Meera Joshi", employeeId: "EMP067", department: "Facilities", totalXp: 5840, level: 9, badgesEarned: 5, challengesCompleted: 8, streak: 14, trend: "same", trendValue: 0, topBadge: "💧", nextLevelXp: 6000 },
  { rank: 7, employeeName: "Arun Krishnan", employeeId: "EMP033", department: "Engineering", totalXp: 5420, level: 9, badgesEarned: 5, challengesCompleted: 8, streak: 20, trend: "up", trendValue: 1, topBadge: "🌱", nextLevelXp: 6000 },
  { rank: 8, employeeName: "Sunita Rao", employeeId: "EMP012", department: "HR", totalXp: 4980, level: 8, badgesEarned: 4, challengesCompleted: 7, streak: 9, trend: "down", trendValue: 2, topBadge: "📜", nextLevelXp: 5000 },
  { rank: 9, employeeName: "Vijay Kumar", employeeId: "EMP089", department: "Manufacturing", totalXp: 4640, level: 8, badgesEarned: 4, challengesCompleted: 6, streak: 7, trend: "up", trendValue: 2, topBadge: "⚡", nextLevelXp: 5000 },
  { rank: 10, employeeName: "Nithya Devi", employeeId: "EMP091", department: "Finance", totalXp: 4280, level: 7, badgesEarned: 3, challengesCompleted: 6, streak: 12, trend: "same", trendValue: 0, topBadge: "🌳", nextLevelXp: 5000 },
  { rank: 11, employeeName: "Sathish M", employeeId: "EMP044", department: "Operations", totalXp: 3920, level: 7, badgesEarned: 3, challengesCompleted: 5, streak: 6, trend: "up", trendValue: 1, topBadge: "♻️", nextLevelXp: 4000 },
  { rank: 12, employeeName: "Lakshmi Priya", employeeId: "EMP028", department: "Marketing", totalXp: 3640, level: 6, badgesEarned: 3, challengesCompleted: 5, streak: 8, trend: "down", trendValue: 1, topBadge: "🤝", nextLevelXp: 4000 },
  { rank: 13, employeeName: "Kavitha R", employeeId: "EMP062", department: "Facilities", totalXp: 3200, level: 6, badgesEarned: 2, challengesCompleted: 4, streak: 4, trend: "up", trendValue: 3, topBadge: "💧", nextLevelXp: 4000 },
  { rank: 14, employeeName: "Mohan Das", employeeId: "EMP051", department: "Manufacturing", totalXp: 2840, level: 5, badgesEarned: 2, challengesCompleted: 4, streak: 3, trend: "same", trendValue: 0, topBadge: "🌱", nextLevelXp: 3000 },
  { rank: 15, employeeName: "Suresh Balan", employeeId: "EMP074", department: "Engineering", totalXp: 2480, level: 5, badgesEarned: 2, challengesCompleted: 3, streak: 5, trend: "down", trendValue: 2, topBadge: "🦺", nextLevelXp: 3000 },
];

const podiumColors = ["text-amber-400", "text-slate-300", "text-orange-600"];
const podiumBg = ["bg-amber-500/10 border-amber-500/30", "bg-slate-500/10 border-slate-500/30", "bg-orange-600/10 border-orange-600/30"];
const medals = ["🥇", "🥈", "🥉"];

const TrendIcon = ({ t, v }: { t: "up" | "down" | "same"; v: number }) => {
  if (t === "up") return <span className="text-xs text-emerald-400 font-600 flex items-center gap-0.5"><TrendingUp className="size-3" />+{v}</span>;
  if (t === "down") return <span className="text-xs text-red-400 font-600 flex items-center gap-0.5"><TrendingDown className="size-3" />-{v}</span>;
  return <span className="text-xs text-slate-600 flex items-center gap-0.5"><Minus className="size-3" />—</span>;
};

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("monthly");
  const [deptFilter, setDeptFilter] = useState("all");

  const depts = ["All Departments", "Engineering", "Operations", "Finance", "HR", "Marketing", "Facilities", "Manufacturing"];
  const filtered = deptFilter === "all" ? ENTRIES : ENTRIES.filter(e => e.department === deptFilter);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Trophy className="size-5 text-amber-400" />Leaderboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Top ESG contributors ranked by XP earned</p></div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/10 overflow-hidden">
            {["monthly", "alltime"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={cn("px-3 py-1.5 text-xs font-600 transition-all", period === p ? "bg-amber-500/15 text-amber-400" : "text-slate-500 hover:text-slate-300")}>
                {p === "monthly" ? "Monthly" : "All Time"}
              </button>
            ))}
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {depts.map(d => <SelectItem key={d} value={d === "All Departments" ? "all" : d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Podium */}
      {deptFilter === "all" && (
        <div className="grid grid-cols-3 gap-4">
          {ENTRIES.slice(0, 3).map((e, i) => (
            <motion.div key={e.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card hover className={cn("border", podiumBg[i])}>
                <CardContent className="p-5 text-center">
                  <div className="text-3xl mb-2">{medals[i]}</div>
                  <div className={cn("size-12 rounded-full mx-auto flex items-center justify-center mb-2 border", podiumBg[i])}>
                    <span className={cn("text-lg font-700", podiumColors[i])}>{e.employeeName.split(" ").map(n=>n[0]).join("")}</span>
                  </div>
                  <div className="text-3xl mb-1">{e.topBadge}</div>
                  <p className="text-sm font-700 text-white">{e.employeeName}</p>
                  <p className="text-xs text-slate-500">{e.department}</p>
                  <div className="mt-3">
                    <p className={cn("text-2xl font-700 tabular-nums", podiumColors[i])}>{e.totalXp.toLocaleString()}</p>
                    <p className="text-xs text-slate-600">XP · Level {e.level}</p>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs"><span className="text-slate-600">Next Level</span><span className={cn("font-600", podiumColors[i])}>{e.nextLevelXp.toLocaleString()} XP</span></div>
                    <Progress value={(e.totalXp / e.nextLevelXp) * 100} variant="gamification" size="sm" />
                  </div>
                  <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-white/6 text-xs">
                    <div><p className="text-slate-500">Badges</p><p className={cn("font-700", podiumColors[i])}>{e.badgesEarned}</p></div>
                    <div><p className="text-slate-500">Challenges</p><p className={cn("font-700", podiumColors[i])}>{e.challengesCompleted}</p></div>
                    <div><p className="text-slate-500">Streak</p><p className={cn("font-700", podiumColors[i])}>{e.streak}d 🔥</p></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full Table */}
      <Card>
        <CardContent className="divide-y divide-white/6 p-0">
          {filtered.map((e, i) => {
            const isTop3 = e.rank <= 3;
            return (
              <motion.div key={e.rank} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className={cn("flex items-center gap-4 px-5 py-3 hover:bg-white/3 transition-all cursor-default", isTop3 && "bg-amber-500/3")}>
                {/* Rank */}
                <div className="w-8 text-center shrink-0">
                  {isTop3 ? <span className="text-lg">{medals[e.rank - 1]}</span>
                    : <span className="text-sm font-700 text-slate-600 tabular-nums">#{e.rank}</span>}
                </div>
                {/* Avatar */}
                <div className={cn("size-9 rounded-full flex items-center justify-center shrink-0", isTop3 ? podiumBg[e.rank-1] : "bg-orange-500/10")}>
                  <span className={cn("text-sm font-700", isTop3 ? podiumColors[e.rank-1] : "text-orange-400")}>{e.employeeName.split(" ").map(n=>n[0]).join("")}</span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-600 text-white">{e.employeeName}</p>
                    <span className="text-lg">{e.topBadge}</span>
                    <TrendIcon t={e.trend} v={e.trendValue} />
                  </div>
                  <p className="text-xs text-slate-500">{e.department} · Level {e.level}</p>
                </div>
                {/* XP Bar */}
                <div className="w-32 hidden lg:block">
                  <Progress value={(e.totalXp / e.nextLevelXp) * 100} variant="gamification" size="sm" />
                  <p className="text-xs text-slate-600 mt-0.5 text-right">{e.totalXp.toLocaleString()} XP</p>
                </div>
                {/* Stats */}
                <div className="hidden xl:flex items-center gap-6 text-xs">
                  <div className="text-center"><p className="text-slate-600">Badges</p><p className="font-700 text-orange-400">{e.badgesEarned}</p></div>
                  <div className="text-center"><p className="text-slate-600">Challenges</p><p className="font-700 text-orange-400">{e.challengesCompleted}</p></div>
                  <div className="text-center"><p className="text-slate-600">Streak</p><p className="font-700 text-orange-400">{e.streak}d 🔥</p></div>
                </div>
                {/* XP badge */}
                <div className="shrink-0">
                  <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2 py-1">
                    <Zap className="size-3 text-orange-400" />
                    <span className="text-xs font-700 text-orange-400 tabular-nums">{e.totalXp.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}

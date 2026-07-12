"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Filter, Trash2, AlertTriangle, CheckCircle, Info, Zap, Shield, Trophy, Leaf, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type NotifType = "warning" | "success" | "info" | "error" | "gamification" | "governance" | "social" | "environment";
type NotifModule = "Environment" | "Social" | "Governance" | "Gamification" | "Reports" | "System";

interface Notification {
  id: string; type: NotifType; module: NotifModule; title: string;
  message: string; time: string; read: boolean; actionLabel?: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: "N001", type: "warning", module: "Environment", title: "Carbon Budget Exceeded", message: "Manufacturing dept exceeded monthly carbon budget by 12%. Current: 9,420 tCO₂e, Budget: 8,400 tCO₂e.", time: new Date(Date.now() - 900000).toISOString(), read: false, actionLabel: "View Transactions" },
  { id: "N002", type: "error", module: "Governance", title: "Critical Compliance Issue Raised", message: "Wastewater discharge BOD levels exceeded TNPCB limits by 18%. Requires immediate corrective action.", time: new Date(Date.now() - 1800000).toISOString(), read: false, actionLabel: "View Issue" },
  { id: "N003", type: "gamification", module: "Gamification", title: "You Earned a New Badge! 🏆", message: "Congratulations! You earned the 'Zero Waste Hero ♻️' badge for completing the Zero Plastic Week challenge.", time: new Date(Date.now() - 3600000).toISOString(), read: false, actionLabel: "View Badges" },
  { id: "N004", type: "success", module: "Governance", title: "Policy Acknowledgement Target Reached", message: "Anti-Corruption & Bribery Policy reached 97% acknowledgement rate. Target was 95%.", time: new Date(Date.now() - 7200000).toISOString(), read: false, actionLabel: "View Policy" },
  { id: "N005", type: "info", module: "Gamification", title: "New Challenge Launched", message: "The 'Green Commute July' challenge is now active and accepting participants. 750 XP available!", time: new Date(Date.now() - 10800000).toISOString(), read: true, actionLabel: "Join Challenge" },
  { id: "N006", type: "warning", module: "Governance", title: "Audit Due in 7 Days", message: "ISO 14001:2015 Environmental Audit is scheduled for Aug 15. Please ensure all documentation is ready.", time: new Date(Date.now() - 18000000).toISOString(), read: true, actionLabel: "View Audit" },
  { id: "N007", type: "success", module: "Environment", title: "Sustainability Goal Milestone", message: "Water Reduction goal hit 71% completion milestone. On track to achieve 30% reduction by 2027.", time: new Date(Date.now() - 28800000).toISOString(), read: true, actionLabel: "View Goal" },
  { id: "N008", type: "gamification", module: "Gamification", title: "Leaderboard Rank Change", message: "You moved to #1 on the monthly leaderboard! Keep up the great ESG contributions.", time: new Date(Date.now() - 36000000).toISOString(), read: true },
  { id: "N009", type: "info", module: "Reports", title: "Q2 ESG Report Ready", message: "Your Q2 2026 ESG summary report has been generated and is ready for download.", time: new Date(Date.now() - 86400000).toISOString(), read: true, actionLabel: "Download Report" },
  { id: "N010", type: "social", module: "Social", title: "CSR Activity Reminder", message: "You are registered for the 'Tree Plantation Drive' tomorrow at 8:00 AM in Chennai HQ. Don't forget!", time: new Date(Date.now() - 90000000).toISOString(), read: true, actionLabel: "View Activity" },
  { id: "N011", type: "success", module: "Gamification", title: "Reward Redemption Approved", message: "Your request for 'Extra Day Off (Paid Leave)' has been approved by HR Manager. Enjoy your day off!", time: new Date(Date.now() - 172800000).toISOString(), read: true },
  { id: "N012", type: "governance", module: "Governance", title: "Policy Review Due", message: "Code of Business Conduct (v5.0) is due for annual review. Please initiate the review process.", time: new Date(Date.now() - 259200000).toISOString(), read: true, actionLabel: "Review Policy" },
  { id: "N013", type: "warning", module: "Environment", title: "Emission Factor Update Required", message: "IPCC AR6 emission factors are available. Update your emission factor library to maintain accuracy.", time: new Date(Date.now() - 345600000).toISOString(), read: true, actionLabel: "Update Factors" },
  { id: "N014", type: "info", module: "System", title: "Platform Maintenance Scheduled", message: "EcoSphere will undergo maintenance on Jul 20, 2026 from 2:00–4:00 AM IST. Save your work beforehand.", time: new Date(Date.now() - 432000000).toISOString(), read: true },
];

const typeConfig: Record<NotifType, { Icon: React.ElementType; iconColor: string; bg: string; dotColor: string }> = {
  warning:      { Icon: AlertTriangle, iconColor: "text-amber-400", bg: "bg-amber-500/10", dotColor: "bg-amber-400" },
  error:        { Icon: AlertTriangle, iconColor: "text-red-400", bg: "bg-red-500/10", dotColor: "bg-red-400" },
  success:      { Icon: CheckCircle, iconColor: "text-emerald-400", bg: "bg-emerald-500/10", dotColor: "bg-emerald-400" },
  info:         { Icon: Info, iconColor: "text-blue-400", bg: "bg-blue-500/10", dotColor: "bg-blue-400" },
  gamification: { Icon: Trophy, iconColor: "text-orange-400", bg: "bg-orange-500/10", dotColor: "bg-orange-400" },
  governance:   { Icon: Shield, iconColor: "text-purple-400", bg: "bg-purple-500/10", dotColor: "bg-purple-400" },
  social:       { Icon: Users, iconColor: "text-sky-400", bg: "bg-sky-500/10", dotColor: "bg-sky-400" },
  environment:  { Icon: Leaf, iconColor: "text-emerald-400", bg: "bg-emerald-500/10", dotColor: "bg-emerald-400" },
};

function timeAgo(isoTime: string): string {
  const diff = Date.now() - new Date(isoTime).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");

  const unread = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    const statusOk = filter === "all" || (filter === "unread" && !n.read) || (filter === "read" && n.read);
    const moduleOk = moduleFilter === "all" || n.module === moduleFilter;
    return statusOk && moduleOk;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification dismissed");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-700 text-white flex items-center gap-2">
            <Bell className="size-5 text-slate-400" />
            Notifications
            {unread > 0 && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-700">
                {unread} new
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Stay up to date with ESG events, alerts and achievements</p>
        </div>
        <div className="flex gap-2">
          {unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck className="size-3.5" />Mark All Read</Button>
          )}
          <Button variant="outline" size="sm" onClick={clearAll} className="text-red-400 hover:text-red-300 hover:border-red-500/30"><Trash2 className="size-3.5" />Clear All</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Total", v: notifications.length, c: "text-white" },
          { l: "Unread", v: unread, c: "text-emerald-400" },
          { l: "Alerts", v: notifications.filter(n=>n.type==="warning"||n.type==="error").length, c: "text-red-400" },
          { l: "Achievements", v: notifications.filter(n=>n.type==="gamification").length, c: "text-orange-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {[
            { v: "all", l: `All (${notifications.length})` },
            { v: "unread", l: `Unread (${unread})` },
            { v: "read", l: `Read (${notifications.length - unread})` },
          ].map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-600 transition-all border",
                filter === f.v ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/4")}>{f.l}</button>
          ))}
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {["Environment","Social","Governance","Gamification","Reports","System"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <Card><CardContent className="p-16 text-center">
          <Bell className="size-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-600">No notifications</p>
          <p className="text-xs text-slate-600 mt-1">You're all caught up!</p>
        </CardContent></Card>
      ) : (
        <Card>
          <CardContent className="divide-y divide-white/6 p-0">
            <AnimatePresence>
              {filtered.map((notif, i) => {
                const tc = typeConfig[notif.type];
                const Icon = tc.Icon;
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn("flex gap-4 px-5 py-4 hover:bg-white/2 transition-all group", !notif.read && "bg-white/1.5")}
                    onClick={() => markRead(notif.id)}
                  >
                    {/* Icon */}
                    <div className={cn("size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5", tc.bg)}>
                      <Icon className={cn("size-4.5", tc.iconColor)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn("text-sm font-700", notif.read ? "text-slate-300" : "text-white")}>{notif.title}</span>
                          <Badge variant={notif.module === "Environment" ? "environment" : notif.module === "Social" ? "social" : notif.module === "Governance" ? "governance" : notif.module === "Gamification" ? "gamification" : "secondary"} className="text-xs">{notif.module}</Badge>
                          {!notif.read && <div className={cn("size-2 rounded-full shrink-0", tc.dotColor)} />}
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }} className="size-6 rounded-md flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="size-3" /></button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-600">{timeAgo(notif.time)}</span>
                        {notif.actionLabel && (
                          <button onClick={(e) => e.stopPropagation()} className="text-xs text-emerald-400 hover:text-emerald-300 font-600 transition-colors">{notif.actionLabel} →</button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

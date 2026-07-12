"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Save, Mail, Smartphone, Monitor, Slack, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button onClick={onChange}
    className={cn("relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors", checked ? "bg-emerald-500" : "bg-white/10")}>
    <span className={cn("inline-block size-4 rounded-full bg-white shadow-sm transition-transform mt-0.5", checked ? "translate-x-4" : "translate-x-0.5")} />
  </button>
);

interface NotifSetting { key: string; label: string; desc: string; email: boolean; push: boolean; slack: boolean; }

const INITIAL: NotifSetting[] = [
  { key: "emission_alert", label: "Emission Threshold Alert", desc: "When emissions exceed monthly targets", email: true, push: true, slack: false },
  { key: "audit_due", label: "Audit Due Reminder", desc: "7 days before a scheduled audit", email: true, push: true, slack: true },
  { key: "policy_ack", label: "Policy Acknowledgement Overdue", desc: "When employees have pending policy sign-offs", email: true, push: false, slack: true },
  { key: "challenge_new", label: "New Challenge Launched", desc: "When a new gamification challenge goes live", email: false, push: true, slack: true },
  { key: "leaderboard", label: "Leaderboard Rank Change", desc: "When your rank changes on the leaderboard", email: false, push: true, slack: false },
  { key: "badge_earned", label: "Badge Earned", desc: "When you or your team earns a badge", email: false, push: true, slack: false },
  { key: "reward_approved", label: "Reward Redemption Approved", desc: "When a reward request is approved or rejected", email: true, push: true, slack: false },
  { key: "report_ready", label: "Report Generated", desc: "When a scheduled report is ready to download", email: true, push: false, slack: true },
  { key: "compliance_issue", label: "New Compliance Issue", desc: "When a compliance issue is raised or assigned to you", email: true, push: true, slack: true },
  { key: "goal_milestone", label: "Goal Milestone Reached", desc: "When a sustainability goal hits 25%, 50%, 75%, 100%", email: true, push: false, slack: true },
  { key: "csr_volunteer", label: "CSR Volunteer Reminder", desc: "48 hours before a CSR activity you've signed up for", email: true, push: true, slack: false },
  { key: "data_import", label: "Data Import Complete", desc: "When bulk data import finishes processing", email: true, push: false, slack: false },
];

const FREQ = ["Real-time", "Hourly Digest", "Daily Digest", "Weekly Summary"];
const CHANNELS = [
  { key: "email", label: "Email", Icon: Mail },
  { key: "push", label: "Push", Icon: Smartphone },
  { key: "slack", label: "Slack", Icon: Slack },
];

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotifSetting[]>(INITIAL);
  const [freq, setFreq] = useState("Real-time");
  const [masterEmail, setMasterEmail] = useState(true);
  const [masterPush, setMasterPush] = useState(true);
  const [masterSlack, setMasterSlack] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (key: string, channel: "email" | "push" | "slack") => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, [channel]: !s[channel] } : s));
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("Notification preferences saved");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Bell className="size-5 text-slate-400" />Notification Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage how and when you receive ESG platform notifications</p></div>
        <Button size="sm" onClick={handleSave} className={saved ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
          {saved ? <><CheckCircle className="size-3.5" />Saved!</> : <><Save className="size-3.5" />Save Changes</>}
        </Button>
      </div>

      {/* Master + Frequency */}
      <Card>
        <CardHeader><CardTitle>Global Notification Channels</CardTitle><CardDescription>Master switches for each notification channel</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {[
            { l: "Email Notifications", d: "Receive notifications via email", state: masterEmail, set: () => setMasterEmail(!masterEmail), Icon: Mail, c: "text-sky-400" },
            { l: "Push Notifications", d: "Browser and mobile push alerts", state: masterPush, set: () => setMasterPush(!masterPush), Icon: Smartphone, c: "text-emerald-400" },
            { l: "Slack Integration", d: "Send alerts to Slack workspace", state: masterSlack, set: () => setMasterSlack(!masterSlack), Icon: Slack, c: "text-purple-400" },
          ].map(m => (
            <div key={m.l} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3"><div className={cn("size-8 rounded-lg bg-white/5 flex items-center justify-center", m.c)}><m.Icon className={cn("size-4", m.c)} /></div>
                <div><p className="text-sm font-600 text-slate-200">{m.l}</p><p className="text-xs text-slate-500">{m.d}</p></div></div>
              <Toggle checked={m.state} onChange={m.set} />
            </div>
          ))}
          <div className="pt-2 border-t border-white/6">
            <p className="text-sm font-600 text-slate-300 mb-2">Email Frequency</p>
            <div className="flex gap-2 flex-wrap">
              {FREQ.map(f => (
                <button key={f} onClick={() => setFreq(f)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-600 border transition-all",
                    freq === f ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "border-white/8 text-slate-500 hover:text-slate-300 hover:bg-white/4")}>{f}</button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per-notification Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle>Notification Preferences</CardTitle><CardDescription>Configure per-event notification channels</CardDescription></div>
            <div className="hidden md:flex items-center gap-8 text-xs text-slate-500 pr-4">
              {CHANNELS.map(c => <span key={c.key} className="flex items-center gap-1"><c.Icon className="size-3" />{c.label}</span>)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-white/6 -mx-5 px-0">
          {settings.map(s => (
            <div key={s.key} className="flex items-center gap-4 px-5 py-3 hover:bg-white/2 transition-all">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-600 text-slate-200">{s.label}</p>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
              <div className="flex items-center gap-5 shrink-0">
                <Toggle checked={s.email && masterEmail} onChange={() => toggle(s.key, "email")} />
                <Toggle checked={s.push && masterPush} onChange={() => toggle(s.key, "push")} />
                <Toggle checked={s.slack && masterSlack} onChange={() => toggle(s.key, "slack")} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

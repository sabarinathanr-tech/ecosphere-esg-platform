"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle, XCircle, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface RewardRedemption {
  id: string; rewardId: string; rewardName: string; rewardIcon: string;
  employeeName: string; employeeId: string; department: string;
  redeemedDate: string; xpSpent: number; monetaryValue: number;
  status: "Pending" | "Approved" | "Fulfilled" | "Rejected";
  approvedBy?: string; fulfilledDate?: string;
}

const DATA: RewardRedemption[] = [
  { id: "RR001", rewardId: "R003", rewardName: "Extra Day Off (Paid Leave)", rewardIcon: "🏖️", employeeName: "Priya Sharma", employeeId: "EMP042", department: "Engineering", redeemedDate: "2026-07-10T09:00:00", xpSpent: 2000, monetaryValue: 2500, status: "Approved", approvedBy: "HR Manager" },
  { id: "RR002", rewardId: "R001", rewardName: "Amazon Gift Voucher ₹500", rewardIcon: "🛍️", employeeName: "Rahul Mehta", employeeId: "EMP018", department: "HR", redeemedDate: "2026-07-09T14:30:00", xpSpent: 500, monetaryValue: 500, status: "Fulfilled", approvedBy: "HR Manager", fulfilledDate: "2026-07-10" },
  { id: "RR003", rewardId: "R009", rewardName: "Plant a Tree in Your Name", rewardIcon: "🌳", employeeName: "Karthik Raj", employeeId: "EMP031", department: "Operations", redeemedDate: "2026-07-08T11:00:00", xpSpent: 150, monetaryValue: 100, status: "Fulfilled", approvedBy: "Auto", fulfilledDate: "2026-07-08" },
  { id: "RR004", rewardId: "R006", rewardName: "CEO Recognition Letter", rewardIcon: "📜", employeeName: "Meera Joshi", employeeId: "EMP067", department: "Facilities", redeemedDate: "2026-07-07T10:00:00", xpSpent: 1500, monetaryValue: 0, status: "Pending" },
  { id: "RR005", rewardId: "R002", rewardName: "Zomato Food Credits ₹300", rewardIcon: "🍕", employeeName: "Ananya Patel", employeeId: "EMP076", department: "Finance", redeemedDate: "2026-07-06T16:00:00", xpSpent: 300, monetaryValue: 300, status: "Fulfilled", approvedBy: "Auto", fulfilledDate: "2026-07-06" },
  { id: "RR006", rewardId: "R007", rewardName: "Wellness Spa Voucher ₹1000", rewardIcon: "🧖", employeeName: "Sunita Rao", employeeId: "EMP012", department: "HR", redeemedDate: "2026-07-05T09:30:00", xpSpent: 1000, monetaryValue: 1000, status: "Pending" },
  { id: "RR007", rewardId: "R004", rewardName: "EV Charging Sessions", rewardIcon: "⚡", employeeName: "Deepa Nair", employeeId: "EMP055", department: "Marketing", redeemedDate: "2026-07-04T14:00:00", xpSpent: 400, monetaryValue: 250, status: "Approved", approvedBy: "Facilities Head" },
  { id: "RR008", rewardId: "R008", rewardName: "ESG Course (Coursera)", rewardIcon: "📚", employeeName: "Arun Krishnan", employeeId: "EMP033", department: "Engineering", redeemedDate: "2026-07-03T11:30:00", xpSpent: 800, monetaryValue: 1200, status: "Rejected", approvedBy: "HR Manager" },
  { id: "RR009", rewardId: "R001", rewardName: "Amazon Gift Voucher ₹500", rewardIcon: "🛍️", employeeName: "Vijay Kumar", employeeId: "EMP089", department: "Manufacturing", redeemedDate: "2026-07-02T09:00:00", xpSpent: 500, monetaryValue: 500, status: "Fulfilled", approvedBy: "Auto", fulfilledDate: "2026-07-02" },
  { id: "RR010", rewardId: "R003", rewardName: "Extra Day Off (Paid Leave)", rewardIcon: "🏖️", employeeName: "Nithya Devi", employeeId: "EMP091", department: "Finance", redeemedDate: "2026-07-01T10:00:00", xpSpent: 2000, monetaryValue: 2500, status: "Approved", approvedBy: "HR Manager" },
  { id: "RR011", rewardId: "R009", rewardName: "Plant a Tree in Your Name", rewardIcon: "🌳", employeeName: "Sathish M", employeeId: "EMP044", department: "Operations", redeemedDate: "2026-06-30T15:00:00", xpSpent: 150, monetaryValue: 100, status: "Fulfilled", approvedBy: "Auto", fulfilledDate: "2026-06-30" },
  { id: "RR012", rewardId: "R002", rewardName: "Zomato Food Credits ₹300", rewardIcon: "🍕", employeeName: "Kavitha R", employeeId: "EMP062", department: "Facilities", redeemedDate: "2026-06-29T12:00:00", xpSpent: 300, monetaryValue: 300, status: "Pending" },
];

export default function RewardRedemptionPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = statusFilter === "all" ? DATA : DATA.filter(d => d.status === statusFilter);

  const columns: Column<RewardRedemption>[] = [
    { key: "rewardName", label: "Reward", render: (v, r) => (
      <div className="flex items-center gap-2">
        <span className="text-xl">{r.rewardIcon}</span>
        <div><p className="text-xs font-600 text-slate-200 max-w-36 leading-snug">{String(v)}</p><p className="text-xs text-slate-600">{r.rewardId}</p></div>
      </div>
    )},
    { key: "employeeName", label: "Employee", sortable: true, render: (_, r) => (
      <div><p className="text-xs font-600 text-slate-200">{r.employeeName}</p><p className="text-xs text-slate-600">{r.employeeId} · {r.department}</p></div>
    )},
    { key: "redeemedDate", label: "Redeemed", sortable: true, render: (v) => <span className="text-xs text-slate-400">{formatDate(String(v).split("T")[0])}</span> },
    { key: "xpSpent", label: "XP Spent", sortable: true, render: (v) => <span className="text-xs font-700 text-orange-400 tabular-nums">{Number(v).toLocaleString()} XP</span> },
    { key: "monetaryValue", label: "Value", render: (v) => (
      Number(v) > 0 ? <span className="text-xs tabular-nums text-emerald-400 font-600">₹{Number(v).toLocaleString("en-IN")}</span> : <span className="text-xs text-slate-600">—</span>
    )},
    { key: "status", label: "Status", render: (v) => (
      <Badge variant={v === "Fulfilled" ? "success" : v === "Approved" ? "social" : v === "Pending" ? "warning" : "destructive"} dot>{String(v)}</Badge>
    )},
    { key: "approvedBy", label: "Approved By", render: (v) => <span className="text-xs text-slate-500">{String(v) !== "undefined" ? String(v) : "—"}</span> },
    { key: "id", label: "", render: (_, r) => (
      <div className="flex gap-1">
        {r.status === "Pending" && <>
          <button onClick={() => toast.success(`Approved redemption ${r.id}`)} className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><CheckCircle className="size-3.5" /></button>
          <button onClick={() => toast.error(`Rejected redemption ${r.id}`)} className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><XCircle className="size-3.5" /></button>
        </>}
        {r.status === "Approved" && (
          <button onClick={() => toast.success(`Marked as fulfilled`)} className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 transition-all text-xs font-700">✓</button>
        )}
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><RotateCcw className="size-5 text-orange-400" />Reward Redemptions</h1>
          <p className="text-sm text-slate-500 mt-0.5">Review and process employee reward redemption requests</p></div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Total Redemptions", v: DATA.length, c: "text-orange-400" },
          { l: "Pending Approval", v: DATA.filter(d=>d.status==="Pending").length, c: "text-amber-400" },
          { l: "Fulfilled", v: DATA.filter(d=>d.status==="Fulfilled").length, c: "text-emerald-400" },
          { l: "Total XP Redeemed", v: DATA.reduce((s,d)=>s+d.xpSpent,0).toLocaleString(), c: "text-sky-400" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={filtered}
          searchPlaceholder="Search by employee, reward..." searchKeys={["employeeName","rewardName","department","status"] as any}
          actions={
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {["Pending","Approved","Fulfilled","Rejected"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          } />
      </CardContent></Card>
    </motion.div>
  );
}


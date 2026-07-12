"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { cn, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface PolicyAcknowledgement {
  id: string; policyId: string; policyName: string;
  employeeName: string; employeeId: string; department: string;
  acknowledgedAt: string; method: "Electronic" | "Physical";
  status: "Acknowledged" | "Pending" | "Overdue";
}

const DATA: PolicyAcknowledgement[] = [
  { id: "ACK001", policyId: "POL001", policyName: "Anti-Corruption Policy", employeeName: "Priya Sharma", employeeId: "EMP042", department: "Engineering", acknowledgedAt: "2026-07-10T09:24:00", method: "Electronic", status: "Acknowledged" },
  { id: "ACK002", policyId: "POL003", policyName: "Data Privacy Policy", employeeName: "Rahul Mehta", employeeId: "EMP018", department: "HR", acknowledgedAt: "2026-07-09T14:12:00", method: "Electronic", status: "Acknowledged" },
  { id: "ACK003", policyId: "POL002", policyName: "Environmental Policy", employeeName: "Karthik Raj", employeeId: "EMP031", department: "Operations", acknowledgedAt: "", method: "Electronic", status: "Overdue" },
  { id: "ACK004", policyId: "POL004", policyName: "Workplace Safety Policy", employeeName: "Meera Joshi", employeeId: "EMP067", department: "Facilities", acknowledgedAt: "2026-07-08T11:00:00", method: "Physical", status: "Acknowledged" },
  { id: "ACK005", policyId: "POL001", policyName: "Anti-Corruption Policy", employeeName: "Deepa Nair", employeeId: "EMP055", department: "Marketing", acknowledgedAt: "", method: "Electronic", status: "Pending" },
  { id: "ACK006", policyId: "POL005", policyName: "Code of Business Conduct", employeeName: "Vijay Kumar", employeeId: "EMP089", department: "Manufacturing", acknowledgedAt: "", method: "Electronic", status: "Overdue" },
  { id: "ACK007", policyId: "POL003", policyName: "Data Privacy Policy", employeeName: "Sunita Rao", employeeId: "EMP012", department: "HR", acknowledgedAt: "2026-07-07T16:45:00", method: "Electronic", status: "Acknowledged" },
  { id: "ACK008", policyId: "POL002", policyName: "Environmental Policy", employeeName: "Ananya Patel", employeeId: "EMP076", department: "Finance", acknowledgedAt: "2026-07-06T10:30:00", method: "Electronic", status: "Acknowledged" },
  { id: "ACK009", policyId: "POL004", policyName: "Workplace Safety Policy", employeeName: "Arun Krishnan", employeeId: "EMP033", department: "Engineering", acknowledgedAt: "", method: "Electronic", status: "Pending" },
  { id: "ACK010", policyId: "POL001", policyName: "Anti-Corruption Policy", employeeName: "Nithya Devi", employeeId: "EMP091", department: "Finance", acknowledgedAt: "2026-07-05T13:20:00", method: "Electronic", status: "Acknowledged" },
  { id: "ACK011", policyId: "POL005", policyName: "Code of Business Conduct", employeeName: "Sathish M", employeeId: "EMP044", department: "Operations", acknowledgedAt: "", method: "Electronic", status: "Overdue" },
  { id: "ACK012", policyId: "POL003", policyName: "Data Privacy Policy", employeeName: "Lakshmi Priya", employeeId: "EMP028", department: "Marketing", acknowledgedAt: "2026-07-04T09:00:00", method: "Physical", status: "Acknowledged" },
  { id: "ACK013", policyId: "POL002", policyName: "Environmental Policy", employeeName: "Mohan Das", employeeId: "EMP051", department: "Manufacturing", acknowledgedAt: "2026-07-03T15:30:00", method: "Electronic", status: "Acknowledged" },
  { id: "ACK014", policyId: "POL004", policyName: "Workplace Safety Policy", employeeName: "Kavitha R", employeeId: "EMP062", department: "Facilities", acknowledgedAt: "", method: "Electronic", status: "Pending" },
  { id: "ACK015", policyId: "POL001", policyName: "Anti-Corruption Policy", employeeName: "Suresh Balan", employeeId: "EMP074", department: "Engineering", acknowledgedAt: "2026-07-01T10:00:00", method: "Electronic", status: "Acknowledged" },
];

const total = 1240, acknowledged = 1082, overdue = 48, pending = total - acknowledged - overdue;

export default function PolicyAcknowledgementsPage() {
  const columns: Column<PolicyAcknowledgement>[] = [
    { key: "employeeName", label: "Employee", sortable: true, render: (_, r) => (
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
          <span className="text-xs font-700 text-purple-400">{r.employeeName.split(" ").map(n=>n[0]).join("")}</span>
        </div>
        <div><p className="text-xs font-600 text-slate-200">{r.employeeName}</p><p className="text-xs text-slate-600">{r.employeeId} · {r.department}</p></div>
      </div>
    )},
    { key: "policyName", label: "Policy", render: (v, r) => <div><p className="text-xs text-slate-300">{String(v)}</p><p className="text-xs text-slate-600">{r.policyId}</p></div> },
    { key: "method", label: "Method", render: (v) => <Badge variant="secondary">{String(v)}</Badge> },
    { key: "acknowledgedAt", label: "Acknowledged At", render: (v) => (
      v ? <span className="text-xs text-slate-400">{formatDateTime(String(v))}</span> : <span className="text-xs text-slate-600">—</span>
    )},
    { key: "status", label: "Status", render: (v) => (
      <Badge variant={v === "Acknowledged" ? "success" : v === "Overdue" ? "destructive" : "warning"} dot>{String(v)}</Badge>
    )},
    { key: "id", label: "", render: (_, r) => (
      r.status !== "Acknowledged" ? (
        <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => toast.success(`Reminder sent to ${r.employeeName}`)}>
          <Bell className="size-3" />Remind
        </Button>
      ) : null
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><BookOpen className="size-5 text-purple-400" />Policy Acknowledgements</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track employee sign-offs across all mandatory policies</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success(`Reminder sent to ${pending + overdue} employees`)}>
            <Bell className="size-3.5" />Remind All Pending
          </Button>
          <Button variant="outline" size="sm"><Download className="size-3.5" />Export</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { l: "Total Required", v: total.toLocaleString(), c: "text-white" },
          { l: "Acknowledged", v: acknowledged.toLocaleString(), c: "text-emerald-400", s: `${Math.round((acknowledged/total)*100)}% complete` },
          { l: "Overdue", v: overdue.toLocaleString(), c: "text-red-400", s: "Needs immediate action" },
        ].map((k, i) => (
          <Card key={i} hover><CardContent className="p-4">
            <p className="text-xs text-slate-500">{k.l}</p>
            <p className={cn("text-2xl font-700 mt-1 tabular-nums", k.c)}>{k.v}</p>
            {k.s && <p className="text-xs text-slate-600 mt-0.5">{k.s}</p>}
          </CardContent></Card>
        ))}
      </div>

      {/* Stacked progress bar */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-600 text-slate-300">Overall Acknowledgement Progress</p>
            <p className="text-sm font-700 text-emerald-400">{Math.round((acknowledged/total)*100)}%</p>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex gap-0.5">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(acknowledged/total)*100}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-emerald-500 rounded-l-full" />
            <motion.div initial={{ width: 0 }} animate={{ width: `${(pending/total)*100}%` }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="h-full bg-amber-500" />
            <motion.div initial={{ width: 0 }} animate={{ width: `${(overdue/total)*100}%` }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} className="h-full bg-red-500 rounded-r-full" />
          </div>
          <div className="flex items-center gap-5 mt-3">
            {[{c:"bg-emerald-500",l:`Acknowledged (${acknowledged.toLocaleString()})`},{c:"bg-amber-500",l:`Pending (${pending.toLocaleString()})`},{c:"bg-red-500",l:`Overdue (${overdue})`}].map(s => (
              <div key={s.l} className="flex items-center gap-1.5"><div className={cn("size-2 rounded-full", s.c)} /><span className="text-xs text-slate-500">{s.l}</span></div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card><CardContent className="p-5">
        <DataTable columns={columns} data={DATA}
          searchPlaceholder="Search by employee, policy..." searchKeys={["employeeName","policyName","department","status"] as any} />
      </CardContent></Card>
    </motion.div>
  );
}


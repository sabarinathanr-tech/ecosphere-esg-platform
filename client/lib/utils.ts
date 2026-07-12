import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals = 1): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(decimals)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(decimals)}K`;
  return num.toFixed(decimals);
}

export function formatPercent(value: number, total: number): string {
  return `${((value / total) * 100).toFixed(1)}%`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (score >= 40) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  return "bg-red-500/10 text-red-400 border-red-500/20";
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "critical": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "high": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "medium": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "low": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "compliant":
    case "approved": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "pending":
    case "under review":
    case "in progress": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "draft": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    case "overdue":
    case "failed":
    case "rejected":
    case "non-compliant": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "archived": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Settings,
  ChevronRight,
  Command,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  LogOut,
  User,
  HelpCircle,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

// Breadcrumb generation
function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = seg
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return { label, href };
  });
}

interface Notification {
  id: string;
  type: "warning" | "success" | "info" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Carbon Budget Alert",
    message: "Manufacturing dept exceeded monthly carbon budget by 12%",
    time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Policy Acknowledged",
    message: "Anti-Corruption Policy reached 94% acknowledgement rate",
    time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "New Challenge Active",
    message: "Zero Waste Week challenge is now accepting participants",
    time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: true,
  },
  {
    id: "4",
    type: "error",
    title: "Compliance Issue",
    message: "ISO 14001 audit finding requires immediate attention",
    time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    read: true,
  },
];

function NotificationIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "warning":
      return <AlertTriangle className="size-4 text-amber-400" />;
    case "success":
      return <CheckCircle className="size-4 text-emerald-400" />;
    case "error":
      return <AlertTriangle className="size-4 text-red-400" />;
    default:
      return <Info className="size-4 text-blue-400" />;
  }
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-12 w-96 rounded-xl border border-white/8 overflow-hidden z-50"
      style={{
        backgroundColor: "var(--bg-elevated)",
        boxShadow: "var(--shadow-modal)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-600 text-white">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="size-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            className={cn(
              "flex gap-3 px-4 py-3.5 border-b border-white/4 cursor-pointer transition-colors",
              !notification.read && "bg-white/2"
            )}
          >
            <div className="mt-0.5 shrink-0">
              <NotificationIcon type={notification.type} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span className={cn("text-xs font-600", !notification.read ? "text-white" : "text-slate-300")}>
                  {notification.title}
                </span>
                {!notification.read && (
                  <div className="size-1.5 rounded-full bg-emerald-400 shrink-0 mt-1" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notification.message}</p>
              <span className="text-xs text-slate-600 mt-1 block">
                {new Date(notification.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/6">
        <Link href="/notifications" onClick={onClose}>
          <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors w-full text-center">
            View all notifications
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

interface NavbarProps {
  sidebarCollapsed: boolean;
}

export function Navbar({ sidebarCollapsed }: NavbarProps) {
  const breadcrumbs = useBreadcrumbs();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center gap-4 px-6 border-b border-white/6"
      style={{
        left: sidebarCollapsed ? "72px" : "256px",
        height: "64px",
        backgroundColor: "rgba(11, 15, 23, 0.92)",
        backdropFilter: "blur(12px)",
        transition: "left 0.25s ease",
      }}
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 flex-1 min-w-0">
        <Link href="/dashboard" className="text-xs text-slate-500 hover:text-slate-300 transition-colors shrink-0">
          EcoSphere
        </Link>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <ChevronRight className="size-3 text-slate-700 shrink-0" />
            <Link
              href={crumb.href}
              className={cn(
                "text-xs transition-colors truncate",
                index === breadcrumbs.length - 1
                  ? "text-slate-200 font-600"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/16 transition-all text-xs"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <Search className="size-3.5" />
          <span className="hidden sm:block">Search...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-xs text-slate-600 bg-white/5 px-1 py-0.5 rounded">
            <Command className="size-2.5" />K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className={cn(
              "size-9 rounded-lg flex items-center justify-center transition-all duration-150 relative",
              notifOpen
                ? "bg-white/8 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/6"
            )}
          >
            <Bell className="size-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-400 ring-2 ring-[var(--bg-base)]" />
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <NotificationPanel onClose={() => setNotifOpen(false)} />
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <Link href="/settings">
          <button className="size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/6 transition-all duration-150">
            <Settings className="size-4.5" />
          </button>
        </Link>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/6 transition-all duration-150"
          >
            <div className="size-7 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
              <span className="text-xs font-600 text-emerald-400">SR</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-600 text-slate-200 leading-none">Sabari Nathan</div>
              <div className="text-xs text-slate-500 leading-tight mt-0.5">ESG Admin</div>
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-52 rounded-xl border border-white/8 overflow-hidden z-50"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  boxShadow: "var(--shadow-modal)",
                }}
              >
                <div className="px-3 py-3 border-b border-white/6">
                  <div className="text-xs font-600 text-white">Sabari Nathan R</div>
                  <div className="text-xs text-slate-500 mt-0.5">sabari@ecosphere.io</div>
                </div>
                <div className="py-1">
                  {[
                    { label: "Profile", icon: User, href: "/profile" },
                    { label: "Settings", icon: Settings, href: "/settings" },
                    { label: "Help & Support", icon: HelpCircle, href: "#" },
                  ].map((item) => (
                    <Link key={item.label} href={item.href} onClick={() => setProfileOpen(false)}>
                      <motion.div
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        <item.icon className="size-3.5" />
                        {item.label}
                      </motion.div>
                    </Link>
                  ))}
                  <div className="border-t border-white/6 mt-1 pt-1">
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(239,68,68,0.06)" }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="size-3.5" />
                      Sign Out
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

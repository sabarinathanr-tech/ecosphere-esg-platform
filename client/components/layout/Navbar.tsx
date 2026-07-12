"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Search, Settings, ChevronRight, X, AlertTriangle,
  CheckCircle, Info, LogOut, User, HelpCircle, Loader2,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { notificationsApi } from "@/lib/services";
import { toast } from "sonner";

// Breadcrumb generation
function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = seg.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return { label, href };
  });
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case "warning": return <AlertTriangle className="size-4 text-amber-400" />;
    case "success": return <CheckCircle className="size-4 text-emerald-400" />;
    case "error":   return <AlertTriangle className="size-4 text-red-400" />;
    default:        return <Info className="size-4 text-blue-400" />;
  }
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsApi.getAll({ limit: 10 })
      .then(({ data }) => setNotifications(data.data || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const markRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-12 w-96 rounded-xl border border-white/8 overflow-hidden z-50"
      style={{ backgroundColor: "var(--bg-elevated)", boxShadow: "var(--shadow-modal)" }}
    >
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
            <button onClick={markAllRead} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="size-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-4 animate-spin text-slate-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <Bell className="size-8 mb-2 opacity-30" />
            <p className="text-xs">No notifications</p>
          </div>
        ) : notifications.map((n) => (
          <motion.div key={n.id} whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            onClick={() => markRead(n.id)}
            className={cn("flex gap-3 px-4 py-3.5 border-b border-white/4 cursor-pointer transition-colors", !n.read && "bg-white/2")}>
            <div className="mt-0.5 shrink-0"><NotificationIcon type={n.type} /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span className={cn("text-xs font-600", !n.read ? "text-white" : "text-slate-300")}>{n.title}</span>
                {!n.read && <div className="size-1.5 rounded-full bg-emerald-400 shrink-0 mt-1" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
              <span className="text-xs text-slate-600 mt-1 block">
                {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

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

interface NavbarProps { sidebarCollapsed: boolean; }

export function Navbar({ sidebarCollapsed }: NavbarProps) {
  const breadcrumbs = useBreadcrumbs();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    notificationsApi.getAll({ limit: 1 })
      .then(({ data }) => {
        const all: any[] = data.data || [];
        setUnreadCount(all.filter((n: any) => !n.read).length);
      }).catch(() => {});
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out successfully");
      router.replace("/login");
    } catch {
      router.replace("/login");
    }
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

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
            <Link href={crumb.href}
              className={cn("text-xs transition-colors truncate",
                index === breadcrumbs.length - 1 ? "text-slate-200 font-600" : "text-slate-500 hover:text-slate-300"
              )}>
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className={cn("size-9 rounded-lg flex items-center justify-center transition-all duration-150 relative",
              notifOpen ? "bg-white/8 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/6"
            )}>
            <Bell className="size-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-400 ring-2 ring-[var(--bg-base)]" />
            )}
          </button>
          <AnimatePresence>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
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
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/6 transition-all duration-150">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="size-7 rounded-full object-cover ring-1 ring-emerald-500/30" />
            ) : (
              <div className="size-7 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
                <span className="text-xs font-600 text-emerald-400">{initials}</span>
              </div>
            )}
            <div className="hidden sm:block text-left">
              <div className="text-xs font-600 text-slate-200 leading-none">{user?.name || "User"}</div>
              <div className="text-xs text-slate-500 leading-tight mt-0.5">{user?.role || "Employee"}</div>
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 rounded-xl border border-white/8 overflow-hidden z-50"
                style={{ backgroundColor: "var(--bg-elevated)", boxShadow: "var(--shadow-modal)" }}
              >
                <div className="px-3 py-3 border-b border-white/6">
                  <div className="text-xs font-600 text-white">{user?.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{user?.email}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-emerald-400 font-600">Lv.{user?.level}</span>
                    <span className="text-xs text-slate-600">{user?.totalXp?.toLocaleString()} XP</span>
                    <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full">{user?.role}</span>
                  </div>
                </div>
                <div className="py-1">
                  {[
                    { label: "My Profile", icon: User, href: "/profile" },
                    { label: "Settings", icon: Settings, href: "/settings" },
                    { label: "Help & Support", icon: HelpCircle, href: "#" },
                  ].map((item) => (
                    <Link key={item.label} href={item.href} onClick={() => setProfileOpen(false)}>
                      <motion.div whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                        <item.icon className="size-3.5" />
                        {item.label}
                      </motion.div>
                    </Link>
                  ))}
                  <div className="border-t border-white/6 mt-1 pt-1">
                    <motion.button whileHover={{ backgroundColor: "rgba(239,68,68,0.06)" }}
                      onClick={handleLogout} disabled={loggingOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
                      {loggingOut ? <Loader2 className="size-3.5 animate-spin" /> : <LogOut className="size-3.5" />}
                      {loggingOut ? "Signing out..." : "Sign Out"}
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

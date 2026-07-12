"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Leaf, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, COMPANY_NAME, type NavItem } from "@/lib/constants";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function NavGroup({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isChildActive = item.children?.some((child) =>
    pathname.startsWith(child.href)
  );
  const [open, setOpen] = useState(isChildActive ?? false);

  const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : isChildActive;

  if (!item.children) {
    return (
      <Link href={item.href!}>
        <motion.div
          whileHover={{ x: 2 }}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 group relative",
            isActive
              ? "bg-emerald-500/10 text-emerald-400"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          )}
        >
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-400 rounded-full"
            />
          )}
          <item.icon
            className={cn(
              "shrink-0 transition-colors",
              collapsed ? "size-5" : "size-4.5",
              isActive ? "text-emerald-400" : `group-hover:${item.color}`
            )}
          />
          {!collapsed && (
            <span className="text-sm font-medium truncate">{item.label}</span>
          )}
          {item.badge && !collapsed && (
            <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">
              {item.badge}
            </span>
          )}
        </motion.div>
      </Link>
    );
  }

  return (
    <div>
      <motion.button
        whileHover={{ x: 2 }}
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 group relative",
          isActive
            ? "text-white"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        )}
      >
        {isActive && (
          <div
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full",
              item.color.replace("text-", "bg-")
            )}
          />
        )}
        <item.icon
          className={cn(
            "shrink-0 transition-colors size-4.5",
            isActive ? item.color : `group-hover:${item.color}`
          )}
        />
        {!collapsed && (
          <>
            <span className="text-sm font-medium flex-1 text-left truncate">
              {item.label}
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-200 shrink-0",
                open ? "rotate-180" : ""
              )}
            />
          </>
        )}
      </motion.button>

      {!collapsed && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="ml-3.5 mt-0.5 border-l border-white/8 pl-3 space-y-0.5 py-1">
                {item.children?.map((child) => {
                  const childActive =
                    pathname === child.href ||
                    pathname.startsWith(child.href + "/");
                  return (
                    <Link key={child.href} href={child.href}>
                      <motion.div
                        whileHover={{ x: 2 }}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150 group",
                          childActive
                            ? "bg-white/6 text-white"
                            : "text-slate-500 hover:text-slate-300 hover:bg-white/4"
                        )}
                      >
                        <child.icon
                          className={cn(
                            "size-3.5 shrink-0 transition-colors",
                            childActive ? item.color : `group-hover:${item.color}`
                          )}
                        />
                        <span className="truncate">{child.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <motion.aside
      animate={{
        width: collapsed ? 72 : 256,
      }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--bg-sidebar)" }}
    >
      {/* Border right */}
      <div
        className="absolute right-0 top-0 bottom-0 w-px"
        style={{ background: "var(--border-subtle)" }}
      />

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0 border-b border-white/6">
        <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/30">
          <Leaf className="size-4.5 text-emerald-400" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col">
                <span className="text-sm font-700 text-white leading-none">
                  {COMPANY_NAME}
                </span>
                <span className="text-xs text-slate-500 leading-tight mt-0.5">
                  ESG Platform
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="ml-auto size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-150 shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4 rotate-90" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-0.5 scrollbar-thin">
        {NAV_ITEMS.map((item) => (
          <NavGroup key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/6 shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/4">
            <div className="size-7 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-600 text-emerald-400">SR</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-600 text-slate-200 truncate">
                Sabari Nathan R
              </span>
              <span className="text-xs text-slate-500 truncate">
                ESG Admin
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="size-8 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
              <span className="text-xs font-600 text-emerald-400">SR</span>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

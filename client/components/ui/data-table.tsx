"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { TableSkeleton } from "./skeleton";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Column<T = Record<string, any>> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableProps<T extends Record<string, any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pagination?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  emptyDescription?: string;
  actions?: React.ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
}

type SortDirection = "asc" | "desc" | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys,
  pagination = true,
  pageSize: initialPageSize = 10,
  emptyMessage = "No results found",
  emptyDescription = "Try adjusting your search or filters",
  actions,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc");
      if (sortDirection === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) => {
      const keys = searchKeys || (Object.keys(row) as (keyof T)[]);
      return keys.some((key) => {
        const value = row[key];
        return String(value).toLowerCase().includes(q);
      });
    });
  }, [data, search, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="size-3 text-slate-600" />;
    if (sortDirection === "asc") return <ChevronUp className="size-3 text-emerald-400" />;
    return <ChevronDown className="size-3 text-emerald-400" />;
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Toolbar */}
      {(searchable || actions) && (
        <div className="flex items-center gap-3 mb-4">
          {searchable && (
            <div className="flex-1 max-w-xs">
              <Input
                icon={<Search className="size-3.5" />}
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {actions}
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-xl border border-white/6 overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        {loading ? (
          <TableSkeleton rows={5} cols={columns.length} />
        ) : paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="size-12 rounded-full bg-white/4 flex items-center justify-center mb-3">
              <Search className="size-5 text-slate-600" />
            </div>
            <p className="text-sm font-600 text-slate-300">{emptyMessage}</p>
            <p className="text-xs text-slate-600 mt-1">{emptyDescription}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className={cn(
                        "text-left px-4 py-3 text-xs font-600 text-slate-500 uppercase tracking-wider whitespace-nowrap",
                        col.sortable && "cursor-pointer hover:text-slate-300 transition-colors",
                        col.className
                      )}
                      style={{ width: col.width }}
                      onClick={() => handleSort(String(col.key), col.sortable)}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.label}
                        {col.sortable && <SortIcon colKey={String(col.key)} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-white/4 last:border-0 transition-colors duration-100",
                      onRowClick && "cursor-pointer hover:bg-white/3",
                      !onRowClick && "hover:bg-white/2"
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={cn("px-4 py-3.5 text-sm text-slate-300 whitespace-nowrap", col.className)}
                      >
                        {col.render
                          ? col.render(row[String(col.key) as keyof T], row, rowIndex)
                          : String(row[String(col.key) as keyof T] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && !loading && sortedData.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-16 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedData.length)} of{" "}
              {sortedData.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

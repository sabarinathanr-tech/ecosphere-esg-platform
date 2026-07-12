import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  circle?: boolean;
}

export function Skeleton({ className, rows, circle, ...props }: SkeletonProps) {
  if (rows) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-md skeleton",
              i === rows - 1 ? "w-2/3 h-3" : "w-full h-3"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "skeleton",
        circle ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-base p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-1.5 w-full rounded-full" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-0">
      <div className="grid gap-3 px-4 py-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-20" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-3 px-4 py-4 border-t border-white/4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn("h-3", colIndex === 0 ? "w-32" : "w-20")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="skeleton rounded-xl"
      style={{ height }}
    />
  );
}

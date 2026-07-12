import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "environment" | "social" | "governance" | "gamification" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
}

const progressColors = {
  default: "bg-emerald-500",
  environment: "bg-emerald-500",
  social: "bg-sky-500",
  governance: "bg-purple-500",
  gamification: "bg-orange-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = "default", size = "md", showLabel, label, ...props }, ref) => {
  const colorClass = progressColors[variant];

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showLabel && (
            <span className="text-xs font-600 text-slate-300 ml-auto">
              {value?.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full bg-white/6",
          size === "sm" && "h-1",
          size === "md" && "h-1.5",
          size === "lg" && "h-2.5",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 rounded-full transition-all duration-500 ease-out",
            colorClass
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

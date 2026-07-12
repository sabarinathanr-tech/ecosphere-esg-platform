import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        secondary: "border-white/10 bg-white/6 text-slate-300",
        destructive: "border-red-500/20 bg-red-500/10 text-red-400",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-400",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        environment: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        social: "border-sky-500/20 bg-sky-500/10 text-sky-400",
        governance: "border-purple-500/20 bg-purple-500/10 text-purple-400",
        gamification: "border-orange-500/20 bg-orange-500/10 text-orange-400",
        reports: "border-slate-500/20 bg-slate-500/10 text-slate-400",
        outline: "border-white/10 bg-transparent text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            variant === "destructive" && "bg-red-400",
            variant === "warning" && "bg-amber-400",
            variant === "info" && "bg-blue-400",
            (variant === "default" || variant === "success" || variant === "environment") && "bg-emerald-400",
            variant === "social" && "bg-sky-400",
            variant === "governance" && "bg-purple-400",
            variant === "gamification" && "bg-orange-400",
            variant === "secondary" && "bg-slate-400",
          )}
        />
      )}
      {children}
    </span>
  );
}

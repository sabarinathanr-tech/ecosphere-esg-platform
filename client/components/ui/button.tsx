import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "default" | "lg" | "icon";
  loading?: boolean;
}

const buttonVariants: Record<string, string> = {
  default: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm border border-emerald-500/30",
  secondary: "bg-white/6 text-slate-200 hover:bg-white/10 border border-white/8",
  outline: "bg-transparent border border-white/12 text-slate-300 hover:bg-white/6 hover:text-white",
  ghost: "bg-transparent text-slate-400 hover:bg-white/6 hover:text-white border-transparent",
  destructive: "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30",
  link: "bg-transparent text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline border-transparent p-0 h-auto",
};

const sizeVariants: Record<string, string> = {
  sm: "h-7 px-3 text-xs rounded-lg gap-1.5",
  default: "h-9 px-4 text-sm rounded-lg gap-2",
  lg: "h-10 px-5 text-sm rounded-lg gap-2.5",
  icon: "h-9 w-9 rounded-lg p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
          buttonVariants[variant] || buttonVariants.default,
          sizeVariants[size] || sizeVariants.default,
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin size-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

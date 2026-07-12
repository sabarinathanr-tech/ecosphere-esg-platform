import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, suffix, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-lg border border-white/8 bg-white/4 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 transition-all duration-150",
            "focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30",
            "hover:border-white/12 hover:bg-white/6",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            error && "border-red-500/30 focus:ring-red-500/50",
            icon && "pl-9",
            suffix && "pr-9",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {suffix}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "flex min-h-24 w-full rounded-lg border border-white/8 bg-white/4 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 transition-all duration-150 resize-none",
            "focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30",
            "hover:border-white/12",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

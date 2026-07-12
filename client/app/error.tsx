"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#0B0F17" }}>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full text-center"
      >
        {/* Icon */}
        <div className="size-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/10">
          <AlertTriangle className="size-9 text-red-400" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-700 text-white mb-2">Something went wrong</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-2">
          An unexpected error occurred while loading this page.
        </p>
        {error?.digest && (
          <p className="text-xs text-slate-600 mb-6 font-mono bg-white/4 rounded-lg px-3 py-2 border border-white/8">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            <RotateCcw className="size-4" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/6 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-600 transition-all"
          >
            <Home className="size-4" />
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

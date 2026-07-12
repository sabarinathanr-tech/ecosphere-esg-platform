import { motion } from "framer-motion";
import { Leaf, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0B0F17" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Leaf className="size-6 text-emerald-400" />
          </div>
          <div className="absolute -inset-1 rounded-2xl border border-emerald-500/20 animate-ping opacity-30" />
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Loading...
        </div>
      </div>
    </div>
  );
}

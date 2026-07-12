import Link from "next/link";
import { Leaf, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#0B0F17" }}>
      <div className="max-w-md w-full text-center">
        {/* Big 404 */}
        <div className="text-8xl font-700 text-white/5 select-none mb-2">404</div>

        {/* Icon */}
        <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto -mt-8 mb-6 shadow-lg shadow-emerald-500/10">
          <Leaf className="size-8 text-emerald-400" />
        </div>

        <h1 className="text-2xl font-700 text-white mb-2">Page Not Found</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The ESG page you&apos;re looking for doesn&apos;t exist or has been moved.<br />
          Navigate back to continue your sustainability journey.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Home className="size-4" />
            Go to Dashboard
          </Link>
          <Link
            href="javascript:history.back()"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/6 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-600 transition-all"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}

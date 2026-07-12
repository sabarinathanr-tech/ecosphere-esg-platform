"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@ecosphere.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back to EcoSphere!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Invalid credentials";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { label: "Admin", email: "admin@ecosphere.com", password: "Admin@123", color: "text-emerald-400" },
    { label: "Manager", email: "sarah.chen@ecosphere.com", password: "User@123", color: "text-sky-400" },
    { label: "Employee", email: "aisha.j@ecosphere.com", password: "User@123", color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12"
        style={{ background: "linear-gradient(135deg, #0d1f1a 0%, #0a1628 50%, #0d1f1a 100%)" }}>
        {/* Animated BG */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{
                width: `${120 + i * 80}px`, height: `${120 + i * 80}px`,
                left: `${10 + i * 15}%`, top: `${5 + i * 14}%`,
                background: i % 2 === 0 ? "rgba(16,185,129,0.06)" : "rgba(56,189,248,0.04)",
                border: "1px solid rgba(16,185,129,0.08)",
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="size-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Leaf className="size-5 text-emerald-400" />
            </div>
            <span className="text-white font-700 text-xl tracking-tight">EcoSphere ESG</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl font-700 text-white leading-tight mb-4">
              Enterprise ESG<br />
              <span className="text-emerald-400">Management Platform</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Track environmental impact, manage social initiatives, and ensure governance compliance — all in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: "🌱", title: "Environmental", desc: "Carbon tracking, emission factors, sustainability goals" },
              { icon: "👥", title: "Social", desc: "CSR activities, training, diversity & inclusion" },
              { icon: "🛡️", title: "Governance", desc: "Policies, audits, compliance issue management" },
              { icon: "🏆", title: "Gamification", desc: "Challenges, badges, leaderboard & rewards" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/6"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-600 text-white">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-600">
          © 2026 EcoSphere ESG Platform · Built for Odoo Hackathon 2026
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="size-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Leaf className="size-4 text-emerald-400" />
            </div>
            <span className="text-white font-700">EcoSphere ESG</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-700 text-white mb-1">Sign in to your account</h2>
            <p className="text-slate-400 text-sm">Welcome back. Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-600 text-slate-400 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@ecosphere.com" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--border-default)",
                    fontFamily: "var(--font-geist-sans)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(16,185,129,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-600 text-slate-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--border-default)",
                    fontFamily: "var(--font-geist-sans)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(16,185,129,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-600 text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: isLoading ? "rgba(16,185,129,0.6)" : "rgba(16,185,129,0.9)", border: "1px solid rgba(16,185,129,0.4)" }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = "rgba(16,185,129,1)"; }}
              onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = "rgba(16,185,129,0.9)"; }}>
              {isLoading ? (
                <><Loader2 className="size-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="size-4" /></>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
              <span className="text-xs text-slate-600">Demo Accounts</span>
              <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => (
                <button key={acc.label} onClick={() => { setEmail(acc.email); setPassword(acc.password); }}
                  className="p-2.5 rounded-lg text-center transition-all hover:scale-105"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                  <p className={`text-xs font-700 ${acc.color}`}>{acc.label}</p>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">{acc.email.split("@")[0]}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-600 text-center mt-3">
              Click any demo account to auto-fill credentials
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

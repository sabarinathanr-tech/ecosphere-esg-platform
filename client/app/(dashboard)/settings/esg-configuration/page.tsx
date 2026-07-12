"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Save, RotateCcw, CheckCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Toggle = ({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
  <button onClick={onChange} disabled={disabled}
    className={cn("relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none", checked ? "bg-emerald-500" : "bg-white/10", disabled && "opacity-40 cursor-not-allowed")}>
    <span className={cn("inline-block size-4 rounded-full bg-white shadow-sm transition-transform mt-0.5", checked ? "translate-x-4" : "translate-x-0.5")} />
  </button>
);

export default function ESGConfigPage() {
  const [cfg, setCfg] = useState({
    orgName: "EcoSphere Technologies Pvt Ltd", reportingYear: "FY 2025-26", currency: "INR", baseline: "2022-23",
    ghgProtocol: "GHG Protocol Corporate Standard", brsr: true, gri: true, sdgMapping: true,
    autoCalc: true, multiSite: false, supplyChain: false, aiInsights: true, dataValidation: true,
    decimalPrecision: "2", weightUnit: "kg", energyUnit: "kWh", emissionsUnit: "tCO₂e",
    targetNetZero: "2030", renewableTarget: "100", waterTarget: "30",
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: string) => setCfg(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  const update = (key: string, val: string) => setCfg(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    toast.success("ESG configuration saved successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) => (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle>{desc && <CardDescription>{desc}</CardDescription>}</CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  const ToggleRow = ({ label, desc, field, disabled }: { label: string; desc?: string; field: string; disabled?: boolean }) => (
    <div className="flex items-center justify-between py-1">
      <div><p className="text-sm font-600 text-slate-200">{label}</p>{desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}</div>
      <Toggle checked={!!cfg[field as keyof typeof cfg]} onChange={() => toggle(field)} disabled={disabled} />
    </div>
  );

  const FieldRow = ({ label, field, type = "text", placeholder }: { label: string; field: string; type?: string; placeholder?: string }) => (
    <div className="flex items-center justify-between">
      <label className="text-sm font-600 text-slate-300 w-48 shrink-0">{label}</label>
      <Input className="max-w-48 h-8 text-xs" type={type} value={String(cfg[field as keyof typeof cfg])} onChange={e => update(field, e.target.value)} placeholder={placeholder} />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-700 text-white flex items-center gap-2"><Wrench className="size-5 text-slate-400" />ESG Configuration</h1>
          <p className="text-sm text-slate-500 mt-0.5">Platform-wide ESG settings, standards and reporting preferences</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Settings reset to defaults")}><RotateCcw className="size-3.5" />Reset</Button>
          <Button size="sm" onClick={handleSave} className={saved ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
            {saved ? <><CheckCircle className="size-3.5" />Saved!</> : <><Save className="size-3.5" />Save Changes</>}
          </Button>
        </div>
      </div>

      <Section title="Organization Details" desc="Basic information about your organization">
        <FieldRow label="Organization Name" field="orgName" />
        <FieldRow label="Reporting Year" field="reportingYear" placeholder="FY 2025-26" />
        <FieldRow label="Baseline Year" field="baseline" placeholder="e.g., 2022-23" />
        <div className="flex items-center justify-between">
          <label className="text-sm font-600 text-slate-300 w-48 shrink-0">Currency</label>
          <Select value={cfg.currency} onValueChange={v => update("currency", v)}>
            <SelectTrigger className="max-w-48 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="INR">INR (₹)</SelectItem><SelectItem value="USD">USD ($)</SelectItem><SelectItem value="EUR">EUR (€)</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-600 text-slate-300 w-48 shrink-0">GHG Protocol</label>
          <Select value={cfg.ghgProtocol} onValueChange={v => update("ghgProtocol", v)}>
            <SelectTrigger className="max-w-48 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="GHG Protocol Corporate Standard">GHG Protocol Corporate</SelectItem>
              <SelectItem value="ISO 14064">ISO 14064</SelectItem>
              <SelectItem value="IPCC AR6">IPCC AR6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="Reporting Standards" desc="Enable compliance frameworks for your ESG reports">
        <ToggleRow label="BRSR Reporting (India)" desc="Business Responsibility & Sustainability Reporting" field="brsr" />
        <ToggleRow label="GRI Standards" desc="Global Reporting Initiative disclosure standards" field="gri" />
        <ToggleRow label="SDG Mapping" desc="Map activities to UN Sustainable Development Goals" field="sdgMapping" />
      </Section>

      <Section title="Platform Features" desc="Toggle advanced platform capabilities">
        <ToggleRow label="Auto Carbon Calculation" desc="Automatically compute emissions from logged activities" field="autoCalc" />
        <ToggleRow label="Multi-Site Management" desc="Track emissions across multiple facilities" field="multiSite" />
        <ToggleRow label="Supply Chain Tracking" desc="Monitor Scope 3 value chain emissions" field="supplyChain" />
        <ToggleRow label="AI-Powered Insights" desc="Enable AI recommendations for ESG improvement" field="aiInsights" />
        <ToggleRow label="Data Validation Rules" desc="Apply validation on all emission data entries" field="dataValidation" />
      </Section>

      <Section title="Units & Precision">
        <div className="grid grid-cols-2 gap-4">
          {[
            { l: "Emissions Unit", f: "emissionsUnit", opts: ["tCO₂e", "kgCO₂e", "MtCO₂e"] },
            { l: "Energy Unit", f: "energyUnit", opts: ["kWh", "MWh", "GJ", "TJ"] },
            { l: "Weight Unit", f: "weightUnit", opts: ["kg", "tonne", "lb"] },
            { l: "Decimal Precision", f: "decimalPrecision", opts: ["0", "1", "2", "3"] },
          ].map(s => (
            <div key={s.f}><label className="text-xs font-600 text-slate-400 mb-1.5 block">{s.l}</label>
              <Select value={String(cfg[s.f as keyof typeof cfg])} onValueChange={v => update(s.f, v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{s.opts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sustainability Targets" desc="Long-term goals used as benchmarks across the platform">
        <FieldRow label="Net Zero Target Year" field="targetNetZero" placeholder="e.g., 2030" />
        <FieldRow label="Renewable Energy Target (%)" field="renewableTarget" placeholder="e.g., 100" />
        <FieldRow label="Water Reduction Target (%)" field="waterTarget" placeholder="vs baseline year" />
      </Section>
    </motion.div>
  );
}

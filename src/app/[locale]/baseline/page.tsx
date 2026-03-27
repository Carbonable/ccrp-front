"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import biomassDataRaw from "./biomassData.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BiomassData {
  [key: string]: number | null;
}

const biomassData = biomassDataRaw as BiomassData;

interface FormData {
  // Baseline section
  country: string;
  hectares: number;
  treeCrownCoverBaseline: number;
  shrubCrownCoverBaseline: number;
  shrubAreaBaseline: number;
  // Project section
  treeCrownCoverProject: number;
  shrubCrownCoverProject: number;
  shrubAreaProject: number;
  // Advanced coefficients
  treeRootShootRatio: number;
  shrubRootShootRatio: number;
  shrubBiomassRatio: number;
}

interface StepConfig {
  id: number;
  section: "baseline" | "project" | "advanced";
  sectionLabel: string;
  field: keyof FormData;
  title: string;
  subtitle: string;
  type: "country" | "number" | "ratio" | "info";
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  quickPicks?: { value: number; label: string }[];
  infoText?: string;
  default?: number;
}

// ─── Steps Configuration ──────────────────────────────────────────────────────

const STEPS: StepConfig[] = [
  {
    id: 1,
    section: "baseline",
    sectionLabel: "Baseline Data",
    field: "country",
    title: "In which country is your project located?",
    subtitle: "This determines the above-ground biomass (AGB) for your region using IPCC data.",
    type: "country",
  },
  {
    id: 2,
    section: "baseline",
    sectionLabel: "Baseline Data",
    field: "hectares",
    title: "Number of hectares of the project area",
    subtitle: "Total project area in hectares.",
    type: "number",
    unit: "ha",
    min: 0,
    step: 1,
  },
  {
    id: 3,
    section: "baseline",
    sectionLabel: "Baseline — Before Restoration",
    field: "treeCrownCoverBaseline" as keyof FormData,
    title: "Let's estimate the carbon stock before your restoration project",
    subtitle: "If you don't have data, we'll set values to 0.",
    type: "info",
    infoText: "The next questions will help calculate the carbon stock of the area before restoration (baseline scenario). This establishes what would happen without intervention.",
  },
  {
    id: 4,
    section: "baseline",
    sectionLabel: "Baseline — Before Restoration",
    field: "treeCrownCoverBaseline",
    title: "Tree crown cover at the baseline",
    subtitle: "Proportion of ground shaded by tree canopy viewed from above.",
    type: "ratio",
    unit: "ratio",
    min: 0,
    max: 1,
    step: 0.01,
    quickPicks: [
      { value: 0.1, label: "10% — sparse" },
      { value: 0.3, label: "30% — open" },
      { value: 0.5, label: "50% — moderate" },
      { value: 0.7, label: "70% — dense" },
    ],
  },
  {
    id: 5,
    section: "baseline",
    sectionLabel: "Baseline — Before Restoration",
    field: "shrubCrownCoverBaseline",
    title: "Shrub crown cover at the baseline",
    subtitle: "Proportion of ground shaded by shrub canopy viewed from above.",
    type: "ratio",
    unit: "ratio",
    min: 0,
    max: 1,
    step: 0.01,
    quickPicks: [
      { value: 0.05, label: "5%" },
      { value: 0.1, label: "10%" },
      { value: 0.2, label: "20%" },
      { value: 0.3, label: "30%" },
    ],
  },
  {
    id: 6,
    section: "baseline",
    sectionLabel: "Baseline — Before Restoration",
    field: "shrubAreaBaseline",
    title: "Area occupied by shrub biomass at the baseline",
    subtitle: "Hectares covered by shrubs in the project area.",
    type: "number",
    unit: "ha",
    min: 0,
    step: 0.1,
  },
  {
    id: 7,
    section: "project",
    sectionLabel: "Project — After Restoration",
    field: "treeCrownCoverProject" as keyof FormData,
    title: "Now let's estimate the carbon stock after your restoration project",
    subtitle: "These values represent the expected state after project implementation.",
    type: "info",
    infoText: "This calculates the expected carbon sequestration from your restoration activities. The difference between project and baseline is your net CO₂ benefit.",
  },
  {
    id: 8,
    section: "project",
    sectionLabel: "Project — After Restoration",
    field: "treeCrownCoverProject",
    title: "Expected tree crown cover after restoration",
    subtitle: "Target proportion of ground shaded by tree canopy.",
    type: "ratio",
    unit: "ratio",
    min: 0,
    max: 1,
    step: 0.01,
    quickPicks: [
      { value: 0.5, label: "50% — moderate" },
      { value: 0.7, label: "70% — good" },
      { value: 0.8, label: "80% — dense" },
      { value: 0.9, label: "90% — very dense" },
    ],
  },
  {
    id: 9,
    section: "project",
    sectionLabel: "Project — After Restoration",
    field: "shrubCrownCoverProject",
    title: "Expected shrub crown cover after restoration",
    subtitle: "Target proportion of ground shaded by shrub canopy.",
    type: "ratio",
    unit: "ratio",
    min: 0,
    max: 1,
    step: 0.01,
    quickPicks: [
      { value: 0.1, label: "10%" },
      { value: 0.2, label: "20%" },
      { value: 0.3, label: "30%" },
      { value: 0.5, label: "50%" },
    ],
  },
  {
    id: 10,
    section: "project",
    sectionLabel: "Project — After Restoration",
    field: "shrubAreaProject",
    title: "Expected area occupied by shrub biomass",
    subtitle: "Hectares expected to be covered by shrubs after restoration.",
    type: "number",
    unit: "ha",
    min: 0,
    step: 0.1,
  },
  {
    id: 11,
    section: "advanced",
    sectionLabel: "Advanced Coefficients",
    field: "treeRootShootRatio",
    title: "Tree root-to-shoot ratio",
    subtitle: "Default IPCC value is 0.25. Adjust if you have site-specific data.",
    type: "number",
    unit: "",
    min: 0,
    max: 2,
    step: 0.01,
    default: 0.25,
    quickPicks: [
      { value: 0.2, label: "0.20 — tropical" },
      { value: 0.25, label: "0.25 — IPCC default" },
      { value: 0.3, label: "0.30 — temperate" },
    ],
  },
  {
    id: 12,
    section: "advanced",
    sectionLabel: "Advanced Coefficients",
    field: "shrubRootShootRatio",
    title: "Shrub root-to-shoot ratio",
    subtitle: "Default IPCC value is 0.40. Adjust if you have site-specific data.",
    type: "number",
    unit: "",
    min: 0,
    max: 2,
    step: 0.01,
    default: 0.40,
    quickPicks: [
      { value: 0.3, label: "0.30" },
      { value: 0.4, label: "0.40 — IPCC default" },
      { value: 0.5, label: "0.50" },
    ],
  },
  {
    id: 13,
    section: "advanced",
    sectionLabel: "Advanced Coefficients",
    field: "shrubBiomassRatio",
    title: "Shrub biomass density ratio (BDRSF)",
    subtitle: "Default value is 0.10. This ratio adjusts shrub biomass relative to forest.",
    type: "number",
    unit: "",
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.10,
    quickPicks: [
      { value: 0.05, label: "0.05 — sparse" },
      { value: 0.1, label: "0.10 — default" },
      { value: 0.15, label: "0.15 — dense" },
    ],
  },
];

const INPUT_STEPS = STEPS.filter((s) => s.type !== "info");
const TOTAL_INPUT_STEPS = INPUT_STEPS.length;

// ─── Constants (IPCC Tier 1) ──────────────────────────────────────────────────

const CF_TREE = 0.47; // Carbon fraction for tree biomass
const CF_SHRUB = 0.47; // Carbon fraction for shrub biomass
const CO2_C_RATIO = 44 / 12; // Molecular ratio CO₂/C

function calculateBaseline(data: FormData): {
  ctreeBaseline: number;
  cshrubBaseline: number;
  ctreeProject: number;
  cshrubProject: number;
  netCO2: number;
} {
  const bFOREST = biomassData[data.country] ?? 0;

  const ctreeBaseline =
    CO2_C_RATIO *
    CF_TREE *
    bFOREST *
    (1 + data.treeRootShootRatio) *
    data.treeCrownCoverBaseline *
    data.hectares;

  const cshrubBaseline =
    CO2_C_RATIO *
    CF_SHRUB *
    (1 + data.shrubRootShootRatio) *
    data.shrubAreaBaseline *
    data.shrubBiomassRatio *
    bFOREST *
    data.shrubCrownCoverBaseline;

  const ctreeProject =
    CO2_C_RATIO *
    CF_TREE *
    bFOREST *
    (1 + data.treeRootShootRatio) *
    data.treeCrownCoverProject *
    data.hectares;

  const cshrubProject =
    CO2_C_RATIO *
    CF_SHRUB *
    (1 + data.shrubRootShootRatio) *
    data.shrubAreaProject *
    data.shrubBiomassRatio *
    bFOREST *
    data.shrubCrownCoverProject;

  const netCO2 = ctreeProject + cshrubProject - ctreeBaseline - cshrubBaseline;

  return { ctreeBaseline, cshrubBaseline, ctreeProject, cshrubProject, netCO2 };
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-neutral-800">
      <div
        className="h-full bg-greenish-500 transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Section Badge ────────────────────────────────────────────────────────────

function SectionBadge({ section, label }: { section: string; label: string }) {
  const colors: Record<string, string> = {
    baseline: "bg-greenish-900/60 text-greenish-400 border-greenish-700/30",
    project: "bg-primary/10 text-primary border-primary/20",
    advanced: "bg-neutral-700/50 text-neutral-300 border-neutral-600/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase ${colors[section] || colors.baseline}`}
    >
      {section === "baseline" && (
        <span className="h-1.5 w-1.5 rounded-full bg-greenish-500" />
      )}
      {section === "project" && (
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      )}
      {section === "advanced" && (
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
      )}
      {label}
    </span>
  );
}

// ─── Step Counter ─────────────────────────────────────────────────────────────

function StepCounter({ current, total }: { current: number; total: number }) {
  return (
    <p className="text-sm font-medium text-neutral-500 mb-4 tabular-nums">
      <span className="text-greenish-500">{current}</span>
      <span className="mx-1">/</span>
      {total}
    </p>
  );
}

// ─── Step Wrapper ─────────────────────────────────────────────────────────────

function StepWrapper({
  children,
  visible,
  direction,
}: {
  children: React.ReactNode;
  visible: boolean;
  direction: "forward" | "back";
}) {
  return (
    <div
      className="transition-all duration-400 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0)"
          : direction === "forward"
            ? "translateY(32px)"
            : "translateY(-32px)",
        pointerEvents: visible ? "auto" : "none",
        position: visible ? "relative" : "absolute",
      }}
    >
      {children}
    </div>
  );
}

// ─── Continue Button ──────────────────────────────────────────────────────────

function ActionButton({
  onClick,
  disabled,
  label = "Continue",
  variant = "primary",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  variant?: "primary" | "secondary";
}) {
  if (variant === "secondary") {
    return (
      <button
        onClick={onClick}
        className="px-6 py-3 rounded-xl font-semibold border border-neutral-600 text-neutral-300 hover:border-neutral-400 hover:text-white transition-all duration-200 cursor-pointer"
      >
        {label}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 flex items-center gap-2
        ${
          disabled
            ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
            : "bg-greenish-500 hover:bg-greenish-400 text-neutral-900 cursor-pointer shadow-lg shadow-greenish-500/20 hover:shadow-greenish-400/30 hover:scale-[1.02] active:scale-95"
        }
      `}
    >
      {label}
      {!disabled && <span className="text-xs opacity-60">↵</span>}
    </button>
  );
}

// ─── Country Search Select ────────────────────────────────────────────────────

function CountrySelect({
  value,
  onChange,
  onConfirm,
}: {
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const countries = useMemo(() => {
    return Object.entries(biomassData)
      .filter(([, v]) => v !== null)
      .map(([name, agb]) => ({ name, agb: agb as number }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return countries;
    const q = search.toLowerCase();
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [search, countries]);

  const handleSelect = (name: string) => {
    onChange(name);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-2">
        <input
          ref={inputRef}
          type="text"
          value={value || search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (value) onChange("");
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value) onConfirm();
            if (e.key === "Enter" && filtered.length === 1) {
              handleSelect(filtered[0].name);
            }
          }}
          placeholder="Search country..."
          className="bg-transparent border-0 border-b-2 border-neutral-600 focus:border-greenish-500 outline-none text-white text-2xl md:text-3xl font-bold w-full pb-2 placeholder-neutral-700 transition-colors duration-200"
        />
      </div>

      {value && (
        <div className="flex items-center gap-2 mt-3 mb-4">
          <span className="inline-flex items-center gap-2 bg-greenish-900/40 border border-greenish-700/30 rounded-full px-4 py-1.5">
            <span className="text-greenish-400 text-sm font-medium">{value}</span>
            <span className="text-neutral-500 text-xs">AGB: {biomassData[value]} tDM/ha</span>
          </span>
          <button
            onClick={() => { onChange(""); setIsOpen(true); inputRef.current?.focus(); }}
            className="text-neutral-500 hover:text-neutral-300 text-sm cursor-pointer"
          >
            change
          </button>
        </div>
      )}

      {isOpen && !value && (
        <div
          ref={listRef}
          className="absolute z-40 w-full max-h-64 overflow-y-auto mt-1 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-neutral-500 text-sm">No results</div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.name}
                onClick={() => handleSelect(c.name)}
                className="w-full text-left px-4 py-2.5 hover:bg-neutral-700/60 flex justify-between items-center transition-colors duration-100 cursor-pointer"
              >
                <span className="text-white text-sm">{c.name}</span>
                <span className="text-neutral-500 text-xs tabular-nums">{c.agb} tDM/ha</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Number Input ─────────────────────────────────────────────────────────────

function NumberInput({
  value,
  onChange,
  onConfirm,
  unit,
  step: inputStep = 1,
  min,
  max,
  quickPicks,
}: {
  value: number;
  onChange: (v: number) => void;
  onConfirm: () => void;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  quickPicks?: { value: number; label: string }[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validate = (v: number): boolean => {
    if (max !== undefined && v > max) {
      setError(`Value must be ≤ ${max}`);
      return false;
    }
    if (min !== undefined && v < min) {
      setError(`Value must be ≥ ${min}`);
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (v: number) => {
    onChange(v);
    validate(v);
  };

  const handleConfirm = () => {
    if (validate(value)) onConfirm();
  };

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-4">
        <input
          ref={inputRef}
          type="number"
          min={min}
          max={max}
          step={inputStep}
          value={value || ""}
          onChange={(e) => handleChange(Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          placeholder="0"
          className="bg-transparent border-0 border-b-2 border-neutral-600 focus:border-greenish-500 outline-none text-white text-4xl md:text-5xl font-bold w-40 pb-2 placeholder-neutral-700 transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && <span className="text-neutral-400 text-lg">{unit}</span>}
      </div>

      {/* Derived info */}
      {unit === "ha" && value > 0 && (
        <p className="text-neutral-600 text-sm mb-3">
          ≈{" "}
          <span className="text-greenish-400 font-medium">
            {(value * 10000).toLocaleString()} m²
          </span>
          {" · "}
          <span className="text-greenish-400 font-medium">
            {(value / 100).toFixed(2)} km²
          </span>
        </p>
      )}

      {/* Quick picks */}
      {quickPicks && quickPicks.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {quickPicks.map((qp) => (
            <button
              key={qp.value}
              onClick={() => handleChange(qp.value)}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  value === qp.value
                    ? "border-greenish-500 bg-greenish-500/20 text-greenish-400"
                    : "border-neutral-600 text-neutral-400 hover:border-neutral-400"
                }`}
            >
              {qp.label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
    </div>
  );
}

// ─── Info Step ─────────────────────────────────────────────────────────────────

function InfoStep({
  title,
  infoText,
  onNext,
}: {
  title: string;
  infoText: string;
  onNext: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNext]);

  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-6 mb-6">
        <p className="text-neutral-300 text-base leading-relaxed">{infoText}</p>
      </div>
    </div>
  );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-neutral-800 last:border-0">
      <span className="text-neutral-400 text-sm">{label}</span>
      <span className={`font-semibold ${highlight ? "text-greenish-400" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Result View ──────────────────────────────────────────────────────────────

function ResultView({
  data,
  onReset,
}: {
  data: FormData;
  onReset: () => void;
}) {
  const result = calculateBaseline(data);
  const bFOREST = biomassData[data.country] ?? 0;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: 2 });

  const isPositive = result.netCO2 > 0;

  return (
    <div className="animate-fade-in">
      {/* Status badge */}
      <div className="inline-flex items-center gap-2 bg-greenish-500/10 border border-greenish-500/30 rounded-full px-4 py-1.5 mb-6">
        <span className="w-2 h-2 rounded-full bg-greenish-500 animate-pulse" />
        <span className="text-greenish-400 text-sm font-medium">
          Baseline calculated
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Net CO₂ Sequestration
      </h2>
      <p className="text-neutral-400 mb-8">
        IPCC Tier-1 · Baseline vs Project scenario
      </p>

      {/* Key metric */}
      <div className={`bg-gradient-to-br ${isPositive ? "from-greenish-500/10" : "from-red-500/10"} to-neutral-900 border ${isPositive ? "border-greenish-500/20" : "border-red-500/20"} rounded-2xl p-6 mb-6`}>
        <p className="text-neutral-400 text-sm mb-1">
          Net Estimated CO₂ {isPositive ? "Sequestration" : "Loss"}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl md:text-6xl font-bold text-white">
            {result.netCO2 >= 1_000_000
              ? `${(result.netCO2 / 1_000_000).toFixed(2)}M`
              : result.netCO2 >= 1000
                ? `${(result.netCO2 / 1000).toFixed(1)}k`
                : fmt(result.netCO2)}
          </span>
          <span className={`font-semibold ${isPositive ? "text-greenish-400" : "text-red-400"}`}>
            tCO₂
          </span>
        </div>
      </div>

      {/* Breakdown: 4 components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral-800/40 rounded-2xl p-5">
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-3">Baseline (before)</p>
          <SummaryRow label="C_TREE baseline" value={`${fmt(result.ctreeBaseline)} tCO₂`} />
          <SummaryRow label="C_SHRUB baseline" value={`${fmt(result.cshrubBaseline)} tCO₂`} />
          <div className="pt-3 border-t border-neutral-700 mt-1">
            <SummaryRow
              label="Total baseline"
              value={`${fmt(result.ctreeBaseline + result.cshrubBaseline)} tCO₂`}
            />
          </div>
        </div>
        <div className="bg-neutral-800/40 rounded-2xl p-5">
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-3">Project (after)</p>
          <SummaryRow label="C_TREE project" value={`${fmt(result.ctreeProject)} tCO₂`} highlight />
          <SummaryRow label="C_SHRUB project" value={`${fmt(result.cshrubProject)} tCO₂`} highlight />
          <div className="pt-3 border-t border-neutral-700 mt-1">
            <SummaryRow
              label="Total project"
              value={`${fmt(result.ctreeProject + result.cshrubProject)} tCO₂`}
              highlight
            />
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-neutral-800/30 rounded-2xl p-5 mb-6">
        <p className="text-neutral-400 text-sm mb-4">
          Formula: (C_TREE_project + C_SHRUB_project) − (C_TREE_baseline + C_SHRUB_baseline)
        </p>
        <div className="font-mono text-sm text-neutral-300 space-y-1">
          <p>
            C_TREE = (44/12) × CF × AGB × (1 + R:S) × Crown × Area
          </p>
          <p>
            C_SHRUB = (44/12) × CF × (1 + R:S) × ShrubArea × BDRSF × AGB × ShrubCrown
          </p>
        </div>
      </div>

      {/* Coefficients */}
      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-6">
        <SummaryRow label="CF (Carbon Fraction)" value={CF_TREE} />
        <SummaryRow label="CO₂/C ratio (44/12)" value={(CO2_C_RATIO).toFixed(4)} />
        <SummaryRow label={`AGB — ${data.country}`} value={`${bFOREST} tDM/ha`} />
        <SummaryRow label="Tree root-shoot ratio" value={data.treeRootShootRatio} />
        <SummaryRow label="Shrub root-shoot ratio" value={data.shrubRootShootRatio} />
        <SummaryRow label="BDRSF (shrub biomass ratio)" value={data.shrubBiomassRatio} />
      </div>

      {/* Inputs summary */}
      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-8">
        <SummaryRow label="Project area" value={`${data.hectares.toLocaleString()} ha`} />
        <SummaryRow
          label="Tree crown — baseline → project"
          value={`${data.treeCrownCoverBaseline} → ${data.treeCrownCoverProject}`}
        />
        <SummaryRow
          label="Shrub crown — baseline → project"
          value={`${data.shrubCrownCoverBaseline} → ${data.shrubCrownCoverProject}`}
        />
        <SummaryRow
          label="Shrub area — baseline → project"
          value={`${data.shrubAreaBaseline} ha → ${data.shrubAreaProject} ha`}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-xl font-semibold border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-all duration-200 cursor-pointer"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

// ─── Review Step ──────────────────────────────────────────────────────────────

function ReviewStep({
  data,
  onCalculate,
  onBack,
}: {
  data: FormData;
  onCalculate: () => void;
  onBack: () => void;
}) {
  const preview = calculateBaseline(data);
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <div>
      <SectionBadge section="advanced" label="Review" />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 mt-4">
        Review your inputs
      </h2>
      <p className="text-neutral-400 mb-8">
        Confirm everything before calculating.
      </p>

      {/* Baseline inputs */}
      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-4">
        <div className="py-2">
          <p className="text-neutral-500 text-xs uppercase tracking-wider">Baseline</p>
        </div>
        <SummaryRow label="Country" value={data.country} />
        <SummaryRow label="Project area" value={`${data.hectares.toLocaleString()} ha`} />
        <SummaryRow label="Tree crown cover" value={`${data.treeCrownCoverBaseline} (${Math.round(data.treeCrownCoverBaseline * 100)}%)`} />
        <SummaryRow label="Shrub crown cover" value={`${data.shrubCrownCoverBaseline} (${Math.round(data.shrubCrownCoverBaseline * 100)}%)`} />
        <SummaryRow label="Shrub area" value={`${data.shrubAreaBaseline} ha`} />
      </div>

      {/* Project inputs */}
      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-4">
        <div className="py-2">
          <p className="text-neutral-500 text-xs uppercase tracking-wider">Project</p>
        </div>
        <SummaryRow label="Tree crown cover" value={`${data.treeCrownCoverProject} (${Math.round(data.treeCrownCoverProject * 100)}%)`} />
        <SummaryRow label="Shrub crown cover" value={`${data.shrubCrownCoverProject} (${Math.round(data.shrubCrownCoverProject * 100)}%)`} />
        <SummaryRow label="Shrub area" value={`${data.shrubAreaProject} ha`} />
      </div>

      {/* Coefficients */}
      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-6">
        <div className="py-2">
          <p className="text-neutral-500 text-xs uppercase tracking-wider">Coefficients</p>
        </div>
        <SummaryRow label="Tree root-shoot" value={data.treeRootShootRatio} />
        <SummaryRow label="Shrub root-shoot" value={data.shrubRootShootRatio} />
        <SummaryRow label="BDRSF" value={data.shrubBiomassRatio} />
      </div>

      {/* Preview */}
      <div className="bg-neutral-800/50 rounded-2xl p-5 mb-8">
        <p className="text-neutral-500 text-sm mb-1">Estimated net CO₂</p>
        <p className="text-3xl font-bold text-greenish-400">{fmt(preview.netCO2)} tCO₂</p>
        <p className="text-neutral-600 text-xs mt-2">
          Project ({fmt(preview.ctreeProject + preview.cshrubProject)}) − Baseline ({fmt(preview.ctreeBaseline + preview.cshrubBaseline)})
        </p>
      </div>

      <div className="flex gap-3">
        <ActionButton onClick={onCalculate} label="Calculate Baseline ✦" />
        <ActionButton onClick={onBack} label="← Back" variant="secondary" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const DEFAULT_FORM: FormData = {
  country: "",
  hectares: 0,
  treeCrownCoverBaseline: 0,
  shrubCrownCoverBaseline: 0,
  shrubAreaBaseline: 0,
  treeCrownCoverProject: 0,
  shrubCrownCoverProject: 0,
  shrubAreaProject: 0,
  treeRootShootRatio: 0.25,
  shrubRootShootRatio: 0.40,
  shrubBiomassRatio: 0.10,
};

export default function BaselinePage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentStep = STEPS[stepIndex];
  const inputStepNumber = useMemo(() => {
    let count = 0;
    for (let i = 0; i <= stepIndex; i++) {
      if (STEPS[i].type !== "info") count++;
    }
    return count;
  }, [stepIndex]);

  const goNext = useCallback(() => {
    if (stepIndex < STEPS.length - 1) {
      setDirection("forward");
      setStepIndex((s) => s + 1);
    } else {
      setShowReview(true);
    }
  }, [stepIndex]);

  const goBack = useCallback(() => {
    if (showReview) {
      setShowReview(false);
      return;
    }
    if (stepIndex > 0) {
      setDirection("back");
      setStepIndex((s) => s - 1);
    }
  }, [stepIndex, showReview]);

  const update = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
    },
    [],
  );

  // Escape to go back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showResult) goBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goBack, showResult]);

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setStepIndex(0);
    setShowResult(false);
    setShowReview(false);
    setDirection("forward");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* Progress */}
      {!showResult && !showReview && (
        <ProgressBar step={inputStepNumber} total={TOTAL_INPUT_STEPS} />
      )}
      {showReview && <ProgressBar step={TOTAL_INPUT_STEPS} total={TOTAL_INPUT_STEPS} />}

      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-neutral-500 text-sm font-medium">
            Baseline Calculator
          </span>
          {!showResult && (
            <button
              onClick={goBack}
              className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors duration-200 flex items-center gap-1 cursor-pointer"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          {showResult ? (
            <ResultView data={form} onReset={handleReset} />
          ) : showReview ? (
            <ReviewStep
              data={form}
              onCalculate={() => setShowResult(true)}
              onBack={goBack}
            />
          ) : (
            STEPS.map((step, i) => (
              <StepWrapper key={step.id} visible={stepIndex === i} direction={direction}>
                <div className="mb-4">
                  <SectionBadge section={step.section} label={step.sectionLabel} />
                  {step.type !== "info" && (
                    <div className="mt-3">
                      <StepCounter current={inputStepNumber} total={TOTAL_INPUT_STEPS} />
                    </div>
                  )}
                </div>

                {step.type === "info" ? (
                  <>
                    <InfoStep
                      title={step.title}
                      infoText={step.infoText!}
                      onNext={goNext}
                    />
                    <ActionButton onClick={goNext} label="Got it, continue" />
                  </>
                ) : step.type === "country" ? (
                  <>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {step.title}
                    </h2>
                    <p className="text-neutral-400 mb-8">{step.subtitle}</p>
                    <CountrySelect
                      value={form.country}
                      onChange={(v) => update("country", v)}
                      onConfirm={goNext}
                    />
                    <div className="mt-6">
                      <ActionButton
                        onClick={goNext}
                        disabled={!form.country}
                        label="Continue"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {step.title}
                    </h2>
                    <p className="text-neutral-400 mb-8">{step.subtitle}</p>
                    <NumberInput
                      value={form[step.field] as number}
                      onChange={(v) => update(step.field, v)}
                      onConfirm={goNext}
                      unit={step.unit}
                      step={step.step}
                      min={step.min}
                      max={step.max}
                      quickPicks={step.quickPicks}
                    />
                    <div className="mt-6">
                      <ActionButton onClick={goNext} label={stepIndex === STEPS.length - 1 ? "Review" : "Continue"} />
                    </div>
                  </>
                )}
              </StepWrapper>
            ))
          )}
        </div>
      </div>

      {/* Keyboard hint */}
      {!showResult && !showReview && currentStep?.type !== "info" && (
        <div className="px-6 py-4 text-center">
          <p className="text-neutral-700 text-xs">
            <kbd className="bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded text-xs">
              Enter
            </kbd>{" "}
            to continue ·{" "}
            <kbd className="bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded text-xs">
              Esc
            </kbd>{" "}
            to go back
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectType =
  | "Restoration"
  | "Conservation"
  | "Reforestation"
  | "DAC"
  | "Biochar";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROJECT_TYPES: { label: ProjectType; icon: string; desc: string }[] = [
  { label: "Restoration", icon: "🌿", desc: "Restoring degraded ecosystems" },
  { label: "Conservation", icon: "🛡️", desc: "Protecting existing carbon stocks" },
  { label: "Reforestation", icon: "🌲", desc: "Planting trees in deforested areas" },
  { label: "DAC", icon: "⚙️", desc: "Direct Air Capture technology" },
  { label: "Biochar", icon: "🔥", desc: "Carbon-rich charcoal from biomass" },
];

// IPCC Tier 1 defaults per project type
const DEFAULTS: Record<ProjectType, { area: number; annualSequestration: number }> = {
  Restoration: { area: 1000, annualSequestration: 5 },
  Conservation: { area: 5000, annualSequestration: 3 },
  Reforestation: { area: 1000, annualSequestration: 7 },
  DAC: { area: 10, annualSequestration: 250 },
  Biochar: { area: 500, annualSequestration: 2.5 },
};

const DURATION = 30; // years

// ─── Result View ──────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-neutral-800">
      <span className="text-neutral-400 text-sm">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

function ResultView({
  projectName,
  projectType,
  onReset,
}: {
  projectName: string;
  projectType: ProjectType;
  onReset: () => void;
}) {
  const defaults = DEFAULTS[projectType];
  const annualTotal = defaults.area * defaults.annualSequestration;
  const total = annualTotal * DURATION;
  const startYear = new Date().getFullYear();

  const years = Array.from({ length: DURATION }, (_, i) => ({
    year: startYear + i,
    cumulative: annualTotal * (i + 1),
  }));
  const maxVal = years[years.length - 1]?.cumulative || 1;

  return (
    <div className="animate-fade-in">
      <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-green-400 text-sm font-medium">Baseline calculated</span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Project Baseline</h2>
      <p className="text-neutral-400 mb-8">{projectName}</p>

      {/* Key Metric */}
      <div className="bg-gradient-to-br from-green-500/10 to-neutral-900 border border-green-500/20 rounded-2xl p-6 mb-6">
        <p className="text-neutral-400 text-sm mb-1">Total Estimated Sequestration</p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl md:text-6xl font-bold text-white">
            {total >= 1000000
              ? `${(total / 1000000).toFixed(2)}M`
              : total >= 1000
                ? `${(total / 1000).toFixed(1)}k`
                : total.toFixed(0)}
          </span>
          <span className="text-green-400 font-semibold">tCO₂</span>
        </div>
        <p className="text-neutral-500 text-sm mt-2">
          Over {DURATION} years · {annualTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} tCO₂/year
        </p>
      </div>

      {/* Chart */}
      <div className="bg-neutral-800/50 rounded-2xl p-5 mb-6">
        <p className="text-neutral-400 text-sm mb-4">Cumulative sequestration (tCO₂)</p>
        <div className="flex items-end gap-1 h-28">
          {years.map((y, i) => (
            <div
              key={y.year}
              className="flex-1 flex flex-col items-center gap-1"
              title={`${y.year}: ${y.cumulative.toLocaleString(undefined, { maximumFractionDigits: 0 })} tCO₂`}
            >
              <div
                className="w-full rounded-t transition-all duration-700 bg-green-500/70 hover:bg-green-400 cursor-pointer"
                style={{
                  height: `${(y.cumulative / maxVal) * 100}%`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
              {(i === 0 || i === Math.floor(years.length / 2) || i === years.length - 1) && (
                <span className="text-neutral-500 text-[9px]">{y.year}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-8">
        <SummaryRow label="Project type" value={projectType} />
        <SummaryRow label="Area (IPCC default)" value={`${defaults.area.toLocaleString()} ha`} />
        <SummaryRow label="Duration" value={`${DURATION} years`} />
        <SummaryRow label="Annual sequestration" value={`${defaults.annualSequestration} tCO₂/ha/yr`} />
      </div>

      <p className="text-neutral-600 text-xs mb-6">
        Based on IPCC Tier 1 default values for {projectType.toLowerCase()} projects.
      </p>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button className="px-8 py-3 rounded-xl font-semibold bg-green-500 hover:bg-green-400 text-neutral-900 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20 cursor-pointer">
          Download Report
        </button>
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BaselinePage() {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [showResult, setShowResult] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !showResult) inputRef.current?.focus();
  }, [mounted, showResult]);

  const canCalculate = projectName.trim() && projectType;

  const handleCalculate = () => {
    if (canCalculate) setShowResult(true);
  };

  const handleReset = () => {
    setProjectName("");
    setProjectType("");
    setShowResult(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="max-w-2xl mx-auto">
          <span className="text-neutral-500 text-sm font-medium">
            Estimate Project Baseline
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          {showResult && projectType ? (
            <ResultView
              projectName={projectName}
              projectType={projectType}
              onReset={handleReset}
            />
          ) : (
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Estimate Project Baseline
              </h2>
              <p className="text-neutral-400 mb-10">
                Enter a project name and select a type to calculate the baseline using IPCC Tier 1 defaults.
              </p>

              {/* Project Name */}
              <div className="mb-10">
                <label className="block text-sm font-medium text-neutral-400 mb-3">
                  Project name
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canCalculate && handleCalculate()}
                  placeholder="e.g. Amazon Reforestation Initiative"
                  className="
                    w-full bg-transparent border-0 border-b-2 border-neutral-600
                    focus:border-green-500 outline-none text-white text-xl md:text-2xl
                    pb-3 placeholder-neutral-600 transition-colors duration-200
                  "
                />
              </div>

              {/* Project Type */}
              <div className="mb-10">
                <label className="block text-sm font-medium text-neutral-400 mb-3">
                  Project type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROJECT_TYPES.map((pt) => (
                    <button
                      key={pt.label}
                      onClick={() => setProjectType(pt.label)}
                      className={`
                        p-4 rounded-xl border-2 text-left transition-all duration-200
                        flex items-center gap-4 cursor-pointer
                        ${
                          projectType === pt.label
                            ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/10"
                            : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-500 hover:bg-neutral-800"
                        }
                      `}
                    >
                      <span className="text-3xl">{pt.icon}</span>
                      <div>
                        <div className="font-semibold text-white text-lg">{pt.label}</div>
                        <div className="text-neutral-400 text-sm">{pt.desc}</div>
                      </div>
                      {projectType === pt.label && (
                        <span className="ml-auto text-green-500 text-xl">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={!canCalculate}
                className={`
                  px-8 py-3 rounded-xl font-semibold text-base
                  transition-all duration-200 flex items-center gap-2
                  ${
                    !canCalculate
                      ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-400 text-neutral-900 cursor-pointer shadow-lg shadow-green-500/20 hover:shadow-green-400/30 hover:scale-105 active:scale-95"
                  }
                `}
              >
                Calculate Baseline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

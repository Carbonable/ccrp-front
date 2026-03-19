"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectType =
  | "Restoration"
  | "Conservation"
  | "Reforestation"
  | "DAC"
  | "Biochar";

interface FormData {
  projectName: string;
  projectType: ProjectType | "";
  location: string;
  area: number;
  startYear: number;
  duration: number;
  annualSequestration: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PROJECT_TYPES: { label: ProjectType; icon: string; desc: string }[] = [
  {
    label: "Restoration",
    icon: "🌿",
    desc: "Restoring degraded ecosystems",
  },
  {
    label: "Conservation",
    icon: "🛡️",
    desc: "Protecting existing carbon stocks",
  },
  {
    label: "Reforestation",
    icon: "🌲",
    desc: "Planting trees in deforested areas",
  },
  {
    label: "DAC",
    icon: "⚙️",
    desc: "Direct Air Capture technology",
  },
  {
    label: "Biochar",
    icon: "🔥",
    desc: "Carbon-rich charcoal from biomass",
  },
];

const TOTAL_STEPS = 7;

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => currentYear + i);

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-neutral-800">
      <div
        className="h-full bg-green-500 transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Step Wrapper (animation) ─────────────────────────────────────────────────

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
          ? "translateY(0px)"
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

// ─── Step Label ───────────────────────────────────────────────────────────────

function StepLabel({ step }: { step: number }) {
  return (
    <p className="text-sm font-medium text-green-500 mb-3 tracking-widest uppercase">
      Step {step} of {TOTAL_STEPS}
    </p>
  );
}

// ─── Continue Button ──────────────────────────────────────────────────────────

function ContinueButton({
  onClick,
  disabled,
  label = "Continue",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        mt-8 px-8 py-3 rounded-xl font-semibold text-base
        transition-all duration-200 flex items-center gap-2
        ${
          disabled
            ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-400 text-neutral-900 cursor-pointer shadow-lg shadow-green-500/20 hover:shadow-green-400/30 hover:scale-105 active:scale-95"
        }
      `}
    >
      {label}
      {!disabled && <span className="text-xs opacity-70">↵</span>}
    </button>
  );
}

// ─── Step 1: Project Name ─────────────────────────────────────────────────────

function Step1({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <StepLabel step={1} />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        What's your project called?
      </h2>
      <p className="text-neutral-400 mb-8">
        Give your carbon project a clear, descriptive name.
      </p>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value.trim() && onNext()}
        placeholder="e.g. Amazon Reforestation Initiative"
        className="
          w-full bg-transparent border-0 border-b-2 border-neutral-600
          focus:border-green-500 outline-none text-white text-xl md:text-2xl
          pb-3 placeholder-neutral-600 transition-colors duration-200
        "
      />
      <ContinueButton onClick={onNext} disabled={!value.trim()} />
    </div>
  );
}

// ─── Step 2: Project Type ─────────────────────────────────────────────────────

function Step2({
  value,
  onChange,
  onNext,
}: {
  value: ProjectType | "";
  onChange: (v: ProjectType) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <StepLabel step={2} />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        What type of project is it?
      </h2>
      <p className="text-neutral-400 mb-8">
        Select the carbon removal methodology.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROJECT_TYPES.map((pt) => (
          <button
            key={pt.label}
            onClick={() => {
              onChange(pt.label);
              setTimeout(onNext, 250);
            }}
            className={`
              p-4 rounded-xl border-2 text-left transition-all duration-200
              flex items-center gap-4 cursor-pointer
              ${
                value === pt.label
                  ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/10"
                  : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-500 hover:bg-neutral-800"
              }
            `}
          >
            <span className="text-3xl">{pt.icon}</span>
            <div>
              <div className="font-semibold text-white text-lg">
                {pt.label}
              </div>
              <div className="text-neutral-400 text-sm">{pt.desc}</div>
            </div>
            {value === pt.label && (
              <span className="ml-auto text-green-500 text-xl">✓</span>
            )}
          </button>
        ))}
      </div>
      <ContinueButton onClick={onNext} disabled={!value} />
    </div>
  );
}

// ─── Step 3: Location ─────────────────────────────────────────────────────────

const COUNTRIES = [
  "Brazil",
  "Colombia",
  "Peru",
  "Indonesia",
  "Democratic Republic of Congo",
  "Kenya",
  "Tanzania",
  "Madagascar",
  "India",
  "China",
  "United States",
  "Canada",
  "Australia",
  "France",
  "Germany",
  "Other",
];

function Step3({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <StepLabel step={3} />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Where is the project located?
      </h2>
      <p className="text-neutral-400 mb-8">
        Select the country or region of implementation.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {COUNTRIES.map((country) => (
          <button
            key={country}
            onClick={() => {
              onChange(country);
              setTimeout(onNext, 250);
            }}
            className={`
              p-3 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                value === country
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800 bg-neutral-800/30"
              }
            `}
          >
            {country}
          </button>
        ))}
      </div>
      <ContinueButton onClick={onNext} disabled={!value} />
    </div>
  );
}

// ─── Step 4: Area ─────────────────────────────────────────────────────────────

function Step4({
  value,
  onChange,
  onNext,
}: {
  value: number;
  onChange: (v: number) => void;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <StepLabel step={4} />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        What's the project area?
      </h2>
      <p className="text-neutral-400 mb-8">
        Enter the total land area in hectares.
      </p>

      <div className="flex items-baseline gap-3 mb-6">
        <input
          ref={inputRef}
          type="number"
          min={1}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && value > 0 && onNext()}
          placeholder="0"
          className="
            bg-transparent border-0 border-b-2 border-neutral-600
            focus:border-green-500 outline-none text-white text-4xl md:text-5xl
            font-bold w-40 pb-2 placeholder-neutral-700 transition-colors duration-200
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          "
        />
        <span className="text-neutral-400 text-xl">hectares</span>
      </div>

      {/* Slider */}
      <div className="mt-4">
        <input
          type="range"
          min={1}
          max={100000}
          step={100}
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-green-500 cursor-pointer"
        />
        <div className="flex justify-between text-neutral-500 text-xs mt-1">
          <span>1 ha</span>
          <span>10,000 ha</span>
          <span>100,000 ha</span>
        </div>
      </div>

      {value > 0 && (
        <p className="mt-4 text-neutral-400 text-sm">
          ≈{" "}
          <span className="text-green-400 font-semibold">
            {(value * 10000).toLocaleString()} m²
          </span>{" "}
          ·{" "}
          <span className="text-green-400 font-semibold">
            {(value / 100).toFixed(2)} km²
          </span>
        </p>
      )}

      <ContinueButton onClick={onNext} disabled={!value || value <= 0} />
    </div>
  );
}

// ─── Step 5: Start Year ───────────────────────────────────────────────────────

function Step5({
  value,
  onChange,
  onNext,
}: {
  value: number;
  onChange: (v: number) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <StepLabel step={5} />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        When does the project start?
      </h2>
      <p className="text-neutral-400 mb-8">
        Select the project's start year for baseline calculation.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {YEAR_OPTIONS.map((year) => (
          <button
            key={year}
            onClick={() => {
              onChange(year);
              setTimeout(onNext, 250);
            }}
            className={`
              py-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 cursor-pointer
              ${
                value === year
                  ? "border-green-500 bg-green-500/10 text-green-400 shadow-lg shadow-green-500/10"
                  : "border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800"
              }
            `}
          >
            {year}
          </button>
        ))}
      </div>
      <ContinueButton onClick={onNext} disabled={!value} />
    </div>
  );
}

// ─── Step 6: Duration ─────────────────────────────────────────────────────────

function Step6({
  value,
  onChange,
  onNext,
}: {
  value: number;
  onChange: (v: number) => void;
  onNext: () => void;
}) {
  const DURATIONS = [5, 10, 15, 20, 25, 30];

  return (
    <div>
      <StepLabel step={6} />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Project duration?
      </h2>
      <p className="text-neutral-400 mb-8">
        How many years will the project run? (5–30 years)
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {DURATIONS.map((d) => (
          <button
            key={d}
            onClick={() => {
              onChange(d);
              setTimeout(onNext, 250);
            }}
            className={`
              py-5 rounded-xl border-2 font-bold text-xl transition-all duration-200 cursor-pointer
              ${
                value === d
                  ? "border-green-500 bg-green-500/10 text-green-400 shadow-lg shadow-green-500/10"
                  : "border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800"
              }
            `}
          >
            {d}
            <div className="text-xs font-normal text-neutral-400 mt-1">
              years
            </div>
          </button>
        ))}
      </div>
      <ContinueButton onClick={onNext} disabled={!value} />
    </div>
  );
}

// ─── Step 7: Annual Sequestration ─────────────────────────────────────────────

function Step7({
  value,
  onChange,
  onNext,
  projectType,
}: {
  value: number;
  onChange: (v: number) => void;
  onNext: () => void;
  projectType: ProjectType | "";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const BENCHMARKS: Record<string, { min: number; max: number }> = {
    Restoration: { min: 2, max: 8 },
    Conservation: { min: 1, max: 5 },
    Reforestation: { min: 3, max: 12 },
    DAC: { min: 50, max: 500 },
    Biochar: { min: 1, max: 4 },
  };

  const bench = projectType ? BENCHMARKS[projectType] : null;

  return (
    <div>
      <StepLabel step={7} />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Expected annual sequestration?
      </h2>
      <p className="text-neutral-400 mb-2">
        Tonnes of CO₂ removed per hectare per year (tCO₂/ha/year).
      </p>
      {bench && (
        <p className="text-sm text-green-400 mb-8">
          Typical range for {projectType}:{" "}
          <strong>
            {bench.min}–{bench.max}
          </strong>{" "}
          tCO₂/ha/year
        </p>
      )}
      {!bench && <div className="mb-8" />}

      <div className="flex items-baseline gap-3 mb-6">
        <input
          ref={inputRef}
          type="number"
          min={0.1}
          step={0.1}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && value > 0 && onNext()}
          placeholder="0"
          className="
            bg-transparent border-0 border-b-2 border-neutral-600
            focus:border-green-500 outline-none text-white text-4xl md:text-5xl
            font-bold w-32 pb-2 placeholder-neutral-700 transition-colors duration-200
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          "
        />
        <span className="text-neutral-400 text-sm leading-tight">
          tCO₂
          <br />
          ha/yr
        </span>
      </div>

      {/* Quick picks */}
      {bench && (
        <div className="flex gap-2 flex-wrap">
          {[bench.min, Math.round((bench.min + bench.max) / 2), bench.max].map(
            (v) => (
              <button
                key={v}
                onClick={() => onChange(v)}
                className={`
                px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  value === v
                    ? "border-green-500 bg-green-500/20 text-green-400"
                    : "border-neutral-600 text-neutral-400 hover:border-neutral-400"
                }
              `}
              >
                {v} (
                {v === bench.min
                  ? "low"
                  : v === bench.max
                    ? "high"
                    : "median"}
                )
              </button>
            ),
          )}
        </div>
      )}

      <ContinueButton onClick={onNext} disabled={!value || value <= 0} />
    </div>
  );
}

// ─── Summary + Results ────────────────────────────────────────────────────────

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-neutral-800">
      <span className="text-neutral-400 text-sm">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

function ResultView({
  data,
  onReset,
}: {
  data: FormData;
  onReset: () => void;
}) {
  const total = data.area * data.duration * data.annualSequestration;
  const annualTotal = data.area * data.annualSequestration;

  // Build chart bars
  const years = Array.from({ length: data.duration }, (_, i) => ({
    year: data.startYear + i,
    cumulative: annualTotal * (i + 1),
  }));
  const maxVal = years[years.length - 1]?.cumulative || 1;

  return (
    <div className="animate-fade-in">
      <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-green-400 text-sm font-medium">
          Baseline calculated
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Project Baseline
      </h2>
      <p className="text-neutral-400 mb-8">{data.projectName}</p>

      {/* Key Metric */}
      <div className="bg-gradient-to-br from-green-500/10 to-neutral-900 border border-green-500/20 rounded-2xl p-6 mb-6">
        <p className="text-neutral-400 text-sm mb-1">
          Total Estimated Sequestration
        </p>
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
          Over {data.duration} years ·{" "}
          {annualTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
          tCO₂/year
        </p>
      </div>

      {/* Chart */}
      <div className="bg-neutral-800/50 rounded-2xl p-5 mb-6">
        <p className="text-neutral-400 text-sm mb-4">
          Cumulative sequestration (tCO₂)
        </p>
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
              {(i === 0 ||
                i === Math.floor(years.length / 2) ||
                i === years.length - 1) && (
                <span className="text-neutral-500 text-[9px]">{y.year}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-8">
        <SummaryRow label="Project type" value={data.projectType} />
        <SummaryRow label="Location" value={data.location} />
        <SummaryRow
          label="Area"
          value={`${data.area.toLocaleString()} ha`}
        />
        <SummaryRow label="Start year" value={data.startYear} />
        <SummaryRow label="Duration" value={`${data.duration} years`} />
        <SummaryRow
          label="Annual sequestration"
          value={`${data.annualSequestration} tCO₂/ha/yr`}
        />
      </div>

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

// ─── Summary Step (before calculate) ─────────────────────────────────────────

function SummaryStep({
  data,
  onCalculate,
  onBack,
}: {
  data: FormData;
  onCalculate: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-green-500 mb-3 tracking-widest uppercase">
        Almost there
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Review your project
      </h2>
      <p className="text-neutral-400 mb-8">
        Confirm the details before calculating the baseline.
      </p>

      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-8">
        <SummaryRow label="Project name" value={data.projectName} />
        <SummaryRow label="Project type" value={data.projectType} />
        <SummaryRow label="Location" value={data.location} />
        <SummaryRow
          label="Area"
          value={`${data.area.toLocaleString()} ha`}
        />
        <SummaryRow label="Start year" value={data.startYear} />
        <SummaryRow label="Duration" value={`${data.duration} years`} />
        <SummaryRow
          label="Annual sequestration"
          value={`${data.annualSequestration} tCO₂/ha/yr`}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCalculate}
          className="px-8 py-3 rounded-xl font-semibold bg-green-500 hover:bg-green-400 text-neutral-900 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20 cursor-pointer"
        >
          Calculate Baseline ✦
        </button>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-all duration-200 cursor-pointer"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const DEFAULT_FORM: FormData = {
  projectName: "",
  projectType: "",
  location: "",
  area: 0,
  startYear: 0,
  duration: 0,
  annualSequestration: 0,
};

export default function BaselinePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [showResult, setShowResult] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goNext = useCallback(() => {
    setDirection("forward");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS + 1));
  }, []);

  const goBack = useCallback(() => {
    setDirection("back");
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const update = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
    },
    [],
  );

  // Keyboard: Escape to go back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step > 1 && !showResult) goBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, goBack, showResult]);

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setStep(1);
    setShowResult(false);
    setDirection("forward");
  };

  if (!mounted) return null;

  const isSummaryStep = step === TOTAL_STEPS + 1;

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* Progress */}
      {!showResult && <ProgressBar step={isSummaryStep ? TOTAL_STEPS : step} />}

      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-neutral-500 text-sm font-medium">
            Estimate Project Baseline
          </span>
          {step > 1 && !showResult && (
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
          ) : isSummaryStep ? (
            <SummaryStep
              data={form}
              onCalculate={() => setShowResult(true)}
              onBack={goBack}
            />
          ) : (
            <>
              <StepWrapper visible={step === 1} direction={direction}>
                <Step1
                  value={form.projectName}
                  onChange={(v) => update("projectName", v)}
                  onNext={goNext}
                />
              </StepWrapper>
              <StepWrapper visible={step === 2} direction={direction}>
                <Step2
                  value={form.projectType}
                  onChange={(v) => update("projectType", v)}
                  onNext={goNext}
                />
              </StepWrapper>
              <StepWrapper visible={step === 3} direction={direction}>
                <Step3
                  value={form.location}
                  onChange={(v) => update("location", v)}
                  onNext={goNext}
                />
              </StepWrapper>
              <StepWrapper visible={step === 4} direction={direction}>
                <Step4
                  value={form.area}
                  onChange={(v) => update("area", v)}
                  onNext={goNext}
                />
              </StepWrapper>
              <StepWrapper visible={step === 5} direction={direction}>
                <Step5
                  value={form.startYear}
                  onChange={(v) => update("startYear", v)}
                  onNext={goNext}
                />
              </StepWrapper>
              <StepWrapper visible={step === 6} direction={direction}>
                <Step6
                  value={form.duration}
                  onChange={(v) => update("duration", v)}
                  onNext={goNext}
                />
              </StepWrapper>
              <StepWrapper visible={step === 7} direction={direction}>
                <Step7
                  value={form.annualSequestration}
                  onChange={(v) => update("annualSequestration", v)}
                  onNext={goNext}
                  projectType={form.projectType}
                />
              </StepWrapper>
            </>
          )}
        </div>
      </div>

      {/* Keyboard hint */}
      {!showResult && !isSummaryStep && (
        <div className="px-6 py-4 text-center">
          <p className="text-neutral-700 text-xs">
            Press{" "}
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

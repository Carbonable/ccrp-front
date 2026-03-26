"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  agb: number; // Above-Ground Biomass (tDM/ha) from dMRV
  hectares: number; // Number of hectares
  crownCover: number; // Crown cover (0–1)
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

// IPCC Tier-1 baseline formula coefficients
const CARBON_FRACTION = 0.47; // CF: fraction of carbon in dry biomass
const CO2_C_RATIO = 44 / 12; // molecular weight ratio CO₂/C
const BEF = 1.25; // Biomass Expansion Factor (roots, branches)

function calculateBaseline(data: FormData): number {
  return CARBON_FRACTION * CO2_C_RATIO * data.agb * BEF * data.hectares * data.crownCover;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
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

// ─── Step 1: Above-Ground Biomass ─────────────────────────────────────────────

function Step1({
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
      <StepLabel step={1} />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        What is the Above-Ground Biomass (AGB) from the dMRV per ha?
      </h2>
      <p className="text-neutral-400 mb-8">
        Tonnes of dry matter per hectare (tDM/ha). Put zero if you don&apos;t have it.
      </p>

      <div className="flex items-baseline gap-3 mb-6">
        <input
          ref={inputRef}
          type="number"
          min={0}
          step={0.1}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && onNext()}
          placeholder="0"
          className="
            bg-transparent border-0 border-b-2 border-neutral-600
            focus:border-green-500 outline-none text-white text-4xl md:text-5xl
            font-bold w-40 pb-2 placeholder-neutral-700 transition-colors duration-200
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          "
        />
        <span className="text-neutral-400 text-lg">tDM/ha</span>
      </div>

      <ContinueButton onClick={onNext} disabled={false} />
    </div>
  );
}

// ─── Step 2: Number of Hectares ───────────────────────────────────────────────

function Step2({
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
      <StepLabel step={2} />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Number of ha of the project
      </h2>
      <p className="text-neutral-400 mb-8">
        Total project area in hectares. Put zero if you don&apos;t have it.
      </p>

      <div className="flex items-baseline gap-3 mb-6">
        <input
          ref={inputRef}
          type="number"
          min={0}
          step={1}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && onNext()}
          placeholder="0"
          className="
            bg-transparent border-0 border-b-2 border-neutral-600
            focus:border-green-500 outline-none text-white text-4xl md:text-5xl
            font-bold w-40 pb-2 placeholder-neutral-700 transition-colors duration-200
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          "
        />
        <span className="text-neutral-400 text-lg">hectares</span>
      </div>

      {value > 0 && (
        <p className="mt-2 text-neutral-500 text-sm">
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

      <ContinueButton onClick={onNext} disabled={false} />
    </div>
  );
}

// ─── Step 3: Crown Cover ──────────────────────────────────────────────────────

function Step3({
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

  const [error, setError] = useState("");

  const handleChange = (v: number) => {
    onChange(v);
    if (v < 0 || v > 1) {
      setError("Crown cover must be between 0 and 1");
    } else {
      setError("");
    }
  };

  const handleNext = () => {
    if (value >= 0 && value <= 1) {
      onNext();
    } else {
      setError("Crown cover must be between 0 and 1");
    }
  };

  return (
    <div>
      <StepLabel step={3} />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Provide your crown cover if you have it
      </h2>
      <p className="text-neutral-400 mb-8">
        Value between 0 and 1 (e.g. 0.8 = 80% canopy cover). Put zero if you don&apos;t have it.
      </p>

      <div className="flex items-baseline gap-3 mb-6">
        <input
          ref={inputRef}
          type="number"
          min={0}
          max={1}
          step={0.01}
          value={value || ""}
          onChange={(e) => handleChange(Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && handleNext()}
          placeholder="0"
          className="
            bg-transparent border-0 border-b-2 border-neutral-600
            focus:border-green-500 outline-none text-white text-4xl md:text-5xl
            font-bold w-40 pb-2 placeholder-neutral-700 transition-colors duration-200
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          "
        />
        <span className="text-neutral-400 text-lg">ratio</span>
      </div>

      {/* Quick picks */}
      <div className="flex gap-2 flex-wrap mb-4">
        {[0.3, 0.5, 0.7, 0.8, 0.9, 1.0].map((v) => (
          <button
            key={v}
            onClick={() => handleChange(v)}
            className={`
              px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                value === v
                  ? "border-green-500 bg-green-500/20 text-green-400"
                  : "border-neutral-600 text-neutral-400 hover:border-neutral-400"
              }
            `}
          >
            {v} ({Math.round(v * 100)}%)
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      <ContinueButton onClick={handleNext} disabled={false} label="Calculate" />
    </div>
  );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────

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

// ─── Result View ──────────────────────────────────────────────────────────────

function ResultView({
  data,
  onReset,
}: {
  data: FormData;
  onReset: () => void;
}) {
  const result = calculateBaseline(data);

  const formatNumber = (num: number) =>
    num.toLocaleString("en-US", { maximumFractionDigits: 2 });

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
      <p className="text-neutral-400 mb-8">
        IPCC Tier-1 carbon stock estimation
      </p>

      {/* Key Metric */}
      <div className="bg-gradient-to-br from-green-500/10 to-neutral-900 border border-green-500/20 rounded-2xl p-6 mb-6">
        <p className="text-neutral-400 text-sm mb-1">
          Total Estimated Carbon Stock
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl md:text-6xl font-bold text-white">
            {result >= 1000000
              ? `${(result / 1000000).toFixed(2)}M`
              : result >= 1000
                ? `${(result / 1000).toFixed(1)}k`
                : formatNumber(result)}
          </span>
          <span className="text-green-400 font-semibold">tCO₂</span>
        </div>
      </div>

      {/* Formula breakdown */}
      <div className="bg-neutral-800/50 rounded-2xl p-5 mb-6">
        <p className="text-neutral-400 text-sm mb-4">
          Formula: CF × (44/12) × AGB × BEF × Area × Crown Cover
        </p>
        <div className="font-mono text-sm text-neutral-300 space-y-1">
          <p>
            <span className="text-green-400">{CARBON_FRACTION}</span> × <span className="text-green-400">{(CO2_C_RATIO).toFixed(4)}</span> × <span className="text-green-400">{data.agb}</span> × <span className="text-green-400">{BEF}</span> × <span className="text-green-400">{data.hectares}</span> × <span className="text-green-400">{data.crownCover}</span>
          </p>
          <p className="text-white font-bold pt-2 border-t border-neutral-700 mt-2">
            = {formatNumber(result)} tCO₂
          </p>
        </div>
      </div>

      {/* Coefficients legend */}
      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-6">
        <SummaryRow label="CF (Carbon Fraction)" value={CARBON_FRACTION} />
        <SummaryRow label="CO₂/C molecular ratio (44/12)" value={(CO2_C_RATIO).toFixed(4)} />
        <SummaryRow label="BEF (Biomass Expansion Factor)" value={BEF} />
      </div>

      {/* Input summary */}
      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-8">
        <SummaryRow
          label="AGB (dMRV)"
          value={`${data.agb} tDM/ha`}
        />
        <SummaryRow
          label="Project area"
          value={`${data.hectares.toLocaleString()} ha`}
        />
        <SummaryRow
          label="Crown cover"
          value={`${data.crownCover} (${Math.round(data.crownCover * 100)}%)`}
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
  const preview = calculateBaseline(data);
  const formatNumber = (num: number) =>
    num.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <div>
      <p className="text-sm font-medium text-green-500 mb-3 tracking-widest uppercase">
        Almost there
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Review your inputs
      </h2>
      <p className="text-neutral-400 mb-8">
        Confirm the data before calculating the baseline.
      </p>

      <div className="bg-neutral-800/30 rounded-2xl px-5 mb-6">
        <SummaryRow
          label="Above-Ground Biomass (AGB)"
          value={`${data.agb} tDM/ha`}
        />
        <SummaryRow
          label="Project area"
          value={`${data.hectares.toLocaleString()} ha`}
        />
        <SummaryRow
          label="Crown cover"
          value={`${data.crownCover} (${Math.round(data.crownCover * 100)}%)`}
        />
      </div>

      {/* Preview result */}
      <div className="bg-neutral-800/50 rounded-2xl p-4 mb-8">
        <p className="text-neutral-500 text-sm">Estimated result</p>
        <p className="text-2xl font-bold text-green-400">
          {formatNumber(preview)} tCO₂
        </p>
        <p className="text-neutral-600 text-xs mt-1">
          CF({CARBON_FRACTION}) × CO₂/C({(CO2_C_RATIO).toFixed(2)}) × AGB({data.agb}) × BEF({BEF}) × {data.hectares}ha × {data.crownCover}
        </p>
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
  agb: 0,
  hectares: 0,
  crownCover: 0,
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
      if (e.key === "Escape" && !showResult) goBack();
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
      {!showResult && <ProgressBar step={isSummaryStep ? TOTAL_STEPS : step} total={TOTAL_STEPS} />}

      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-neutral-500 text-sm font-medium">
            Estimate Project Baseline
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
                  value={form.agb}
                  onChange={(v) => update("agb", v)}
                  onNext={goNext}
                />
              </StepWrapper>
              <StepWrapper visible={step === 2} direction={direction}>
                <Step2
                  value={form.hectares}
                  onChange={(v) => update("hectares", v)}
                  onNext={goNext}
                />
              </StepWrapper>
              <StepWrapper visible={step === 3} direction={direction}>
                <Step3
                  value={form.crownCover}
                  onChange={(v) => update("crownCover", v)}
                  onNext={goNext}
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

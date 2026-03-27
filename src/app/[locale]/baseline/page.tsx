"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import biomassDataRaw from "./biomassData.json";

interface BiomassData {
  [key: string]: number | null;
}

const biomassData = biomassDataRaw as BiomassData;

type TranslationValues = Record<string, string | number>;
type TranslateFn = (key: string, values?: TranslationValues) => string;

interface FormData {
  country: string;
  hectares: number;
  treeCrownCoverBaseline: number;
  shrubCrownCoverBaseline: number;
  shrubAreaBaseline: number;
  treeCrownCoverProject: number;
  shrubCrownCoverProject: number;
  shrubAreaProject: number;
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
}

const CF_TREE = 0.47;
const CF_SHRUB = 0.47;
const CO2_C_RATIO = 44 / 12;

function getSteps(t: TranslateFn): StepConfig[] {
  return [
    {
      id: 1,
      section: "baseline",
      sectionLabel: t("steps.country.sectionLabel"),
      field: "country",
      title: t("steps.country.title"),
      subtitle: t("steps.country.subtitle"),
      type: "country",
    },
    {
      id: 2,
      section: "baseline",
      sectionLabel: t("steps.hectares.sectionLabel"),
      field: "hectares",
      title: t("steps.hectares.title"),
      subtitle: t("steps.hectares.subtitle"),
      type: "number",
      unit: "ha",
      min: 0,
      step: 1,
    },
    {
      id: 3,
      section: "baseline",
      sectionLabel: t("steps.baselineIntro.sectionLabel"),
      field: "treeCrownCoverBaseline",
      title: t("steps.baselineIntro.title"),
      subtitle: t("steps.baselineIntro.subtitle"),
      type: "info",
      infoText: t("steps.baselineIntro.infoText"),
    },
    {
      id: 4,
      section: "baseline",
      sectionLabel: t("steps.treeBaseline.sectionLabel"),
      field: "treeCrownCoverBaseline",
      title: t("steps.treeBaseline.title"),
      subtitle: t("steps.treeBaseline.subtitle"),
      type: "ratio",
      unit: t("unitRatio"),
      min: 0,
      max: 1,
      step: 0.01,
      quickPicks: [
        { value: 0.1, label: `10% — ${t("quickPicks.sparse")}` },
        { value: 0.3, label: `30% — ${t("quickPicks.open")}` },
        { value: 0.5, label: `50% — ${t("quickPicks.moderate")}` },
        { value: 0.7, label: `70% — ${t("quickPicks.dense")}` },
      ],
    },
    {
      id: 5,
      section: "baseline",
      sectionLabel: t("steps.shrubBaseline.sectionLabel"),
      field: "shrubCrownCoverBaseline",
      title: t("steps.shrubBaseline.title"),
      subtitle: t("steps.shrubBaseline.subtitle"),
      type: "ratio",
      unit: t("unitRatio"),
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
      sectionLabel: t("steps.shrubAreaBaseline.sectionLabel"),
      field: "shrubAreaBaseline",
      title: t("steps.shrubAreaBaseline.title"),
      subtitle: t("steps.shrubAreaBaseline.subtitle"),
      type: "number",
      unit: "ha",
      min: 0,
      step: 0.1,
    },
    {
      id: 7,
      section: "project",
      sectionLabel: t("steps.projectIntro.sectionLabel"),
      field: "treeCrownCoverProject",
      title: t("steps.projectIntro.title"),
      subtitle: t("steps.projectIntro.subtitle"),
      type: "info",
      infoText: t("steps.projectIntro.infoText"),
    },
    {
      id: 8,
      section: "project",
      sectionLabel: t("steps.treeProject.sectionLabel"),
      field: "treeCrownCoverProject",
      title: t("steps.treeProject.title"),
      subtitle: t("steps.treeProject.subtitle"),
      type: "ratio",
      unit: t("unitRatio"),
      min: 0,
      max: 1,
      step: 0.01,
      quickPicks: [
        { value: 0.5, label: `50% — ${t("quickPicks.moderate")}` },
        { value: 0.7, label: `70% — ${t("quickPicks.good")}` },
        { value: 0.8, label: `80% — ${t("quickPicks.dense")}` },
        { value: 0.9, label: `90% — ${t("quickPicks.veryDense")}` },
      ],
    },
    {
      id: 9,
      section: "project",
      sectionLabel: t("steps.shrubProject.sectionLabel"),
      field: "shrubCrownCoverProject",
      title: t("steps.shrubProject.title"),
      subtitle: t("steps.shrubProject.subtitle"),
      type: "ratio",
      unit: t("unitRatio"),
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
      sectionLabel: t("steps.shrubAreaProject.sectionLabel"),
      field: "shrubAreaProject",
      title: t("steps.shrubAreaProject.title"),
      subtitle: t("steps.shrubAreaProject.subtitle"),
      type: "number",
      unit: "ha",
      min: 0,
      step: 0.1,
    },
    {
      id: 11,
      section: "advanced",
      sectionLabel: t("steps.treeRootShoot.sectionLabel"),
      field: "treeRootShootRatio",
      title: t("steps.treeRootShoot.title"),
      subtitle: t("steps.treeRootShoot.subtitle"),
      type: "number",
      unit: "",
      min: 0,
      max: 2,
      step: 0.01,
      quickPicks: [
        { value: 0.2, label: `0.20 — ${t("quickPicks.tropical")}` },
        { value: 0.25, label: `0.25 — ${t("quickPicks.ipccDefault")}` },
        { value: 0.3, label: `0.30 — ${t("quickPicks.temperate")}` },
      ],
    },
    {
      id: 12,
      section: "advanced",
      sectionLabel: t("steps.shrubRootShoot.sectionLabel"),
      field: "shrubRootShootRatio",
      title: t("steps.shrubRootShoot.title"),
      subtitle: t("steps.shrubRootShoot.subtitle"),
      type: "number",
      unit: "",
      min: 0,
      max: 2,
      step: 0.01,
      quickPicks: [
        { value: 0.3, label: "0.30" },
        { value: 0.4, label: `0.40 — ${t("quickPicks.ipccDefault")}` },
        { value: 0.5, label: "0.50" },
      ],
    },
    {
      id: 13,
      section: "advanced",
      sectionLabel: t("steps.shrubBiomass.sectionLabel"),
      field: "shrubBiomassRatio",
      title: t("steps.shrubBiomass.title"),
      subtitle: t("steps.shrubBiomass.subtitle"),
      type: "number",
      unit: "",
      min: 0,
      max: 1,
      step: 0.01,
      quickPicks: [
        { value: 0.05, label: `0.05 — ${t("quickPicks.sparse")}` },
        { value: 0.1, label: `0.10 — ${t("quickPicks.default")}` },
        { value: 0.15, label: `0.15 — ${t("quickPicks.dense")}` },
      ],
    },
  ];
}

function calculateBaseline(data: FormData) {
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

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-neutral-800">
      <div
        className="h-full bg-greenish-500 transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SectionBadge({ section, label }: { section: string; label: string }) {
  const colors: Record<string, string> = {
    baseline: "border-greenish-700/30 bg-greenish-900/60 text-greenish-400",
    project: "border-primary/20 bg-primary/10 text-primary",
    advanced: "border-neutral-600/30 bg-neutral-700/50 text-neutral-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide ${colors[section] || colors.baseline}`}
    >
      {section === "baseline" && <span className="h-1.5 w-1.5 rounded-full bg-greenish-500" />}
      {section === "project" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      {section === "advanced" && <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />}
      {label}
    </span>
  );
}

function StepCounter({ current, total }: { current: number; total: number }) {
  return (
    <p className="mb-4 text-sm font-medium tabular-nums text-neutral-500">
      <span className="text-greenish-500">{current}</span>
      <span className="mx-1">/</span>
      {total}
    </p>
  );
}

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

function ActionButton({
  onClick,
  disabled,
  label,
  variant = "primary",
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  variant?: "primary" | "secondary";
}) {
  if (variant === "secondary") {
    return (
      <button
        onClick={onClick}
        className="cursor-pointer rounded-xl border border-neutral-600 px-6 py-3 font-semibold text-neutral-300 transition-all duration-200 hover:border-neutral-400 hover:text-white"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl px-8 py-3 text-base font-semibold transition-all duration-200 ${
        disabled
          ? "cursor-not-allowed bg-neutral-700 text-neutral-500"
          : "cursor-pointer bg-greenish-500 text-neutral-900 shadow-lg shadow-greenish-500/20 hover:scale-[1.02] hover:bg-greenish-400 hover:shadow-greenish-400/30 active:scale-95"
      }`}
    >
      {label}
      {!disabled && <span className="text-xs opacity-60">↵</span>}
    </button>
  );
}

function CountrySelect({
  value,
  onChange,
  onConfirm,
  t,
}: {
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  t: TranslateFn;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      <div className="mb-2 flex items-center gap-3">
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
          placeholder={t("searchCountry")}
          className="w-full border-0 border-b-2 border-neutral-600 bg-transparent pb-2 text-2xl font-bold text-white outline-none transition-colors duration-200 placeholder-neutral-700 focus:border-greenish-500 md:text-3xl"
        />
      </div>

      {value && (
        <div className="mb-4 mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-greenish-700/30 bg-greenish-900/40 px-4 py-1.5">
            <span className="text-sm font-medium text-greenish-400">{value}</span>
            <span className="text-xs text-neutral-500">{t("countryAgb", { value: biomassData[value] ?? 0 })}</span>
          </span>
          <button
            onClick={() => {
              onChange("");
              setIsOpen(true);
              inputRef.current?.focus();
            }}
            className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-300"
          >
            {t("change")}
          </button>
        </div>
      )}

      {isOpen && !value && (
        <div className="absolute z-40 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-800 shadow-xl">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-neutral-500">{t("noResults")}</div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.name}
                onClick={() => handleSelect(c.name)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left transition-colors duration-100 hover:bg-neutral-700/60"
              >
                <span className="text-sm text-white">{c.name}</span>
                <span className="text-xs tabular-nums text-neutral-500">{c.agb} tDM/ha</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  onConfirm,
  unit,
  step: inputStep = 1,
  min,
  max,
  quickPicks,
  t,
  locale,
}: {
  value: number;
  onChange: (v: number) => void;
  onConfirm: () => void;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  quickPicks?: { value: number; label: string }[];
  t: TranslateFn;
  locale: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validate = (v: number): boolean => {
    if (max !== undefined && v > max) {
      setError(t("valueMustBeMax", { max }));
      return false;
    }
    if (min !== undefined && v < min) {
      setError(t("valueMustBeMin", { min }));
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
      <div className="mb-4 flex items-baseline gap-3">
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
          className="w-40 border-0 border-b-2 border-neutral-600 bg-transparent pb-2 text-4xl font-bold text-white outline-none transition-colors duration-200 placeholder-neutral-700 [appearance:textfield] focus:border-greenish-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none md:text-5xl"
        />
        {unit && <span className="text-lg text-neutral-400">{unit}</span>}
      </div>

      {unit === "ha" && value > 0 && (
        <p className="mb-3 text-sm text-neutral-600">
          ≈ <span className="font-medium text-greenish-400">{(value * 10000).toLocaleString(locale)} m²</span>
          {" · "}
          <span className="font-medium text-greenish-400">{(value / 100).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km²</span>
        </p>
      )}

      {quickPicks && quickPicks.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {quickPicks.map((qp) => (
            <button
              key={qp.value}
              onClick={() => handleChange(qp.value)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
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

      {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}

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
      <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{title}</h2>
      <div className="mb-6 rounded-2xl border border-neutral-700/50 bg-neutral-800/40 p-6">
        <p className="text-base leading-relaxed text-neutral-300">{infoText}</p>
      </div>
    </div>
  );
}

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
    <div className="flex items-center justify-between border-b border-neutral-800 py-3 last:border-0">
      <span className="text-sm text-neutral-400">{label}</span>
      <span className={`font-semibold ${highlight ? "text-greenish-400" : "text-white"}`}>{value}</span>
    </div>
  );
}

function ResultView({
  data,
  onReset,
  t,
  locale,
}: {
  data: FormData;
  onReset: () => void;
  t: TranslateFn;
  locale: string;
}) {
  const result = calculateBaseline(data);
  const bFOREST = biomassData[data.country] ?? 0;
  const fmt = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 2 });
  const isPositive = result.netCO2 > 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-greenish-500/30 bg-greenish-500/10 px-4 py-1.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-greenish-500" />
        <span className="text-sm font-medium text-greenish-400">{t("baselineCalculated")}</span>
      </div>

      <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">{t("resultTitle")}</h2>
      <p className="mb-8 text-neutral-400">{t("resultSubtitle")}</p>

      <div className={`mb-6 rounded-2xl border bg-gradient-to-br p-6 ${isPositive ? "border-greenish-500/20 from-greenish-500/10" : "border-red-500/20 from-red-500/10"} to-neutral-900`}>
        <p className="mb-1 text-sm text-neutral-400">{isPositive ? t("metricPositive") : t("metricNegative")}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-white md:text-6xl">
            {result.netCO2 >= 1_000_000
              ? `${(result.netCO2 / 1_000_000).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`
              : result.netCO2 >= 1000
                ? `${(result.netCO2 / 1000).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`
                : fmt(result.netCO2)}
          </span>
          <span className={`font-semibold ${isPositive ? "text-greenish-400" : "text-red-400"}`}>tCO₂</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-neutral-800/40 p-5">
          <p className="mb-3 text-xs uppercase tracking-wider text-neutral-500">{t("baselineBefore")}</p>
          <SummaryRow label={t("cTreeBaseline")} value={`${fmt(result.ctreeBaseline)} tCO₂`} />
          <SummaryRow label={t("cShrubBaseline")} value={`${fmt(result.cshrubBaseline)} tCO₂`} />
          <div className="mt-1 border-t border-neutral-700 pt-3">
            <SummaryRow label={t("totalBaseline")} value={`${fmt(result.ctreeBaseline + result.cshrubBaseline)} tCO₂`} />
          </div>
        </div>
        <div className="rounded-2xl bg-neutral-800/40 p-5">
          <p className="mb-3 text-xs uppercase tracking-wider text-neutral-500">{t("projectAfter")}</p>
          <SummaryRow label={t("cTreeProject")} value={`${fmt(result.ctreeProject)} tCO₂`} highlight />
          <SummaryRow label={t("cShrubProject")} value={`${fmt(result.cshrubProject)} tCO₂`} highlight />
          <div className="mt-1 border-t border-neutral-700 pt-3">
            <SummaryRow label={t("totalProject")} value={`${fmt(result.ctreeProject + result.cshrubProject)} tCO₂`} highlight />
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-neutral-800/30 p-5">
        <p className="mb-4 text-sm text-neutral-400">{t("formulaLabel")}: (C_TREE_project + C_SHRUB_project) − (C_TREE_baseline + C_SHRUB_baseline)</p>
        <div className="space-y-1 font-mono text-sm text-neutral-300">
          <p>C_TREE = (44/12) × CF × AGB × (1 + R:S) × Crown × Area</p>
          <p>C_SHRUB = (44/12) × CF × (1 + R:S) × ShrubArea × BDRSF × AGB × ShrubCrown</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-neutral-800/30 px-5">
        <SummaryRow label={t("carbonFraction")} value={CF_TREE} />
        <SummaryRow label={t("co2Ratio")} value={CO2_C_RATIO.toFixed(4)} />
        <SummaryRow label={t("agb", { country: data.country })} value={`${bFOREST} tDM/ha`} />
        <SummaryRow label={t("treeRootShoot")} value={data.treeRootShootRatio} />
        <SummaryRow label={t("shrubRootShoot")} value={data.shrubRootShootRatio} />
        <SummaryRow label={t("shrubBiomassRatio")} value={data.shrubBiomassRatio} />
      </div>

      <div className="mb-8 rounded-2xl bg-neutral-800/30 px-5">
        <SummaryRow label={t("projectArea")} value={`${data.hectares.toLocaleString(locale)} ha`} />
        <SummaryRow label={t("treeCrownBaselineToProject")} value={`${data.treeCrownCoverBaseline} → ${data.treeCrownCoverProject}`} />
        <SummaryRow label={t("shrubCrownBaselineToProject")} value={`${data.shrubCrownCoverBaseline} → ${data.shrubCrownCoverProject}`} />
        <SummaryRow label={t("shrubAreaBaselineToProject")} value={`${data.shrubAreaBaseline.toLocaleString(locale)} ha → ${data.shrubAreaProject.toLocaleString(locale)} ha`} />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onReset}
          className="cursor-pointer rounded-xl border border-neutral-700 px-8 py-3 font-semibold text-neutral-300 transition-all duration-200 hover:border-neutral-500 hover:text-white"
        >
          {t("startOver")}
        </button>
      </div>
    </div>
  );
}

function ReviewStep({
  data,
  onCalculate,
  onBack,
  t,
  locale,
}: {
  data: FormData;
  onCalculate: () => void;
  onBack: () => void;
  t: TranslateFn;
  locale: string;
}) {
  const preview = calculateBaseline(data);
  const fmt = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 2 });

  return (
    <div>
      <SectionBadge section="advanced" label={t("review")} />
      <h2 className="mb-2 mt-4 text-3xl font-bold text-white md:text-4xl">{t("reviewTitle")}</h2>
      <p className="mb-8 text-neutral-400">{t("reviewSubtitle")}</p>

      <div className="mb-4 rounded-2xl bg-neutral-800/30 px-5">
        <div className="py-2">
          <p className="text-xs uppercase tracking-wider text-neutral-500">{t("baselineSection")}</p>
        </div>
        <SummaryRow label={t("country")} value={data.country} />
        <SummaryRow label={t("projectArea")} value={`${data.hectares.toLocaleString(locale)} ha`} />
        <SummaryRow label={t("treeCrownCover")} value={`${data.treeCrownCoverBaseline} (${Math.round(data.treeCrownCoverBaseline * 100)}%)`} />
        <SummaryRow label={t("shrubCrownCover")} value={`${data.shrubCrownCoverBaseline} (${Math.round(data.shrubCrownCoverBaseline * 100)}%)`} />
        <SummaryRow label={t("shrubArea")} value={`${data.shrubAreaBaseline.toLocaleString(locale)} ha`} />
      </div>

      <div className="mb-4 rounded-2xl bg-neutral-800/30 px-5">
        <div className="py-2">
          <p className="text-xs uppercase tracking-wider text-neutral-500">{t("projectSection")}</p>
        </div>
        <SummaryRow label={t("treeCrownCover")} value={`${data.treeCrownCoverProject} (${Math.round(data.treeCrownCoverProject * 100)}%)`} />
        <SummaryRow label={t("shrubCrownCover")} value={`${data.shrubCrownCoverProject} (${Math.round(data.shrubCrownCoverProject * 100)}%)`} />
        <SummaryRow label={t("shrubArea")} value={`${data.shrubAreaProject.toLocaleString(locale)} ha`} />
      </div>

      <div className="mb-6 rounded-2xl bg-neutral-800/30 px-5">
        <div className="py-2">
          <p className="text-xs uppercase tracking-wider text-neutral-500">{t("coefficientsSection")}</p>
        </div>
        <SummaryRow label={t("treeRootShoot")} value={data.treeRootShootRatio} />
        <SummaryRow label={t("shrubRootShoot")} value={data.shrubRootShootRatio} />
        <SummaryRow label={t("shrubBiomassRatio")} value={data.shrubBiomassRatio} />
      </div>

      <div className="mb-8 rounded-2xl bg-neutral-800/50 p-5">
        <p className="mb-1 text-sm text-neutral-500">{t("estimatedNetCo2")}</p>
        <p className="text-3xl font-bold text-greenish-400">{fmt(preview.netCO2)} tCO₂</p>
        <p className="mt-2 text-xs text-neutral-600">
          {t("projectSection")} ({fmt(preview.ctreeProject + preview.cshrubProject)}) − {t("baselineSection")} ({fmt(preview.ctreeBaseline + preview.cshrubBaseline)})
        </p>
      </div>

      <div className="flex gap-3">
        <ActionButton onClick={onCalculate} label={t("calculateBaseline")} />
        <ActionButton onClick={onBack} label={`← ${t("back")}`} variant="secondary" />
      </div>
    </div>
  );
}

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
  shrubRootShootRatio: 0.4,
  shrubBiomassRatio: 0.1,
};

export default function BaselinePage() {
  const t = useTranslations("baseline");
  const locale = useLocale();
  const steps = useMemo(() => getSteps(t), [t]);
  const inputSteps = useMemo(() => steps.filter((s) => s.type !== "info"), [steps]);
  const totalInputSteps = inputSteps.length;

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentStep = steps[stepIndex];
  const inputStepNumber = useMemo(() => {
    let count = 0;
    for (let i = 0; i <= stepIndex; i++) {
      if (steps[i]?.type !== "info") count++;
    }
    return count;
  }, [stepIndex, steps]);

  const goNext = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      setDirection("forward");
      setStepIndex((s) => s + 1);
    } else {
      setShowReview(true);
    }
  }, [stepIndex, steps.length]);

  const goBack = useCallback(() => {
    if (showReview) {
      setShowReview(false);
      return;
    }
    if (stepIndex > 0) {
      setDirection("back");
      setStepIndex((s) => s - 1);
    }
  }, [showReview, stepIndex]);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

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
    <div className="flex min-h-screen flex-col bg-neutral-900">
      {!showResult && !showReview && <ProgressBar step={inputStepNumber} total={totalInputSteps} />}
      {showReview && <ProgressBar step={totalInputSteps} total={totalInputSteps} />}

      <div className="px-6 pb-4 pt-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <span className="text-sm font-medium text-neutral-500">{t("headerTitle")}</span>
          {!showResult && (
            <button
              onClick={goBack}
              className="flex cursor-pointer items-center gap-1 text-sm text-neutral-500 transition-colors duration-200 hover:text-neutral-300"
            >
              ← {t("back")}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          {showResult ? (
            <ResultView data={form} onReset={handleReset} t={t} locale={locale} />
          ) : showReview ? (
            <ReviewStep data={form} onCalculate={() => setShowResult(true)} onBack={goBack} t={t} locale={locale} />
          ) : (
            steps.map((step, i) => (
              <StepWrapper key={step.id} visible={stepIndex === i} direction={direction}>
                <div className="mb-4">
                  <SectionBadge section={step.section} label={step.sectionLabel} />
                  {step.type !== "info" && (
                    <div className="mt-3">
                      <StepCounter current={inputStepNumber} total={totalInputSteps} />
                    </div>
                  )}
                </div>

                {step.type === "info" ? (
                  <>
                    <InfoStep title={step.title} infoText={step.infoText!} onNext={goNext} />
                    <ActionButton onClick={goNext} label={t("gotItContinue")} />
                  </>
                ) : step.type === "country" ? (
                  <>
                    <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">{step.title}</h2>
                    <p className="mb-8 text-neutral-400">{step.subtitle}</p>
                    <CountrySelect value={form.country} onChange={(v) => update("country", v)} onConfirm={goNext} t={t} />
                    <div className="mt-6">
                      <ActionButton onClick={goNext} disabled={!form.country} label={t("continue")} />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">{step.title}</h2>
                    <p className="mb-8 text-neutral-400">{step.subtitle}</p>
                    <NumberInput
                      value={form[step.field] as number}
                      onChange={(v) => update(step.field, v)}
                      onConfirm={goNext}
                      unit={step.unit}
                      step={step.step}
                      min={step.min}
                      max={step.max}
                      quickPicks={step.quickPicks}
                      t={t}
                      locale={locale}
                    />
                    <div className="mt-6">
                      <ActionButton onClick={goNext} label={stepIndex === steps.length - 1 ? t("review") : t("continue")} />
                    </div>
                  </>
                )}
              </StepWrapper>
            ))
          )}
        </div>
      </div>

      {!showResult && !showReview && currentStep?.type !== "info" && (
        <div className="px-6 py-4 text-center">
          <p className="text-xs text-neutral-700">
            <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-500">Enter</kbd>{" "}
            {t("enterToContinue")} ·{" "}
            <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-500">Esc</kbd>{" "}
            {t("escToGoBack")}
          </p>
        </div>
      )}
    </div>
  );
}

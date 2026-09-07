"use client";

import { cn } from "@/lib/utils";

/** Colour swatch + hex text input, kept in sync. */
export function ColorField({
  label,
  value,
  onChange,
  hint,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  className?: string;
}) {
  // <input type=color> only understands #rrggbb, so strip any alpha suffix.
  const solid = /^#([0-9a-f]{6})/i.test(value) ? value.slice(0, 7) : "#000000";
  return (
    <div className={className}>
      <label className="label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={solid}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} colour picker`}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-ink-300 bg-white p-1"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className={cn("field font-mono text-xs")}
          placeholder="#0d1019"
        />
      </div>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

/** Labelled slider with a live numeric readout. */
export function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "px",
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="label">{label}</label>
        <span className="text-xs font-semibold tabular-nums text-ink-500">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600"
      />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

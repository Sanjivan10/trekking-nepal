"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save, Check, AlertCircle, Monitor, Smartphone } from "lucide-react";
import { Panel } from "./form-shell";
import { Field, Input, Textarea, Toggle, ImageField } from "./fields";
import { RangeField } from "./color-field";
import { Hero } from "@/components/site/hero";
import type { Settings } from "@/lib/settings";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "text", label: "Headline & text" },
  { id: "media", label: "Image & size" },
  { id: "cta", label: "Buttons & stats" },
  { id: "badges", label: "Review badges" },
];

export function HeroForm({
  initial,
  regions,
}: {
  initial: Settings;
  regions: Array<{ slug: string; name: string }>;
}) {
  const router = useRouter();
  const [s, setS] = useState<Settings>(initial);
  const [tab, setTab] = useState("text");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setS((p) => ({ ...p, [k]: v }));
    setSaved(false);
  };

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <h1 className="min-w-0 flex-1 text-base font-bold text-ink-900">Homepage hero</h1>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" aria-hidden /> : saved ? <Check size={14} aria-hidden /> : <Save size={14} aria-hidden />}
            {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
          </button>
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition",
                tab === t.id ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500 hover:text-ink-800",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:mx-6 lg:mx-8">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[24rem_minmax(0,1fr)] lg:p-8">
        <div className="space-y-5">
          {tab === "text" && (
            <Panel title="Headline" description="The accent word renders in an italic serif — that's the design detail that makes it feel premium.">
              <Field label="Eyebrow" hint="Small pill above the headline. Leave empty to hide.">
                <Input value={s.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
              </Field>
              <Field label="Headline">
                <Input value={s.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} placeholder="Real Himalayan treks." />
              </Field>
              <Field label="Accent word (italic serif)">
                <Input value={s.heroAccent} onChange={(e) => set("heroAccent", e.target.value)} placeholder="Zero corporate BS." />
              </Field>
              <Field label="Headline continues" hint="Optional text after the accent word.">
                <Input value={s.heroTitleAfter} onChange={(e) => set("heroTitleAfter", e.target.value)} />
              </Field>
              <Field label="Subtitle">
                <Textarea rows={4} value={s.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
              </Field>
              <Field label="Oversized background word" hint="Huge word bleeding off the bottom edge. Empty to hide.">
                <Input value={s.heroWordmark} onChange={(e) => set("heroWordmark", e.target.value.toUpperCase())} placeholder="HIMALAYA" />
              </Field>
            </Panel>
          )}

          {tab === "media" && (
            <Panel title="Background image & sizing">
              <ImageField
                label="Hero image"
                value={s.heroImage}
                onChange={(v) => set("heroImage", v)}
                alt={s.heroImageAlt}
                onAltChange={(v) => set("heroImageAlt", v)}
                hint="This is the LCP image — use at least 2000px wide. Leave empty for the default."
              />
              <RangeField label="Hero height" value={s.heroHeight} onChange={(v) => set("heroHeight", v)} min={50} max={100} unit="vh" />
              <RangeField label="Image darkening" value={s.heroOverlay} onChange={(v) => set("heroOverlay", v)} min={0} max={90} unit="%" hint="Higher = darker image, more readable text." />
            </Panel>
          )}

          {tab === "cta" && (
            <>
              <Panel title="Buttons">
                <Field label="Primary button label"><Input value={s.heroPrimaryLabel} onChange={(e) => set("heroPrimaryLabel", e.target.value)} /></Field>
                <Field label="Primary button link"><Input value={s.heroPrimaryUrl} onChange={(e) => set("heroPrimaryUrl", e.target.value)} placeholder="/nepal-trekking-routes" /></Field>
                <Field label="Secondary button label" hint="Leave empty to use the main-site booking label."><Input value={s.heroSecondaryLabel} onChange={(e) => set("heroSecondaryLabel", e.target.value)} /></Field>
                <Field label="Secondary button link"><Input value={s.heroSecondaryUrl} onChange={(e) => set("heroSecondaryUrl", e.target.value)} /></Field>
                <Toggle checked={s.heroShowSearch} onChange={(v) => set("heroShowSearch", v)} label="Show trek search panel" />
              </Panel>
              <Panel title="Stats strip">
                <Toggle checked={s.heroShowStats} onChange={(v) => set("heroShowStats", v)} label="Show stats" />
                <Field label="Stats" hint='One per line, formatted "value|label" — e.g. "4.9|Google rating".'>
                  <Textarea rows={6} value={s.heroStats} onChange={(e) => set("heroStats", e.target.value)} className="font-mono text-[0.8125rem]" />
                </Field>
              </Panel>
            </>
          )}

          {tab === "badges" && (
            <Panel
              title="Google & TripAdvisor badges"
              description="Shown in the footer and beside the reviews. These link to your real profiles — they are deliberately not put into rating schema, because Google's policy forbids marking up another platform's reviews as your own."
            >
              <Toggle checked={s.showReviewBadges} onChange={(v) => set("showReviewBadges", v)} label="Show review badges" />
              <Field label="Google profile URL"><Input value={s.googleReviewUrl} onChange={(e) => set("googleReviewUrl", e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Google rating"><Input value={s.googleRating} onChange={(e) => set("googleRating", e.target.value)} placeholder="4.9" /></Field>
                <Field label="Google review count"><Input value={s.googleCount} onChange={(e) => set("googleCount", e.target.value)} placeholder="87" /></Field>
              </div>
              <Field label="TripAdvisor URL"><Input value={s.tripadvisorUrl} onChange={(e) => set("tripadvisorUrl", e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="TripAdvisor rating"><Input value={s.tripadvisorRating} onChange={(e) => set("tripadvisorRating", e.target.value)} placeholder="5.0" /></Field>
                <Field label="TripAdvisor count"><Input value={s.tripadvisorCount} onChange={(e) => set("tripadvisorCount", e.target.value)} placeholder="211" /></Field>
              </div>
            </Panel>
          )}
        </div>

        <div className="lg:sticky lg:top-32 lg:h-fit">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Live preview</p>
            <div className="flex gap-1 rounded-lg border border-ink-200 p-0.5">
              {([["desktop", Monitor], ["mobile", Smartphone]] as const).map(([id, Icon]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDevice(id)}
                  aria-label={id}
                  aria-pressed={device === id}
                  className={cn("rounded p-1.5 transition", device === id ? "bg-brand-50 text-brand-700" : "text-ink-400")}
                >
                  <Icon size={15} aria-hidden />
                </button>
              ))}
            </div>
          </div>
          <div className={cn("overflow-hidden rounded-2xl border border-ink-200", device === "mobile" && "mx-auto max-w-[400px]")}>
            <div className="pointer-events-none origin-top scale-[0.62]" style={{ width: "161%", marginBottom: "-38%" }}>
              <Hero settings={s} regions={regions} />
            </div>
          </div>
          <p className="hint">Scaled-down preview. Save to publish to the live site.</p>
        </div>
      </div>
    </>
  );
}

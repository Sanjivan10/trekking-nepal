"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save, Check, AlertCircle, RotateCcw, Plus, Trash2, Monitor, Smartphone } from "lucide-react";
import { Panel } from "./form-shell";
import { Field, Input, Textarea, Toggle, AddButton } from "./fields";
import { ColorField, RangeField } from "./color-field";
import { FooterView } from "@/components/site/footer-view";
import { defaultSettings, type Settings, type FooterColumnData } from "@/lib/settings";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "content", label: "Content" },
  { id: "columns", label: "Link columns" },
  { id: "colors", label: "Colours" },
  { id: "size", label: "Size & spacing" },
  { id: "scene", label: "Mountain scene" },
];

const PRESETS: Array<{ name: string; patch: Partial<Settings> }> = [
  { name: "Midnight (default)", patch: { footerBg: "#0d1019", footerBgTo: "#12172a", footerText: "#aeb7c8", footerHeading: "#ffffff", footerAccent: "#38d391", footerBorder: "#ffffff1a", mountainColor: "#1b2030", mountainColor2: "#252b3d", snowColor: "#e8eef7", trekkerColor: "#38d391" } },
  { name: "Alpine dusk", patch: { footerBg: "#141024", footerBgTo: "#2a1b3d", footerText: "#c4b9d6", footerHeading: "#ffffff", footerAccent: "#f5a742", footerBorder: "#ffffff1f", mountainColor: "#241a38", mountainColor2: "#33254d", snowColor: "#ffd9a0", trekkerColor: "#f5a742" } },
  { name: "Forest", patch: { footerBg: "#0b1a14", footerBgTo: "#102a20", footerText: "#a9c4b6", footerHeading: "#ffffff", footerAccent: "#5fd39a", footerBorder: "#ffffff1a", mountainColor: "#122a20", mountainColor2: "#1b3b2c", snowColor: "#dff5e9", trekkerColor: "#5fd39a" } },
  { name: "Slate light", patch: { footerBg: "#f6f7f9", footerBgTo: "#eceef2", footerText: "#4f5b73", footerHeading: "#1b2030", footerAccent: "#06955f", footerBorder: "#00000014", mountainColor: "#d4d9e2", mountainColor2: "#e4e8ee", snowColor: "#ffffff", trekkerColor: "#06955f" } },
];

export function FooterForm({
  initial,
  preview,
}: {
  initial: Settings;
  preview: { regions: Array<{ slug: string; name: string }>; trips: Array<{ slug: string; title: string }> };
}) {
  const router = useRouter();
  const [s, setS] = useState<Settings>(initial);
  const [tab, setTab] = useState("content");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setS((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };
  const patch = (p: Partial<Settings>) => {
    setS((prev) => ({ ...prev, ...p }));
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

  /* ------------------------------ columns ------------------------------ */
  const setColumns = (columns: FooterColumnData[]) => set("columns", columns);
  const updateColumn = (i: number, p: Partial<FooterColumnData>) =>
    setColumns(s.columns.map((c, idx) => (idx === i ? { ...c, ...p } : c)));
  const moveColumn = (from: number, to: number) => {
    if (to < 0 || to >= s.columns.length) return;
    const next = [...s.columns];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setColumns(next);
  };

  return (
    <>
      {/* Sticky action bar */}
      <div className="sticky top-0 z-30 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <h1 className="min-w-0 flex-1 text-base font-bold text-ink-900">Footer &amp; site settings</h1>
          <button
            type="button"
            onClick={() => patch({ ...defaultSettings, columns: s.columns })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-2 text-sm font-semibold text-ink-600 transition hover:border-brand-400 hover:text-brand-700"
          >
            <RotateCcw size={14} aria-hidden />
            <span className="hidden sm:inline">Reset styles</span>
          </button>
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

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[26rem_minmax(0,1fr)] lg:p-8">
        {/* ----------------------------- Editor ---------------------------- */}
        <div className="space-y-5">
          {tab === "content" && (
            <>
              <Panel title="About block">
                <Field label="Tagline" hint="First paragraph under the logo.">
                  <Textarea rows={3} value={s.footerTagline} onChange={(e) => set("footerTagline", e.target.value)} />
                </Field>
                <Field label="Secondary text" hint="Optional second paragraph.">
                  <Textarea rows={2} value={s.footerAbout} onChange={(e) => set("footerAbout", e.target.value)} />
                </Field>
              </Panel>

              <Panel title="Contact details" description="Hidden by default. Turn on and fill in only what you want public — these also feed your Organization schema.">
                <Toggle checked={s.showContact} onChange={(v) => set("showContact", v)} label="Show contact block" />
                <Field label="Address">
                  <Input value={s.contactAddress} onChange={(e) => set("contactAddress", e.target.value)} placeholder="Leave empty to hide" />
                </Field>
                <Field label="Email">
                  <Input value={s.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="Leave empty to hide" />
                </Field>
                <Field label="Phone">
                  <Input value={s.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="Leave empty to hide" />
                </Field>
              </Panel>

              <Panel title="Social links" description="Blank fields are hidden.">
                <Field label="Facebook"><Input value={s.socialFacebook} onChange={(e) => set("socialFacebook", e.target.value)} placeholder="https://facebook.com/…" /></Field>
                <Field label="Instagram"><Input value={s.socialInstagram} onChange={(e) => set("socialInstagram", e.target.value)} placeholder="https://instagram.com/…" /></Field>
                <Field label="YouTube"><Input value={s.socialYoutube} onChange={(e) => set("socialYoutube", e.target.value)} placeholder="https://youtube.com/…" /></Field>
                <Field label="X / Twitter"><Input value={s.socialX} onChange={(e) => set("socialX", e.target.value)} placeholder="https://x.com/…" /></Field>
              </Panel>

              <Panel title="Call-to-action strip">
                <Toggle checked={s.showCta} onChange={(v) => set("showCta", v)} label="Show CTA" />
                <Field label="Title"><Input value={s.ctaTitle} onChange={(e) => set("ctaTitle", e.target.value)} /></Field>
                <Field label="Text"><Textarea rows={2} value={s.ctaText} onChange={(e) => set("ctaText", e.target.value)} /></Field>
                <Field label="Button label"><Input value={s.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} /></Field>
                <Field label="Button link"><Input value={s.ctaUrl} onChange={(e) => set("ctaUrl", e.target.value)} placeholder="/nepal-trekking-routes" /></Field>
              </Panel>

              <Panel title="Bottom bar">
                <Field label="Copyright text" hint="Use {year} to insert the current year automatically.">
                  <Input value={s.copyrightText} onChange={(e) => set("copyrightText", e.target.value)} placeholder="© {year} Trekking Nepal. All rights reserved." />
                </Field>
                <Toggle checked={s.showCredit} onChange={(v) => set("showCredit", v)} label="Show 'Official bookings via' credit" />
              </Panel>
            </>
          )}

          {tab === "columns" && (
            <Panel title="Link columns" description="Leave empty to use the automatic columns (regions, popular treks, resources).">
              <div className="space-y-3">
                {s.columns.map((column, i) => (
                  <div key={i} className="rounded-xl border border-ink-200 bg-white">
                    <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50 px-3 py-2">
                      <span className="flex-1 text-xs font-bold uppercase tracking-wide text-ink-600">Column {i + 1}</span>
                      <button type="button" onClick={() => moveColumn(i, i - 1)} className="rounded px-1.5 text-xs font-semibold text-ink-500 hover:bg-ink-200">↑</button>
                      <button type="button" onClick={() => moveColumn(i, i + 1)} className="rounded px-1.5 text-xs font-semibold text-ink-500 hover:bg-ink-200">↓</button>
                      <button type="button" onClick={() => setColumns(s.columns.filter((_, idx) => idx !== i))} className="rounded p-1 text-ink-400 hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={14} aria-hidden />
                      </button>
                    </div>
                    <div className="space-y-3 p-3">
                      <Field label="Heading">
                        <Input value={column.title} onChange={(e) => updateColumn(i, { title: e.target.value })} placeholder="Trekking regions" />
                      </Field>
                      <Toggle checked={column.visible !== false} onChange={(v) => updateColumn(i, { visible: v })} label="Visible" />
                      <div className="space-y-2">
                        {column.links.map((link, li) => (
                          <div key={li} className="flex gap-2">
                            <Input value={link.label} onChange={(e) => updateColumn(i, { links: column.links.map((l, x) => (x === li ? { ...l, label: e.target.value } : l)) })} placeholder="Label" className="flex-1" />
                            <Input value={link.href} onChange={(e) => updateColumn(i, { links: column.links.map((l, x) => (x === li ? { ...l, href: e.target.value } : l)) })} placeholder="/path or https://" className="flex-1" />
                            <button type="button" onClick={() => updateColumn(i, { links: column.links.filter((_, x) => x !== li) })} aria-label="Remove link" className="shrink-0 rounded-lg border border-ink-300 px-2 text-ink-400 hover:border-red-300 hover:text-red-600">
                              <Trash2 size={13} aria-hidden />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => updateColumn(i, { links: [...column.links, { label: "", href: "", external: false }] })} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
                          <Plus size={12} aria-hidden /> Add link
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <AddButton onClick={() => setColumns([...s.columns, { title: "", visible: true, links: [] }])} label="Add column" />
              </div>
            </Panel>
          )}

          {tab === "colors" && (
            <>
              <Panel title="Presets">
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => patch(preset.patch)}
                      className="flex items-center gap-2 rounded-xl border border-ink-200 p-2 text-left text-xs font-semibold text-ink-700 transition hover:border-brand-400"
                    >
                      <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-lg" style={{ background: preset.patch.footerBg }}>
                        <span className="mt-auto h-2.5 w-full" style={{ background: preset.patch.trekkerColor }} />
                      </span>
                      {preset.name}
                    </button>
                  ))}
                </div>
              </Panel>
              <Panel title="Footer colours">
                <ColorField label="Background (top)" value={s.footerBg} onChange={(v) => set("footerBg", v)} />
                <ColorField label="Background (bottom)" value={s.footerBgTo} onChange={(v) => set("footerBgTo", v)} hint="Set both the same for a flat colour." />
                <ColorField label="Body text" value={s.footerText} onChange={(v) => set("footerText", v)} />
                <ColorField label="Headings" value={s.footerHeading} onChange={(v) => set("footerHeading", v)} />
                <ColorField label="Accent (logo, buttons, links)" value={s.footerAccent} onChange={(v) => set("footerAccent", v)} />
                <ColorField label="Divider lines" value={s.footerBorder} onChange={(v) => set("footerBorder", v)} hint="Supports 8-digit hex for transparency, e.g. #ffffff1a" />
              </Panel>
            </>
          )}

          {tab === "size" && (
            <Panel title="Size &amp; spacing">
              <RangeField label="Body text size" value={s.footerFontSize} onChange={(v) => set("footerFontSize", v)} min={11} max={20} />
              <RangeField label="Column heading size" value={s.footerHeadingSize} onChange={(v) => set("footerHeadingSize", v)} min={10} max={22} />
              <RangeField label="Vertical padding" value={s.footerPaddingY} onChange={(v) => set("footerPaddingY", v)} min={16} max={140} />
              <RangeField label="Top corner radius" value={s.footerRadius} onChange={(v) => set("footerRadius", v)} min={0} max={64} />
              <RangeField label="Content max width" value={s.footerMaxWidth} onChange={(v) => set("footerMaxWidth", v)} min={640} max={1920} step={20} />
            </Panel>
          )}

          {tab === "scene" && (
            <Panel title="Mountain scene" description="A minimal Himalayan skyline drawn as SVG — no image files, so it stays sharp and weighs a couple of KB.">
              <Toggle checked={s.showMountains} onChange={(v) => set("showMountains", v)} label="Show mountain scene" />
              <Toggle checked={s.showTrekkers} onChange={(v) => set("showTrekkers", v)} label="Show trekkers" description="Four walking figures on the ridge line." />
              <Toggle checked={s.showPrayerFlags} onChange={(v) => set("showPrayerFlags", v)} label="Show prayer flags" />
              <Toggle checked={s.showStars} onChange={(v) => set("showStars", v)} label="Show stars" />
              <RangeField label="Scene height" value={s.sceneHeight} onChange={(v) => set("sceneHeight", v)} min={0} max={260} />
              <ColorField label="Front ridge" value={s.mountainColor} onChange={(v) => set("mountainColor", v)} />
              <ColorField label="Back ridge" value={s.mountainColor2} onChange={(v) => set("mountainColor2", v)} />
              <ColorField label="Snow &amp; stars" value={s.snowColor} onChange={(v) => set("snowColor", v)} />
              <ColorField label="Trekkers" value={s.trekkerColor} onChange={(v) => set("trekkerColor", v)} />
            </Panel>
          )}
        </div>

        {/* ----------------------------- Preview --------------------------- */}
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
                  className={cn("rounded p-1.5 transition", device === id ? "bg-brand-50 text-brand-700" : "text-ink-400 hover:text-ink-700")}
                >
                  <Icon size={15} aria-hidden />
                </button>
              ))}
            </div>
          </div>
          <div className={cn("overflow-hidden rounded-2xl border border-ink-200 shadow-sm", device === "mobile" && "mx-auto max-w-[400px]")}>
            <FooterView settings={s} data={preview} preview />
          </div>
          <p className="hint">Changes appear instantly here. Click <strong>Save changes</strong> to publish them to the live site.</p>
        </div>
      </div>
    </>
  );
}

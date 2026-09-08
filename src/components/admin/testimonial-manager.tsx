"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2, Loader2, Save, AlertCircle, Star } from "lucide-react";
import { Field, Input, Textarea, Select, Toggle } from "./fields";

export type Row = {
  id: string;
  source: string;
  authorName: string;
  authorMeta: string;
  rating: number;
  dateLabel: string;
  body: string;
  ownerReply: string;
  sourceUrl: string;
  tripName: string;
  featured: boolean;
  position: number;
  published: boolean;
};

const blank = (): Row => ({
  id: "", source: "google", authorName: "", authorMeta: "", rating: 5, dateLabel: "",
  body: "", ownerReply: "", sourceUrl: "", tripName: "", featured: false, position: 0, published: true,
});

export function TestimonialManager({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initial);
  const [draft, setDraft] = useState<Row>(blank());
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const patch = (id: string, p: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...p } : r)));

  async function create() {
    if (!draft.authorName.trim() || !draft.body.trim()) {
      setError("A reviewer name and review text are required.");
      return;
    }
    setBusy("new");
    setError("");
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, position: rows.length }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not add");
      setRows((p) => [...p, json]);
      setDraft(blank());
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add");
    } finally {
      setBusy("");
    }
  }

  async function save(row: Row) {
    setBusy(row.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy("");
    }
  }

  async function remove(id: string) {
    setBusy(id);
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setRows((p) => p.filter((r) => r.id !== id));
    setBusy("");
    router.refresh();
  }

  const fields = (row: Row, onChange: (p: Partial<Row>) => void) => (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Source">
          <Select value={row.source} onChange={(e) => onChange({ source: e.target.value })}>
            <option value="google">Google</option>
            <option value="tripadvisor">TripAdvisor</option>
            <option value="direct">Direct / verified trekker</option>
          </Select>
        </Field>
        <Field label="Reviewer name">
          <Input value={row.authorName} onChange={(e) => onChange({ authorName: e.target.value })} />
        </Field>
        <Field label="Rating">
          <Input type="number" min={1} max={5} value={row.rating} onChange={(e) => onChange({ rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)) })} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Reviewer meta" hint="e.g. Local Guide · 19 reviews">
          <Input value={row.authorMeta} onChange={(e) => onChange({ authorMeta: e.target.value })} />
        </Field>
        <Field label="Date label" hint="e.g. 4 months ago">
          <Input value={row.dateLabel} onChange={(e) => onChange({ dateLabel: e.target.value })} />
        </Field>
        <Field label="Trek name">
          <Input value={row.tripName} onChange={(e) => onChange({ tripName: e.target.value })} />
        </Field>
      </div>
      <Field label="Review text">
        <Textarea rows={4} value={row.body} onChange={(e) => onChange({ body: e.target.value })} />
      </Field>
      <Field label="Owner response" hint="Optional — shown as a quoted reply under the review.">
        <Textarea rows={3} value={row.ownerReply} onChange={(e) => onChange({ ownerReply: e.target.value })} />
      </Field>
      <Field label="Link to the original review">
        <Input value={row.sourceUrl} onChange={(e) => onChange({ sourceUrl: e.target.value })} placeholder="https://…" />
      </Field>
    </>
  );

  return (
    <div className="space-y-6">
      {error && (
        <p className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-brand-200 bg-brand-50/40 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-900">Add a review</h2>
        <div className="mt-4 space-y-3">{fields(draft, (p) => setDraft({ ...draft, ...p }))}</div>
        <div className="mt-4 flex items-center gap-4">
          <Toggle checked={draft.featured} onChange={(v) => setDraft({ ...draft, featured: v })} label="Feature it" />
          <button
            type="button"
            onClick={create}
            disabled={busy === "new"}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {busy === "new" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Plus size={15} aria-hidden />}
            Add review
          </button>
        </div>
      </section>

      <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
        {rows.length} review{rows.length === 1 ? "" : "s"}
      </h2>

      <div className="space-y-3">
        {rows.map((row) => (
          <details key={row.id} className="rounded-2xl border border-ink-200 bg-white">
            <summary className="flex cursor-pointer flex-wrap items-center gap-3 p-4">
              <span className="flex items-center gap-1 text-sm font-bold text-ink-900">
                {row.authorName}
                {row.featured && <Star size={12} fill="currentColor" strokeWidth={0} className="text-sun-500" aria-hidden />}
              </span>
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[0.625rem] font-semibold uppercase text-ink-600">{row.source}</span>
              {row.tripName && <span className="text-xs text-ink-500">{row.tripName}</span>}
              {!row.published && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[0.625rem] font-semibold text-amber-800">Hidden</span>}
              <span className="ml-auto text-xs text-ink-400">{row.dateLabel}</span>
            </summary>
            <div className="space-y-3 border-t border-ink-100 p-4">
              {fields(row, (p) => patch(row.id, p))}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-3">
                <div className="flex gap-5">
                  <Toggle checked={row.published} onChange={(v) => patch(row.id, { published: v })} label="Published" />
                  <Toggle checked={row.featured} onChange={(v) => patch(row.id, { featured: v })} label="Featured" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => remove(row.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-2 text-sm font-semibold text-ink-600 hover:border-red-300 hover:text-red-600">
                    <Trash2 size={14} aria-hidden /> Delete
                  </button>
                  <button type="button" onClick={() => save(row)} disabled={busy === row.id} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
                    {busy === row.id ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Save size={14} aria-hidden />} Save
                  </button>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

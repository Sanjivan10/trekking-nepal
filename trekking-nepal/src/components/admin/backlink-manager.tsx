"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2, Loader2, Save, AlertCircle, ExternalLink } from "lucide-react";
import { Field, Input, Textarea, TagInput, Toggle } from "./fields";
import { mainSite } from "@/lib/mainSite";

export type BacklinkRow = {
  id: string;
  keyword: string;
  targetUrl: string;
  anchorText: string;
  variations: string;
  priority: number;
  maxPerPage: number;
  active: boolean;
  notes: string;
};

const blank = (): BacklinkRow => ({
  id: "", keyword: "", targetUrl: "", anchorText: "", variations: "",
  priority: 0, maxPerPage: 1, active: true, notes: "",
});

/** Global keyword → main-site URL map used by the backlink engine. */
export function BacklinkManager({ initial }: { initial: BacklinkRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<BacklinkRow[]>(initial);
  const [draft, setDraft] = useState<BacklinkRow>(blank());
  const [busy, setBusy] = useState<string>("");
  const [error, setError] = useState("");

  async function create() {
    if (!draft.keyword.trim() || !draft.targetUrl.trim()) {
      setError("Both a keyword and a target URL are required.");
      return;
    }
    setBusy("new");
    setError("");
    try {
      const response = await fetch("/api/admin/backlinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Could not create rule");
      setRows((prev) => [json, ...prev]);
      setDraft(blank());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create rule");
    } finally {
      setBusy("");
    }
  }

  async function update(row: BacklinkRow) {
    setBusy(row.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/backlinks/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Could not save rule");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save rule");
    } finally {
      setBusy("");
    }
  }

  async function remove(id: string) {
    setBusy(id);
    await fetch(`/api/admin/backlinks/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((row) => row.id !== id));
    setBusy("");
    router.refresh();
  }

  const patch = (id: string, changes: Partial<BacklinkRow>) =>
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...changes } : row)));

  return (
    <div className="space-y-6">
      {error && (
        <p className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      {/* New rule */}
      <section className="rounded-2xl border border-brand-200 bg-brand-50/40 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-900">
          Add a keyword rule
        </h2>
        <p className="hint mt-1">
          The first time the keyword appears in a post&apos;s body text, it becomes a dofollow link
          to the target URL. Existing links, headings and code blocks are never touched.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Keyword to match" required>
            <Input
              value={draft.keyword}
              onChange={(e) => setDraft({ ...draft, keyword: e.target.value })}
              placeholder="Everest Base Camp Trek"
            />
          </Field>
          <Field label="Target URL on the main site" required>
            <Input
              value={draft.targetUrl}
              onChange={(e) => setDraft({ ...draft, targetUrl: e.target.value })}
              placeholder={`${mainSite.url}/trip/everest-base-camp-trek`}
            />
          </Field>
          <Field label="Anchor text" hint="Leave empty to use the matched keyword itself.">
            <Input
              value={draft.anchorText}
              onChange={(e) => setDraft({ ...draft, anchorText: e.target.value })}
            />
          </Field>
          <Field label="Anchor variations" hint="Rotated across pages for a natural link profile.">
            <TagInput
              value={draft.variations}
              onChange={(value) => setDraft({ ...draft, variations: value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Priority" hint="Higher wins on overlap.">
              <Input
                type="number"
                value={draft.priority}
                onChange={(e) => setDraft({ ...draft, priority: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Max per page">
              <Input
                type="number"
                min={1}
                value={draft.maxPerPage}
                onChange={(e) =>
                  setDraft({ ...draft, maxPerPage: Math.max(1, Number(e.target.value) || 1) })
                }
              />
            </Field>
          </div>
          <Field label="Notes">
            <Input
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />
          </Field>
        </div>

        <button
          type="button"
          onClick={create}
          disabled={busy === "new"}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {busy === "new" ? (
            <Loader2 size={15} className="animate-spin" aria-hidden />
          ) : (
            <Plus size={15} aria-hidden />
          )}
          Add rule
        </button>
      </section>

      {/* Existing rules */}
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
          No keyword rules yet. Add one above to start injecting cross-domain links.
        </p>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
            {rows.length} keyword rule{rows.length === 1 ? "" : "s"}
          </h2>

          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-ink-200 bg-white p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Keyword">
                  <Input
                    value={row.keyword}
                    onChange={(e) => patch(row.id, { keyword: e.target.value })}
                  />
                </Field>
                <Field label="Target URL">
                  <Input
                    value={row.targetUrl}
                    onChange={(e) => patch(row.id, { targetUrl: e.target.value })}
                  />
                </Field>
                <Field label="Anchor text">
                  <Input
                    value={row.anchorText}
                    onChange={(e) => patch(row.id, { anchorText: e.target.value })}
                  />
                </Field>
                <Field label="Anchor variations">
                  <TagInput
                    value={row.variations}
                    onChange={(value) => patch(row.id, { variations: value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Priority">
                    <Input
                      type="number"
                      value={row.priority}
                      onChange={(e) => patch(row.id, { priority: Number(e.target.value) || 0 })}
                    />
                  </Field>
                  <Field label="Max per page">
                    <Input
                      type="number"
                      min={1}
                      value={row.maxPerPage}
                      onChange={(e) =>
                        patch(row.id, { maxPerPage: Math.max(1, Number(e.target.value) || 1) })
                      }
                    />
                  </Field>
                </div>
                <Field label="Notes">
                  <Textarea
                    rows={2}
                    value={row.notes}
                    onChange={(e) => patch(row.id, { notes: e.target.value })}
                  />
                </Field>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
                <Toggle
                  checked={row.active}
                  onChange={(value) => patch(row.id, { active: value })}
                  label="Active"
                />
                <div className="flex items-center gap-2">
                  {row.targetUrl && (
                    <a
                      href={row.targetUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-2 text-sm font-semibold text-ink-600 transition hover:border-brand-400 hover:text-brand-700"
                    >
                      <ExternalLink size={14} aria-hidden />
                      Test
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-2 text-sm font-semibold text-ink-600 transition hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 size={14} aria-hidden />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => update(row)}
                    disabled={busy === row.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
                  >
                    {busy === row.id ? (
                      <Loader2 size={14} className="animate-spin" aria-hidden />
                    ) : (
                      <Save size={14} aria-hidden />
                    )}
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, Save, Trash2, ExternalLink, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab = { id: string; label: string };

/**
 * Shared editor chrome: sticky action bar, tab switching, save/delete state.
 * Keeps BlogForm and ItineraryForm focused on their own fields.
 */
export function FormShell({
  title,
  backHref,
  tabs,
  activeTab,
  onTabChange,
  status,
  onStatusChange,
  onSave,
  onDelete,
  previewHref,
  saving,
  error,
  saved,
  children,
}: {
  title: string;
  backHref: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  onSave: () => void;
  onDelete?: () => void;
  previewHref?: string;
  saving: boolean;
  error?: string;
  saved?: boolean;
  children: React.ReactNode;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href={backHref}
            aria-label="Back"
            className="rounded-lg p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
          >
            <ArrowLeft size={17} aria-hidden />
          </Link>

          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-ink-900">{title}</h1>

          <div className="flex items-center gap-2">
            {previewHref && status === "published" && (
              <a
                href={previewHref}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
              >
                <ExternalLink size={14} aria-hidden />
                <span className="hidden sm:inline">View</span>
              </a>
            )}

            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Publish status"
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-semibold outline-none",
                status === "published"
                  ? "border-brand-300 bg-brand-50 text-brand-800"
                  : "border-amber-300 bg-amber-50 text-amber-800",
              )}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            {onDelete && (
              <button
                type="button"
                onClick={() => (confirming ? onDelete() : setConfirming(true))}
                onBlur={() => setConfirming(false)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                  confirming
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-ink-300 text-ink-600 hover:border-red-300 hover:text-red-600",
                )}
              >
                <Trash2 size={14} aria-hidden />
                <span className="hidden sm:inline">{confirming ? "Confirm delete" : "Delete"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" aria-hidden />
              ) : saved ? (
                <Check size={14} aria-hidden />
              ) : (
                <Save size={14} aria-hidden />
              )}
              {saving ? "Saving…" : saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-ink-500 hover:text-ink-800",
              )}
            >
              {tab.label}
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

      <div className="p-4 sm:p-6 lg:p-8">{children}</div>
    </>
  );
}

/** Card wrapper used to group related fields inside a tab. */
export function Panel({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-ink-200 bg-white p-5", className)}>
      {title && (
        <header className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">{title}</h2>
          {description && <p className="hint mt-1">{description}</p>}
        </header>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

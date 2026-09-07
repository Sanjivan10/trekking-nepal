"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Link2, Loader2, Plus, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------ primitives ------------------------------ */

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="label">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("field", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("field", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("field", props.className)} />;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition",
          checked ? "bg-brand-600" : "bg-ink-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          )}
          style={{ transform: `translateX(${checked ? 18 : 2}px)` }}
        />
      </button>
      <span>
        <span className="block text-sm font-semibold text-ink-800">{label}</span>
        {description && <span className="hint mt-0 block">{description}</span>}
      </span>
    </label>
  );
}

/** Character counter tuned to SEO limits (55–60 title, 150–160 description). */
export function CharCount({ value, ideal, max }: { value: string; ideal: number; max: number }) {
  const length = value.length;
  const tone =
    length === 0
      ? "text-ink-400"
      : length > max
        ? "text-red-600"
        : length >= ideal
          ? "text-brand-600"
          : "text-amber-600";
  return (
    <span className={cn("text-xs font-medium tabular-nums", tone)}>
      {length}/{max}
    </span>
  );
}

/* ------------------------------ tag input ------------------------------ */

/** Keyword / entity tagger. Unlimited tags, comma or Enter to commit. */
export function TagInput({
  value,
  onChange,
  placeholder = "Add a keyword and press Enter",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const tags = value.split(",").map((t) => t.trim()).filter(Boolean);

  const commit = (raw: string) => {
    const additions = raw.split(",").map((t) => t.trim()).filter(Boolean);
    if (!additions.length) return;
    const next = [...tags];
    for (const tag of additions) {
      if (!next.some((existing) => existing.toLowerCase() === tag.toLowerCase())) next.push(tag);
    }
    onChange(next.join(", "));
    setDraft("");
  };

  const remove = (index: number) =>
    onChange(tags.filter((_, i) => i !== index).join(", "));

  return (
    <div className="rounded-lg border border-ink-300 bg-white p-2 transition focus-within:border-brand-500 focus-within:ring-[3px] focus-within:ring-brand-100">
      {tags.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <li
              key={`${tag}-${index}`}
              className="inline-flex items-center gap-1 rounded-md bg-brand-50 py-1 pl-2 pr-1 text-xs font-medium text-brand-800 ring-1 ring-inset ring-brand-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove ${tag}`}
                className="rounded p-0.5 transition hover:bg-brand-200"
              >
                <X size={12} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        value={draft}
        onChange={(e) => {
          if (e.target.value.includes(",")) commit(e.target.value);
          else setDraft(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(draft);
          } else if (e.key === "Backspace" && !draft && tags.length) {
            remove(tags.length - 1);
          }
        }}
        onBlur={() => commit(draft)}
        placeholder={placeholder}
        className="w-full bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-ink-400"
      />
    </div>
  );
}

/* ----------------------------- image field ----------------------------- */

/** Image URL input with upload-to-/public/uploads and a live preview. */
export function ImageField({
  value,
  onChange,
  label,
  hint,
  alt,
  onAltChange,
  altLabel = "Alt text",
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  hint?: string;
  alt?: string;
  onAltChange?: (value: string) => void;
  altLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Upload failed");
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… or /uploads/photo.jpg"
            className="field pl-8"
          />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink-300 bg-white px-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : (
            <Upload size={14} aria-hidden />
          )}
          <span className="hidden sm:inline">{uploading ? "Uploading…" : "Upload"}</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="hint text-red-600">{error}</p>}
      {hint && !error && <p className="hint">{hint}</p>}

      {value && (
        <div className="mt-2 flex gap-3">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-ink-200 bg-ink-100">
            {/* Unoptimised preview so admin edits stay instant. */}
            <Image
              src={value}
              alt={alt || "Preview"}
              fill
              unoptimized
              sizes="128px"
              className="object-cover"
            />
          </div>
          {onAltChange && (
            <div className="min-w-0 flex-1">
              <label className="label">{altLabel}</label>
              <input
                value={alt || ""}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="Describe the image for screen readers and image search"
                className="field"
              />
            </div>
          )}
        </div>
      )}

      {!value && onAltChange && (
        <div className="mt-2">
          <label className="label">{altLabel}</label>
          <input
            value={alt || ""}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Describe the image for screen readers and image search"
            className="field"
          />
        </div>
      )}
    </div>
  );
}

/* --------------------------- repeatable rows --------------------------- */

export function RepeaterCard({
  index,
  title,
  onRemove,
  onMoveUp,
  onMoveDown,
  children,
}: {
  index: number;
  title: string;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white">
      <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50 px-3 py-2">
        <GripVertical size={14} className="text-ink-400" aria-hidden />
        <span className="flex-1 text-xs font-bold uppercase tracking-wide text-ink-600">
          {title}
        </span>
        {onMoveUp && (
          <button
            type="button"
            onClick={onMoveUp}
            aria-label={`Move ${title} up`}
            className="rounded px-1.5 py-0.5 text-xs font-semibold text-ink-500 transition hover:bg-ink-200"
          >
            ↑
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            onClick={onMoveDown}
            aria-label={`Move ${title} down`}
            className="rounded px-1.5 py-0.5 text-xs font-semibold text-ink-500 transition hover:bg-ink-200"
          >
            ↓
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${title}`}
          className="rounded p-1 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={14} aria-hidden />
        </button>
      </div>
      <div className="space-y-3 p-3">{children}</div>
    </div>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-300 py-3 text-sm font-semibold text-ink-600 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
    >
      <Plus size={15} aria-hidden />
      {label}
    </button>
  );
}

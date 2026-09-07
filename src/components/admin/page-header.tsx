import Link from "next/link";
import { Plus } from "lucide-react";

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="border-b border-ink-200 bg-white">
      <div className="flex flex-wrap items-end justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-ink-600">{description}</p>}
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            <Plus size={15} aria-hidden />
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const published = status === "published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        published
          ? "bg-brand-50 text-brand-800 ring-brand-200"
          : "bg-amber-50 text-amber-800 ring-amber-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${published ? "bg-brand-500" : "bg-amber-500"}`}
        aria-hidden
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

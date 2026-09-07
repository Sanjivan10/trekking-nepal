"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Check, Trash2, Loader2, X } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import { formatDate } from "@/lib/utils";

export type ReviewRow = {
  id: string;
  authorName: string;
  country: string;
  rating: number;
  title: string;
  body: string;
  approved: boolean;
  reviewedAt: string;
  itinerary: { title: string; slug: string };
};

export function ReviewModeration({ initial }: { initial: ReviewRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState("");
  const [filter, setFilter] = useState<"all" | "pending">("pending");

  const visible = rows.filter((row) => (filter === "pending" ? !row.approved : true));
  const pendingCount = rows.filter((row) => !row.approved).length;

  async function setApproved(id: string, approved: boolean) {
    setBusy(id);
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, approved } : row)));
    setBusy("");
    router.refresh();
  }

  async function remove(id: string) {
    setBusy(id);
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((row) => row.id !== id));
    setBusy("");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(["pending", "all"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              filter === value
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-ink-200 bg-white text-ink-700 hover:border-brand-300"
            }`}
          >
            {value === "pending" ? `Pending (${pendingCount})` : `All (${rows.length})`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
          {filter === "pending" ? "No reviews awaiting moderation." : "No reviews yet."}
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((review) => (
            <li key={review.id} className="rounded-2xl border border-ink-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-ink-900">{review.authorName}</span>
                    {review.country && (
                      <span className="text-xs text-ink-500">{review.country}</span>
                    )}
                    <Stars rating={review.rating} size={13} />
                    {!review.approved && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    <Link
                      href={`/itinerary/${review.itinerary.slug}`}
                      target="_blank"
                      className="font-medium text-brand-700 hover:underline"
                    >
                      {review.itinerary.title}
                    </Link>
                    {" · "}
                    {formatDate(review.reviewedAt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {review.approved ? (
                    <button
                      type="button"
                      onClick={() => setApproved(review.id, false)}
                      disabled={busy === review.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-2 text-sm font-semibold text-ink-600 transition hover:border-amber-300 hover:text-amber-700 disabled:opacity-60"
                    >
                      <X size={14} aria-hidden />
                      Unpublish
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setApproved(review.id, true)}
                      disabled={busy === review.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
                    >
                      {busy === review.id ? (
                        <Loader2 size={14} className="animate-spin" aria-hidden />
                      ) : (
                        <Check size={14} aria-hidden />
                      )}
                      Approve
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(review.id)}
                    disabled={busy === review.id}
                    aria-label="Delete review"
                    className="rounded-lg border border-ink-300 p-2 text-ink-500 transition hover:border-red-300 hover:text-red-600 disabled:opacity-60"
                  >
                    <Trash2 size={14} aria-hidden />
                  </button>
                </div>
              </div>

              {review.title && (
                <p className="mt-3 text-sm font-bold text-ink-900">{review.title}</p>
              )}
              <p className="mt-1 text-sm leading-relaxed text-ink-700">{review.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

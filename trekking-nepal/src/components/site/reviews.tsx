"use client";

import { useState, useTransition } from "react";
import { Star, Send, CheckCircle2, AlertCircle, Quote } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import { formatDate, isoDate } from "@/lib/utils";

export type ReviewItem = {
  id: string;
  authorName: string;
  country?: string | null;
  rating: number;
  title?: string | null;
  body?: string | null;
  reviewedAt: string;
};

/** Aggregate rating visualisation + review list + submission form. */
export function ReviewSection({
  itinerarySlug,
  reviews,
  ratingValue,
  reviewCount,
}: {
  itinerarySlug: string;
  reviews: ReviewItem[];
  ratingValue: number;
  reviewCount: number;
}) {
  const [visible, setVisible] = useState(4);

  // Distribution bars, computed from the reviews we render.
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count, pct: reviews.length ? (count / reviews.length) * 100 : 0 };
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        {reviewCount > 0 && (
          <div className="mb-6 flex flex-col gap-5 rounded-2xl border border-ink-200 bg-white p-5 sm:flex-row sm:items-center sm:gap-8">
            <div className="shrink-0 text-center sm:text-left">
              <p className="text-4xl font-extrabold leading-none text-ink-900">
                {ratingValue.toFixed(1)}
                <span className="text-lg font-semibold text-ink-400">/5</span>
              </p>
              <Stars rating={ratingValue} size={16} className="mt-2 justify-center sm:justify-start" />
              <p className="mt-1.5 text-xs text-ink-500">
                {reviewCount} verified review{reviewCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex-1 space-y-1.5">
              {distribution.map((row) => (
                <div key={row.star} className="flex items-center gap-2 text-xs">
                  <span className="flex w-8 shrink-0 items-center gap-0.5 font-medium text-ink-600">
                    {row.star}
                    <Star size={10} fill="currentColor" strokeWidth={0} className="text-sun-500" aria-hidden />
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                    <span
                      className="block h-full rounded-full bg-sun-500 transition-[width] duration-700"
                      style={{ width: `${row.pct}%` }}
                    />
                  </span>
                  <span className="w-6 shrink-0 text-right text-ink-500">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink-300 p-8 text-center text-sm text-ink-500">
            No reviews yet — be the first to share your experience on this trek.
          </p>
        ) : (
          <>
            <ul className="space-y-4">
              {reviews.slice(0, visible).map((review) => (
                <li key={review.id} className="rounded-2xl border border-ink-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700"
                        aria-hidden
                      >
                        {review.authorName.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink-900">{review.authorName}</p>
                        <p className="text-xs text-ink-500">
                          {review.country ? `${review.country} · ` : ""}
                          <time dateTime={isoDate(review.reviewedAt)}>
                            {formatDate(review.reviewedAt)}
                          </time>
                        </p>
                      </div>
                    </div>
                    <Stars rating={review.rating} size={14} />
                  </div>
                  {review.title && (
                    <p className="mt-3 text-[0.9375rem] font-bold text-ink-900">{review.title}</p>
                  )}
                  {review.body && (
                    <p className="mt-1.5 flex gap-2 text-sm leading-relaxed text-ink-700">
                      <Quote size={14} className="mt-1 shrink-0 text-ink-300" aria-hidden />
                      {review.body}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            {visible < reviews.length && (
              <button
                type="button"
                onClick={() => setVisible((v) => v + 6)}
                className="mt-4 w-full rounded-xl border border-ink-200 bg-white py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
              >
                Show {Math.min(6, reviews.length - visible)} more reviews
              </button>
            )}
          </>
        )}
      </div>

      <ReviewForm itinerarySlug={itinerarySlug} />
    </div>
  );
}

function ReviewForm({ itinerarySlug }: { itinerarySlug: string }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    start(async () => {
      try {
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, rating, slug: itinerarySlug }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Something went wrong");
        setStatus("ok");
        setMessage(json.message || "Thanks! Your review is awaiting moderation.");
        form.reset();
        setRating(5);
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Something went wrong");
      }
    });
  }

  return (
    <aside className="h-fit rounded-2xl border border-ink-200 bg-ink-50 p-5 lg:sticky lg:top-24">
      <h3 className="text-base font-bold text-ink-900">Write a review</h3>
      <p className="mt-1 text-xs leading-relaxed text-ink-600">
        Trekked with us? Share your experience. Reviews are published after a quick check.
      </p>

      {status === "ok" ? (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-800 ring-1 ring-inset ring-brand-200">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden />
          {message}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <fieldset>
            <legend className="label">Your rating</legend>
            <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  aria-label={`${star} star${star === 1 ? "" : "s"}`}
                  aria-pressed={rating === star}
                  className="rounded p-0.5 transition hover:scale-110"
                >
                  <Star
                    size={24}
                    strokeWidth={1.5}
                    className={(hover || rating) >= star ? "text-sun-500" : "text-ink-300"}
                    fill={(hover || rating) >= star ? "currentColor" : "none"}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="label" htmlFor="rv-name">
              Name *
            </label>
            <input id="rv-name" name="authorName" required maxLength={80} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="rv-country">
              Country
            </label>
            <input id="rv-country" name="country" maxLength={60} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="rv-title">
              Headline
            </label>
            <input id="rv-title" name="title" maxLength={120} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="rv-body">
              Your review *
            </label>
            <textarea id="rv-body" name="body" required rows={4} maxLength={2000} className="field" />
          </div>

          {/* Honeypot — bots fill this, humans never see it. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          {status === "error" && (
            <p className="flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "Submitting…" : "Submit review"}
            {!pending && <Send size={14} aria-hidden />}
          </button>
        </form>
      )}
    </aside>
  );
}

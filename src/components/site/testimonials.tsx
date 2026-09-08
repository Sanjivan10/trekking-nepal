import { Quote, ExternalLink } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
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
};

const SOURCE_LABEL: Record<string, string> = {
  google: "Google",
  tripadvisor: "TripAdvisor",
  direct: "Verified trekker",
};

const SOURCE_DOT: Record<string, string> = {
  google: "bg-[#4285F4]",
  tripadvisor: "bg-[#00AF87]",
  direct: "bg-brand-500",
};

/**
 * Third-party testimonials wall. Attribution to the originating platform is
 * shown on every card, and each links back to the real review — these are
 * other people's words, not ours.
 */
export function Testimonials({
  items,
  className,
}: {
  items: TestimonialItem[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <ul
      className={cn(
        "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col rounded-2xl border border-ink-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-ink-900/5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700"
                aria-hidden
              >
                {item.authorName.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink-900">{item.authorName}</p>
                {item.authorMeta && (
                  <p className="truncate text-[0.6875rem] text-ink-500">{item.authorMeta}</p>
                )}
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink-50 px-2 py-1 text-[0.625rem] font-semibold text-ink-600 ring-1 ring-inset ring-ink-200">
              <span className={cn("h-1.5 w-1.5 rounded-full", SOURCE_DOT[item.source] ?? "bg-ink-400")} aria-hidden />
              {SOURCE_LABEL[item.source] ?? item.source}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Stars rating={item.rating} size={13} />
            {item.dateLabel && <span className="text-xs text-ink-400">{item.dateLabel}</span>}
          </div>

          {item.tripName && (
            <p className="mt-2 text-xs font-semibold text-brand-700">{item.tripName}</p>
          )}

          <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">
            <Quote size={14} className="mr-1 inline -translate-y-0.5 text-ink-300" aria-hidden />
            {item.body}
          </blockquote>

          {item.ownerReply && (
            <div className="mt-4 rounded-xl border-l-2 border-brand-400 bg-ink-50 px-3 py-2.5">
              <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-ink-500">
                Response from the team
              </p>
              <p className="mt-1 line-clamp-4 text-xs leading-relaxed text-ink-600">
                {item.ownerReply}
              </p>
            </div>
          )}

          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener nofollow"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-ink-500 transition hover:text-brand-700"
            >
              Read on {SOURCE_LABEL[item.source] ?? item.source}
              <ExternalLink size={11} aria-hidden />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

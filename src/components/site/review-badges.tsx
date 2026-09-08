import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Google "G" mark, drawn inline so there is no external image request. */
function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.5c0-1.6-.15-3.2-.43-4.7H24v9h12.9c-.56 3-2.24 5.5-4.77 7.2l7.5 5.8c4.4-4 6.35-10 6.35-17.3z" />
      <path fill="#FBBC05" d="M10.4 28.7A14.6 14.6 0 0 1 9.6 24c0-1.6.28-3.2.77-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.94 7.5 2.6 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

/** TripAdvisor owl, simplified to its two eyes and beak. */
function TripAdvisorMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 32" aria-hidden focusable="false">
      <circle cx="14" cy="16" r="11" fill="#00AF87" />
      <circle cx="34" cy="16" r="11" fill="#00AF87" />
      <circle cx="14" cy="16" r="5.2" fill="#fff" />
      <circle cx="34" cy="16" r="5.2" fill="#fff" />
      <circle cx="14" cy="16" r="2.4" fill="#000" />
      <circle cx="34" cy="16" r="2.4" fill="#000" />
      <path d="M24 3 L19.5 8.5 h9 Z" fill="#00AF87" />
    </svg>
  );
}

export type BadgeSettings = {
  showReviewBadges: boolean;
  googleReviewUrl: string;
  googleRating: string;
  googleCount: string;
  tripadvisorUrl: string;
  tripadvisorRating: string;
  tripadvisorCount: string;
};

/**
 * Google + TripAdvisor rating badges. These link out to the real profiles;
 * they are deliberately NOT wired into AggregateRating JSON-LD, because
 * Google's review-snippet policy forbids marking up ratings gathered on
 * another platform as your own.
 */
export function ReviewBadges({
  settings: s,
  tone = "dark",
  className,
  borderColor,
}: {
  settings: BadgeSettings;
  tone?: "dark" | "light";
  className?: string;
  borderColor?: string;
}) {
  if (!s.showReviewBadges) return null;

  const badges = [
    {
      key: "google",
      url: s.googleReviewUrl,
      rating: s.googleRating,
      count: s.googleCount,
      label: "Google Reviews",
      Mark: GoogleMark,
    },
    {
      key: "tripadvisor",
      url: s.tripadvisorUrl,
      rating: s.tripadvisorRating,
      count: s.tripadvisorCount,
      label: "TripAdvisor",
      Mark: TripAdvisorMark,
    },
  ].filter((b) => b.url?.trim() && b.rating?.trim());

  if (badges.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {badges.map(({ key, url, rating, count, label, Mark }) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noopener"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition hover:-translate-y-0.5",
              tone === "dark" ? "bg-white/[0.06] hover:bg-white/[0.1]" : "bg-white hover:shadow-md",
            )}
            style={{ border: `1px solid ${borderColor || (tone === "dark" ? "rgba(255,255,255,0.14)" : "#d4d9e2")}` }}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white">
              <Mark size={20} />
            </span>
            <span className="leading-tight">
              <span className="flex items-center gap-1.5">
                <span className={cn("text-base font-extrabold", tone === "dark" ? "text-white" : "text-ink-900")}>
                  {rating}
                </span>
                <span className="flex" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={11} fill="currentColor" strokeWidth={0} className="text-sun-500" />
                  ))}
                </span>
              </span>
              <span className={cn("block text-[0.6875rem] font-medium", tone === "dark" ? "text-white/60" : "text-ink-500")}>
                {count ? `${count} reviews on ${label}` : label}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

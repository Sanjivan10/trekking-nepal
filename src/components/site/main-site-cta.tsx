import { ExternalLink, ShieldCheck, BadgeCheck, CalendarCheck } from "lucide-react";
import { mainSite, mainSiteUrl } from "@/lib/mainSite";
import { cn } from "@/lib/utils";

/**
 * "Book the official tour" callout card.
 *
 * Rendered on every itinerary and blog page. The link is a plain editorial
 * dofollow link (rel="noopener" only) to the main destination site.
 */
export function MainSiteCta({
  targetUrl,
  headline,
  text,
  tripTitle,
  variant = "full",
  className,
}: {
  targetUrl?: string | null;
  headline?: string | null;
  text?: string | null;
  tripTitle?: string | null;
  variant?: "full" | "compact";
  className?: string;
}) {
  const href = mainSiteUrl(targetUrl || "/");
  const title =
    headline?.trim() ||
    (tripTitle ? `Book the official ${tripTitle}` : `Book your trek on ${mainSite.name}`);
  const body =
    text?.trim() ||
    `Departure dates, live availability and secure booking are handled on ${mainSite.name}, our official booking site — with licensed guides, government-registered porters and full permit support included.`;

  if (variant === "compact") {
    return (
      <aside
        className={cn(
          "rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white shadow-lg shadow-brand-900/10",
          className,
        )}
      >
        <p className="text-xs font-bold uppercase tracking-wide text-brand-200">
          Official booking
        </p>
        <h2 className="mt-1.5 text-lg font-bold leading-snug">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-50/90">
          Reserve your spot directly with {mainSite.name}.
        </p>
        <a
          href={href}
          rel="noopener"
          target="_blank"
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand-800 transition hover:bg-brand-50"
        >
          Book on {mainSite.name}
          <ExternalLink size={14} aria-hidden />
        </a>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "not-prose overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-700 to-brand-900 text-white shadow-xl shadow-brand-900/15",
        className,
      )}
    >
      <div className="relative p-6 sm:p-8">
        {/* Decorative ridge line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-15 sm:block"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Cpath d='M0 200 L90 60 L150 120 L220 20 L300 110 L400 40 L400 200 Z' fill='%23fff'/%3E%3C/svg%3E\")",
            backgroundSize: "cover",
            backgroundPosition: "bottom right",
          }}
        />
        <div className="relative max-w-2xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ring-white/25">
            <BadgeCheck size={13} aria-hidden />
            Official tour operator
          </p>
          <h2 className="mt-3 text-xl font-bold leading-snug sm:text-2xl">{title}</h2>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-brand-50/90">{body}</p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={href}
              rel="noopener"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-800 shadow-sm transition hover:bg-brand-50 hover:shadow-md"
            >
              Book on {mainSite.name}
              <ExternalLink size={15} aria-hidden />
            </a>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-brand-50/85">
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={14} aria-hidden /> Licensed &amp; insured
              </li>
              <li className="flex items-center gap-1.5">
                <CalendarCheck size={14} aria-hidden /> Free date changes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}

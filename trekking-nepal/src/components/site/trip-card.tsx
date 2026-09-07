import Link from "next/link";
import Image from "next/image";
import { Clock, Mountain, TrendingUp, ArrowRight } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";

export type TripCardData = {
  slug: string;
  title: string;
  metaDescription?: string | null;
  keyTakeaway?: string | null;
  bannerImage?: string | null;
  bannerAlt?: string | null;
  heroImage?: string | null;
  durationDays?: number | null;
  maxAltitude?: string | null;
  difficulty?: string | null;
  priceFrom?: number | null;
  currency?: string | null;
  ratingValue?: number | null;
  reviewCount?: number | null;
  region?: { name: string; slug: string } | null;
};

export function TripCard({
  trip,
  priority = false,
  className,
}: {
  trip: TripCardData;
  priority?: boolean;
  className?: string;
}) {
  const image = trip.bannerImage || trip.heroImage || "";
  const summary = trip.metaDescription || trip.keyTakeaway || "";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-ink-900/5",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        {image ? (
          <Image
            src={image}
            alt={trip.bannerAlt || trip.title}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-ink-300">
            <Mountain size={40} aria-hidden />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

        {trip.region && (
          <div className="absolute left-3 top-3">
            <Badge variant="dark">{trip.region.name}</Badge>
          </div>
        )}
        {trip.priceFrom ? (
          <div className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-2.5 py-1 text-sm font-bold text-ink-900 shadow-sm backdrop-blur">
            <span className="text-[0.6875rem] font-medium text-ink-500">from </span>
            {formatPrice(trip.priceFrom, trip.currency || "USD")}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {trip.ratingValue && trip.reviewCount ? (
          <div className="mb-2 flex items-center gap-2">
            <Stars rating={trip.ratingValue} size={14} />
            <span className="text-xs font-medium text-ink-500">
              {trip.ratingValue.toFixed(1)} ({trip.reviewCount} review
              {trip.reviewCount === 1 ? "" : "s"})
            </span>
          </div>
        ) : null}

        <h3 className="text-[1.0625rem] font-bold leading-snug text-ink-900">
          {/* Stretched link keeps the whole card clickable with one <a>. */}
          <Link href={`/itinerary/${trip.slug}`} className="after:absolute after:inset-0">
            {trip.title}
          </Link>
        </h3>

        {summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600">{summary}</p>
        )}

        <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-600">
          {trip.durationDays ? (
            <Spec icon={<Clock size={13} aria-hidden />} label="Duration">
              {trip.durationDays} days
            </Spec>
          ) : null}
          {trip.maxAltitude ? (
            <Spec icon={<Mountain size={13} aria-hidden />} label="Max altitude">
              {trip.maxAltitude.split("/")[0].trim()}
            </Spec>
          ) : null}
          {trip.difficulty ? (
            <Spec icon={<TrendingUp size={13} aria-hidden />} label="Difficulty">
              {trip.difficulty}
            </Spec>
          ) : null}
        </dl>

        <div className="mt-4 flex items-center gap-1.5 border-t border-ink-100 pt-3 text-sm font-semibold text-brand-700 transition group-hover:gap-2.5">
          View full itinerary
          <ArrowRight size={15} aria-hidden />
        </div>
      </div>
    </article>
  );
}

function Spec({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-brand-600">{icon}</span>
      <dt className="sr-only">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

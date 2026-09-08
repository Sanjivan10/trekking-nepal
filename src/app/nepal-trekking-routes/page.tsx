import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PUBLISHED, tripCardSelect, getRegions } from "@/lib/content";
import { site } from "@/lib/site";
import { TripCard } from "@/components/site/trip-card";
import { SectionHeading } from "@/components/site/section";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { collectionPageSchema, breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

const TITLE = "All Nepal Trekking Itineraries — Day-by-Day Routes, Costs & Difficulty";
const DESCRIPTION =
  "Browse every guided trek we run in Nepal. Compare duration, maximum altitude, difficulty and price, with a full day-by-day itinerary and verified reviews for each route.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/nepal-trekking-routes" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/nepal-trekking-routes", type: "website" },
};

type SearchParams = Promise<{ region?: string; duration?: string; difficulty?: string }>;

const DURATIONS = [
  { value: "1-7", label: "1–7 days" },
  { value: "8-14", label: "8–14 days" },
  { value: "15-21", label: "15–21 days" },
  { value: "22-99", label: "22+ days" },
];
const DIFFICULTIES = ["Easy", "Moderate", "Challenging", "Strenuous"];

export default async function ItineraryIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [minDays, maxDays] = (params.duration || "").split("-").map(Number);

  const where = {
    ...PUBLISHED,
    ...(params.region ? { region: { slug: params.region } } : {}),
    ...(params.difficulty ? { difficulty: params.difficulty } : {}),
    ...(minDays
      ? { durationDays: { gte: minDays, lte: maxDays || 999 } }
      : {}),
  };

  const [trips, regions] = await Promise.all([
    prisma.itinerary.findMany({
      where,
      orderBy: [{ featured: "desc" }, { ratingValue: "desc" }, { durationDays: "asc" }],
      select: tripCardSelect,
    }),
    getRegions(),
  ]);

  const hasFilters = Boolean(params.region || params.duration || params.difficulty);
  const crumbs = [{ name: "Nepal Trekking Routes", href: "/nepal-trekking-routes" }];

  const buildHref = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { ...params, ...patch };
    for (const [key, value] of Object.entries(merged)) if (value) next.set(key, value);
    return `/nepal-trekking-routes${next.toString() ? `?${next}` : ""}`;
  };

  return (
    <>
      <JsonLd id="itinerary-breadcrumbs" data={breadcrumbSchema(crumbs)} />
      <JsonLd
        id="itinerary-collection"
        data={collectionPageSchema({
          name: TITLE,
          description: DESCRIPTION,
          url: "/nepal-trekking-routes",
          items: trips.map((trip) => ({ name: trip.title, url: `/trip/${trip.slug}` })),
        })}
      />

      <div className="border-b border-ink-200 bg-ink-50">
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs items={crumbs} className="mb-6 text-ink-600" />
          <SectionHeading
            as="h1"
            eyebrow="Destinations"
            title="Nepal Trekking Routes"
            description={DESCRIPTION}
          />
        </div>
      </div>

      <div className="container-page py-10 sm:py-14">
        {/* Filters — plain links, so every combination is a crawlable URL. */}
        <div className="mb-8 space-y-4">
          <FilterRow label="Region">
            <FilterChip href={buildHref({ region: undefined })} active={!params.region}>
              All regions
            </FilterChip>
            {regions.map((region) => (
              <FilterChip
                key={region.slug}
                href={buildHref({ region: region.slug })}
                active={params.region === region.slug}
              >
                {region.name}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Duration">
            <FilterChip href={buildHref({ duration: undefined })} active={!params.duration}>
              Any length
            </FilterChip>
            {DURATIONS.map((item) => (
              <FilterChip
                key={item.value}
                href={buildHref({ duration: item.value })}
                active={params.duration === item.value}
              >
                {item.label}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Difficulty">
            <FilterChip href={buildHref({ difficulty: undefined })} active={!params.difficulty}>
              Any level
            </FilterChip>
            {DIFFICULTIES.map((level) => (
              <FilterChip
                key={level}
                href={buildHref({ difficulty: level })}
                active={params.difficulty === level}
              >
                {level}
              </FilterChip>
            ))}
          </FilterRow>
        </div>

        <p className="mb-6 text-sm text-ink-600" role="status">
          <strong className="font-semibold text-ink-900">{trips.length}</strong> trek
          {trips.length === 1 ? "" : "s"} found
          {hasFilters && (
            <>
              {" · "}
              <Link href="/nepal-trekking-routes" className="font-semibold text-brand-700 hover:underline">
                Clear filters
              </Link>
            </>
          )}
        </p>

        {trips.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, index) => (
              <TripCard key={trip.id} trip={trip} priority={index < 3} className="h-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink-300 p-12 text-center">
            <p className="text-sm text-ink-600">
              No treks match these filters.{" "}
              <Link href="/nepal-trekking-routes" className="font-semibold text-brand-700 hover:underline">
                Show all itineraries
              </Link>
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-full text-xs font-bold uppercase tracking-wide text-ink-500 sm:w-20">
        {label}
      </span>
      <div className="no-scrollbar flex flex-1 flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700",
      )}
    >
      {children}
    </Link>
  );
}

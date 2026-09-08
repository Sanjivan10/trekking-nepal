import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, X, Sparkles, Star, ArrowRight, Camera } from "lucide-react";

import { prisma } from "@/lib/prisma";
import {
  getItineraryBySlug,
  getBacklinkRules,
  getRelatedBlogs,
  getRelatedItineraries,
} from "@/lib/content";
import { renderMarkdown, renderInline } from "@/lib/markdown";
import { buildRules } from "@/lib/backlinkEngine";
import { splitLines, splitList, formatPrice, isoDate, truncate, stripMarkdown } from "@/lib/utils";
import { mainSite, mainSiteUrl } from "@/lib/mainSite";
import {
  touristTripSchema,
  faqSchema,
  breadcrumbSchema,
  type Crumb,
} from "@/lib/schema";

import { JsonLd } from "@/components/json-ld";
import { trekBreadcrumbs } from "@/utils/generateBreadcrumbSchema";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { KeyTakeaways } from "@/components/site/key-takeaways";
import { SpecsRibbon, type Spec } from "@/components/site/specs-ribbon";
import { DayByDay, type DayItem } from "@/components/site/day-by-day";
import { ItineraryTable } from "@/components/site/itinerary-table";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { ReviewSection } from "@/components/site/reviews";
import { TableOfContents } from "@/components/site/table-of-contents";
import { MainSiteCta } from "@/components/site/main-site-cta";
import { AdSlot } from "@/components/site/ad-slot";
import { PriceTiers } from "@/components/site/price-tiers";
import { TripCard } from "@/components/site/trip-card";
import { BlogCard } from "@/components/site/blog-card";
import { Stars } from "@/components/ui/stars";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;
export const dynamicParams = true;

/** Prerenders every published trek at build time for instant TTFB. */
export async function generateStaticParams() {
  const trips = await prisma.itinerary
    .findMany({ where: { status: "published" }, select: { slug: true } })
    .catch(() => []);
  return trips.map((trip) => ({ slug: trip.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getItineraryBySlug(slug);
  if (!trip) return { title: "Trek not found", robots: { index: false, follow: false } };

  const title = trip.metaTitle || `${trip.title} — Itinerary, Cost & Difficulty`;
  const description =
    trip.metaDescription ||
    trip.keyTakeaway ||
    truncate(stripMarkdown(trip.overview), 158);
  const image = trip.heroImage || trip.bannerImage;

  return {
    title,
    description,
    keywords: splitList(trip.keywords),
    alternates: { canonical: trip.canonicalUrl || `/trip/${trip.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/trip/${trip.slug}`,
      images: image ? [{ url: image, alt: trip.bannerAlt || trip.title }] : undefined,
      publishedTime: isoDate(trip.publishedAt),
      modifiedTime: isoDate(trip.updatedAt),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ItineraryPage({ params }: Props) {
  const { slug } = await params;
  const trip = await getItineraryBySlug(slug);
  if (!trip) notFound();

  const globalRules = await getBacklinkRules();
  const rules = buildRules({ global: globalRules, post: trip });
  const opts = { backlinks: rules, seed: trip.slug };

  const overview = renderMarkdown(trip.overview, opts);
  const days: DayItem[] = trip.days.map((day) => ({
    id: day.id,
    dayNumber: day.dayNumber,
    title: day.title,
    description: renderMarkdown(day.description, opts).html,
    accommodation: day.accommodation,
    meals: day.meals,
    distance: day.distance,
    duration: day.duration,
    altitude: day.altitude,
  }));

  const faqs = trip.faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: renderInline(faq.answer, opts),
  }));

  const [relatedTrips, relatedPosts] = await Promise.all([
    getRelatedItineraries(trip, 3),
    getRelatedBlogs(trip, 3),
  ]);

  const highlights = splitLines(trip.highlights);
  const includes = splitLines(trip.includes);
  const excludes = splitLines(trip.excludes);
  const gallery = splitLines(trip.gallery);

  const crumbs: Crumb[] = trekBreadcrumbs(trip);

  const specs: Spec[] = [
    trip.durationDays
      ? {
          label: "Duration",
          value: `${trip.durationDays} days${trip.durationNights ? ` / ${trip.durationNights} nights` : ""}`,
          icon: "clock" as const,
        }
      : null,
    trip.maxAltitude ? { label: "Max altitude", value: trip.maxAltitude, icon: "mountain" as const } : null,
    trip.difficulty ? { label: "Difficulty", value: trip.difficulty, icon: "trending" as const } : null,
    trip.bestSeason ? { label: "Best season", value: trip.bestSeason, icon: "sun" as const } : null,
    trip.groupSize ? { label: "Group size", value: trip.groupSize, icon: "users" as const } : null,
    trip.startPoint
      ? {
          label: "Start / end",
          value: trip.endPoint ? `${trip.startPoint} → ${trip.endPoint}` : trip.startPoint,
          icon: "pin" as const,
        }
      : null,
  ].filter(Boolean) as Spec[];

  // Table of contents — only sections that actually render.
  const toc = [
    { id: "overview", text: "Trip overview" },
    highlights.length ? { id: "highlights", text: "Trip highlights" } : null,
    days.length ? { id: "itinerary", text: "Day-by-day itinerary" } : null,
    days.length ? { id: "route-table", text: "Route & altitude table" } : null,
    trip.tiers.length || includes.length || excludes.length
      ? { id: "cost", text: "Price & group discounts" }
      : null,
    gallery.length ? { id: "gallery", text: "Gallery" } : null,
    faqs.length ? { id: "faqs", text: "FAQs" } : null,
    { id: "reviews", text: "Reviews" },
  ].filter(Boolean) as Array<{ id: string; text: string }>;

  const heroImage = trip.heroImage || trip.bannerImage;

  return (
    <>
      {/* ---------------------- Structured data ---------------------- */}
      <JsonLd id="trip-schema" data={touristTripSchema(trip)} />
      <JsonLd id="trip-breadcrumbs" data={breadcrumbSchema(crumbs)} />
      {faqs.length > 0 && (
        <JsonLd
          id="trip-faq"
          data={faqSchema(
            trip.faqs.map((f) => ({ question: f.question, answer: f.answer })),
            `/trip/${trip.slug}`,
          )}
        />
      )}

      {/* -------------------------- Hero --------------------------- */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        {heroImage && (
          <Image
            src={heroImage}
            alt={trip.bannerAlt || trip.title}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={74}
            className="object-cover opacity-65"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink-950/75 via-ink-950/40 to-ink-950/95"
        />

        <div className="container-page relative py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={crumbs} className="mb-6 text-white/75" />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                {trip.region && <Badge variant="dark">{trip.region.name}</Badge>}
                {trip.difficulty && <Badge variant="dark">{trip.difficulty}</Badge>}
                {trip.bestSeason && <Badge variant="dark">Best: {trip.bestSeason}</Badge>}
              </div>

              <h1 className="mt-4 text-[1.85rem] font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-5xl">
                {trip.title}
              </h1>

              {trip.reviewCount > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Stars rating={trip.ratingValue} size={17} />
                  <span className="text-sm font-semibold text-white">
                    {trip.ratingValue.toFixed(1)} / 5
                  </span>
                  <a href="#reviews" className="text-sm text-white/75 underline-offset-2 hover:underline">
                    {trip.reviewCount} verified review{trip.reviewCount === 1 ? "" : "s"}
                  </a>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Primary conversion CTA — dofollow to the main site. */}
                <a
                  href={mainSiteUrl(trip.mainSiteUrl?.trim() || `/${trip.slug}`)}
                  rel="noopener"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-400"
                >
                  Book this trek on {mainSite.name}
                  <ArrowRight size={16} aria-hidden />
                </a>
                {trip.priceFrom > 0 && (
                  <p className="text-sm text-white/80">
                    <span className="text-3xl font-extrabold text-white">
                      {formatPrice(trip.priceFrom, trip.currency)}
                    </span>
                    {trip.priceRegular > trip.priceFrom && (
                      <span className="ml-2 text-base font-medium text-white/60 line-through">
                        {formatPrice(trip.priceRegular, trip.currency)}
                      </span>
                    )}
                    <span className="ml-1">per person</span>
                  </p>
                )}
              </div>
            </div>

            {/* Advertisement slot, adjacent to the hero */}
            <AdSlot
              image={trip.adImage}
              alt={trip.adAlt}
              href={trip.adLink}
              label={trip.adLabel}
              ratio="box"
              className="hidden lg:block"
            />
          </div>
        </div>
      </section>

      {/* --------------------- Quick specs ribbon -------------------- */}
      <div className="container-page relative z-10 -mt-7">
        <SpecsRibbon specs={specs} tripTitle={trip.title} bookingUrl={trip.mainSiteUrl} />
      </div>

      {/* Mobile ad slot */}
      <div className="container-page mt-6 lg:hidden">
        <AdSlot image={trip.adImage} alt={trip.adAlt} href={trip.adLink} label={trip.adLabel} />
      </div>

      {/* --------------------------- Body ---------------------------- */}
      <div className="container-page py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          <article className="min-w-0">
            <KeyTakeaways
              paragraph={trip.keyTakeaway}
              bullets={trip.takeaways}
              title="Key takeaways"
              className="mb-10"
            />

            <section id="overview" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">Trip overview</h2>
              <div
                className="prose-trek mt-4"
                dangerouslySetInnerHTML={{ __html: overview.html }}
              />
            </section>

            {highlights.length > 0 && (
              <section id="highlights" className="mt-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">Trip highlights</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {highlights.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-2.5 rounded-xl border border-ink-200 bg-white p-4 text-sm leading-relaxed text-ink-700"
                    >
                      <Sparkles size={16} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <MainSiteCta
              targetUrl={trip.mainSiteUrl}
              headline={trip.ctaHeadline}
              text={trip.ctaText}
              tripTitle={trip.title}
              className="mt-12"
            />

            {days.length > 0 && (
              <>
                <section id="itinerary" className="mt-12 scroll-mt-28">
                  <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                    Day-by-day itinerary
                  </h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
                    {trip.durationDays} days on the trail, with daily walking distance, altitude
                    gain and overnight accommodation.
                  </p>
                  <div className="mt-6">
                    <DayByDay days={days} />
                  </div>
                </section>

                <section id="route-table" className="mt-12 scroll-mt-28">
                  <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                    Route, distance &amp; altitude table
                  </h2>
                  <ItineraryTable
                    days={days}
                    caption={`Daily distance, walking time, maximum altitude and accommodation for the ${trip.title}.`}
                  />
                </section>
              </>
            )}

            {(trip.tiers.length > 0 || includes.length > 0 || excludes.length > 0) && (
              <section id="cost" className="mt-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                  Price &amp; what it covers
                </h2>

                {trip.tiers.length > 0 && (
                  <div className="mt-5">
                    <PriceTiers
                      tiers={trip.tiers.map((t) => ({
                        id: t.id,
                        label: t.label,
                        price: t.price,
                        note: t.note,
                      }))}
                      currency={trip.currency}
                      priceFrom={trip.priceFrom}
                      priceRegular={trip.priceRegular}
                    />
                  </div>
                )}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {includes.length > 0 && (
                    <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
                      <h3 className="flex items-center gap-2 text-base font-bold text-brand-900">
                        <Check size={17} strokeWidth={2.5} aria-hidden />
                        Included
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {includes.map((item, index) => (
                          <li key={index} className="flex gap-2 text-sm leading-relaxed text-ink-700">
                            <Check size={15} className="mt-1 shrink-0 text-brand-600" aria-hidden />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {excludes.length > 0 && (
                    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-5">
                      <h3 className="flex items-center gap-2 text-base font-bold text-ink-900">
                        <X size={17} strokeWidth={2.5} aria-hidden />
                        Not included
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {excludes.map((item, index) => (
                          <li key={index} className="flex gap-2 text-sm leading-relaxed text-ink-700">
                            <X size={15} className="mt-1 shrink-0 text-ink-400" aria-hidden />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {gallery.length > 0 && (
              <section id="gallery" className="mt-12 scroll-mt-28">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-ink-900 sm:text-3xl">
                  <Camera size={22} className="text-brand-600" aria-hidden />
                  Gallery
                </h2>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((src, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-100"
                    >
                      <Image
                        src={src}
                        alt={`${trip.title} — photo ${index + 1}`}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {faqs.length > 0 && (
              <section id="faqs" className="mt-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                  Frequently asked questions
                </h2>
                <p className="mt-2 text-[0.9375rem] text-ink-600">
                  Everything trekkers ask us about the {trip.title}.
                </p>
                <div className="mt-6">
                  <FaqAccordion faqs={faqs} />
                </div>
              </section>
            )}

            <section id="reviews" className="mt-12 scroll-mt-28">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-ink-900 sm:text-3xl">
                <Star size={22} className="text-sun-500" fill="currentColor" strokeWidth={0} aria-hidden />
                Trekker reviews
              </h2>
              <div className="mt-6">
                <ReviewSection
                  itinerarySlug={trip.slug}
                  ratingValue={trip.ratingValue}
                  reviewCount={trip.reviewCount}
                  reviews={trip.reviews.map((review) => ({
                    id: review.id,
                    authorName: review.authorName,
                    country: review.country,
                    rating: review.rating,
                    title: review.title,
                    body: review.body,
                    reviewedAt: review.reviewedAt.toISOString(),
                  }))}
                />
              </div>
            </section>
          </article>

          {/* -------------------------- Sidebar ------------------------- */}
          <aside className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
            <div className="space-y-6">
              <div className="rounded-2xl border border-ink-200 bg-white p-5">
                <TableOfContents items={toc} />
              </div>

              <MainSiteCta
                variant="compact"
                targetUrl={trip.mainSiteUrl}
                headline={trip.ctaHeadline}
                tripTitle={trip.title}
              />

              {relatedTrips.length > 0 && (
                <div className="rounded-2xl border border-ink-200 bg-white p-5">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
                    Related treks
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {relatedTrips.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/trip/${item.slug}`}
                          className="group flex gap-3 rounded-xl p-1 transition hover:bg-ink-50"
                        >
                          {item.bannerImage && (
                            <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                              <Image
                                src={item.bannerImage}
                                alt=""
                                fill
                                loading="lazy"
                                sizes="64px"
                                className="object-cover"
                              />
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
                              {item.title}
                            </span>
                            <span className="mt-0.5 block text-xs text-ink-500">
                              {item.durationDays} days
                              {item.priceFrom
                                ? ` · from ${formatPrice(item.priceFrom, item.currency)}`
                                : ""}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {relatedPosts.length > 0 && (
                <div className="rounded-2xl border border-ink-200 bg-white p-5">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
                    Trekking guides
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {relatedPosts.map((post) => (
                      <li key={post.id}>
                        <BlogCard post={post} compact className="border-0 hover:translate-y-0 hover:shadow-none" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* ---------------------- Related trips grid ---------------------- */}
        {relatedTrips.length > 0 && (
          <section className="mt-16 border-t border-ink-200 pt-12">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">You might also like</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTrips.map((item) => (
                <TripCard key={item.id} trip={item} className="h-full" />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

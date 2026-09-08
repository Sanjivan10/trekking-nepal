import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck, Award, HeartHandshake, Users, ArrowRight, Mountain,
  Clock, TrendingUp, Check, Sparkles,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getPublishedItineraries, getPublishedBlogs, getRegions, getTestimonials } from "@/lib/content";
import { getSettings } from "@/lib/settings";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, collectionPageSchema } from "@/lib/schema";
import { Hero } from "@/components/site/hero";
import { TripCard } from "@/components/site/trip-card";
import { BlogCard } from "@/components/site/blog-card";
import { SectionHeading } from "@/components/site/section";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { AdSlot } from "@/components/site/ad-slot";
import { Testimonials } from "@/components/site/testimonials";
import { ReviewBadges } from "@/components/site/review-badges";
import { Stars } from "@/components/ui/stars";
import { Reveal } from "@/components/ui/reveal";
import { renderInline } from "@/lib/markdown";
import { formatPrice, splitLines } from "@/lib/utils";
import { tripPath, regionPath, ROUTES } from "@/lib/routes";
import { mainSite } from "@/lib/mainSite";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `${site.name} — Everest, Manaslu & Annapurna Treks with Exact Prices`,
  description:
    "Guided Himalayan treks with real prices and real itineraries. Everest Base Camp from US$1,199, Manaslu Circuit from US$995, Annapurna Circuit from US$850. No hidden extras.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [settings, trips, posts, regions, testimonials, faqs] = await Promise.all([
    getSettings(),
    getPublishedItineraries({ take: 6 }),
    getPublishedBlogs({ take: 3 }),
    getRegions(),
    getTestimonials({ take: 6, featuredOnly: false }),
    prisma.faq
      .findMany({
        where: { blogId: null, itineraryId: null, regionId: null },
        orderBy: { position: "asc" },
        take: 8,
      })
      .catch(() => []),
  ]);

  const [spotlight, ...rest] = trips;
  const homeFaqs = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: renderInline(faq.answer),
  }));

  return (
    <>
      <JsonLd
        id="home-collection"
        data={collectionPageSchema({
          name: `${site.name} — Guided Himalayan Treks`,
          description: site.description,
          url: "/",
          items: trips.map((trip) => ({ name: trip.title, url: tripPath(trip.slug) })),
        })}
      />
      {faqs.length > 0 && (
        <JsonLd
          id="home-faq"
          data={faqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })), "/")}
        />
      )}

      <Hero settings={settings} regions={regions.map((r) => ({ slug: r.slug, name: r.name }))} />

      {/* ---------------------- Promotional banner ---------------------- */}
      <div className="container-page mt-10">
        <AdSlot
          image={process.env.NEXT_PUBLIC_HOME_AD_IMAGE}
          alt="Seasonal trekking offer"
          href={process.env.NEXT_PUBLIC_HOME_AD_LINK || mainSite.url}
        />
      </div>

      {/* ------------------------ #1 EBC spotlight ----------------------- */}
      {spotlight && (
        <section className="container-page pt-16 sm:pt-20">
          <SectionHeading
            eyebrow="Our number one trek"
            title="The one everybody asks for"
            description="Exact price, exact itinerary, exact altitude on every single day. Nothing padded, nothing hidden."
          />

          <Reveal>
            <article className="mt-8 overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-xl shadow-ink-900/5 lg:grid lg:grid-cols-[1.15fr_1fr]">
              <div className="relative aspect-[16/11] lg:aspect-auto">
                {(spotlight.heroImage || spotlight.bannerImage) && (
                  <Image
                    src={spotlight.heroImage || spotlight.bannerImage || ""}
                    alt={spotlight.bannerAlt || spotlight.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  <Sparkles size={12} aria-hidden />
                  #1 Most booked
                </span>
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                {spotlight.reviewCount > 0 && (
                  <div className="mb-3 flex items-center gap-2">
                    <Stars rating={spotlight.ratingValue} size={15} />
                    <span className="text-xs font-semibold text-ink-600">
                      {spotlight.ratingValue.toFixed(1)} · {spotlight.reviewCount} reviews
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
                  <Link href={tripPath(spotlight.slug)} className="hover:text-brand-700">
                    {spotlight.title}
                  </Link>
                </h3>

                {spotlight.keyTakeaway && (
                  <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-600">
                    {spotlight.keyTakeaway}
                  </p>
                )}

                <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    { icon: Clock, label: "Duration", value: `${spotlight.durationDays} days` },
                    { icon: Mountain, label: "Max altitude", value: spotlight.maxAltitude?.split("(")[0].trim() },
                    { icon: TrendingUp, label: "Trip grade", value: spotlight.difficulty },
                  ]
                    .filter((s) => s.value)
                    .map((spec) => (
                      <div key={spec.label} className="rounded-xl bg-ink-50 px-3 py-2.5">
                        <dt className="flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-wide text-ink-500">
                          <spec.icon size={11} className="text-brand-600" aria-hidden />
                          {spec.label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-bold text-ink-900">{spec.value}</dd>
                      </div>
                    ))}
                </dl>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-ink-100 pt-5">
                  <p>
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-500">
                      From, per person
                    </span>
                    <span className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-ink-900">
                        {formatPrice(spotlight.priceFrom, spotlight.currency)}
                      </span>
                      {spotlight.priceRegular > spotlight.priceFrom && (
                        <span className="text-sm font-medium text-ink-400 line-through">
                          {formatPrice(spotlight.priceRegular, spotlight.currency)}
                        </span>
                      )}
                    </span>
                  </p>
                  <Link
                    href={tripPath(spotlight.slug)}
                    className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
                  >
                    See full itinerary
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        </section>
      )}

      {/* ------------------------ Remaining treks ------------------------ */}
      {rest.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <SectionHeading
            eyebrow="Also worth your two weeks"
            title="The rest of the line-up"
            description="Manaslu if you hate crowds. Annapurna if you want the most scenery per rupee."
            href={ROUTES.routesHub}
            linkLabel="All routes"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((trip, index) => (
              <Reveal key={trip.id} delay={index * 0.06}>
                <TripCard trip={trip} priority={index < 2} className="h-full" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* -------------------------- Testimonials ------------------------- */}
      {testimonials.length > 0 && (
        <section className="border-y border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Verified reviews"
                title="What trekkers actually said"
                description="Real reviews from Google and TripAdvisor. We didn't write these, and we can't edit them."
              />
              <ReviewBadges settings={settings} tone="light" />
            </div>
            <Testimonials
              items={testimonials.map((t) => ({
                id: t.id,
                source: t.source,
                authorName: t.authorName,
                authorMeta: t.authorMeta,
                rating: t.rating,
                dateLabel: t.dateLabel,
                body: t.body,
                ownerReply: t.ownerReply,
                sourceUrl: t.sourceUrl,
                tripName: t.tripName,
              }))}
              className="mt-10"
            />
          </div>
        </section>
      )}

      {/* ---------------------------- Regions ---------------------------- */}
      {regions.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <SectionHeading
            eyebrow="Trekking regions"
            title="Pick your Himalaya"
            description="Each region hub collects every itinerary, guide and FAQ we publish for that area."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((region, index) => (
              <Reveal key={region.id} delay={index * 0.05}>
                <Link
                  href={regionPath(region.slug)}
                  className="group relative flex h-52 flex-col justify-end overflow-hidden rounded-2xl bg-ink-900 p-5"
                >
                  {region.heroImage && (
                    <Image
                      src={region.heroImage}
                      alt={region.heroAlt || region.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-85"
                    />
                  )}
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/92 via-ink-950/25 to-transparent" />
                  <div className="relative">
                    <h3 className="text-lg font-bold text-white">{region.name}</h3>
                    {region.headline && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/80">{region.headline}</p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------- Why choose us ------------------------- */}
      <section className="container-page pb-16 sm:pb-20">
        <SectionHeading
          eyebrow="Why trek with us"
          title="Licensed, local, and accountable"
          description="Government-registered Nepali operator. Guides trained in wilderness first aid, porters insured and weight-limited, satellite communicator on every high-altitude departure."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Acclimatisation built in", body: "Every itinerary keeps its rest days. The 11-day EBC trips you'll see advertised got shorter by deleting exactly the days that keep you safe." },
            { icon: Award, title: "Government licensed", body: "Registered with Nepal's Department of Tourism and a TAAN member. Permits, TIMS and conservation fees are handled before you land." },
            { icon: HeartHandshake, title: "Fair porter policy", body: "Insured porters, 20 kg load limits, proper kit and above-standard wages. Every trek, no exceptions." },
            { icon: Users, title: "Small groups", body: "Maximum 12 trekkers per guide. Private departures on any route, any date, no surcharge drama." },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-ink-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <item.icon size={20} aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------- Latest blog ------------------------- */}
      {posts.length > 0 && (
        <section className="border-t border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="container-page">
            <SectionHeading
              eyebrow="Trekking guides"
              title="Read this before you book"
              description="Permits, real budgets, packing lists and altitude advice — written by guides, not by a marketing team."
              href={ROUTES.blog}
              linkLabel="All guides"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.id} delay={index * 0.06}>
                  <BlogCard post={post} className="h-full" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------ FAQs ----------------------------- */}
      {homeFaqs.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)]">
            <SectionHeading
              eyebrow="Common questions"
              title="Trekking in Nepal, answered straight"
              description="The questions we get asked most, answered without the sales pitch."
            />
            <FaqAccordion faqs={homeFaqs} />
          </div>
        </section>
      )}
    </>
  );
}

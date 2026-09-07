import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Award,
  HeartHandshake,
  Users,
  ArrowRight,
  Mountain,
  ExternalLink,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getPublishedItineraries, getPublishedBlogs, getRegions } from "@/lib/content";
import { site } from "@/lib/site";
import { mainSite } from "@/lib/mainSite";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, collectionPageSchema } from "@/lib/schema";
import { TripCard } from "@/components/site/trip-card";
import { BlogCard } from "@/components/site/blog-card";
import { SectionHeading } from "@/components/site/section";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { TrekFinder } from "@/components/site/trek-finder";
import { AdSlot } from "@/components/site/ad-slot";
import { Reveal } from "@/components/ui/reveal";
import { renderInline } from "@/lib/markdown";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `${site.name} — Guided Himalayan Treks, Itineraries & Costs`,
  description: site.description,
  alternates: { canonical: "/" },
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=70";

export default async function HomePage() {
  const [trips, posts, regions, faqs] = await Promise.all([
    getPublishedItineraries({ take: 6 }),
    getPublishedBlogs({ take: 3 }),
    getRegions(),
    prisma.faq
      .findMany({
        where: { blogId: null, itineraryId: null, regionId: null },
        orderBy: { position: "asc" },
        take: 8,
      })
      .catch(() => []),
  ]);

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
          items: trips.map((trip) => ({ name: trip.title, url: `/itinerary/${trip.slug}` })),
        })}
      />
      {faqs.length > 0 && (
        <JsonLd
          id="home-faq"
          data={faqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })), "/")}
        />
      )}

      {/* ---------------------------- Hero ---------------------------- */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        <Image
          src={HERO_IMAGE}
          alt="Trekkers on a high Himalayan ridge in Nepal at sunrise"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={72}
          className="object-cover opacity-60"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/45 to-ink-950/90"
        />

        <div className="container-page relative py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-inset ring-white/25 backdrop-blur">
              <Mountain size={13} aria-hidden />
              Since 2009 · 4,800+ trekkers guided
            </p>

            <h1 className="mt-5 text-[2.15rem] font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Trek Nepal&apos;s greatest trails, planned day by day
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Everest Base Camp, Manaslu Circuit and Gosaikunda — with honest costs,
              real altitude profiles, permit checklists and verified trekker reviews.
              Every itinerary is written by guides who walk these trails.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/itinerary"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-400"
              >
                Browse all itineraries
                <ArrowRight size={16} aria-hidden />
              </Link>
              <a
                href={mainSite.url}
                rel="noopener"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold text-white ring-1 ring-inset ring-white/30 backdrop-blur transition hover:bg-white/20"
              >
                Book on {mainSite.name}
                <ExternalLink size={15} aria-hidden />
              </a>
            </div>
          </div>

          <div className="mt-10 lg:mt-14">
            <TrekFinder regions={regions.map((r) => ({ slug: r.slug, name: r.name }))} />
          </div>
        </div>
      </section>

      {/* ------------------- Promotional banner slot ------------------- */}
      <div className="container-page -mt-6 sm:-mt-8">
        <AdSlot
          image={process.env.NEXT_PUBLIC_HOME_AD_IMAGE}
          alt="Seasonal trekking offer"
          href={process.env.NEXT_PUBLIC_HOME_AD_LINK || mainSite.url}
          label="Sponsored"
        />
      </div>

      {/* --------------------- Featured itineraries -------------------- */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Handpicked routes"
          title="Featured trekking itineraries"
          description="Full day-by-day plans with distances, altitude gain, teahouse accommodation and what each trek actually costs."
          href="/itinerary"
          linkLabel="All treks"
        />

        {trips.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, index) => (
              <Reveal key={trip.id} delay={index * 0.06}>
                <TripCard trip={trip} priority={index < 3} className="h-full" />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState label="No itineraries published yet. Add one from /admin." />
        )}
      </section>

      {/* --------------------------- Regions --------------------------- */}
      {regions.length > 0 && (
        <section className="border-y border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="container-page">
            <SectionHeading
              eyebrow="Trekking regions"
              title="Choose your Himalaya"
              description="Each region hub collects every itinerary, guide and FAQ we publish for that area."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {regions.map((region, index) => (
                <Reveal key={region.id} delay={index * 0.05}>
                  <Link
                    href={`/region/${region.slug}`}
                    className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl bg-ink-900 p-5"
                  >
                    {region.heroImage && (
                      <Image
                        src={region.heroImage}
                        alt={region.heroAlt || region.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-85"
                      />
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent"
                    />
                    <div className="relative">
                      <h3 className="text-lg font-bold text-white">{region.name}</h3>
                      {region.headline && (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/80">
                          {region.headline}
                        </p>
                      )}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------ Why choose us ------------------------ */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Why trek with us"
          title="Licensed, local and accountable"
          description="We are a government-registered Nepali operator. Guides are trained in wilderness first aid, porters are insured and weight-limited, and every departure carries a satellite communicator."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Safety-first altitude plans",
              body: "Every itinerary builds in acclimatisation days. Guides carry pulse oximeters and a satellite communicator on all high-altitude departures.",
            },
            {
              icon: Award,
              title: "Government licensed",
              body: "Registered with Nepal's Department of Tourism and a member of TAAN — permits, TIMS and conservation fees are handled for you.",
            },
            {
              icon: HeartHandshake,
              title: "Fair porter policy",
              body: "Insured porters, 20 kg load limits, proper equipment and above-standard wages on every single trek we run.",
            },
            {
              icon: Users,
              title: "Small groups",
              body: "Maximum 12 trekkers per guide, with private departures available on any route and any date you choose.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-ink-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-lg hover:shadow-ink-900/5">
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

      {/* -------------------------- Latest blog ------------------------- */}
      {posts.length > 0 && (
        <section className="border-t border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="container-page">
            <SectionHeading
              eyebrow="Trekking guides"
              title="Latest from the trail"
              description="Permits, packing lists, altitude sickness and season-by-season conditions — written by our guides."
              href="/blog"
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

      {/* ----------------------------- FAQs ----------------------------- */}
      {homeFaqs.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)]">
            <div>
              <SectionHeading
                eyebrow="Common questions"
                title="Trekking in Nepal, answered"
                description="The questions we're asked most often, answered plainly."
              />
            </div>
            <FaqAccordion faqs={homeFaqs} />
          </div>
        </section>
      )}
    </>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <p className="mt-10 rounded-2xl border border-dashed border-ink-300 p-12 text-center text-sm text-ink-500">
      {label}
    </p>
  );
}

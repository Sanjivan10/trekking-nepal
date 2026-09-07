import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getRegionBySlug, getBacklinkRules } from "@/lib/content";
import { renderMarkdown, renderInline } from "@/lib/markdown";
import { truncate, stripMarkdown, splitList } from "@/lib/utils";
import {
  regionSchema,
  faqSchema,
  breadcrumbSchema,
  collectionPageSchema,
  type Crumb,
} from "@/lib/schema";

import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { KeyTakeaways } from "@/components/site/key-takeaways";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { TripCard } from "@/components/site/trip-card";
import { BlogCard } from "@/components/site/blog-card";
import { MainSiteCta } from "@/components/site/main-site-cta";
import { SectionHeading } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const regions = await prisma.region
    .findMany({ where: { status: "published" }, select: { slug: true } })
    .catch(() => []);
  return regions.map((region) => ({ slug: region.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) return { title: "Region not found", robots: { index: false, follow: false } };

  const title = region.metaTitle || `${region.name} Trekking — Routes, Costs & Permits`;
  const description =
    region.metaDescription ||
    region.headline ||
    truncate(stripMarkdown(region.description), 158);

  return {
    title,
    description,
    keywords: splitList(region.keywords),
    alternates: { canonical: `/region/${region.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/region/${region.slug}`,
      images: region.heroImage
        ? [{ url: region.heroImage, alt: region.heroAlt || region.name }]
        : undefined,
    },
  };
}

/**
 * Region pillar page — the hub in the hub-and-spoke model. Links down to
 * every child itinerary and guide, which link back up via breadcrumbs.
 */
export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) notFound();

  const rules = await getBacklinkRules();
  const opts = { backlinks: rules, seed: region.slug };
  const body = renderMarkdown(region.description, opts);
  const faqs = region.faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: renderInline(faq.answer, opts),
  }));

  const crumbs: Crumb[] = [
    { name: "Regions", href: "/region" },
    { name: region.name, href: `/region/${region.slug}` },
  ];

  return (
    <>
      <JsonLd id="region-schema" data={regionSchema(region)} />
      <JsonLd id="region-breadcrumbs" data={breadcrumbSchema(crumbs)} />
      <JsonLd
        id="region-collection"
        data={collectionPageSchema({
          name: `${region.name} treks`,
          description: region.metaDescription || region.headline,
          url: `/region/${region.slug}`,
          items: region.itineraries.map((trip) => ({
            name: trip.title,
            url: `/itinerary/${trip.slug}`,
          })),
        })}
      />
      {faqs.length > 0 && (
        <JsonLd
          id="region-faq"
          data={faqSchema(
            region.faqs.map((f) => ({ question: f.question, answer: f.answer })),
            `/region/${region.slug}`,
          )}
        />
      )}

      <section className="relative isolate overflow-hidden bg-ink-950">
        {region.heroImage && (
          <Image
            src={region.heroImage}
            alt={region.heroAlt || region.name}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={72}
            className="object-cover opacity-60"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink-950/75 via-ink-950/45 to-ink-950/95"
        />
        <div className="container-page relative py-14 sm:py-20">
          <Breadcrumbs items={crumbs} className="mb-6 text-white/75" />
          <div className="max-w-3xl">
            <Badge variant="dark">Trekking region</Badge>
            <h1 className="mt-4 text-[1.9rem] font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-5xl">
              {region.name}
            </h1>
            {region.headline && (
              <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                {region.headline}
              </p>
            )}
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
              <span>
                <strong className="font-bold text-white">{region.itineraries.length}</strong> trek
                {region.itineraries.length === 1 ? "" : "s"}
              </span>
              <span>
                <strong className="font-bold text-white">{region.blogs.length}</strong> guide
                {region.blogs.length === 1 ? "" : "s"}
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-10 sm:py-14">
        <KeyTakeaways
          paragraph={region.keyTakeaway}
          bullets={region.takeaways}
          title={`${region.name} at a glance`}
          className="mb-10"
        />

        {body.html && (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="prose-trek" dangerouslySetInnerHTML={{ __html: body.html }} />
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <MainSiteCta variant="compact" tripTitle={`${region.name} treks`} />
            </aside>
          </div>
        )}

        {region.itineraries.length > 0 && (
          <section className="mt-14">
            <SectionHeading
              eyebrow="Itineraries"
              title={`${region.name} trekking routes`}
              description={`Every guided itinerary we run in the ${region.name} region, with full day-by-day plans.`}
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {region.itineraries.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} priority={index < 3} className="h-full" />
              ))}
            </div>
          </section>
        )}

        {region.blogs.length > 0 && (
          <section className="mt-14">
            <SectionHeading
              eyebrow="Guides"
              title={`${region.name} trekking guides`}
              description="Permits, costs, seasons and preparation advice for this region."
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {region.blogs.map((post) => (
                <BlogCard key={post.id} post={post} className="h-full" />
              ))}
            </div>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="mt-14">
            <SectionHeading eyebrow="FAQ" title={`${region.name} trekking questions`} />
            <div className="mt-8">
              <FaqAccordion faqs={faqs} />
            </div>
          </section>
        )}
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getRegions } from "@/lib/content";
import { SectionHeading } from "@/components/site/section";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { collectionPageSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

const TITLE = "Nepal Trekking Regions — Everest, Annapurna, Manaslu & Langtang";
const DESCRIPTION =
  "Every trekking region we guide in Nepal. Compare the Everest, Annapurna, Manaslu and Langtang Himalaya by difficulty, season, permits and typical trek length.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/region" },
};

export default async function RegionIndexPage() {
  const regions = await getRegions();
  const crumbs = [{ name: "Regions", href: "/region" }];

  return (
    <>
      <JsonLd id="regions-breadcrumbs" data={breadcrumbSchema(crumbs)} />
      <JsonLd
        id="regions-collection"
        data={collectionPageSchema({
          name: TITLE,
          description: DESCRIPTION,
          url: "/region",
          items: regions.map((r) => ({ name: r.name, url: `/region/${r.slug}` })),
        })}
      />

      <div className="border-b border-ink-200 bg-ink-50">
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs items={crumbs} className="mb-6 text-ink-600" />
          <SectionHeading as="h1" eyebrow="Regions" title="Trekking regions of Nepal" description={DESCRIPTION} />
        </div>
      </div>

      <div className="container-page py-10 sm:py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region, index) => (
            <Link
              key={region.id}
              href={`/region/${region.slug}`}
              className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl bg-ink-900 p-5"
            >
              {region.heroImage && (
                <Image
                  src={region.heroImage}
                  alt={region.heroAlt || region.name}
                  fill
                  priority={index < 3}
                  loading={index < 3 ? undefined : "lazy"}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-85"
                />
              )}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950/92 via-ink-950/35 to-transparent"
              />
              <div className="relative">
                <h2 className="text-xl font-bold text-white">{region.name}</h2>
                {region.headline && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/80">
                    {region.headline}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

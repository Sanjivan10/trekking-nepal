/**
 * Re-seeds the three priority treks (EBC 1, Manaslu 2, Annapurna 3), demotes
 * Gosaikunda/Langtang below the fold, and loads the Google testimonials.
 * Safe to re-run.
 */
import { PrismaClient } from "@prisma/client";
import { priorityTreks } from "./treks-data";
import { testimonials, GOOGLE_PROFILE, TRIPADVISOR_PROFILE } from "./testimonials-data";

const prisma = new PrismaClient();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000);

const REGIONS = [
  { slug: "everest", name: "Everest", position: 1 },
  { slug: "manaslu", name: "Manaslu", position: 2 },
  {
    slug: "annapurna",
    name: "Annapurna",
    position: 3,
    headline:
      "Thorong La at 5,416m, Muktinath, and hot springs at Tatopani — the classic circuit with the most scenery per day.",
    heroImage:
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=2000&q=70",
    heroAlt: "Annapurna range above the Marsyangdi valley in Nepal",
    metaTitle: "Annapurna Trekking — Circuit, Thorong La & Costs",
    metaDescription:
      "Trek the Annapurna region: the 12-day Circuit over the 5,416m Thorong La Pass, Muktinath temple and Tatopani hot springs. Exact prices and day-by-day routes.",
    keywords: "annapurna circuit trek, thorong la pass, annapurna trekking",
    entityTags: "Annapurna, Thorong La, Manang, Muktinath, Tatopani, Pokhara",
    keyTakeaway:
      "The Annapurna region holds Nepal's most famous circuit: 12 days over the 5,416m Thorong La Pass, from subtropical forest to high-altitude desert, with no domestic flight needed at either end.",
    takeaways: [
      "Signature route: Annapurna Circuit, 12 days, US$850 per person",
      "High point: Thorong La Pass, 5,416m — higher than Everest Base Camp",
      "Access: road at both ends, no Lukla-style flight cancellations",
      "Permits: ACAP + TIMS card",
      "Best months: March–May and October–November",
    ].join("\n"),
    description: `## Why Annapurna

The Annapurna Circuit is the trek that made Nepal famous with Western walkers, and it still holds up. Twelve days, one 5,416m pass, and a change of scenery so complete you'll check whether you're in the same country.

You start in paddy fields and pine, cross Thorong La in the snow, and come down the other side into what looks like Tibet — dry, wind-blasted, and enormous.

## Road access is the underrated part

Everest needs the Lukla flight, and Lukla flights get cancelled. Annapurna is reachable by road at both ends. If your holiday dates are fixed and your flight home is expensive, that reliability is worth more than most people realise until they're stuck in Kathmandu watching the weather.`,
  },
];

async function main() {
  console.log("Re-seeding priority treks…\n");

  /* ----------------------------- regions ----------------------------- */
  const regionIds = new Map<string, string>();
  for (const r of REGIONS) {
    const existing = await prisma.region.findUnique({ where: { slug: r.slug } });
    if (existing) {
      await prisma.region.update({ where: { slug: r.slug }, data: { position: r.position } });
      regionIds.set(r.slug, existing.id);
      console.log(`  region kept: ${r.name} (position ${r.position})`);
    } else {
      const created = await prisma.region.create({
        data: {
          slug: r.slug,
          name: r.name,
          position: r.position,
          headline: r.headline ?? "",
          description: r.description ?? "",
          heroImage: r.heroImage ?? "",
          heroAlt: r.heroAlt ?? "",
          metaTitle: r.metaTitle ?? "",
          metaDescription: r.metaDescription ?? "",
          keywords: r.keywords ?? "",
          entityTags: r.entityTags ?? "",
          keyTakeaway: r.keyTakeaway ?? "",
          takeaways: r.takeaways ?? "",
          featured: true,
          status: "published",
        },
      });
      regionIds.set(r.slug, created.id);
      console.log(`  region CREATED: ${r.name}`);
    }
  }

  /* --------------------------- priority treks ------------------------ */
  for (const trek of priorityTreks) {
    const existing = await prisma.itinerary.findUnique({ where: { slug: trek.slug } });
    if (existing) {
      await prisma.itineraryDay.deleteMany({ where: { itineraryId: existing.id } });
      await prisma.faq.deleteMany({ where: { itineraryId: existing.id } });
      await prisma.priceTier.deleteMany({ where: { itineraryId: existing.id } });
    }

    const data = {
      slug: trek.slug,
      title: trek.title,
      metaTitle: trek.metaTitle,
      metaDescription: trek.metaDescription,
      keywords: trek.keywords,
      entityTags: trek.entityTags,
      regionId: regionIds.get(trek.regionSlug) ?? null,
      heroImage: trek.heroImage,
      bannerImage: trek.bannerImage,
      bannerAlt: trek.bannerAlt,
      gallery: trek.gallery,
      overview: trek.overview,
      keyTakeaway: trek.keyTakeaway,
      takeaways: trek.takeaways,
      durationDays: trek.durationDays,
      durationNights: trek.durationNights,
      maxAltitude: trek.maxAltitude,
      bestSeason: trek.bestSeason,
      difficulty: trek.difficulty,
      groupSize: trek.groupSize,
      startPoint: trek.startPoint,
      endPoint: trek.endPoint,
      accommodation: trek.accommodation,
      transportation: trek.transportation,
      priceFrom: trek.priceFrom,
      priceRegular: trek.priceRegular,
      priceTo: 0,
      currency: trek.currency,
      priority: trek.priority,
      highlights: trek.highlights,
      includes: trek.includes,
      excludes: trek.excludes,
      mainSiteUrl: `/trip/${trek.slug}`,
      primaryAnchor: trek.title,
      backlinksEnabled: true,
      ctaHeadline: `Book the official ${trek.title}`,
      featured: true,
      status: "published",
      publishedAt: existing?.publishedAt ?? daysAgo(90),
      days: {
        create: trek.days.map((d, i) => ({
          dayNumber: i + 1,
          title: d.title,
          description: d.description,
          altitude: d.altitude ?? "",
          distance: d.distance ?? "",
          duration: d.duration ?? "",
          accommodation: d.accommodation ?? "",
        })),
      },
      faqs: { create: trek.faqs.map((f, i) => ({ ...f, position: i })) },
      tiers: {
        create: trek.tiers.map((t, i) => ({
          label: t.label,
          price: t.price,
          note: t.note ?? "",
          position: i,
        })),
      },
    };

    const saved = existing
      ? await prisma.itinerary.update({ where: { id: existing.id }, data })
      : await prisma.itinerary.create({ data });

    console.log(
      `  #${trek.priority} ${saved.title} — ${trek.durationDays}d, from $${trek.priceFrom} (was $${trek.priceRegular}), ${trek.tiers.length} tiers, ${trek.days.length} days`,
    );
  }

  /* ------------------------ demote the others ------------------------ */
  const demoted = await prisma.itinerary.updateMany({
    where: { slug: { notIn: priorityTreks.map((t) => t.slug) } },
    data: { priority: 50, featured: false },
  });
  console.log(`\n  demoted ${demoted.count} secondary trek(s) to priority 50`);

  await prisma.region.updateMany({
    where: { slug: { notIn: ["everest", "manaslu", "annapurna"] } },
    data: { position: 50, featured: false },
  });

  /* --------------------------- testimonials -------------------------- */
  await prisma.testimonial.deleteMany();
  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.create({
      data: {
        source: t.source,
        authorName: t.authorName,
        authorMeta: t.authorMeta,
        rating: 5,
        dateLabel: t.dateLabel,
        body: t.body,
        ownerReply: t.ownerReply ?? "",
        tripName: t.tripName ?? "",
        sourceUrl: t.source === "google" ? GOOGLE_PROFILE.url : TRIPADVISOR_PROFILE.url,
        featured: Boolean((t as { featured?: boolean }).featured),
        position: i,
        published: true,
      },
    });
  }
  console.log(`  ${testimonials.length} testimonials loaded`);

  /* ---------------------- review badges in footer -------------------- */
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      showReviewBadges: true,
      googleReviewUrl: GOOGLE_PROFILE.url,
      googleRating: GOOGLE_PROFILE.rating,
      googleCount: GOOGLE_PROFILE.count,
      tripadvisorUrl: TRIPADVISOR_PROFILE.url,
      tripadvisorRating: TRIPADVISOR_PROFILE.rating,
      tripadvisorCount: TRIPADVISOR_PROFILE.count,
    },
    update: {
      showReviewBadges: true,
      googleReviewUrl: GOOGLE_PROFILE.url,
      googleRating: GOOGLE_PROFILE.rating,
      googleCount: GOOGLE_PROFILE.count,
      tripadvisorUrl: TRIPADVISOR_PROFILE.url,
      tripadvisorRating: TRIPADVISOR_PROFILE.rating,
      tripadvisorCount: TRIPADVISOR_PROFILE.count,
    },
  });
  console.log("  footer review badges configured");
  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

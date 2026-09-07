import { PrismaClient } from "@prisma/client";
import { regions, itineraries, blogs, siteFaqs } from "./seed-data";

const prisma = new PrismaClient();

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/** Words / 220 wpm, matching lib/utils readingTime(). */
function readingTime(markdown: string) {
  const words = markdown.replace(/[#*_`>|-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

async function main() {
  console.log("Seeding database…");

  // Clear in FK-safe order.
  await prisma.faq.deleteMany();
  await prisma.review.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.region.deleteMany();
  await prisma.backlinkTarget.deleteMany();

  /* ------------------------------ regions ------------------------------ */
  const regionIds = new Map<string, string>();
  for (const region of regions) {
    const created = await prisma.region.create({
      data: {
        slug: region.slug,
        name: region.name,
        headline: region.headline,
        description: region.description,
        heroImage: region.heroImage,
        heroAlt: region.heroAlt,
        metaTitle: region.metaTitle,
        metaDescription: region.metaDescription,
        keywords: region.keywords,
        entityTags: region.entityTags,
        keyTakeaway: region.keyTakeaway,
        takeaways: region.takeaways,
        position: region.position,
        featured: region.featured,
        status: "published",
      },
    });
    regionIds.set(region.slug, created.id);
  }
  console.log(`  ${regions.length} regions`);

  /* ---------------------------- itineraries ---------------------------- */
  for (const trip of itineraries) {
    const created = await prisma.itinerary.create({
      data: {
        slug: trip.slug,
        title: trip.title,
        metaTitle: trip.metaTitle,
        metaDescription: trip.metaDescription,
        keywords: trip.keywords,
        bannerImage: trip.bannerImage,
        bannerAlt: trip.bannerAlt,
        heroImage: trip.heroImage,
        gallery: trip.gallery,
        overview: trip.overview,
        keyTakeaway: trip.keyTakeaway,
        takeaways: trip.takeaways,
        durationDays: trip.durationDays,
        durationNights: trip.durationNights,
        maxAltitude: trip.maxAltitude,
        bestSeason: trip.bestSeason,
        difficulty: trip.difficulty,
        startPoint: trip.startPoint,
        endPoint: trip.endPoint,
        groupSize: trip.groupSize,
        accommodation: trip.accommodation,
        transportation: trip.transportation,
        priceFrom: trip.priceFrom,
        priceTo: trip.priceTo,
        currency: trip.currency,
        highlights: trip.highlights,
        includes: trip.includes,
        excludes: trip.excludes,
        entityTags: trip.entityTags,
        regionId: regionIds.get(trip.regionSlug) ?? null,
        mainSiteUrl: `/trip/${trip.slug}`,
        primaryAnchor: trip.primaryAnchor,
        secondaryAnchors: trip.secondaryAnchors,
        backlinksEnabled: true,
        ctaHeadline: trip.ctaHeadline,
        ctaText: trip.ctaText,
        featured: trip.featured,
        status: "published",
        publishedAt: daysAgo(120),
        days: {
          create: trip.days.map((day, index) => ({
            dayNumber: index + 1,
            title: day.title,
            description: day.description,
            accommodation: day.accommodation,
            distance: day.distance,
            duration: day.duration,
            altitude: day.altitude,
          })),
        },
        faqs: {
          create: trip.faqs.map((faq, index) => ({ ...faq, position: index })),
        },
        reviews: {
          create: trip.reviews.map((review) => ({
            authorName: review.authorName,
            country: review.country,
            rating: review.rating,
            title: review.title,
            body: review.body,
            approved: true,
            reviewedAt: daysAgo(review.daysAgo),
            createdAt: daysAgo(review.daysAgo),
          })),
        },
      },
    });

    // Recompute the aggregate rating from the reviews we just created.
    const agg = await prisma.review.aggregate({
      where: { itineraryId: created.id, approved: true },
      _avg: { rating: true },
      _count: { _all: true },
    });
    await prisma.itinerary.update({
      where: { id: created.id },
      data: {
        ratingValue: agg._avg.rating ? Number(agg._avg.rating.toFixed(2)) : 0,
        reviewCount: agg._count._all,
      },
    });
  }
  console.log(`  ${itineraries.length} itineraries`);

  /* -------------------------------- blogs ------------------------------- */
  for (const [index, post] of blogs.entries()) {
    await prisma.blog.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        bannerImage: post.bannerImage,
        bannerAlt: post.bannerAlt,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        primaryKeywords: post.primaryKeywords,
        secondaryKeywords: post.secondaryKeywords,
        author: post.author,
        authorTitle: post.authorTitle,
        authorBio: post.authorBio,
        keyTakeaway: post.keyTakeaway,
        takeaways: post.takeaways,
        readMinutes: readingTime(post.content),
        entityTags: post.entityTags,
        regionId: regionIds.get(post.regionSlug) ?? null,
        mainSiteUrl: post.mainSiteUrl,
        primaryAnchor: post.primaryAnchor,
        secondaryAnchors: post.secondaryAnchors ?? "",
        backlinksEnabled: true,
        featured: index === 0,
        status: "published",
        publishedAt: daysAgo(30 + index * 18),
        faqs: { create: post.faqs.map((faq, i) => ({ ...faq, position: i })) },
      },
    });
  }
  console.log(`  ${blogs.length} blog posts`);

  /* ----------------------------- site FAQs ------------------------------ */
  for (const [index, faq] of siteFaqs.entries()) {
    await prisma.faq.create({ data: { ...faq, position: index } });
  }
  console.log(`  ${siteFaqs.length} site-wide FAQs`);

  /* -------------------------- backlink rules ---------------------------- */
  const backlinks = [
    {
      keyword: "Everest Base Camp Trek",
      targetUrl: "/trip/everest-base-camp-trek",
      anchorText: "Everest Base Camp Trek",
      variations: "official Everest Base Camp trek, EBC trek packages",
      priority: 30,
      maxPerPage: 1,
      notes: "Primary money page for Khumbu content.",
    },
    {
      keyword: "Manaslu Circuit Trek",
      targetUrl: "/trip/manaslu-circuit-trek",
      anchorText: "Manaslu Circuit Trek",
      variations: "official Manaslu Circuit trek, Manaslu trek packages",
      priority: 30,
      maxPerPage: 1,
      notes: "Primary money page for Manaslu content.",
    },
    {
      keyword: "Gosaikunda Lake Trek",
      targetUrl: "/trip/gosaikunda-lake-trek",
      anchorText: "Gosaikunda Lake Trek",
      variations: "official Gosaikunda trek, Langtang Gosaikunda trek",
      priority: 30,
      maxPerPage: 1,
      notes: "Primary money page for Langtang content.",
    },
    {
      keyword: "trekking in Nepal",
      targetUrl: "/",
      anchorText: "trekking in Nepal",
      variations: "Nepal trekking packages, guided Nepal treks",
      priority: 5,
      maxPerPage: 1,
      notes: "Broad brand link. Low priority so specific trek rules win.",
    },
  ];
  for (const rule of backlinks) {
    await prisma.backlinkTarget.create({ data: { ...rule, active: true } });
  }
  console.log(`  ${backlinks.length} backlink rules`);

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

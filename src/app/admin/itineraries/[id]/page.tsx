import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ItineraryForm } from "@/components/admin/itinerary-form";
import type { ItineraryDraft } from "@/lib/drafts";

export const dynamic = "force-dynamic";

export default async function EditItineraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [trip, regions] = await Promise.all([
    prisma.itinerary.findUnique({
      where: { id },
      include: {
        days: { orderBy: { dayNumber: "asc" } },
        faqs: { orderBy: { position: "asc" } },
        reviews: { orderBy: { reviewedAt: "desc" } },
      },
    }),
    prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!trip) notFound();

  const initial: ItineraryDraft = {
    id: trip.id,
    title: trip.title, slug: trip.slug,
    metaTitle: trip.metaTitle, metaDescription: trip.metaDescription,
    keywords: trip.keywords, canonicalUrl: trip.canonicalUrl,
    bannerImage: trip.bannerImage, bannerAlt: trip.bannerAlt,
    heroImage: trip.heroImage, gallery: trip.gallery,
    adImage: trip.adImage, adAlt: trip.adAlt, adLink: trip.adLink, adLabel: trip.adLabel,
    overview: trip.overview, keyTakeaway: trip.keyTakeaway, takeaways: trip.takeaways,
    durationDays: trip.durationDays, durationNights: trip.durationNights,
    maxAltitude: trip.maxAltitude, bestSeason: trip.bestSeason, difficulty: trip.difficulty,
    startPoint: trip.startPoint, endPoint: trip.endPoint, groupSize: trip.groupSize,
    accommodation: trip.accommodation, transportation: trip.transportation,
    priceFrom: trip.priceFrom, priceTo: trip.priceTo, currency: trip.currency,
    highlights: trip.highlights, includes: trip.includes, excludes: trip.excludes,
    entityTags: trip.entityTags, regionId: trip.regionId || "",
    mainSiteUrl: trip.mainSiteUrl, primaryAnchor: trip.primaryAnchor,
    secondaryAnchors: trip.secondaryAnchors, backlinksEnabled: trip.backlinksEnabled,
    ctaHeadline: trip.ctaHeadline, ctaText: trip.ctaText,
    featured: trip.featured, status: trip.status,
    days: trip.days.map((day) => ({
      dayNumber: day.dayNumber, title: day.title, description: day.description,
      accommodation: day.accommodation, meals: day.meals, distance: day.distance,
      duration: day.duration, altitude: day.altitude, image: day.image,
    })),
    faqs: trip.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
    reviews: trip.reviews.map((review) => ({
      authorName: review.authorName, country: review.country, rating: review.rating,
      title: review.title, body: review.body, approved: review.approved,
      reviewedAt: review.reviewedAt.toISOString().slice(0, 10),
    })),
  };

  return <ItineraryForm initial={initial} regions={regions} />;
}

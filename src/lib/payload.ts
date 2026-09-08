/**
 * Shapes raw admin form JSON into Prisma-ready data.
 * Shared between the create (POST) and update (PUT) routes.
 */
import { str, num, int, bool, csv } from "./api";
import { slugify, readingTime } from "./utils";

type Body = Record<string, any>;

export type FaqInput = { question: string; answer: string };

export function faqRows(body: Body): FaqInput[] {
  const list = Array.isArray(body.faqs) ? body.faqs : [];
  return list
    .map((faq: Body) => ({ question: str(faq?.question), answer: str(faq?.answer) }))
    .filter((faq) => faq.question && faq.answer);
}

export function blogPayload(body: Body) {
  const title = str(body.title);
  const content = str(body.content);
  const status = body.status === "published" ? "published" : "draft";

  return {
    title,
    slug: slugify(str(body.slug) || title),
    excerpt: str(body.excerpt),
    content,
    bannerImage: str(body.bannerImage),
    bannerAlt: str(body.bannerAlt),
    metaTitle: str(body.metaTitle),
    metaDescription: str(body.metaDescription),
    primaryKeywords: csv(body.primaryKeywords),
    secondaryKeywords: csv(body.secondaryKeywords),
    canonicalUrl: str(body.canonicalUrl),
    author: str(body.author),
    authorTitle: str(body.authorTitle),
    authorBio: str(body.authorBio),
    authorImage: str(body.authorImage),
    keyTakeaway: str(body.keyTakeaway),
    takeaways: str(body.takeaways),
    readMinutes: int(body.readMinutes) || readingTime(content),
    entityTags: csv(body.entityTags),
    regionId: str(body.regionId) || null,
    mainSiteUrl: str(body.mainSiteUrl),
    primaryAnchor: str(body.primaryAnchor),
    secondaryAnchors: csv(body.secondaryAnchors),
    backlinksEnabled: bool(body.backlinksEnabled, true),
    featured: bool(body.featured),
    status,
  };
}

export function itineraryPayload(body: Body) {
  const title = str(body.title);
  const status = body.status === "published" ? "published" : "draft";

  return {
    title,
    slug: slugify(str(body.slug) || title),
    metaTitle: str(body.metaTitle),
    metaDescription: str(body.metaDescription),
    keywords: csv(body.keywords),
    canonicalUrl: str(body.canonicalUrl),
    bannerImage: str(body.bannerImage),
    bannerAlt: str(body.bannerAlt),
    heroImage: str(body.heroImage),
    gallery: str(body.gallery),
    adImage: str(body.adImage),
    adAlt: str(body.adAlt),
    adLink: str(body.adLink),
    adLabel: str(body.adLabel) || "Sponsored",
    overview: str(body.overview),
    keyTakeaway: str(body.keyTakeaway),
    takeaways: str(body.takeaways),
    durationDays: int(body.durationDays),
    durationNights: int(body.durationNights),
    maxAltitude: str(body.maxAltitude),
    bestSeason: str(body.bestSeason),
    difficulty: str(body.difficulty) || "Moderate",
    startPoint: str(body.startPoint),
    endPoint: str(body.endPoint),
    groupSize: str(body.groupSize),
    accommodation: str(body.accommodation),
    transportation: str(body.transportation),
    priceFrom: num(body.priceFrom),
    priceTo: num(body.priceTo),
    currency: str(body.currency) || "USD",
    highlights: str(body.highlights),
    includes: str(body.includes),
    excludes: str(body.excludes),
    entityTags: csv(body.entityTags),
    regionId: str(body.regionId) || null,
    mainSiteUrl: str(body.mainSiteUrl),
    primaryAnchor: str(body.primaryAnchor),
    secondaryAnchors: csv(body.secondaryAnchors),
    backlinksEnabled: bool(body.backlinksEnabled, true),
    ctaHeadline: str(body.ctaHeadline),
    ctaText: str(body.ctaText),
    featured: bool(body.featured),
    status,
  };
}

export function dayRows(body: Body) {
  const list = Array.isArray(body.days) ? body.days : [];
  return list
    .map((day: Body, index: number) => ({
      dayNumber: int(day?.dayNumber, index + 1) || index + 1,
      title: str(day?.title),
      description: str(day?.description),
      accommodation: str(day?.accommodation),
      meals: str(day?.meals),
      distance: str(day?.distance),
      duration: str(day?.duration),
      altitude: str(day?.altitude),
      image: str(day?.image),
    }))
    .filter((day) => day.title || day.description)
    .sort((a, b) => a.dayNumber - b.dayNumber);
}

export function reviewRows(body: Body) {
  const list = Array.isArray(body.reviews) ? body.reviews : [];
  return list
    .map((review: Body) => ({
      authorName: str(review?.authorName),
      country: str(review?.country),
      rating: Math.min(5, Math.max(1, int(review?.rating, 5))),
      title: str(review?.title),
      body: str(review?.body),
      approved: bool(review?.approved, true),
      reviewedAt: review?.reviewedAt ? new Date(review.reviewedAt) : new Date(),
    }))
    .filter((review) => review.authorName);
}

export function regionPayload(body: Body) {
  const name = str(body.name);
  return {
    name,
    slug: slugify(str(body.slug) || name),
    headline: str(body.headline),
    description: str(body.description),
    heroImage: str(body.heroImage),
    heroAlt: str(body.heroAlt),
    metaTitle: str(body.metaTitle),
    metaDescription: str(body.metaDescription),
    keywords: csv(body.keywords),
    entityTags: csv(body.entityTags),
    keyTakeaway: str(body.keyTakeaway),
    takeaways: str(body.takeaways),
    position: int(body.position),
    featured: bool(body.featured),
    status: body.status === "draft" ? "draft" : "published",
  };
}

export function backlinkPayload(body: Body) {
  return {
    keyword: str(body.keyword),
    targetUrl: str(body.targetUrl),
    anchorText: str(body.anchorText),
    variations: csv(body.variations),
    priority: int(body.priority),
    maxPerPage: Math.max(1, int(body.maxPerPage, 1)),
    active: bool(body.active, true),
    notes: str(body.notes),
  };
}

/** Publish flips publishedAt on the first publish and never rewrites it after. */
export function publishStamp(status: string, existing?: Date | null) {
  if (status !== "published") return null;
  return existing ?? new Date();
}

export function testimonialPayload(body: Body) {
  return {
    source: ["google", "tripadvisor", "direct"].includes(str(body.source))
      ? str(body.source)
      : "google",
    authorName: str(body.authorName).slice(0, 120),
    authorMeta: str(body.authorMeta).slice(0, 160),
    rating: Math.min(5, Math.max(1, int(body.rating, 5))),
    dateLabel: str(body.dateLabel).slice(0, 60),
    body: str(body.body).slice(0, 4000),
    ownerReply: str(body.ownerReply).slice(0, 4000),
    sourceUrl: str(body.sourceUrl),
    tripName: str(body.tripName).slice(0, 120),
    featured: bool(body.featured),
    position: int(body.position),
    published: bool(body.published, true),
  };
}

/**
 * Data-access layer. All queries live here so pages stay thin and every
 * public query consistently filters to published content.
 */
import { prisma } from "./prisma";
import type { BacklinkRule } from "./backlinkEngine";
import { splitList } from "./utils";

export const PUBLISHED = { status: "published" } as const;

/* ---------------------------- backlink rules ---------------------------- */

export async function getBacklinkRules(): Promise<BacklinkRule[]> {
  const rows = await prisma.backlinkTarget.findMany({
    where: { active: true },
    orderBy: [{ priority: "desc" }, { keyword: "desc" }],
  });
  return rows.map((row) => ({
    keyword: row.keyword,
    targetUrl: row.targetUrl,
    anchorText: row.anchorText,
    variations: row.variations,
    priority: row.priority,
    maxPerPage: row.maxPerPage,
    active: row.active,
  }));
}

/* -------------------------------- blogs -------------------------------- */

export const blogCardSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  bannerImage: true,
  bannerAlt: true,
  author: true,
  readMinutes: true,
  publishedAt: true,
  featured: true,
  entityTags: true,
  region: { select: { name: true, slug: true } },
} as const;

export function getPublishedBlogs(opts: { take?: number; skip?: number } = {}) {
  return prisma.blog.findMany({
    where: PUBLISHED,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    select: blogCardSelect,
    take: opts.take,
    skip: opts.skip,
  });
}

export function getBlogBySlug(slug: string) {
  return prisma.blog.findFirst({
    where: { slug, ...PUBLISHED },
    include: {
      faqs: { orderBy: { position: "asc" } },
      region: { select: { name: true, slug: true } },
    },
  });
}

/* ----------------------------- itineraries ----------------------------- */

export const tripCardSelect = {
  id: true,
  slug: true,
  title: true,
  metaDescription: true,
  keyTakeaway: true,
  bannerImage: true,
  bannerAlt: true,
  heroImage: true,
  durationDays: true,
  durationNights: true,
  maxAltitude: true,
  difficulty: true,
  bestSeason: true,
  priceFrom: true,
  currency: true,
  ratingValue: true,
  reviewCount: true,
  featured: true,
  entityTags: true,
  region: { select: { name: true, slug: true } },
} as const;

export function getPublishedItineraries(opts: { take?: number; skip?: number } = {}) {
  return prisma.itinerary.findMany({
    where: PUBLISHED,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    select: tripCardSelect,
    take: opts.take,
    skip: opts.skip,
  });
}

export function getItineraryBySlug(slug: string) {
  return prisma.itinerary.findFirst({
    where: { slug, ...PUBLISHED },
    include: {
      days: { orderBy: { dayNumber: "asc" } },
      faqs: { orderBy: { position: "asc" } },
      reviews: { where: { approved: true }, orderBy: { reviewedAt: "desc" } },
      region: { select: { name: true, slug: true } },
    },
  });
}

/* -------------------------------- regions ------------------------------- */

export function getRegions() {
  return prisma.region.findMany({
    where: { status: "published" },
    orderBy: [{ position: "asc" }, { name: "asc" }],
  });
}

export function getRegionBySlug(slug: string) {
  return prisma.region.findFirst({
    where: { slug, status: "published" },
    include: {
      faqs: { orderBy: { position: "asc" } },
      itineraries: {
        where: PUBLISHED,
        orderBy: [{ featured: "desc" }, { durationDays: "asc" }],
        select: tripCardSelect,
      },
      blogs: {
        where: PUBLISHED,
        orderBy: { publishedAt: "desc" },
        select: blogCardSelect,
      },
    },
  });
}

/* --------------------- hub & spoke internal linking --------------------- */

type Taggable = { id: string; entityTags?: string | null; region?: { slug: string } | null };

/** Scores candidates by shared entity tags + shared region. */
function relevance(source: Taggable, candidate: Taggable) {
  const sourceTags = new Set(splitList(source.entityTags).map((t) => t.toLowerCase()));
  const candidateTags = splitList(candidate.entityTags).map((t) => t.toLowerCase());
  let score = candidateTags.filter((tag) => sourceTags.has(tag)).length * 2;
  if (source.region?.slug && source.region.slug === candidate.region?.slug) score += 3;
  return score;
}

/** Related trips for a blog post (spoke -> money page). */
export async function getRelatedItineraries(source: Taggable, take = 4) {
  const candidates = await prisma.itinerary.findMany({
    where: { ...PUBLISHED, id: { not: source.id } },
    select: tripCardSelect,
    take: 40,
    orderBy: [{ featured: "desc" }, { ratingValue: "desc" }],
  });
  return candidates
    .map((item) => ({ item, score: relevance(source, item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, take)
    .map((entry) => entry.item);
}

/** Related guides for an itinerary (money page -> supporting content). */
export async function getRelatedBlogs(source: Taggable, take = 3) {
  const candidates = await prisma.blog.findMany({
    where: { ...PUBLISHED, id: { not: source.id } },
    select: blogCardSelect,
    take: 40,
    orderBy: { publishedAt: "desc" },
  });
  return candidates
    .map((item) => ({ item, score: relevance(source, item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, take)
    .map((entry) => entry.item);
}

/** Recomputes and stores aggregate rating from approved reviews. */
export async function recomputeRating(itineraryId: string) {
  const agg = await prisma.review.aggregate({
    where: { itineraryId, approved: true },
    _avg: { rating: true },
    _count: { _all: true },
  });
  return prisma.itinerary.update({
    where: { id: itineraryId },
    data: {
      ratingValue: agg._avg.rating ? Number(agg._avg.rating.toFixed(2)) : 0,
      reviewCount: agg._count._all,
    },
  });
}

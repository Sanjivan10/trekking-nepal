/**
 * Draft shapes + empty-record factories for the admin forms.
 *
 * This module deliberately has NO "use client" directive: the `/new` pages are
 * Server Components and must be able to call these factories directly. Exports
 * of a "use client" module become client references on the server, so calling
 * one from a server page throws
 * "Attempted to call X() from the server but X is on the client".
 */

/* -------------------------------- shared -------------------------------- */

export type FaqDraft = { question: string; answer: string };

export type DayDraft = {
  dayNumber: number;
  title: string;
  description: string;
  accommodation: string;
  meals: string;
  distance: string;
  duration: string;
  altitude: string;
  image: string;
};

export const emptyDay = (dayNumber: number): DayDraft => ({
  dayNumber,
  title: "",
  description: "",
  accommodation: "",
  meals: "",
  distance: "",
  duration: "",
  altitude: "",
  image: "",
});

export type ReviewDraft = {
  authorName: string;
  country: string;
  rating: number;
  title: string;
  body: string;
  approved: boolean;
  reviewedAt: string;
};

export const emptyReview = (): ReviewDraft => ({
  authorName: "",
  country: "",
  rating: 5,
  title: "",
  body: "",
  approved: true,
  reviewedAt: new Date().toISOString().slice(0, 10),
});

/* --------------------------------- blog --------------------------------- */

export type BlogDraft = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  bannerImage: string;
  bannerAlt: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeywords: string;
  secondaryKeywords: string;
  canonicalUrl: string;
  author: string;
  authorTitle: string;
  authorBio: string;
  authorImage: string;
  keyTakeaway: string;
  takeaways: string;
  readMinutes: number;
  entityTags: string;
  regionId: string;
  mainSiteUrl: string;
  primaryAnchor: string;
  secondaryAnchors: string;
  backlinksEnabled: boolean;
  featured: boolean;
  status: string;
  faqs: FaqDraft[];
};

export const emptyBlog = (): BlogDraft => ({
  title: "", slug: "", excerpt: "", content: "", bannerImage: "", bannerAlt: "",
  metaTitle: "", metaDescription: "", primaryKeywords: "", secondaryKeywords: "",
  canonicalUrl: "", author: "", authorTitle: "", authorBio: "", authorImage: "",
  keyTakeaway: "", takeaways: "", readMinutes: 0, entityTags: "", regionId: "",
  mainSiteUrl: "", primaryAnchor: "", secondaryAnchors: "", backlinksEnabled: true,
  featured: false, status: "draft", faqs: [],
});

/* ------------------------------- itinerary ------------------------------- */

export type ItineraryDraft = {
  id?: string;
  title: string; slug: string; metaTitle: string; metaDescription: string;
  keywords: string; canonicalUrl: string;
  bannerImage: string; bannerAlt: string; heroImage: string; gallery: string;
  adImage: string; adAlt: string; adLink: string; adLabel: string;
  overview: string; keyTakeaway: string; takeaways: string;
  durationDays: number; durationNights: number; maxAltitude: string;
  bestSeason: string; difficulty: string; startPoint: string; endPoint: string;
  groupSize: string; accommodation: string; transportation: string;
  priceFrom: number; priceTo: number; currency: string;
  highlights: string; includes: string; excludes: string;
  entityTags: string; regionId: string;
  mainSiteUrl: string; primaryAnchor: string; secondaryAnchors: string;
  backlinksEnabled: boolean; ctaHeadline: string; ctaText: string;
  featured: boolean; status: string;
  days: DayDraft[]; faqs: FaqDraft[]; reviews: ReviewDraft[];
};

export const emptyItinerary = (): ItineraryDraft => ({
  title: "", slug: "", metaTitle: "", metaDescription: "", keywords: "", canonicalUrl: "",
  bannerImage: "", bannerAlt: "", heroImage: "", gallery: "",
  adImage: "", adAlt: "", adLink: "", adLabel: "Sponsored",
  overview: "", keyTakeaway: "", takeaways: "",
  durationDays: 0, durationNights: 0, maxAltitude: "", bestSeason: "",
  difficulty: "Moderate", startPoint: "", endPoint: "", groupSize: "",
  accommodation: "", transportation: "",
  priceFrom: 0, priceTo: 0, currency: "USD",
  highlights: "", includes: "", excludes: "",
  entityTags: "", regionId: "",
  mainSiteUrl: "", primaryAnchor: "", secondaryAnchors: "", backlinksEnabled: true,
  ctaHeadline: "", ctaText: "",
  featured: false, status: "draft",
  days: [emptyDay(1)], faqs: [], reviews: [],
});

/* -------------------------------- region -------------------------------- */

export type RegionDraft = {
  id?: string;
  name: string; slug: string; headline: string; description: string;
  heroImage: string; heroAlt: string;
  metaTitle: string; metaDescription: string; keywords: string; entityTags: string;
  keyTakeaway: string; takeaways: string;
  position: number; featured: boolean; status: string;
  faqs: FaqDraft[];
};

export const emptyRegion = (): RegionDraft => ({
  name: "", slug: "", headline: "", description: "", heroImage: "", heroAlt: "",
  metaTitle: "", metaDescription: "", keywords: "", entityTags: "",
  keyTakeaway: "", takeaways: "",
  position: 0, featured: false, status: "published", faqs: [],
});

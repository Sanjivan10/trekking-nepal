/**
 * JSON-LD generators (schema.org) for SEO / AEO / GEO.
 *
 * Every generator returns a plain object. Render it with <JsonLd data={...} />
 * which serialises it into a <script type="application/ld+json"> tag.
 *
 * Rich-result targets:
 *  - TouristTrip + AggregateRating -> trip rich cards + star ratings
 *  - BlogPosting / Article         -> article rich results, Discover, Top Stories
 *  - FAQPage                       -> FAQ accordions in SERPs + AI citations
 *  - BreadcrumbList                -> breadcrumb trail in SERPs
 *  - Organization / TravelAgency   -> knowledge panel + entity grounding
 */
import { site, absoluteUrl } from "./site";
import { splitLines, splitList, isoDate, stripMarkdown, truncate } from "./utils";

type Json = Record<string, unknown>;

/** Removes empty strings/arrays/undefined so emitted JSON-LD stays clean. */
function prune<T extends Json>(obj: T): T {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete obj[key];
    } else if (typeof value === "object" && !Array.isArray(value)) {
      prune(value as Json);
      if (Object.keys(value as Json).length === 0) delete obj[key];
    }
  }
  return obj;
}

function imageUrl(src?: string | null) {
  if (!src) return undefined;
  return src.startsWith("http") ? src : absoluteUrl(src);
}

/* ------------------------------------------------------------------ */
/* Organization / LocalBusiness — site-wide entity                     */
/* ------------------------------------------------------------------ */

export const ORGANIZATION_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

/** Contact details are editable in /admin/footer; blank fields are omitted. */
export type OrgOverrides = {
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialX?: string;
};

export function organizationSchema(overrides: OrgOverrides = {}): Json {
  const sameAs = [
    overrides.socialFacebook,
    overrides.socialInstagram,
    overrides.socialYoutube,
    overrides.socialX,
  ].filter((url): url is string => Boolean(url?.trim()));

  return prune({
    "@type": ["Organization", "TravelAgency", "LocalBusiness"],
    "@id": ORGANIZATION_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: imageUrl(site.logo),
      caption: site.name,
    },
    image: imageUrl(site.logo),
    description: site.description,
    email: overrides.contactEmail?.trim() || undefined,
    telephone: overrides.contactPhone?.trim() || undefined,
    foundingDate: site.foundingDate,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: overrides.contactAddress?.trim() || undefined,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed: { "@type": "Country", name: "Nepal" },
    knowsLanguage: ["en", "ne"],
    sameAs: sameAs.length ? sameAs : undefined,
  });
}

export function websiteSchema(): Json {
  return prune({
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/itinerary?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

/** Header/footer graph — emitted once per page in the root layout. */
export function siteGraph(overrides: OrgOverrides = {}): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(overrides), websiteSchema()],
  };
}

/* ------------------------------------------------------------------ */
/* BreadcrumbList                                                      */
/* ------------------------------------------------------------------ */

export type Crumb = { name: string; href: string };

/**
 * The visible <Breadcrumbs /> always renders Home first, and Google requires
 * the markup to match what is on the page — so prepend it here too.
 */
export function breadcrumbSchema(crumbs: Crumb[]): Json {
  const trail = [{ name: "Home", href: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.href),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* FAQPage                                                             */
/* ------------------------------------------------------------------ */

export type FaqLike = { question: string; answer: string };

export function faqSchema(faqs: FaqLike[], pageUrl?: string): Json | null {
  const valid = faqs.filter((f) => f.question?.trim() && f.answer?.trim());
  if (valid.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": pageUrl ? `${absoluteUrl(pageUrl)}#faq` : undefined,
    mainEntity: valid.map((faq) => ({
      "@type": "Question",
      name: faq.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripMarkdown(faq.answer).trim(),
      },
    })),
  };
}

/* ------------------------------------------------------------------ */
/* BlogPosting / Article                                               */
/* ------------------------------------------------------------------ */

export type BlogSchemaInput = {
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  excerpt?: string | null;
  content?: string | null;
  bannerImage?: string | null;
  bannerAlt?: string | null;
  author?: string | null;
  authorTitle?: string | null;
  authorImage?: string | null;
  primaryKeywords?: string | null;
  secondaryKeywords?: string | null;
  entityTags?: string | null;
  readMinutes?: number | null;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

export function blogPostingSchema(post: BlogSchemaInput): Json {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const keywords = [
    ...splitList(post.primaryKeywords),
    ...splitList(post.secondaryKeywords),
  ];
  const wordCount = post.content
    ? stripMarkdown(post.content).split(/\s+/).filter(Boolean).length
    : undefined;

  return prune({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: truncate(post.metaTitle || post.title, 110),
    name: post.title,
    description:
      post.metaDescription || post.excerpt || truncate(stripMarkdown(post.content || ""), 160),
    articleBody: post.content ? stripMarkdown(post.content) : undefined,
    wordCount,
    timeRequired: post.readMinutes ? `PT${post.readMinutes}M` : undefined,
    inLanguage: "en",
    image: post.bannerImage
      ? {
          "@type": "ImageObject",
          url: imageUrl(post.bannerImage),
          caption: post.bannerAlt || post.title,
        }
      : undefined,
    datePublished: isoDate(post.publishedAt),
    dateModified: isoDate(post.updatedAt) || isoDate(post.publishedAt),
    author: post.author
      ? prune({
          "@type": "Person",
          name: post.author,
          jobTitle: post.authorTitle || undefined,
          image: imageUrl(post.authorImage),
          url: `${site.url}/about`,
        })
      : { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    keywords: keywords.length ? keywords.join(", ") : undefined,
    about: splitList(post.entityTags).map((tag) => ({ "@type": "Thing", name: tag })),
    isAccessibleForFree: true,
  });
}

/* ------------------------------------------------------------------ */
/* TouristTrip + AggregateRating + Review                              */
/* ------------------------------------------------------------------ */

export type TripSchemaInput = {
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  overview?: string | null;
  keyTakeaway?: string | null;
  heroImage?: string | null;
  bannerImage?: string | null;
  bannerAlt?: string | null;
  gallery?: string | null;
  durationDays?: number | null;
  maxAltitude?: string | null;
  difficulty?: string | null;
  bestSeason?: string | null;
  startPoint?: string | null;
  endPoint?: string | null;
  groupSize?: string | null;
  highlights?: string | null;
  includes?: string | null;
  keywords?: string | null;
  entityTags?: string | null;
  priceFrom?: number | null;
  priceRegular?: number | null;
  tiers?: Array<{ label: string; price: number }>;
  priceTo?: number | null;
  currency?: string | null;
  ratingValue?: number | null;
  reviewCount?: number | null;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
  region?: { name: string; slug: string } | null;
  days?: Array<{
    dayNumber: number;
    title?: string | null;
    description?: string | null;
    accommodation?: string | null;
    distance?: string | null;
    duration?: string | null;
    altitude?: string | null;
  }>;
  reviews?: Array<{
    authorName: string;
    rating: number;
    title?: string | null;
    body?: string | null;
    reviewedAt?: Date | string | null;
  }>;
};

export function touristTripSchema(trip: TripSchemaInput): Json {
  const url = absoluteUrl(`/trip/${trip.slug}`);
  const images = [
    trip.heroImage,
    trip.bannerImage,
    ...splitLines(trip.gallery),
  ]
    .filter(Boolean)
    .map((src) => imageUrl(src as string))
    .filter((v, i, arr) => v && arr.indexOf(v) === i);

  // Day-by-day itinerary as an ordered ItemList of TouristDestination stops.
  const itinerary =
    trip.days && trip.days.length
      ? {
          "@type": "ItemList",
          numberOfItems: trip.days.length,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: trip.days
            .slice()
            .sort((a, b) => a.dayNumber - b.dayNumber)
            .map((day) =>
              prune({
                "@type": "ListItem",
                position: day.dayNumber,
                name: `Day ${day.dayNumber}: ${day.title || ""}`.trim().replace(/:$/, ""),
                item: prune({
                  "@type": "TouristDestination",
                  name: day.title || `Day ${day.dayNumber}`,
                  description: [
                    day.description ? stripMarkdown(day.description) : "",
                    day.altitude ? `Max altitude: ${day.altitude}.` : "",
                    day.distance ? `Distance: ${day.distance}.` : "",
                    day.duration ? `Walking time: ${day.duration}.` : "",
                    day.accommodation ? `Overnight: ${day.accommodation}.` : "",
                  ]
                    .filter(Boolean)
                    .join(" "),
                }),
              }),
            ),
        }
      : undefined;

  const aggregateRating =
    trip.ratingValue && trip.reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: Number(trip.ratingValue.toFixed(1)),
          reviewCount: trip.reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  const reviews = (trip.reviews || []).slice(0, 10).map((review) =>
    prune({
      "@type": "Review",
      author: { "@type": "Person", name: review.authorName },
      datePublished: isoDate(review.reviewedAt),
      name: review.title || undefined,
      reviewBody: review.body || undefined,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  );

  // Each group tier is its own Offer so search engines can show the real
  // price range rather than a single number.
  const tierOffers = (trip.tiers || []).map((tier) =>
    prune({
      "@type": "Offer",
      url,
      name: tier.label,
      price: tier.price,
      priceCurrency: trip.currency || "USD",
      availability: "https://schema.org/InStock",
      seller: { "@id": ORGANIZATION_ID },
    }),
  );

  const offers = trip.priceFrom
    ? prune({
        "@type": "Offer",
        url,
        price: trip.priceFrom,
        priceCurrency: trip.currency || "USD",
        availability: "https://schema.org/InStock",
        priceSpecification: trip.priceTo
          ? {
              "@type": "PriceSpecification",
              minPrice: trip.priceFrom,
              maxPrice: trip.priceTo,
              priceCurrency: trip.currency || "USD",
            }
          : undefined,
        seller: { "@id": ORGANIZATION_ID },
      })
    : undefined;

  return prune({
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    name: trip.title,
    headline: truncate(trip.metaTitle || trip.title, 110),
    description:
      trip.metaDescription ||
      trip.keyTakeaway ||
      truncate(stripMarkdown(trip.overview || ""), 200),
    image: images.length ? images : undefined,
    inLanguage: "en",
    tourBookingPage: url,
    provider: { "@id": ORGANIZATION_ID },
    offers: tierOffers.length ? tierOffers : offers,
    aggregateRating,
    review: reviews.length ? reviews : undefined,
    itinerary,
    // Duration as ISO-8601 so engines can parse "how many days".
    duration: trip.durationDays ? `P${trip.durationDays}D` : undefined,
    touristType: trip.difficulty
      ? [`${trip.difficulty} trekkers`, "Adventure travellers", "Hikers"]
      : undefined,
    subjectOf: aggregateRating ? undefined : undefined,
    arrivalLocation: trip.startPoint
      ? { "@type": "Place", name: trip.startPoint }
      : undefined,
    departureLocation: trip.endPoint
      ? { "@type": "Place", name: trip.endPoint }
      : undefined,
    about: [
      ...splitList(trip.entityTags).map((tag) => ({ "@type": "Thing", name: tag })),
      trip.region ? { "@type": "Place", name: trip.region.name } : undefined,
    ].filter(Boolean),
    keywords: splitList(trip.keywords).join(", ") || undefined,
    // Machine-readable trip facts for AI answer engines (AEO/GEO).
    additionalProperty: [
      trip.durationDays
        ? { "@type": "PropertyValue", name: "Duration", value: `${trip.durationDays} days` }
        : undefined,
      trip.maxAltitude
        ? { "@type": "PropertyValue", name: "Maximum altitude", value: trip.maxAltitude }
        : undefined,
      trip.difficulty
        ? { "@type": "PropertyValue", name: "Difficulty", value: trip.difficulty }
        : undefined,
      trip.bestSeason
        ? { "@type": "PropertyValue", name: "Best season", value: trip.bestSeason }
        : undefined,
      trip.groupSize
        ? { "@type": "PropertyValue", name: "Group size", value: trip.groupSize }
        : undefined,
      trip.startPoint
        ? { "@type": "PropertyValue", name: "Start point", value: trip.startPoint }
        : undefined,
      trip.endPoint
        ? { "@type": "PropertyValue", name: "End point", value: trip.endPoint }
        : undefined,
    ].filter(Boolean),
    datePublished: isoDate(trip.publishedAt),
    dateModified: isoDate(trip.updatedAt) || isoDate(trip.publishedAt),
  });
}

/* ------------------------------------------------------------------ */
/* Collection / hub pages                                              */
/* ------------------------------------------------------------------ */

export function collectionPageSchema(opts: {
  name: string;
  description: string;
  url: string;
  items: Array<{ name: string; url: string }>;
}): Json {
  return prune({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(opts.url)}#collection`,
    url: absoluteUrl(opts.url),
    name: opts.name,
    description: opts.description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.url),
      })),
    },
  });
}

/** Region pillar page — a Place plus the trips it contains. */
export function regionSchema(region: {
  slug: string;
  name: string;
  headline?: string | null;
  description?: string | null;
  metaDescription?: string | null;
  heroImage?: string | null;
  entityTags?: string | null;
}): Json {
  const url = absoluteUrl(`/nepal-trekking-routes/${region.slug}-region`);
  return prune({
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${url}#place`,
    name: region.name,
    alternateName: region.headline || undefined,
    url,
    description:
      region.metaDescription || truncate(stripMarkdown(region.description || ""), 200),
    image: imageUrl(region.heroImage),
    containedInPlace: { "@type": "Country", name: "Nepal" },
    keywords: splitList(region.entityTags).join(", ") || undefined,
  });
}

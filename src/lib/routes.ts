/**
 * Canonical URL structure, mirroring the himalayan-masters.com hierarchy:
 *
 *   /                                        Home
 *   /nepal-trekking-routes                   Destinations hub
 *   /nepal-trekking-routes/everest-region    Region
 *   /trip/everest-base-camp-trek             Trek
 *   /blog, /blog/[slug]                      Guides
 *
 * The old /itinerary and /region paths 301 to these (see next.config.ts), so
 * any existing links and indexed URLs keep working.
 */
export const ROUTES = {
  home: "/",
  routesHub: "/nepal-trekking-routes",
  blog: "/blog",
} as const;

export const ROUTES_HUB_LABEL = "Nepal Trekking Routes";

/** "everest" -> "/nepal-trekking-routes/everest-region" */
export function regionPath(slug: string) {
  return `${ROUTES.routesHub}/${regionSegment(slug)}`;
}

/** "everest" -> "everest-region" (idempotent) */
export function regionSegment(slug: string) {
  return slug.endsWith("-region") ? slug : `${slug}-region`;
}

/** "everest-region" -> "everest" */
export function regionSlugFromSegment(segment: string) {
  return segment.replace(/-region$/, "");
}

/** "Everest" -> "Everest Region" */
export function regionLabel(name: string) {
  return /region$/i.test(name) ? name : `${name} Region`;
}

/** "everest-base-camp-trek" -> "/trip/everest-base-camp-trek" */
export function tripPath(slug: string) {
  return `/trip/${slug}`;
}

export function blogPath(slug: string) {
  return `/blog/${slug}`;
}

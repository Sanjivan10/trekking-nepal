/**
 * BreadcrumbList JSON-LD generator.
 *
 * Hierarchy: Home > Nepal Trekking Routes > [Region] > [Trek Name]
 * The visible <Breadcrumbs /> component must render the same trail — Google
 * requires the markup to match what is on the page.
 */
import { absoluteUrl } from "@/lib/site";
import { ROUTES, ROUTES_HUB_LABEL, regionPath, regionLabel, tripPath } from "@/lib/routes";

export type Crumb = { name: string; href: string };

export function generateBreadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
      ...crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.name,
        item: absoluteUrl(crumb.href),
      })),
    ],
  };
}

/** Home > Nepal Trekking Routes > Everest Region > Everest Base Camp Trek */
export function trekBreadcrumbs(trek: {
  title: string;
  slug: string;
  region?: { name: string; slug: string } | null;
}): Crumb[] {
  return [
    { name: ROUTES_HUB_LABEL, href: ROUTES.routesHub },
    ...(trek.region
      ? [{ name: regionLabel(trek.region.name), href: regionPath(trek.region.slug) }]
      : []),
    { name: trek.title, href: tripPath(trek.slug) },
  ];
}

export function regionBreadcrumbs(region: { name: string; slug: string }): Crumb[] {
  return [
    { name: ROUTES_HUB_LABEL, href: ROUTES.routesHub },
    { name: regionLabel(region.name), href: regionPath(region.slug) },
  ];
}

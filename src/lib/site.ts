/**
 * Resolves the canonical public URL of this site.
 *
 * Order matters, and it is deliberate. A hand-entered NEXT_PUBLIC_SITE_URL
 * drifted out of sync with the real deployment (it said
 * "trekking-nepal.vercel.app" while Vercel had assigned
 * "trekking-nepal-six.vercel.app"), which put the wrong domain on all 29
 * sitemap URLs and made Google reject every one of them.
 *
 * VERCEL_PROJECT_PRODUCTION_URL is supplied by Vercel itself, is always the
 * real production domain, and switches to a custom domain automatically when
 * one is attached — so it is preferred over anything typed by hand. SITE_URL
 * remains as an explicit escape hatch for other hosts.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const site = {
  name: "Trekking Nepal",
  legalName: "Trekking Nepal Adventures Pvt. Ltd.",
  tagline: "Himalayan treks, expert-led.",
  description:
    "Expert-guided treks in Nepal — Everest Base Camp, Manaslu Circuit, Gosaikunda and beyond. Day-by-day itineraries, real trekker reviews, permits and costs explained.",
  url: resolveSiteUrl(),
  locale: "en_US",
  logo: "/logo.svg",
  address: {
    city: "Kathmandu",
    region: "Bagmati",
    postalCode: "44600",
    country: "NP",
  },
  geo: { latitude: 27.7172, longitude: 85.324 },
  foundingDate: "2009-04-01",
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

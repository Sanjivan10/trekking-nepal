export const site = {
  name: "Trekking Nepal",
  legalName: "Trekking Nepal Adventures Pvt. Ltd.",
  tagline: "Himalayan treks, expert-led.",
  description:
    "Expert-guided treks in Nepal — Everest Base Camp, Manaslu Circuit, Gosaikunda and beyond. Day-by-day itineraries, real trekker reviews, permits and costs explained.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_US",
  logo: "/logo.svg",
  email: "hello@trekkingnepal.example",
  phone: "+977-1-4000000",
  address: {
    street: "Thamel Marg",
    city: "Kathmandu",
    region: "Bagmati",
    postalCode: "44600",
    country: "NP",
  },
  geo: { latitude: 27.7172, longitude: 85.324 },
  social: [
    "https://www.facebook.com/",
    "https://www.instagram.com/",
    "https://www.youtube.com/",
  ],
  foundingDate: "2009-04-01",
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

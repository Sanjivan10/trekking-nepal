import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd } from "@/components/json-ld";
import { siteGraph } from "@/lib/schema";
import { site } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

// self-hosted via next/font — no render-blocking request to Google
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-display",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Guided Himalayan Treks, Itineraries & Costs`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — Guided Himalayan Treks`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Guided Himalayan Treks`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "travel",
};

export const viewport: Viewport = {
  themeColor: "#06955f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Nav + footer data. Wrapped so a cold/empty DB never breaks the shell.
  const [settings, regions, trips] = await Promise.all([
    getSettings(),
    prisma.region
      .findMany({
        where: { status: "published" },
        orderBy: [{ position: "asc" }, { name: "asc" }],
        select: { slug: true, name: true },
      })
      .catch(() => []),
    prisma.itinerary
      .findMany({
        where: { status: "published" },
        orderBy: [{ featured: "desc" }, { ratingValue: "desc" }],
        take: 5,
        select: { slug: true, title: true },
      })
      .catch(() => []),
  ]);

  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd id="site-graph" data={siteGraph(settings)} />
        <SiteHeader regions={regions} />
        <main id="main">{children}</main>
        <SiteFooter settings={settings} regions={regions} trips={trips} />
      </body>
    </html>
  );
}

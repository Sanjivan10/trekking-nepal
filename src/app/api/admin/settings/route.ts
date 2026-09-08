import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, str, int, bool } from "@/lib/api";
import { SETTINGS_ID } from "@/lib/settings";

export async function GET() {
  return withAdmin(async () =>
    prisma.siteSettings.findUnique({
      where: { id: SETTINGS_ID },
      include: {
        columns: { orderBy: { position: "asc" }, include: { links: { orderBy: { position: "asc" } } } },
      },
    }),
  );
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => ({}));

  return withAdmin(async () => {
    const data = {
      footerTagline: str(body.footerTagline),
      footerAbout: str(body.footerAbout),
      showContact: bool(body.showContact),
      contactAddress: str(body.contactAddress),
      contactEmail: str(body.contactEmail),
      contactPhone: str(body.contactPhone),
      socialFacebook: str(body.socialFacebook),
      socialInstagram: str(body.socialInstagram),
      socialYoutube: str(body.socialYoutube),
      socialTiktok: str(body.socialTiktok),
      socialX: str(body.socialX),
      showCta: bool(body.showCta, true),
      ctaTitle: str(body.ctaTitle),
      ctaText: str(body.ctaText),
      ctaLabel: str(body.ctaLabel),
      ctaUrl: str(body.ctaUrl),
      footerBg: str(body.footerBg) || "#0d1019",
      footerBgTo: str(body.footerBgTo) || "#0d1019",
      footerText: str(body.footerText) || "#aeb7c8",
      footerHeading: str(body.footerHeading) || "#ffffff",
      footerAccent: str(body.footerAccent) || "#38d391",
      footerBorder: str(body.footerBorder) || "#ffffff1a",
      footerFontSize: Math.min(20, Math.max(11, int(body.footerFontSize, 14))),
      footerHeadingSize: Math.min(22, Math.max(10, int(body.footerHeadingSize, 13))),
      footerPaddingY: Math.min(140, Math.max(16, int(body.footerPaddingY, 56))),
      footerRadius: Math.min(64, Math.max(0, int(body.footerRadius))),
      footerMaxWidth: Math.min(1920, Math.max(640, int(body.footerMaxWidth, 1280))),
      showMountains: bool(body.showMountains, true),
      showTrekkers: bool(body.showTrekkers, true),
      showPrayerFlags: bool(body.showPrayerFlags, true),
      showStars: bool(body.showStars, true),
      mountainColor: str(body.mountainColor) || "#1b2030",
      mountainColor2: str(body.mountainColor2) || "#252b3d",
      snowColor: str(body.snowColor) || "#e8eef7",
      trekkerColor: str(body.trekkerColor) || "#38d391",
      sceneHeight: Math.min(260, Math.max(0, int(body.sceneHeight, 120))),
      // Hero
      heroEyebrow: str(body.heroEyebrow),
      heroTitle: str(body.heroTitle),
      heroAccent: str(body.heroAccent),
      heroTitleAfter: str(body.heroTitleAfter),
      heroSubtitle: str(body.heroSubtitle),
      heroImage: str(body.heroImage),
      heroImageAlt: str(body.heroImageAlt),
      heroWordmark: str(body.heroWordmark),
      heroOverlay: Math.min(90, Math.max(0, int(body.heroOverlay, 55))),
      heroHeight: Math.min(100, Math.max(50, int(body.heroHeight, 88))),
      heroPrimaryLabel: str(body.heroPrimaryLabel),
      heroPrimaryUrl: str(body.heroPrimaryUrl),
      heroSecondaryLabel: str(body.heroSecondaryLabel),
      heroSecondaryUrl: str(body.heroSecondaryUrl),
      heroShowSearch: bool(body.heroShowSearch, true),
      heroShowStats: bool(body.heroShowStats, true),
      heroStats: str(body.heroStats),
      // Review badges
      showReviewBadges: bool(body.showReviewBadges, true),
      googleReviewUrl: str(body.googleReviewUrl),
      googleRating: str(body.googleRating),
      googleCount: str(body.googleCount),
      tripadvisorUrl: str(body.tripadvisorUrl),
      tripadvisorRating: str(body.tripadvisorRating),
      tripadvisorCount: str(body.tripadvisorCount),
      copyrightText: str(body.copyrightText),
      showCredit: bool(body.showCredit, true),
    };

    // Columns are replaced wholesale — simplest correct result for a form save.
    // Built as ONE nested write rather than a loop of queries: every statement
    // here is a network round-trip to Neon, and a sequential loop blew past
    // Prisma's interactive-transaction timeout (P2028).
    const columns = (Array.isArray(body.columns) ? body.columns : [])
      .map((column: any, index: number) => ({
        title: str(column?.title),
        position: index,
        visible: bool(column?.visible, true),
        links: {
          create: (Array.isArray(column?.links) ? column.links : [])
            .map((link: any, i: number) => ({
              label: str(link?.label),
              href: str(link?.href),
              external: bool(link?.external),
              position: i,
            }))
            .filter((link: any) => link.label && link.href),
        },
      }))
      .filter((column: any) => column.title);

    const saved = await prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, ...data, columns: { create: columns } },
      update: { ...data, columns: { deleteMany: {}, create: columns } },
      include: {
        columns: {
          orderBy: { position: "asc" },
          include: { links: { orderBy: { position: "asc" } } },
        },
      },
    });

    // The footer is on every page, so refresh the whole site.
    revalidateContent(["/blog", "/nepal-trekking-routes", "/nepal-trekking-routes"]);
    return saved;
  }, request);
}

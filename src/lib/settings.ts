import { prisma } from "./prisma";
import { site } from "./site";

export const SETTINGS_ID = "singleton";

export type FooterLinkData = { id?: string; label: string; href: string; external: boolean };
export type FooterColumnData = {
  id?: string;
  title: string;
  visible: boolean;
  links: FooterLinkData[];
};

export type Settings = {
  footerTagline: string;
  footerAbout: string;
  showContact: boolean;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialTiktok: string;
  socialX: string;
  showCta: boolean;
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  ctaUrl: string;
  footerBg: string;
  footerBgTo: string;
  footerText: string;
  footerHeading: string;
  footerAccent: string;
  footerBorder: string;
  footerFontSize: number;
  footerHeadingSize: number;
  footerPaddingY: number;
  footerRadius: number;
  footerMaxWidth: number;
  showMountains: boolean;
  showTrekkers: boolean;
  showPrayerFlags: boolean;
  showStars: boolean;
  mountainColor: string;
  mountainColor2: string;
  snowColor: string;
  trekkerColor: string;
  sceneHeight: number;
  copyrightText: string;
  showCredit: boolean;
  columns: FooterColumnData[];
};

/** Used before anything is saved, and as the "Reset" target in the admin. */
export const defaultSettings: Settings = {
  footerTagline: site.description,
  footerAbout: "",
  showContact: false,
  contactAddress: "",
  contactEmail: "",
  contactPhone: "",
  socialFacebook: "",
  socialInstagram: "",
  socialYoutube: "",
  socialTiktok: "",
  socialX: "",
  showCta: true,
  ctaTitle: "Ready to walk the Himalaya?",
  ctaText: "Browse every guided itinerary, or talk to a guide who has walked the route.",
  ctaLabel: "Browse all treks",
  ctaUrl: "/itinerary",
  footerBg: "#0d1019",
  footerBgTo: "#12172a",
  footerText: "#aeb7c8",
  footerHeading: "#ffffff",
  footerAccent: "#38d391",
  footerBorder: "#ffffff1a",
  footerFontSize: 14,
  footerHeadingSize: 13,
  footerPaddingY: 56,
  footerRadius: 0,
  footerMaxWidth: 1280,
  showMountains: true,
  showTrekkers: true,
  showPrayerFlags: true,
  showStars: true,
  mountainColor: "#1b2030",
  mountainColor2: "#252b3d",
  snowColor: "#e8eef7",
  trekkerColor: "#38d391",
  sceneHeight: 120,
  copyrightText: "",
  showCredit: true,
  columns: [],
};

/**
 * Reads the singleton settings row. Falls back to defaults when the row does
 * not exist yet or the database is unreachable, so the footer always renders.
 */
export async function getSettings(): Promise<Settings> {
  try {
    const row = await prisma.siteSettings.findUnique({
      where: { id: SETTINGS_ID },
      include: {
        columns: {
          where: { visible: true },
          orderBy: { position: "asc" },
          include: { links: { orderBy: { position: "asc" } } },
        },
      },
    });
    if (!row) return defaultSettings;
    const { id, updatedAt, columns, ...rest } = row;
    return {
      ...defaultSettings,
      ...rest,
      columns: columns.map((column) => ({
        id: column.id,
        title: column.title,
        visible: column.visible,
        links: column.links.map((link) => ({
          id: link.id,
          label: link.label,
          href: link.href,
          external: link.external,
        })),
      })),
    };
  } catch {
    return defaultSettings;
  }
}

/** Admin variant — includes hidden columns so they can be toggled back on. */
export async function getSettingsForAdmin(): Promise<Settings> {
  try {
    const row = await prisma.siteSettings.findUnique({
      where: { id: SETTINGS_ID },
      include: {
        columns: {
          orderBy: { position: "asc" },
          include: { links: { orderBy: { position: "asc" } } },
        },
      },
    });
    if (!row) return defaultSettings;
    const { id, updatedAt, columns, ...rest } = row;
    return {
      ...defaultSettings,
      ...rest,
      columns: columns.map((column) => ({
        id: column.id,
        title: column.title,
        visible: column.visible,
        links: column.links.map((link) => ({
          id: link.id,
          label: link.label,
          href: link.href,
          external: link.external,
        })),
      })),
    };
  } catch {
    return defaultSettings;
  }
}

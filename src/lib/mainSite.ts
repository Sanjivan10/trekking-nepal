export const mainSite = {
  url: (process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://beyondthetrek.com").replace(/\/$/, ""),
  name: process.env.NEXT_PUBLIC_MAIN_SITE_NAME || "Beyond The Trek",
};

export const MAIN_SITE_ID = `${mainSite.url}/#organization`;

/** Builds an absolute main-site URL from a path or passes through an absolute one. */
export function mainSiteUrl(pathOrUrl = "/") {
  if (!pathOrUrl) return mainSite.url;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${mainSite.url}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function isMainSiteUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "") ===
      new URL(mainSite.url).hostname.replace(/^www\./, "");
  } catch {
    return false;
  }
}

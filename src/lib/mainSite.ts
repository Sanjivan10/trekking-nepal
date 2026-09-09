/**
 * The official booking site every "Book" button points to.
 *
 * Deliberately NOT read from an environment variable. This value lives in one
 * place, in code, on purpose:
 *
 *   - It is a single fixed partner domain that does not vary per environment.
 *   - It is public by definition — it is printed in every booking button, so
 *     there is nothing to protect by keeping it in hosting config.
 *   - A stale `NEXT_PUBLIC_MAIN_SITE_URL` left over in the hosting dashboard
 *     silently overrode the correct value here and pointed every booking
 *     button at a dead domain. Config that can drift out of sync with code,
 *     for a constant that never changes, is a liability rather than a feature.
 *
 * To change the booking destination, edit these two lines. That is the whole
 * process — no dashboard, no redeploy dance, and it is reviewable in git.
 */
export const mainSite = {
  url: "https://www.beyondthelimitstreks.com",
  name: "Beyond The Limits Treks and Expedition",
};

export const MAIN_SITE_ID = `${mainSite.url}/#organization`;

/** Builds an absolute main-site URL from a path, or passes an absolute URL through. */
export function mainSiteUrl(pathOrUrl = "/") {
  const value = pathOrUrl?.trim();
  if (!value) return mainSite.url;
  if (/^https?:\/\//i.test(value)) return value;
  return `${mainSite.url}${value.startsWith("/") ? value : `/${value}`}`;
}

export function isMainSiteUrl(url: string) {
  try {
    return (
      new URL(url).hostname.replace(/^www\./, "") ===
      new URL(mainSite.url).hostname.replace(/^www\./, "")
    );
  } catch {
    return false;
  }
}

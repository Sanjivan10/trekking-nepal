/**
 * IndexNow submission — pushes changed URLs to Bing/Yandex/Seznam so they
 * can be crawled within minutes instead of waiting on the next scheduled
 * crawl. Bing's index also underpins Copilot/Bing Chat's citations.
 *
 * Not a substitute for Google. Google shut its sitemap-ping endpoint down in
 * 2023 and does not consume IndexNow — there is no push API left for it.
 * Google's own guidance is: a correct sitemap, strong internal linking, and
 * content that actually changes. This site already does all three; the
 * GSC "Request indexing" tool is still worth using by hand on key pages.
 */
import { site, absoluteUrl } from "./site";

const ENDPOINT = "https://api.indexnow.org/indexnow";

export async function submitToIndexNow(paths: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || paths.length === 0) return;

  try {
    const host = new URL(site.url).host;
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: absoluteUrl(`/${key}.txt`),
        urlList: paths.map((p) => absoluteUrl(p)),
      }),
      // Never let a slow/unreachable endpoint hold up a content save.
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Best-effort only — indexing pings must never break publishing.
  }
}

/**
 * IndexNow key-verification file. IndexNow (Bing, Yandex, Seznam — the
 * protocol Copilot/Bing Chat's index draws from) requires a plaintext key
 * file at the domain root matching the key used in submissions.
 *
 * Google does not consume IndexNow and retired its own sitemap-ping endpoint
 * in 2023, so there is no equivalent "ping Google" call left to make — fast
 * Google indexing now comes from a clean sitemap, internal links and content
 * that changes, not a push API. This covers the half of "fast index" that a
 * push API can still reach.
 */
export const dynamic = "force-static";

export async function GET() {
  return new Response("8be275b85feef2d8fe2b2e6a630d5a77", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

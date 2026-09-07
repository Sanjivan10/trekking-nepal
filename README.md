# Trekking Nepal

A Next.js 15 trekking & travel site engineered for **SEO**, **AEO** (Answer Engine Optimization) and **GEO** (Generative Engine Optimization), with a full admin CMS and a cross-domain backlink engine pointing at a main booking site.

---

## Quick start

```bash
npm install
npm run setup      # prisma db push + seed (3 treks, 3 regions, 3 guides)
npm run dev        # http://localhost:3000
```

Admin panel: **http://localhost:3000/admin** — default credentials `admin` / `trekadmin123` (set in `.env`).

> Change `ADMIN_PASSWORD` and `AUTH_SECRET` before deploying anywhere public.

### Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Serve the production build |
| `npm run setup` | Push schema + seed content |
| `npm run db:push` | Sync schema to the database |
| `npm run db:seed` | Re-seed content (destructive) |
| `npm run db:studio` | Prisma Studio |

---

## Environment

```env
DATABASE_URL="postgresql://…pooler…/neondb?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://…direct…/neondb?sslmode=require"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"     # canonicals, sitemap, robots, llms.txt
NEXT_PUBLIC_MAIN_SITE_URL="https://beyondthetrek.com"
NEXT_PUBLIC_MAIN_SITE_NAME="Beyond The Trek"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="trekadmin123"
AUTH_SECRET="…long random string…"
```

**Database:** PostgreSQL on Neon. `DATABASE_URL` is the pooled connection used at runtime; `DATABASE_URL_UNPOOLED` is the direct connection Prisma needs for `db push`.

---

## Routes

| Route | Rendering | Purpose |
| --- | --- | --- |
| `/` | Static (ISR 1h) | Hero + trek finder, ad slot, featured trips, regions, trust badges, blog, FAQs |
| `/itinerary` | Dynamic | Filterable trek index (region / duration / difficulty as crawlable URLs) |
| `/itinerary/[slug]` | **Prerendered** | Hero + ad slot, sticky specs ribbon, key takeaways, day-by-day, route table, cost, gallery, FAQs, reviews |
| `/blog` · `/blog/[slug]` | **Prerendered** | Editorial reader: TOC, key takeaways, author box, related trips sidebar |
| `/region` · `/region/[slug]` | **Prerendered** | Pillar/hub pages linking down to child treks and guides |
| `/sitemap.xml` | ISR 1h | Every published URL, auto-updated on publish |
| `/robots.txt` | Static | Allows all search + AI crawlers; disallows `/admin`, `/api/admin` |
| `/llms.txt` | ISR 1h | Markdown content index for LLM ingestion |
| `/admin/*` | Dynamic | CMS (auth-gated, `noindex`) |

---

## SEO / AEO / GEO

### Structured data — `src/lib/schema.ts`

| Generator | Emitted on |
| --- | --- |
| `Organization` + `TravelAgency` + `LocalBusiness`, `WebSite` | Every page (root layout) |
| `TouristTrip` + `AggregateRating` + `Review` + `Offer` | Itinerary pages |
| `BlogPosting` | Blog posts |
| `FAQPage` | Itineraries, blogs, regions, homepage |
| `BreadcrumbList` | All single pages |
| `CollectionPage` / `ItemList` | Listing + hub pages |
| `Place` | Region pillar pages |

Day-by-day itineraries serialise as an ordered `ItemList` of `TouristDestination` steps, and trip facts (duration, max altitude, difficulty, season, group size, start/end) also emit as `additionalProperty` `PropertyValue` pairs so answer engines can read specifics without parsing prose.

### AEO / GEO elements

- **Key Takeaways box** above the fold on every trek, guide and region — a direct-answer paragraph plus 4–7 factual bullets, marked `data-aeo="key-takeaways"`.
- **Structured comparison tables** for day-by-day distance, walking time, altitude and accommodation — real `<table>` markup with `<th scope>`.
- **FAQ accordions** with microdata, backing the `FAQPage` JSON-LD.
- **`llms.txt`** carrying hard facts (duration, altitude, price, rating, day-by-day table, FAQs) per trek.
- **`robots.txt`** explicitly allowing GPTBot, ClaudeBot, PerplexityBot, Bytespider, Google-Extended, Applebot-Extended, CCBot, MistralAI-User and others.

### Internal linking (hub & spoke)

`src/lib/content.ts` scores content by shared **entity tags** (×2) and shared **region** (+3) to populate related-trips and related-guides modules automatically. Region pages are the hubs; treks and guides are the spokes, linked back up via breadcrumbs.

---

## Backlink engine — `src/lib/backlinkEngine.ts`

Converts the first N in-body occurrences of configured keywords into `rel="noopener"` **dofollow** links to the main site (no `nofollow`/`sponsored`, so equity passes).

Configured in two places:

1. **Global keyword map** — `/admin/backlinks` (keyword → URL, anchor, variations, priority, max per page).
2. **Per-post controller** — the "Linking & backlinks" tab on any trek or post (target URL, primary anchor, anchor variations, on/off). Per-post rules take priority over the global map.

**Anchor variation** is deterministic per page (seeded by slug), so a crawler always sees the same anchor on a given URL while the anchor text spreads across the variation set site-wide.

**Safety rules the matcher enforces** (all covered by tests):

- never matches inside an existing `<a>`, `<code>`, `<pre>`, or heading, or within an HTML attribute
- whole-phrase, word-boundary, case-insensitive matching only
- longest / highest-priority phrase wins on overlap
- a phrase already claimed by a longer rule is guarded, so a short rule can't link a fragment out of the middle of it
- each rule fires at most `maxPerPage` times

Advertisement slots are the deliberate inverse: `rel="sponsored noopener nofollow"`.

> **A note on risk.** These are automated, anchor-optimised dofollow links between domains you own — the exact pattern Google's [link spam policy](https://developers.google.com/search/docs/essentials/spam-policies#link-spam) targets. It's defensible when each link is genuinely editorial and relevant; it becomes a deindexing risk at scale with exact-match anchors. Prefer few, well-placed rules and varied anchors.

---

## Admin CMS

| Screen | Does |
| --- | --- |
| `/admin` | Stats, SEO health checks, recent content, links to the technical files |
| `/admin/itineraries` | Trek CRUD — 7 tabs: overview, day-by-day builder, cost & media, SEO/AEO, FAQ builder, reviews, linking |
| `/admin/blogs` | Post CRUD — content, SEO/AEO, FAQ builder, linking |
| `/admin/regions` | Pillar page CRUD |
| `/admin/backlinks` | Global keyword → main-site URL rules |
| `/admin/reviews` | Moderation queue for public submissions |

Every form has: custom slug (auto-derived, overridable), meta title/description with SEO-length counters, unlimited keyword tagging, banner upload or URL with alt text, entity/region tagging, and a draft/published toggle. Saving revalidates the affected pages plus the sitemap and llms.txt.

**Auth** is a signed HMAC-SHA256 session cookie (Web Crypto, so it runs on both Edge middleware and Node routes), with rate-limited login and constant-time credential comparison. `middleware.ts` gates `/admin` and `/api/admin` and sets `X-Robots-Tag: noindex`.

**Reviews** submitted publicly land unapproved and are excluded from `AggregateRating` until moderated — so the star ratings in search results always reflect reviews you have actually vetted.

---

## Performance

- Content pages are **prerendered to static HTML** (`generateStaticParams`) with 1-hour ISR — 4–7 ms TTFB locally.
- **103 kB** shared First Load JS; interactivity is confined to small client islands (accordions, TOC scroll-spy, sticky ribbon, forms).
- `next/font` self-hosts Inter and Plus Jakarta Sans — no render-blocking font request.
- `next/image` with AVIF/WebP, explicit `sizes`, `priority` + `fetchPriority="high"` on LCP images only, lazy everywhere else.
- Framer Motion animations are scroll-triggered, run once, and are fully disabled under `prefers-reduced-motion`. Content is always in the DOM, so it stays crawlable without JS.
- Mobile-first layouts throughout; wide tables, breadcrumbs and the specs ribbon scroll horizontally inside their own containers so the page body never does.

---

## Project structure

```
prisma/
  schema.prisma        Region · Blog · Itinerary · ItineraryDay · Review · Faq · BacklinkTarget
  seed.ts, seed-data.ts
src/
  app/
    page.tsx, blog/, itinerary/, region/     public pages
    sitemap.ts, robots.ts, llms.txt/         technical SEO files
    admin/                                   CMS
    api/admin/, api/reviews/                 CRUD + public review endpoint
  components/
    site/       header, footer, cards, key-takeaways, FAQ, day-by-day,
                specs ribbon, TOC, reviews, ad slot, main-site CTA
    admin/      form shell, field primitives, builders, managers
    ui/         stars, badge, reveal
  lib/
    schema.ts          JSON-LD generators
    backlinkEngine.ts  cross-domain dofollow injector
    content.ts         queries + hub-and-spoke relevance scoring
    markdown.ts        Markdown → HTML + heading IDs + backlink injection
    auth.ts, api.ts, payload.ts, site.ts, mainSite.ts, utils.ts
  middleware.ts        admin auth gate
```

---

## Before going live

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain (drives canonicals, sitemap, robots, llms.txt).
2. Change `ADMIN_PASSWORD` and set a long random `AUTH_SECRET`.
3. Move to PostgreSQL if deploying to a serverless platform — SQLite will not persist on ephemeral filesystems.
4. Replace the seeded Unsplash imagery and the placeholder contact details in `src/lib/site.ts`.
5. Uploads write to `public/uploads`; on serverless hosting, point the upload route at S3/R2/Blob storage instead.
6. Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import { TrekFinder } from "./trek-finder";
import { mainSite } from "@/lib/mainSite";
import { splitLines } from "@/lib/utils";
import type { Settings } from "@/lib/settings";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=72";

/**
 * Full-bleed hero: image, centred headline with an italic serif accent word,
 * a frosted search card, and an oversized wordmark bleeding off the bottom.
 * Every string is editable in /admin/hero.
 */
export function Hero({
  settings: s,
  regions,
}: {
  settings: Settings;
  regions: Array<{ slug: string; name: string }>;
}) {
  const title = s.heroTitle?.trim() || "Real Himalayan treks.";
  const accent = s.heroAccent?.trim() || "Zero corporate BS.";
  const after = s.heroTitleAfter?.trim() || "";
  const subtitle =
    s.heroSubtitle?.trim() ||
    "Exact prices, exact itineraries, and guides who have actually walked the trail. Everest Base Camp, Manaslu Circuit and Annapurna — no guesswork, no hidden extras.";
  const image = s.heroImage?.trim() || FALLBACK_IMAGE;
  const wordmark = s.heroWordmark?.trim() ?? "HIMALAYA";
  const overlay = Math.min(90, Math.max(0, s.heroOverlay ?? 55)) / 100;

  const stats = splitLines(s.heroStats).map((line) => {
    const [value, ...rest] = line.split("|");
    return { value: (value || "").trim(), label: rest.join("|").trim() };
  });

  return (
    <section
      className="relative isolate -mt-[4.5rem] flex flex-col justify-center overflow-hidden bg-ink-950"
      style={{ minHeight: `${Math.min(100, Math.max(50, s.heroHeight || 88))}vh` }}
    >
      <Image
        src={image}
        alt={s.heroImageAlt || "Trekkers on a Himalayan ridge in Nepal"}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={74}
        className="object-cover"
      />
      {/* Darkening + a bottom fade so the wordmark and nav stay legible */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(9,12,20,${overlay + 0.12}) 0%, rgba(9,12,20,${overlay * 0.55}) 38%, rgba(9,12,20,${Math.min(0.95, overlay + 0.3)}) 100%)`,
        }}
      />

      <div className="container-page relative z-10 pb-40 pt-32 sm:pb-48 sm:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          {s.heroEyebrow?.trim() && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white glass">
              <Star size={12} fill="currentColor" strokeWidth={0} className="text-brand-300" aria-hidden />
              {s.heroEyebrow}
            </p>
          )}

          <h1 className="text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.5rem]">
            {title}
            {accent && (
              <>
                {" "}
                <span className="accent-serif font-normal text-brand-300">{accent}</span>
              </>
            )}
            {after && <> {after}</>}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={s.heroPrimaryUrl?.trim() || "/nepal-trekking-routes"}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-ink-900 shadow-xl shadow-black/25 transition hover:bg-brand-50 sm:w-auto"
            >
              {s.heroPrimaryLabel?.trim() || "See all treks & exact prices"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <a
              href={s.heroSecondaryUrl?.trim() || mainSite.url}
              rel="noopener"
              target="_blank"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold text-white transition hover:bg-white/20 glass sm:w-auto"
            >
              {s.heroSecondaryLabel?.trim() || `Book on ${mainSite.name}`}
              <ExternalLink size={15} aria-hidden />
            </a>
          </div>

          {s.heroShowSearch && (
            <div className="mx-auto mt-10 max-w-3xl rounded-3xl p-3 glass-dark sm:p-4">
              <TrekFinder regions={regions} />
            </div>
          )}

          {s.heroShowStats && stats.length > 0 && (
            <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {stats.map((stat) => (
                <li key={stat.label} className="text-center">
                  <p className="text-2xl font-extrabold text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-white/60">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Oversized wordmark bleeding off the bottom edge */}
      {wordmark && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-hidden"
        >
          <span
            className="hero-wordmark translate-y-[26%] text-[22vw] opacity-[0.13] sm:text-[19vw]"
            style={{ WebkitTextStroke: "0px" }}
          >
            {wordmark}
          </span>
        </div>
      )}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Clock, Mountain, TrendingUp, Sun, Users, MapPin, ExternalLink } from "lucide-react";
import { mainSite, mainSiteUrl } from "@/lib/mainSite";

export type Spec = { label: string; value: string; icon: keyof typeof ICONS };

const ICONS = {
  clock: Clock,
  mountain: Mountain,
  trending: TrendingUp,
  sun: Sun,
  users: Users,
  pin: MapPin,
} as const;

/**
 * Quick-specs ribbon. Renders inline in the page flow, then re-appears as a
 * compact sticky bar (with the booking CTA) once the hero scrolls away.
 */
export function SpecsRibbon({
  specs,
  tripTitle,
  bookingUrl,
}: {
  specs: Spec[];
  tripTitle: string;
  bookingUrl?: string | null;
}) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("specs-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (specs.length === 0) return null;

  return (
    <>
      <div id="specs-sentinel" aria-hidden />

      {/* Inline ribbon */}
      <div className="rounded-2xl border border-ink-200 bg-white shadow-sm">
        <dl className="grid grid-cols-2 divide-ink-200 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          {specs.map((spec) => {
            const Icon = ICONS[spec.icon];
            return (
              <div key={spec.label} className="flex items-center gap-2.5 px-4 py-3.5">
                <Icon size={17} className="shrink-0 text-brand-600" aria-hidden />
                <div className="min-w-0">
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-500">
                    {spec.label}
                  </dt>
                  <dd className="truncate text-sm font-bold text-ink-900" title={spec.value}>
                    {spec.value}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>

      {/* Sticky condensed bar */}
      <div
        aria-hidden={!stuck}
        className={`fixed inset-x-0 top-16 z-40 border-b border-ink-200 bg-white/95 backdrop-blur-md transition-transform duration-300 ${
          stuck ? "translate-y-0" : "pointer-events-none -translate-y-[130%]"
        }`}
      >
        <div className="container-page flex h-14 items-center gap-4">
          <p className="hidden min-w-0 shrink truncate text-sm font-bold text-ink-900 md:block">
            {tripTitle}
          </p>
          <dl className="no-scrollbar flex flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap text-xs sm:gap-5">
            {specs.map((spec) => {
              const Icon = ICONS[spec.icon];
              return (
                <div key={spec.label} className="flex shrink-0 items-center gap-1.5">
                  <Icon size={14} className="text-brand-600" aria-hidden />
                  <dt className="sr-only">{spec.label}</dt>
                  <dd className="font-semibold text-ink-800">{spec.value}</dd>
                </div>
              );
            })}
          </dl>
          <a
            href={mainSiteUrl(bookingUrl || "/")}
            rel="noopener"
            target="_blank"
            className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700 sm:inline-flex"
          >
            Book now
            <ExternalLink size={13} aria-hidden />
          </a>
        </div>
      </div>
    </>
  );
}

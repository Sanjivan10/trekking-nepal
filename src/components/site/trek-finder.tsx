"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, Clock, TrendingUp } from "lucide-react";

/**
 * Hero quick-filter. Submits to /itinerary as querystring filters, so the
 * results page stays a server-rendered, indexable URL.
 */
export function TrekFinder({
  regions,
}: {
  regions: Array<{ slug: string; name: string }>;
}) {
  const router = useRouter();
  const [region, setRegion] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    if (duration) params.set("duration", duration);
    if (difficulty) params.set("difficulty", difficulty);
    router.push(`/itinerary${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-2xl border border-white/20 bg-white/95 p-3 shadow-2xl shadow-black/20 backdrop-blur sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
      role="search"
      aria-label="Find a trek"
    >
      <Field icon={<MapPin size={15} aria-hidden />} label="Destination" htmlFor="tf-region">
        <select
          id="tf-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none"
        >
          <option value="">Any region</option>
          {regions.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>
      </Field>

      <Field icon={<Clock size={15} aria-hidden />} label="Duration" htmlFor="tf-duration">
        <select
          id="tf-duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none"
        >
          <option value="">Any length</option>
          <option value="1-7">1–7 days</option>
          <option value="8-14">8–14 days</option>
          <option value="15-21">15–21 days</option>
          <option value="22-99">22+ days</option>
        </select>
      </Field>

      <Field icon={<TrendingUp size={15} aria-hidden />} label="Difficulty" htmlFor="tf-difficulty">
        <select
          id="tf-difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none"
        >
          <option value="">Any level</option>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Challenging">Challenging</option>
          <option value="Strenuous">Strenuous</option>
        </select>
      </Field>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 sm:col-span-2 lg:col-span-1"
      >
        <Search size={16} aria-hidden />
        Search treks
      </button>
    </form>
  );
}

function Field({
  icon,
  label,
  htmlFor,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-ink-200 px-3 py-2 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
      <span className="shrink-0 text-brand-600">{icon}</span>
      <span className="min-w-0 flex-1">
        <label htmlFor={htmlFor} className="block text-[0.625rem] font-bold uppercase tracking-wide text-ink-500">
          {label}
        </label>
        {children}
      </span>
    </div>
  );
}

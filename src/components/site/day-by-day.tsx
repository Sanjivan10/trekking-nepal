"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  Moon,
  Route,
  Timer,
  Mountain,
  Utensils,
  Maximize2,
  Minimize2,
} from "lucide-react";

export type DayItem = {
  id: string;
  dayNumber: number;
  title: string;
  description: string; // pre-rendered HTML
  accommodation?: string | null;
  meals?: string | null;
  distance?: string | null;
  duration?: string | null;
  altitude?: string | null;
};

/**
 * Modular day-by-day itinerary. Each day is an expandable card whose
 * metadata (distance / altitude / accommodation) is always visible so the
 * structure is scannable — and parseable — even while collapsed.
 */
export function DayByDay({ days }: { days: DayItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const reduce = useReducedMotion();
  const allOpen = open.size === days.length;

  const toggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const toggleAll = () =>
    setOpen(allOpen ? new Set() : new Set(days.map((_, i) => i)));

  if (days.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
        >
          {allOpen ? <Minimize2 size={13} aria-hidden /> : <Maximize2 size={13} aria-hidden />}
          {allOpen ? "Collapse all" : "Expand all days"}
        </button>
      </div>

      <ol className="relative space-y-3">
        {days.map((day, index) => {
          const isOpen = open.has(index);
          const panelId = `day-panel-${day.dayNumber}`;
          return (
            <li
              key={day.id}
              className={`overflow-hidden rounded-2xl border bg-white transition ${
                isOpen ? "border-brand-300 shadow-md shadow-brand-900/5" : "border-ink-200"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-ink-50 sm:gap-4 sm:p-5"
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-center font-bold leading-none transition ${
                    isOpen ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
                  }`}
                  aria-hidden
                >
                  <span className="text-[0.5625rem] font-semibold uppercase tracking-wide opacity-75">
                    Day
                  </span>
                  <span className="text-base">{day.dayNumber}</span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[0.975rem] font-bold leading-snug text-ink-900">
                    <span className="sr-only">Day {day.dayNumber}: </span>
                    {day.title}
                  </span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-600">
                    {day.distance && <Meta icon={<Route size={12} />}>{day.distance}</Meta>}
                    {day.duration && <Meta icon={<Timer size={12} />}>{day.duration}</Meta>}
                    {day.altitude && <Meta icon={<Mountain size={12} />}>{day.altitude}</Meta>}
                    {day.accommodation && <Meta icon={<Moon size={12} />}>{day.accommodation}</Meta>}
                  </span>
                </span>

                <ChevronDown
                  size={18}
                  aria-hidden
                  className={`mt-1 shrink-0 text-ink-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="panel"
                    id={panelId}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-ink-100 px-4 pb-5 pt-4 sm:px-5 sm:pl-[4.75rem]">
                      <div
                        className="prose-trek text-[0.9375rem]"
                        dangerouslySetInnerHTML={{ __html: day.description }}
                      />
                      {(day.accommodation || day.meals) && (
                        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-xl bg-ink-50 px-4 py-3 text-sm">
                          {day.accommodation && (
                            <div className="flex items-center gap-2">
                              <Moon size={14} className="text-brand-600" aria-hidden />
                              <dt className="font-semibold text-ink-700">Overnight:</dt>
                              <dd className="text-ink-600">{day.accommodation}</dd>
                            </div>
                          )}
                          {day.meals && (
                            <div className="flex items-center gap-2">
                              <Utensils size={14} className="text-brand-600" aria-hidden />
                              <dt className="font-semibold text-ink-700">Meals:</dt>
                              <dd className="text-ink-600">{day.meals}</dd>
                            </div>
                          )}
                        </dl>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Meta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-brand-600" aria-hidden>
        {icon}
      </span>
      {children}
    </span>
  );
}

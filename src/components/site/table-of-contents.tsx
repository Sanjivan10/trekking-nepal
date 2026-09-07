"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

export type TocEntry = { id: string; text: string; level?: number };

/**
 * Sticky table of contents with scroll-spy.
 *
 * Uses IntersectionObserver (no scroll handler) so it stays cheap, and
 * falls back to plain anchor links if JS never runs.
 */
export function TableOfContents({
  items,
  title = "On this page",
  className,
}: {
  items: TocEntry[];
  title?: string;
  className?: string;
}) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Focus the band just under the sticky header.
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className={cn("text-sm", className)}>
      <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-500">
        <List size={14} aria-hidden />
        {title}
      </p>
      <ul className="space-y-0.5 border-l border-ink-200">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1.5 leading-snug transition",
                item.level === 3 ? "pl-6 text-[0.8125rem]" : "pl-4",
                active === item.id
                  ? "border-brand-600 font-semibold text-brand-700"
                  : "border-transparent text-ink-600 hover:border-ink-300 hover:text-ink-900",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

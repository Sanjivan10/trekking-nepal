import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { Crumb } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * Visible breadcrumb trail. Pair with breadcrumbSchema() for the JSON-LD —
 * Google requires the markup to match what's on the page.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="no-scrollbar flex items-center gap-1 overflow-x-auto whitespace-nowrap text-sm">
        <li className="flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-current opacity-70 transition hover:opacity-100"
          >
            <Home size={14} aria-hidden />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex min-w-0 items-center">
              <ChevronRight size={14} className="mx-0.5 shrink-0 opacity-40" aria-hidden />
              {isLast ? (
                <span className="truncate font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="truncate opacity-70 transition hover:opacity-100"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

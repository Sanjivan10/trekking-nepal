"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Mountain, ExternalLink } from "lucide-react";
import { mainSite } from "@/lib/mainSite";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

/**
 * Floating pill navigation. Transparent over the homepage hero, then turns
 * into a solid frosted bar once you scroll past it (and on every other page).
 */
export function SiteHeader({ regions = [] }: { regions?: Array<{ slug: string; name: string }> }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const overHero = pathname === "/";

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", open);
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  const nav: NavItem[] = [
    { href: "/nepal-trekking-routes", label: "Treks" },
    { href: "/blog", label: "Blog" },
    ...regions.slice(0, 2).map((r) => ({ href: `/nepal-trekking-routes/${r.slug}-region`, label: r.name })),
    { href: "/nepal-trekking-routes", label: "Regions" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const floating = overHero && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        floating ? "bg-transparent" : "border-b border-ink-200/80 bg-white/85 backdrop-blur-xl",
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-3">
        <Link
          href="/"
          className={cn(
            "flex shrink-0 items-center gap-2 transition",
            floating ? "text-white" : "text-ink-900",
          )}
          aria-label="Trekking Nepal home"
        >
          <span
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl transition",
              floating ? "bg-white/15 ring-1 ring-inset ring-white/30 backdrop-blur" : "bg-brand-600 text-white",
            )}
          >
            <Mountain size={19} strokeWidth={2.3} aria-hidden />
          </span>
          <span className="text-[1.0625rem] font-extrabold leading-none tracking-tight">
            Trekking<span className={floating ? "text-brand-300" : "text-brand-600"}>Nepal</span>
          </span>
        </Link>

        {/* Pill nav */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul
            className={cn(
              "flex items-center gap-1 rounded-full p-1 transition",
              floating ? "glass" : "bg-ink-100/70",
            )}
          >
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-full px-4 py-2 text-sm font-semibold transition",
                    isActive(item.href)
                      ? floating
                        ? "bg-white text-ink-900 shadow-sm"
                        : "bg-white text-brand-700 shadow-sm"
                      : floating
                        ? "text-white/90 hover:bg-white/15 hover:text-white"
                        : "text-ink-600 hover:bg-white hover:text-ink-900",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={mainSite.url}
            rel="noopener"
            target="_blank"
            className={cn(
              "hidden items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition sm:inline-flex",
              floating
                ? "bg-white text-ink-900 hover:bg-white/90"
                : "bg-brand-600 text-white hover:bg-brand-700",
            )}
          >
            Book now
            <ExternalLink size={14} aria-hidden />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full transition lg:hidden",
              floating ? "glass text-white" : "bg-ink-100 text-ink-700 hover:bg-ink-200",
            )}
          >
            {open ? <X size={19} aria-hidden /> : <Menu size={19} aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div id="mobile-nav" hidden={!open} className="border-t border-ink-200 bg-white lg:hidden">
        <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-4 py-3 text-[0.9375rem] font-semibold transition",
                isActive(item.href) ? "bg-brand-50 text-brand-800" : "text-ink-700 hover:bg-ink-50",
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={mainSite.url}
            rel="noopener"
            target="_blank"
            className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-bold text-white"
          >
            Book now
            <ExternalLink size={14} aria-hidden />
          </a>
        </nav>
      </div>
    </header>
  );
}

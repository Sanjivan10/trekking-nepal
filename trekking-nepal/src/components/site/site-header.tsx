"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Mountain, ExternalLink, Search } from "lucide-react";
import { mainSite } from "@/lib/mainSite";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function SiteHeader({ regions = [] }: { regions?: Array<{ slug: string; name: string }> }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", open);
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  // Blog sits in the primary menu, immediately after Treks. Region hubs
  // follow, then the Regions index.
  const nav: NavItem[] = [
    { href: "/itinerary", label: "Treks" },
    { href: "/blog", label: "Blog" },
    ...regions.slice(0, 3).map((r) => ({ href: `/region/${r.slug}`, label: r.name })),
    { href: "/region", label: "Regions" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-ink-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75"
          : "border-transparent bg-white",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Trekking Nepal home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Mountain size={19} strokeWidth={2.3} aria-hidden />
          </span>
          <span className="text-[1.0625rem] font-extrabold leading-none tracking-tight text-ink-900">
            Trekking<span className="text-brand-600">Nepal</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-800"
                  : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/itinerary"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-900 sm:inline-flex"
          >
            <Search size={15} aria-hidden />
            Find a trek
          </Link>
          {/* Primary cross-domain CTA — dofollow to the main booking site. */}
          <a
            href={mainSite.url}
            rel="noopener"
            target="_blank"
            className="hidden items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:inline-flex"
          >
            Book on {mainSite.name}
            <ExternalLink size={14} aria-hidden />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 transition hover:bg-ink-100 lg:hidden"
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-200 bg-white lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium transition",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-800"
                  : "text-ink-700 hover:bg-ink-50",
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={mainSite.url}
            rel="noopener"
            target="_blank"
            className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Book on {mainSite.name}
            <ExternalLink size={14} aria-hidden />
          </a>
        </nav>
      </div>
    </header>
  );
}

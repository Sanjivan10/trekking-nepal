"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Map,
  Mountain,
  Link2,
  Star,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/itineraries", label: "Itineraries", icon: Mountain },
  { href: "/admin/blogs", label: "Blog posts", icon: FileText },
  { href: "/admin/regions", label: "Regions", icon: Map },
  { href: "/admin/backlinks", label: "Backlink engine", icon: Link2 },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export function AdminShell({ user, children }: { user: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink-50 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-ink-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-lg p-2 text-ink-700 transition hover:bg-ink-100"
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
        <span className="text-sm font-bold text-ink-900">Trekking Nepal CMS</span>
      </div>

      <aside
        className={cn(
          "border-r border-ink-200 bg-white lg:sticky lg:top-0 lg:block lg:h-screen",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="hidden items-center gap-2 px-2 pb-5 lg:flex">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              <Mountain size={17} aria-hidden />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-ink-900">
              Trekking Nepal
            </span>
          </div>

          <nav className="flex-1 space-y-1" aria-label="Admin">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive(item.href, item.exact)
                    ? "bg-brand-50 text-brand-800"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                )}
              >
                <item.icon size={16} aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 space-y-1 border-t border-ink-200 pt-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100"
            >
              <ExternalLink size={16} aria-hidden />
              View site
            </Link>
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="truncate text-xs text-ink-500">
                Signed in as <strong className="text-ink-700">{user}</strong>
              </span>
              <button
                type="button"
                onClick={logout}
                aria-label="Sign out"
                className="rounded p-1.5 text-ink-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={15} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

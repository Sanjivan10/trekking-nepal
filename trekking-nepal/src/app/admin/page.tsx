import Link from "next/link";
import {
  Mountain,
  FileText,
  Map,
  Star,
  Link2,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, StatusPill } from "@/components/admin/page-header";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import { mainSite } from "@/lib/mainSite";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    tripCount,
    tripPublished,
    blogCount,
    blogPublished,
    regionCount,
    backlinkCount,
    pendingReviews,
    recentTrips,
    recentPosts,
    missingMeta,
  ] = await Promise.all([
    prisma.itinerary.count(),
    prisma.itinerary.count({ where: { status: "published" } }),
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "published" } }),
    prisma.region.count(),
    prisma.backlinkTarget.count({ where: { active: true } }),
    prisma.review.count({ where: { approved: false } }),
    prisma.itinerary.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, status: true, updatedAt: true },
    }),
    prisma.blog.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, status: true, updatedAt: true },
    }),
    // Simple SEO health check across published content.
    prisma.itinerary.count({
      where: { status: "published", OR: [{ metaDescription: "" }, { keyTakeaway: "" }] },
    }),
  ]);

  const stats = [
    { label: "Itineraries", value: tripCount, sub: `${tripPublished} published`, icon: Mountain, href: "/admin/itineraries" },
    { label: "Blog posts", value: blogCount, sub: `${blogPublished} published`, icon: FileText, href: "/admin/blogs" },
    { label: "Regions", value: regionCount, sub: "pillar pages", icon: Map, href: "/admin/regions" },
    { label: "Backlink rules", value: backlinkCount, sub: `→ ${mainSite.name}`, icon: Link2, href: "/admin/backlinks" },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description={`Manage content for ${site.name}. Publishing updates the sitemap, llms.txt and all listing pages automatically.`}
      />

      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-ink-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <stat.icon size={19} aria-hidden />
                </span>
                <ArrowRight
                  size={16}
                  className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                  aria-hidden
                />
              </div>
              <p className="mt-4 text-2xl font-extrabold text-ink-900">{stat.value}</p>
              <p className="text-sm font-semibold text-ink-700">{stat.label}</p>
              <p className="text-xs text-ink-500">{stat.sub}</p>
            </Link>
          ))}
        </div>

        {/* Health checks */}
        <div className="grid gap-4 sm:grid-cols-2">
          <HealthCard
            ok={pendingReviews === 0}
            okLabel="No reviews awaiting moderation"
            warnLabel={`${pendingReviews} review${pendingReviews === 1 ? "" : "s"} awaiting moderation`}
            href="/admin/reviews"
            action="Moderate reviews"
          />
          <HealthCard
            ok={missingMeta === 0}
            okLabel="All published treks have meta descriptions and key takeaways"
            warnLabel={`${missingMeta} published trek${missingMeta === 1 ? "" : "s"} missing a meta description or key takeaway`}
            href="/admin/itineraries"
            action="Review itineraries"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentList
            title="Recent itineraries"
            href="/admin/itineraries"
            basePath="/admin/itineraries"
            items={recentTrips}
          />
          <RecentList
            title="Recent blog posts"
            href="/admin/blogs"
            basePath="/admin/blogs"
            items={recentPosts}
          />
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
            Technical SEO files
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { href: "/sitemap.xml", label: "sitemap.xml", note: "All published URLs" },
              { href: "/robots.txt", label: "robots.txt", note: "AI crawlers allowed" },
              { href: "/llms.txt", label: "llms.txt", note: "LLM content index" },
            ].map((file) => (
              <li key={file.href}>
                <a
                  href={file.href}
                  target="_blank"
                  rel="noopener"
                  className="block rounded-xl border border-ink-200 p-3 transition hover:border-brand-300 hover:bg-brand-50"
                >
                  <span className="block text-sm font-bold text-ink-900">{file.label}</span>
                  <span className="block text-xs text-ink-500">{file.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function HealthCard({
  ok,
  okLabel,
  warnLabel,
  href,
  action,
}: {
  ok: boolean;
  okLabel: string;
  warnLabel: string;
  href: string;
  action: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        ok ? "border-brand-200 bg-brand-50/50" : "border-amber-200 bg-amber-50/60"
      }`}
    >
      {ok ? (
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
      ) : (
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink-800">{ok ? okLabel : warnLabel}</p>
        {!ok && (
          <Link
            href={href}
            className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:gap-1.5"
          >
            {action}
            <ArrowRight size={13} aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}

function RecentList({
  title,
  href,
  basePath,
  items,
}: {
  title: string;
  href: string;
  basePath: string;
  items: Array<{ id: string; title: string; status: string; updatedAt: Date }>;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">{title}</h2>
        <Link href={href} className="text-xs font-semibold text-brand-700 hover:underline">
          View all
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="p-5 text-sm text-ink-500">Nothing here yet.</p>
      ) : (
        <ul className="divide-y divide-ink-100">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`${basePath}/${item.id}`}
                className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-ink-50"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink-900">
                    {item.title}
                  </span>
                  <span className="text-xs text-ink-500">
                    Updated {formatDate(item.updatedAt)}
                  </span>
                </span>
                <StatusPill status={item.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

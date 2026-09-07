import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader, StatusPill } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminRegionsPage() {
  const regions = await prisma.region.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { _count: { select: { itineraries: true, blogs: true, faqs: true } } },
  });

  return (
    <>
      <AdminHeader
        title="Regions"
        description="Pillar pages — the hubs in the hub-and-spoke internal linking model. Each links down to its treks and guides."
        action={{ href: "/admin/regions/new", label: "New region" }}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {regions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-12 text-center">
            <p className="text-sm text-ink-500">No regions yet.</p>
            <Link
              href="/admin/regions/new"
              className="mt-3 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Create your first region
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((region) => (
              <Link
                key={region.id}
                href={`/admin/regions/${region.id}`}
                className="rounded-2xl border border-ink-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold text-ink-900">{region.name}</h2>
                  <StatusPill status={region.status} />
                </div>
                <p className="mt-1 text-xs text-ink-500">/region/{region.slug}</p>
                {region.headline && (
                  <p className="mt-2 line-clamp-2 text-sm text-ink-600">{region.headline}</p>
                )}
                <p className="mt-3 text-xs text-ink-500">
                  {region._count.itineraries} treks · {region._count.blogs} guides ·{" "}
                  {region._count.faqs} FAQs
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

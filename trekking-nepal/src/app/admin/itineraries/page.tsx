import Link from "next/link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, StatusPill } from "@/components/admin/page-header";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminItinerariesPage() {
  const trips = await prisma.itinerary.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, title: true, slug: true, status: true, featured: true,
      durationDays: true, priceFrom: true, currency: true,
      ratingValue: true, reviewCount: true, updatedAt: true,
      region: { select: { name: true } },
      _count: { select: { days: true, faqs: true } },
    },
  });

  return (
    <>
      <AdminHeader
        title="Itineraries"
        description="Trek pages with day-by-day breakdowns, TouristTrip + AggregateRating schema and the booking CTA."
        action={{ href: "/admin/itineraries/new", label: "New itinerary" }}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {trips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-12 text-center">
            <p className="text-sm text-ink-500">No itineraries yet.</p>
            <Link
              href="/admin/itineraries/new"
              className="mt-3 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Create your first itinerary
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Trek</th>
                    <th className="px-4 py-3 font-bold">Region</th>
                    <th className="px-4 py-3 font-bold">Days</th>
                    <th className="px-4 py-3 font-bold">Price</th>
                    <th className="px-4 py-3 font-bold">Rating</th>
                    <th className="px-4 py-3 font-bold">Content</th>
                    <th className="px-4 py-3 font-bold">Updated</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {trips.map((trip) => (
                    <tr key={trip.id} className="transition hover:bg-ink-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/itineraries/${trip.id}`}
                          className="font-semibold text-ink-900 hover:text-brand-700"
                        >
                          {trip.title}
                        </Link>
                        <span className="block text-xs text-ink-500">/itinerary/{trip.slug}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-600">
                        {trip.region?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-ink-600">{trip.durationDays || "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-600">
                        {trip.priceFrom ? formatPrice(trip.priceFrom, trip.currency) : "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {trip.reviewCount ? (
                          <span className="inline-flex items-center gap-1 text-ink-700">
                            <Star size={12} fill="currentColor" strokeWidth={0} className="text-sun-500" aria-hidden />
                            {trip.ratingValue.toFixed(1)}
                            <span className="text-xs text-ink-400">({trip.reviewCount})</span>
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-500">
                        {trip._count.days} days · {trip._count.faqs} FAQs
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-500">
                        {formatDate(trip.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={trip.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

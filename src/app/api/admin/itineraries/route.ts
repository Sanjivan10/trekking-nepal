import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, regionPaths, fail } from "@/lib/api";
import { audit } from "@/lib/security";
import { getSession } from "@/lib/auth";
import { itineraryPayload, faqRows, dayRows, reviewRows, publishStamp } from "@/lib/payload";
import { recomputeRating } from "@/lib/content";

export async function GET() {
  return withAdmin(async () =>
    prisma.itinerary.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true, slug: true, title: true, status: true, featured: true,
        durationDays: true, priceFrom: true, currency: true,
        ratingValue: true, reviewCount: true, updatedAt: true,
        region: { select: { name: true } },
        _count: { select: { days: true, faqs: true } },
      },
    }),
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.title) return fail("A title is required.");

  return withAdmin(async () => {
    const data = itineraryPayload(body);
    const trip = await prisma.itinerary.create({
      data: {
        ...data,
        publishedAt: publishStamp(data.status),
        days: { create: dayRows(body) },
        faqs: { create: faqRows(body).map((faq, i) => ({ ...faq, position: i })) },
        reviews: { create: reviewRows(body) },
      },
    });
    await recomputeRating(trip.id);
    revalidateContent([`/trip/${trip.slug}`, ...(await regionPaths(trip.regionId))]);
    await audit({ actor: (await getSession()) || "admin", action: "create", entity: "itinerary", entityId: trip.id, summary: trip.title, request });
    return trip;
  }, request);
}

import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, regionPaths, fail } from "@/lib/api";
import { itineraryPayload, faqRows, dayRows, reviewRows, publishStamp } from "@/lib/payload";
import { recomputeRating } from "@/lib/content";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () =>
    prisma.itinerary.findUnique({
      where: { id },
      include: {
        days: { orderBy: { dayNumber: "asc" } },
        faqs: { orderBy: { position: "asc" } },
        reviews: { orderBy: { reviewedAt: "desc" } },
      },
    }),
  );
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body?.title) return fail("A title is required.");

  return withAdmin(async () => {
    const existing = await prisma.itinerary.findUnique({
      where: { id },
      select: { publishedAt: true, slug: true, regionId: true },
    });
    if (!existing) throw new Error("Itinerary not found");

    const data = itineraryPayload(body);

    const trip = await prisma.$transaction(async (tx) => {
      await tx.itineraryDay.deleteMany({ where: { itineraryId: id } });
      await tx.faq.deleteMany({ where: { itineraryId: id } });
      // Reviews are only replaced when the form actually sends them, so a
      // save from the content tab never wipes public submissions.
      if (Array.isArray(body.reviews)) {
        await tx.review.deleteMany({ where: { itineraryId: id } });
      }
      return tx.itinerary.update({
        where: { id },
        data: {
          ...data,
          publishedAt: publishStamp(data.status, existing.publishedAt),
          days: { create: dayRows(body) },
          faqs: { create: faqRows(body).map((faq, i) => ({ ...faq, position: i })) },
          ...(Array.isArray(body.reviews) ? { reviews: { create: reviewRows(body) } } : {}),
        },
      });
    }, { timeout: 20000, maxWait: 10000 });

    await recomputeRating(trip.id);
    revalidateContent([
      `/itinerary/${trip.slug}`,
      `/itinerary/${existing.slug}`,
      ...(await regionPaths(trip.regionId, existing.regionId)),
    ]);
    return trip;
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const trip = await prisma.itinerary.delete({ where: { id } });
    revalidateContent([`/itinerary/${trip.slug}`, ...(await regionPaths(trip.regionId))]);
    return { ok: true };
  });
}

import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, bool } from "@/lib/api";
import { recomputeRating } from "@/lib/content";

type Params = { params: Promise<{ id: string }> };

/** Approve or unapprove a submitted review, then refresh the aggregate. */
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return withAdmin(async () => {
    const review = await prisma.review.update({
      where: { id },
      data: { approved: bool(body.approved, true) },
      include: { itinerary: { select: { slug: true } } },
    });
    await recomputeRating(review.itineraryId);
    revalidateContent([`/itinerary/${review.itinerary.slug}`]);
    return review;
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const review = await prisma.review.delete({
      where: { id },
      include: { itinerary: { select: { slug: true } } },
    });
    await recomputeRating(review.itineraryId);
    revalidateContent([`/itinerary/${review.itinerary.slug}`]);
    return { ok: true };
  });
}

import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/page-header";
import { ReviewModeration } from "@/components/admin/review-moderation";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
    take: 200,
    include: { itinerary: { select: { title: true, slug: true } } },
  });

  return (
    <>
      <AdminHeader
        title="Reviews"
        description="Reviews submitted from trek pages arrive here unapproved. Approving one adds it to the public list and recalculates the AggregateRating schema."
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <ReviewModeration
          initial={reviews.map((review) => ({
            id: review.id,
            authorName: review.authorName,
            country: review.country,
            rating: review.rating,
            title: review.title,
            body: review.body,
            approved: review.approved,
            reviewedAt: review.reviewedAt.toISOString(),
            itinerary: review.itinerary,
          }))}
        />
      </div>
    </>
  );
}

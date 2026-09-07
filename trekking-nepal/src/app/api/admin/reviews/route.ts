import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/api";

export async function GET(request: Request) {
  const pending = new URL(request.url).searchParams.get("pending") === "1";
  return withAdmin(async () =>
    prisma.review.findMany({
      where: pending ? { approved: false } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { itinerary: { select: { title: true, slug: true } } },
    }),
  );
}

import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, fail } from "@/lib/api";
import { regionPayload, faqRows } from "@/lib/payload";

export async function GET() {
  return withAdmin(async () =>
    prisma.region.findMany({
      orderBy: [{ position: "asc" }, { name: "asc" }],
      include: { _count: { select: { itineraries: true, blogs: true } } },
    }),
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.name) return fail("A region name is required.");
  return withAdmin(async () => {
    const region = await prisma.region.create({
      data: {
        ...regionPayload(body),
        faqs: { create: faqRows(body).map((faq, i) => ({ ...faq, position: i })) },
      },
    });
    revalidateContent([`/region/${region.slug}`]);
    return region;
  });
}

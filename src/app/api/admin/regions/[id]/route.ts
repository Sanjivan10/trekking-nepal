import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, fail } from "@/lib/api";
import { regionPayload, faqRows } from "@/lib/payload";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () =>
    prisma.region.findUnique({
      where: { id },
      include: { faqs: { orderBy: { position: "asc" } } },
    }),
  );
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body?.name) return fail("A region name is required.");

  return withAdmin(async () => {
    const region = await prisma.$transaction(async (tx) => {
      await tx.faq.deleteMany({ where: { regionId: id } });
      return tx.region.update({
        where: { id },
        data: {
          ...regionPayload(body),
          faqs: { create: faqRows(body).map((faq, i) => ({ ...faq, position: i })) },
        },
      });
    }, { timeout: 20000, maxWait: 10000 });
    revalidateContent([`/nepal-trekking-routes/${region.slug}-region`]);
    return region;
  }, request);
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const region = await prisma.region.delete({ where: { id } });
    revalidateContent([`/nepal-trekking-routes/${region.slug}-region`]);
    return { ok: true };
  }, request);
}

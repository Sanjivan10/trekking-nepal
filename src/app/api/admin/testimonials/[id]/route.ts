import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, fail } from "@/lib/api";
import { testimonialPayload } from "@/lib/payload";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body?.authorName || !body?.body) {
    return fail("A reviewer name and review text are required.");
  }
  return withAdmin(async () => {
    const row = await prisma.testimonial.update({ where: { id }, data: testimonialPayload(body) });
    revalidateContent();
    return row;
  }, request);
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    await prisma.testimonial.delete({ where: { id } });
    revalidateContent();
    return { ok: true };
  }, request);
}

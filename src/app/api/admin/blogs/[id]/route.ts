import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, regionPaths, fail } from "@/lib/api";
import { blogPayload, faqRows, publishStamp } from "@/lib/payload";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () =>
    prisma.blog.findUnique({
      where: { id },
      include: { faqs: { orderBy: { position: "asc" } } },
    }),
  );
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body?.title) return fail("A title is required.");

  return withAdmin(async () => {
    const existing = await prisma.blog.findUnique({
      where: { id },
      select: { publishedAt: true, slug: true, regionId: true },
    });
    if (!existing) throw new Error("Post not found");

    const data = blogPayload(body);
    // FAQs are replaced wholesale — simplest correct result for a form save.
    const post = await prisma.$transaction(async (tx) => {
      await tx.faq.deleteMany({ where: { blogId: id } });
      return tx.blog.update({
        where: { id },
        data: {
          ...data,
          publishedAt: publishStamp(data.status, existing.publishedAt),
          faqs: { create: faqRows(body).map((faq, i) => ({ ...faq, position: i })) },
        },
      });
    }, { timeout: 20000, maxWait: 10000 });

    revalidateContent([
      `/blog/${post.slug}`,
      `/blog/${existing.slug}`,
      ...(await regionPaths(post.regionId, existing.regionId)),
    ]);
    return post;
  }, request);
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    const post = await prisma.blog.delete({ where: { id } });
    revalidateContent([`/blog/${post.slug}`, ...(await regionPaths(post.regionId))]);
    return { ok: true };
  }, request);
}

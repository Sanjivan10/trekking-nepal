import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, regionPaths, fail } from "@/lib/api";
import { audit } from "@/lib/security";
import { getSession } from "@/lib/auth";
import { blogPayload, faqRows, publishStamp } from "@/lib/payload";

export async function GET() {
  return withAdmin(async () =>
    prisma.blog.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true, slug: true, title: true, status: true, featured: true,
        author: true, publishedAt: true, updatedAt: true,
        region: { select: { name: true } },
      },
    }),
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.title) return fail("A title is required.");

  return withAdmin(async () => {
    const data = blogPayload(body);
    const post = await prisma.blog.create({
      data: {
        ...data,
        publishedAt: publishStamp(data.status),
        faqs: { create: faqRows(body).map((faq, i) => ({ ...faq, position: i })) },
      },
    });
    revalidateContent([`/blog/${post.slug}`, ...(await regionPaths(post.regionId))]);
    await audit({ actor: (await getSession()) || "admin", action: "create", entity: "blog", entityId: post.id, summary: post.title, request });
    return post;
  }, request);
}

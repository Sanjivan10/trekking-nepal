import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, fail } from "@/lib/api";
import { testimonialPayload } from "@/lib/payload";

export async function GET() {
  return withAdmin(async () =>
    prisma.testimonial.findMany({ orderBy: [{ featured: "desc" }, { position: "asc" }] }),
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.authorName || !body?.body) {
    return fail("A reviewer name and review text are required.");
  }
  return withAdmin(async () => {
    const row = await prisma.testimonial.create({ data: testimonialPayload(body) });
    revalidateContent();
    return row;
  }, request);
}

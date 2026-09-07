import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, fail } from "@/lib/api";
import { backlinkPayload } from "@/lib/payload";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const data = body ? backlinkPayload(body) : null;
  if (!data?.keyword || !data.targetUrl) {
    return fail("Both a keyword and a target URL are required.");
  }
  return withAdmin(async () => {
    const rule = await prisma.backlinkTarget.update({ where: { id }, data });
    revalidateContent();
    return rule;
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  return withAdmin(async () => {
    await prisma.backlinkTarget.delete({ where: { id } });
    revalidateContent();
    return { ok: true };
  });
}

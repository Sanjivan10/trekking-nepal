import { prisma } from "@/lib/prisma";
import { withAdmin, revalidateContent, fail } from "@/lib/api";
import { backlinkPayload } from "@/lib/payload";

export async function GET() {
  return withAdmin(async () =>
    prisma.backlinkTarget.findMany({ orderBy: [{ priority: "desc" }, { keyword: "asc" }] }),
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const data = body ? backlinkPayload(body) : null;
  if (!data?.keyword || !data.targetUrl) {
    return fail("Both a keyword and a target URL are required.");
  }
  return withAdmin(async () => {
    const rule = await prisma.backlinkTarget.create({ data });
    revalidateContent();
    return rule;
  }, request);
}

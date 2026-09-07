import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";
import { emptyBlog } from "@/lib/drafts";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const regions = await prisma.region.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return <BlogForm initial={emptyBlog()} regions={regions} />;
}

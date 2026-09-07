import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";
import type { BlogDraft } from "@/lib/drafts";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, regions] = await Promise.all([
    prisma.blog.findUnique({
      where: { id },
      include: { faqs: { orderBy: { position: "asc" } } },
    }),
    prisma.region.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!post) notFound();

  const initial: BlogDraft = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    bannerImage: post.bannerImage,
    bannerAlt: post.bannerAlt,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    primaryKeywords: post.primaryKeywords,
    secondaryKeywords: post.secondaryKeywords,
    canonicalUrl: post.canonicalUrl,
    author: post.author,
    authorTitle: post.authorTitle,
    authorBio: post.authorBio,
    authorImage: post.authorImage,
    keyTakeaway: post.keyTakeaway,
    takeaways: post.takeaways,
    readMinutes: post.readMinutes,
    entityTags: post.entityTags,
    regionId: post.regionId || "",
    mainSiteUrl: post.mainSiteUrl,
    primaryAnchor: post.primaryAnchor,
    secondaryAnchors: post.secondaryAnchors,
    backlinksEnabled: post.backlinksEnabled,
    featured: post.featured,
    status: post.status,
    faqs: post.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
  };

  return <BlogForm initial={initial} regions={regions} />;
}

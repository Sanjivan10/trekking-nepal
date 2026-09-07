import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RegionForm } from "@/components/admin/region-form";
import type { RegionDraft } from "@/lib/drafts";

export const dynamic = "force-dynamic";

export default async function EditRegionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const region = await prisma.region.findUnique({
    where: { id },
    include: { faqs: { orderBy: { position: "asc" } } },
  });
  if (!region) notFound();

  const initial: RegionDraft = {
    id: region.id,
    name: region.name, slug: region.slug, headline: region.headline,
    description: region.description, heroImage: region.heroImage, heroAlt: region.heroAlt,
    metaTitle: region.metaTitle, metaDescription: region.metaDescription,
    keywords: region.keywords, entityTags: region.entityTags,
    keyTakeaway: region.keyTakeaway, takeaways: region.takeaways,
    position: region.position, featured: region.featured, status: region.status,
    faqs: region.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
  };

  return <RegionForm initial={initial} />;
}

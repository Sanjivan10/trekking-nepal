/**
 * Seeds the 15-post Manaslu/Annapurna programmatic SEO cluster.
 * Safe to re-run — upserts by slug rather than duplicating.
 */
import { PrismaClient } from "@prisma/client";
import { clusterPosts } from "./manaslu-cluster-posts";

const prisma = new PrismaClient();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000);

function readingTime(markdown: string) {
  const words = markdown.replace(/[#*_`>|-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

const AUTHOR = {
  author: "Sanjivan Dhakal",
  authorTitle: "SEO Specialist",
  authorBio:
    "Sanjivan Dhakal is an SEO specialist focused on search and answer-engine visibility for trekking and travel content. He builds and maintains this site.",
};

async function main() {
  console.log(`Seeding ${clusterPosts.length}-post Manaslu/Annapurna cluster…\n`);

  const regions = await prisma.region.findMany({ where: { slug: { in: ["manaslu", "annapurna"] } } });
  const regionId = new Map(regions.map((r) => [r.slug, r.id]));

  let created = 0;
  let updated = 0;

  for (const [index, post] of clusterPosts.entries()) {
    const existing = await prisma.blog.findUnique({ where: { slug: post.slug } });

    const data = {
      title: post.title,
      excerpt: post.excerpt,
      bannerImage: post.bannerImage,
      bannerAlt: post.bannerAlt,
      content: post.content,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      primaryKeywords: post.primaryKeywords,
      secondaryKeywords: post.secondaryKeywords,
      entityTags: post.entityTags,
      keyTakeaway: post.keyTakeaway,
      takeaways: post.takeaways,
      readMinutes: readingTime(post.content),
      regionId: regionId.get(post.regionSlug) ?? null,
      status: "published",
      featured: false,
      ...AUTHOR,
    };

    if (existing) {
      await prisma.faq.deleteMany({ where: { blogId: existing.id } });
      await prisma.blog.update({
        where: { id: existing.id },
        data: {
          ...data,
          faqs: { create: post.faqs.map((f, i) => ({ ...f, position: i })) },
        },
      });
      updated++;
    } else {
      await prisma.blog.create({
        data: {
          slug: post.slug,
          ...data,
          publishedAt: daysAgo(15 - index), // stagger publish dates, newest last
          faqs: { create: post.faqs.map((f, i) => ({ ...f, position: i })) },
        },
      });
      created++;
    }
    console.log(`  ${existing ? "updated" : "created"}: ${post.slug}`);
  }

  console.log(`\n${created} created, ${updated} updated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

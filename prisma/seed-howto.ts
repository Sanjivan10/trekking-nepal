/**
 * Seeds the two how-to posts, then wires internal links FROM existing related
 * posts TO them. New pages with no inbound internal links are effectively
 * orphaned — they get crawled slowly and rank poorly regardless of content
 * quality, so the inbound links matter as much as the posts themselves.
 */
import { PrismaClient } from "@prisma/client";
import { howToPosts } from "./manaslu-howto-posts";

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

/** Inbound links: [target post slug] <- [source slug, anchor text, sentence to append after] */
const INBOUND_LINKS: Array<{
  source: string;
  anchor: string;
  href: string;
  afterHeading: string;
  sentence: string;
}> = [
  {
    source: "manaslu-circuit-trek-permits",
    href: "/blog/how-to-get-manaslu-trekking-permits",
    anchor: "step-by-step guide to getting them",
    afterHeading: "## Why Manaslu needs permits an ordinary trek doesn't",
    sentence:
      "This page covers what each permit is and what it costs. For the practical side — who applies, which documents you hand over and how long it takes — see our [step-by-step guide to getting them](/blog/how-to-get-manaslu-trekking-permits).",
  },
  {
    source: "manaslu-circuit-trek-difficulty",
    href: "/blog/how-to-prepare-for-manaslu-trekking",
    anchor: "12-week preparation plan",
    afterHeading: "## The short version",
    sentence:
      "If you have already decided you're doing it and want to get ready, jump to our [12-week preparation plan](/blog/how-to-prepare-for-manaslu-trekking) instead.",
  },
  {
    source: "manaslu-circuit-trek-cost",
    href: "/blog/how-to-get-manaslu-trekking-permits",
    anchor: "how the permit process actually works",
    afterHeading: "## The permits: the single biggest line item",
    sentence:
      "For the application process itself, see [how the permit process actually works](/blog/how-to-get-manaslu-trekking-permits).",
  },
  {
    source: "manaslu-circuit-trek-accommodation-and-food",
    href: "/blog/how-to-prepare-for-manaslu-trekking",
    anchor: "what to pack and how to train",
    afterHeading: "## Simpler than the Khumbu, and that's not a complaint",
    sentence:
      "Planning what to bring? Our guide to [what to pack and how to train](/blog/how-to-prepare-for-manaslu-trekking) covers the gear that earns its weight.",
  },
  {
    source: "manaslu-circuit-trek-itinerary-day-by-day",
    href: "/blog/how-to-prepare-for-manaslu-trekking",
    anchor: "how to prepare for it",
    afterHeading: "## Which length should you actually book?",
    sentence:
      "Once you've picked your itinerary length, read [how to prepare for it](/blog/how-to-prepare-for-manaslu-trekking) — the training and admin are worth starting three months out.",
  },
];

async function main() {
  console.log("Seeding how-to posts…\n");

  const region = await prisma.region.findUnique({ where: { slug: "manaslu" } });

  for (const [index, post] of howToPosts.entries()) {
    const existing = await prisma.blog.findUnique({ where: { slug: post.slug } });
    const data = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      bannerImage: post.bannerImage,
      bannerAlt: post.bannerAlt,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      primaryKeywords: post.primaryKeywords,
      secondaryKeywords: post.secondaryKeywords,
      entityTags: post.entityTags,
      keyTakeaway: post.keyTakeaway,
      takeaways: post.takeaways,
      readMinutes: readingTime(post.content),
      regionId: region?.id ?? null,
      status: "published",
      featured: false,
      ...AUTHOR,
    };

    if (existing) {
      await prisma.faq.deleteMany({ where: { blogId: existing.id } });
      await prisma.blog.update({
        where: { id: existing.id },
        data: { ...data, faqs: { create: post.faqs.map((f, i) => ({ ...f, position: i })) } },
      });
      console.log(`  updated: ${post.slug}`);
    } else {
      await prisma.blog.create({
        data: {
          slug: post.slug,
          ...data,
          // Published now, not backdated — these are new posts, and a
          // stale date buries them at the bottom of a date-ordered listing.
          publishedAt: new Date(Date.now() - (howToPosts.length - index) * 3600_000),
          faqs: { create: post.faqs.map((f, i) => ({ ...f, position: i })) },
        },
      });
      console.log(`  created: ${post.slug}`);
    }
  }

  console.log("\nAdding inbound internal links from existing posts…\n");
  let linked = 0;
  for (const link of INBOUND_LINKS) {
    const source = await prisma.blog.findUnique({ where: { slug: link.source } });
    if (!source) {
      console.log(`  ⚠️  source not found: ${link.source}`);
      continue;
    }
    if (source.content.includes(link.href)) {
      console.log(`  already linked: ${link.source} -> ${link.href}`);
      continue;
    }
    if (!source.content.includes(link.afterHeading)) {
      console.log(`  ⚠️  heading not found in ${link.source}: "${link.afterHeading}"`);
      continue;
    }
    const updated = source.content.replace(
      link.afterHeading,
      `${link.afterHeading}\n\n${link.sentence}`,
    );
    await prisma.blog.update({ where: { id: source.id }, data: { content: updated } });
    console.log(`  linked: ${link.source} -> ${link.href}`);
    linked++;
  }

  console.log(`\n${linked} inbound link(s) added.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

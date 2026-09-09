/** Seeds the 14-post Everest Base Camp cluster + inbound internal links. */
import { PrismaClient } from "@prisma/client";
import { ebcPostsA } from "./ebc-posts-a";
import { ebcPostsB } from "./ebc-posts-b";

const prisma = new PrismaClient();
const posts = [...ebcPostsA, ...ebcPostsB];

function readingTime(md: string) {
  return Math.max(1, Math.round(md.replace(/[#*_`>|-]/g, " ").split(/\s+/).filter(Boolean).length / 220));
}

const AUTHOR = {
  author: "Sanjivan Dhakal",
  authorTitle: "SEO Specialist",
  authorBio:
    "Sanjivan Dhakal is an SEO specialist focused on search and answer-engine visibility for trekking and travel content. He builds and maintains this site.",
};

/** Cross-links between the new EBC posts so the cluster interlinks properly. */
const CROSS_LINKS: Array<{ source: string; afterHeading: string; sentence: string }> = [
  {
    source: "how-high-is-everest-base-camp",
    afterHeading: "## What 5,364 metres actually feels like",
    sentence:
      "If you are weighing up whether that altitude is manageable, see [is Everest Base Camp hard?](/blog/is-everest-base-camp-hard) and [is it dangerous?](/blog/is-everest-base-camp-dangerous)",
  },
  {
    source: "where-is-everest-base-camp",
    afterHeading: "### Getting there from Kathmandu",
    sentence:
      "For the flight connections themselves, see [which airport you fly into](/blog/which-airport-for-everest-base-camp).",
  },
  {
    source: "how-long-is-the-everest-base-camp-trek",
    afterHeading: "## Practical timing advice",
    sentence:
      "Deciding when in the year to go? Our [season-by-season guide](/blog/when-to-trek-to-everest-base-camp) covers the trade-offs.",
  },
  {
    source: "how-many-miles-is-the-everest-base-camp-trek",
    afterHeading: "## Why 80 miles is harder than 80 miles sounds",
    sentence:
      "The full picture on effort is in [is Everest Base Camp hard?](/blog/is-everest-base-camp-hard)",
  },
  {
    source: "is-everest-base-camp-hard",
    afterHeading: "## How fit do you need to be?",
    sentence:
      "For a full training timeline, see [can anyone trek to Everest Base Camp?](/blog/can-anyone-trek-to-everest-base-camp)",
  },
  {
    source: "is-everest-base-camp-dangerous",
    afterHeading: "## The confusion worth clearing up first",
    sentence:
      "The distances involved are set out in [how far Base Camp is from the summit](/blog/how-far-is-everest-base-camp-from-the-summit).",
  },
  {
    source: "is-everest-base-camp-worth-it",
    afterHeading: "## What Everest Base Camp actually looks like",
    sentence:
      "More on what the place actually is in [what is Everest Base Camp?](/blog/what-is-everest-base-camp)",
  },
  {
    source: "can-anyone-trek-to-everest-base-camp",
    afterHeading: "## How much training you actually need",
    sentence:
      "Get your footwear right too — see [what boots to bring](/blog/what-boots-for-everest-base-camp).",
  },
  {
    source: "when-to-trek-to-everest-base-camp",
    afterHeading: "## Practical booking advice",
    sentence:
      "Temperatures by month and altitude are in [how cold is Everest Base Camp?](/blog/how-cold-is-everest-base-camp)",
  },
  {
    source: "how-cold-is-everest-base-camp",
    afterHeading: "## Practical advice for the cold",
    sentence:
      "Boots and socks matter as much as the sleeping bag — see [our footwear guide](/blog/what-boots-for-everest-base-camp).",
  },
  {
    source: "what-boots-for-everest-base-camp",
    afterHeading: "## Socks matter more than people expect",
    sentence:
      "Check [how cold it actually gets](/blog/how-cold-is-everest-base-camp) before finalising your kit list.",
  },
  {
    source: "which-airport-for-everest-base-camp",
    afterHeading: "## Why you need a buffer day",
    sentence:
      "See [how long the trek takes](/blog/how-long-is-the-everest-base-camp-trek) for where the buffer day fits.",
  },
  {
    source: "how-far-is-everest-base-camp-from-the-summit",
    afterHeading: "## What trekkers see instead",
    sentence:
      "Base Camp's own elevation is covered in [how high is Everest Base Camp?](/blog/how-high-is-everest-base-camp)",
  },
  {
    source: "what-is-everest-base-camp",
    afterHeading: "## Why trekkers go",
    sentence:
      "Whether it justifies two weeks is answered in [is Everest Base Camp worth it?](/blog/is-everest-base-camp-worth-it)",
  },
  // Inbound from the existing EBC cost post, so the cluster is not isolated.
  {
    source: "everest-base-camp-trek-cost-breakdown",
    afterHeading: "## What this actually costs",
    sentence:
      "New to the trek? Start with [how long it takes](/blog/how-long-is-the-everest-base-camp-trek) and [how hard it is](/blog/is-everest-base-camp-hard).",
  },
];

async function main() {
  console.log(`Seeding ${posts.length}-post Everest cluster…\n`);
  const region = await prisma.region.findUnique({ where: { slug: "everest" } });

  for (const [i, post] of posts.entries()) {
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
        data: { ...data, faqs: { create: post.faqs.map((f, n) => ({ ...f, position: n })) } },
      });
      console.log(`  updated: ${post.slug}`);
    } else {
      await prisma.blog.create({
        data: {
          slug: post.slug,
          ...data,
          // Published now, staggered by minutes to keep listing order stable.
          publishedAt: new Date(Date.now() - (posts.length - i) * 60_000),
          faqs: { create: post.faqs.map((f, n) => ({ ...f, position: n })) },
        },
      });
      console.log(`  created: ${post.slug}`);
    }
  }

  console.log("\nWiring internal cross-links…\n");
  let n = 0;
  for (const link of CROSS_LINKS) {
    const src = await prisma.blog.findUnique({ where: { slug: link.source } });
    if (!src) { console.log(`  ⚠️  missing source: ${link.source}`); continue; }
    if (src.content.includes(link.sentence.slice(0, 40))) { console.log(`  already linked: ${link.source}`); continue; }
    if (!src.content.includes(link.afterHeading)) { console.log(`  ⚠️  heading not found in ${link.source}`); continue; }
    await prisma.blog.update({
      where: { id: src.id },
      data: { content: src.content.replace(link.afterHeading, `${link.afterHeading}\n\n${link.sentence}`) },
    });
    console.log(`  linked: ${link.source}`);
    n++;
  }
  console.log(`\n${n} cross-link(s) added.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

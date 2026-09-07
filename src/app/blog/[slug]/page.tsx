import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, Tag, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import {
  getBlogBySlug,
  getBacklinkRules,
  getRelatedItineraries,
  getRelatedBlogs,
} from "@/lib/content";
import { renderMarkdown, renderInline } from "@/lib/markdown";
import { buildRules } from "@/lib/backlinkEngine";
import { splitList, formatDate, isoDate, truncate, stripMarkdown, formatPrice } from "@/lib/utils";
import { blogPostingSchema, faqSchema, breadcrumbSchema, type Crumb } from "@/lib/schema";

import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { KeyTakeaways } from "@/components/site/key-takeaways";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { TableOfContents } from "@/components/site/table-of-contents";
import { MainSiteCta } from "@/components/site/main-site-cta";
import { TripCard } from "@/components/site/trip-card";
import { BlogCard } from "@/components/site/blog-card";
import { Badge } from "@/components/ui/badge";
import { mainSite } from "@/lib/mainSite";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await prisma.blog
    .findMany({ where: { status: "published" }, select: { slug: true } })
    .catch(() => []);
  return posts.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Guide not found", robots: { index: false, follow: false } };

  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription || post.excerpt || truncate(stripMarkdown(post.content), 158);

  return {
    title,
    description,
    keywords: [...splitList(post.primaryKeywords), ...splitList(post.secondaryKeywords)],
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: { canonical: post.canonicalUrl || `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      images: post.bannerImage
        ? [{ url: post.bannerImage, alt: post.bannerAlt || post.title }]
        : undefined,
      publishedTime: isoDate(post.publishedAt),
      modifiedTime: isoDate(post.updatedAt),
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.bannerImage ? [post.bannerImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const globalRules = await getBacklinkRules();
  const rules = buildRules({ global: globalRules, post });
  const opts = { backlinks: rules, seed: post.slug };

  const article = renderMarkdown(post.content, opts);
  const faqs = post.faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: renderInline(faq.answer, opts),
  }));

  const [relatedTrips, relatedPosts] = await Promise.all([
    getRelatedItineraries(post, 4),
    getRelatedBlogs(post, 3),
  ]);

  const keywords = [...splitList(post.primaryKeywords), ...splitList(post.secondaryKeywords)];
  const entities = splitList(post.entityTags);

  const crumbs: Crumb[] = [
    { name: "Blog", href: "/blog" },
    ...(post.region ? [{ name: post.region.name, href: `/region/${post.region.slug}` }] : []),
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  const toc = [
    ...article.toc,
    ...(faqs.length ? [{ id: "faqs", text: "Frequently asked questions", level: 2 }] : []),
  ];

  return (
    <>
      <JsonLd id="post-schema" data={blogPostingSchema(post)} />
      <JsonLd id="post-breadcrumbs" data={breadcrumbSchema(crumbs)} />
      {faqs.length > 0 && (
        <JsonLd
          id="post-faq"
          data={faqSchema(
            post.faqs.map((f) => ({ question: f.question, answer: f.answer })),
            `/blog/${post.slug}`,
          )}
        />
      )}

      <div className="border-b border-ink-200 bg-ink-50">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs items={crumbs} className="text-ink-600" />
        </div>
      </div>

      <div className="container-page py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          <article className="min-w-0">
            <header>
              <div className="flex flex-wrap items-center gap-2">
                {post.region && <Badge variant="brand">{post.region.name}</Badge>}
                {entities.slice(0, 3).map((entity) => (
                  <Badge key={entity}>{entity}</Badge>
                ))}
              </div>

              <h1 className="mt-4 text-[1.85rem] font-extrabold leading-[1.15] text-ink-900 sm:text-4xl">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-4 text-lg leading-relaxed text-ink-600">{post.excerpt}</p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-ink-200 py-3.5 text-sm text-ink-600">
                {post.author && (
                  <span className="flex items-center gap-1.5 font-medium text-ink-800">
                    <User size={14} className="text-brand-600" aria-hidden />
                    {post.author}
                    {post.authorTitle && (
                      <span className="font-normal text-ink-500">· {post.authorTitle}</span>
                    )}
                  </span>
                )}
                {post.publishedAt && (
                  <time
                    dateTime={isoDate(post.publishedAt)}
                    className="flex items-center gap-1.5"
                  >
                    <Calendar size={14} aria-hidden />
                    {formatDate(post.publishedAt)}
                  </time>
                )}
                {post.readMinutes ? (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} aria-hidden />
                    {post.readMinutes} min read
                  </span>
                ) : null}
              </div>
            </header>

            {post.bannerImage && (
              <figure className="mt-7">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink-100">
                  <Image
                    src={post.bannerImage}
                    alt={post.bannerAlt || post.title}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 760px"
                    quality={78}
                    className="object-cover"
                  />
                </div>
                {post.bannerAlt && (
                  <figcaption className="mt-2 text-xs text-ink-500">{post.bannerAlt}</figcaption>
                )}
              </figure>
            )}

            <KeyTakeaways
              paragraph={post.keyTakeaway}
              bullets={post.takeaways}
              className="mt-8"
            />

            {/* Mobile TOC */}
            {toc.length > 2 && (
              <details className="mt-8 rounded-2xl border border-ink-200 bg-ink-50 p-4 lg:hidden">
                <summary className="cursor-pointer text-sm font-bold text-ink-900">
                  On this page
                </summary>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-ink-600 hover:text-brand-700">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <div
              className="prose-trek mt-8"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />

            <MainSiteCta
              targetUrl={post.mainSiteUrl}
              tripTitle={null}
              headline={
                post.primaryAnchor
                  ? `Ready to go? ${post.primaryAnchor}`
                  : `Plan this trek with ${mainSite.name}`
              }
              className="mt-12"
            />

            {keywords.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-ink-200 pt-6">
                <Tag size={15} className="text-ink-400" aria-hidden />
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {(post.authorBio || post.author) && (
              <aside className="mt-10 flex flex-col gap-4 rounded-2xl border border-ink-200 bg-ink-50 p-5 sm:flex-row">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-brand-100">
                  {post.authorImage ? (
                    <Image
                      src={post.authorImage}
                      alt={post.author || "Author"}
                      fill
                      loading="lazy"
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-lg font-bold text-brand-700">
                      {(post.author || "TN").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                    Written by
                  </p>
                  <p className="mt-0.5 text-base font-bold text-ink-900">{post.author}</p>
                  {post.authorTitle && (
                    <p className="text-sm text-brand-700">{post.authorTitle}</p>
                  )}
                  {post.authorBio && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{post.authorBio}</p>
                  )}
                </div>
              </aside>
            )}

            {faqs.length > 0 && (
              <section id="faqs" className="mt-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                  Frequently asked questions
                </h2>
                <div className="mt-6">
                  <FaqAccordion faqs={faqs} />
                </div>
              </section>
            )}

            {relatedPosts.length > 0 && (
              <section className="mt-14 border-t border-ink-200 pt-10">
                <h2 className="text-2xl font-bold text-ink-900">Keep reading</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-3">
                  {relatedPosts.map((item) => (
                    <BlogCard key={item.id} post={item} className="h-full" />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* -------------------------- Sidebar ------------------------- */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {toc.length > 0 && (
                <div className="rounded-2xl border border-ink-200 bg-white p-5">
                  <TableOfContents items={toc} />
                </div>
              )}

              <MainSiteCta variant="compact" targetUrl={post.mainSiteUrl} />

              {relatedTrips.length > 0 && (
                <div className="rounded-2xl border border-ink-200 bg-white p-5">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
                    Featured trips on {mainSite.name}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {relatedTrips.map((trip) => (
                      <li key={trip.id}>
                        <Link
                          href={`/itinerary/${trip.slug}`}
                          className="group flex gap-3 rounded-xl p-1 transition hover:bg-ink-50"
                        >
                          {trip.bannerImage && (
                            <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                              <Image
                                src={trip.bannerImage}
                                alt=""
                                fill
                                loading="lazy"
                                sizes="64px"
                                className="object-cover"
                              />
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
                              {trip.title}
                            </span>
                            <span className="mt-0.5 block text-xs text-ink-500">
                              {trip.durationDays} days
                              {trip.priceFrom
                                ? ` · from ${formatPrice(trip.priceFrom, trip.currency)}`
                                : ""}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/itinerary"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2.5"
                  >
                    All itineraries
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>

        {relatedTrips.length > 0 && (
          <section className="mt-16 border-t border-ink-200 pt-12">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">Related treks</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} className="h-full" />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

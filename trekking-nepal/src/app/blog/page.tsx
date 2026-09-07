import type { Metadata } from "next";
import { getPublishedBlogs } from "@/lib/content";
import { BlogCard } from "@/components/site/blog-card";
import { SectionHeading } from "@/components/site/section";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { collectionPageSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

const TITLE = "Nepal Trekking Guides — Permits, Costs, Gear & Altitude Advice";
const DESCRIPTION =
  "Practical trekking guides written by licensed Nepali guides: permit rules, realistic budgets, packing lists, altitude sickness prevention and season-by-season trail conditions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/blog", type: "website" },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogs();
  const crumbs = [{ name: "Blog", href: "/blog" }];
  const [lead, ...rest] = posts;

  return (
    <>
      <JsonLd id="blog-breadcrumbs" data={breadcrumbSchema(crumbs)} />
      <JsonLd
        id="blog-collection"
        data={collectionPageSchema({
          name: TITLE,
          description: DESCRIPTION,
          url: "/blog",
          items: posts.map((post) => ({ name: post.title, url: `/blog/${post.slug}` })),
        })}
      />

      <div className="border-b border-ink-200 bg-ink-50">
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs items={crumbs} className="mb-6 text-ink-600" />
          <SectionHeading
            as="h1"
            eyebrow="Blog"
            title="Field notes from the Himalaya"
            description={DESCRIPTION}
          />
        </div>
      </div>

      <div className="container-page py-10 sm:py-14">
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink-300 p-12 text-center text-sm text-ink-500">
            No guides published yet. Add one from /admin.
          </p>
        ) : (
          <>
            {lead && (
              <div className="mb-10">
                <BlogCard post={lead} priority className="sm:grid sm:grid-cols-2 sm:items-stretch" />
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.id} post={post} className="h-full" />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

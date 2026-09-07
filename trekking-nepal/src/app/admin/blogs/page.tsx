import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader, StatusPill } from "@/components/admin/page-header";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const posts = await prisma.blog.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, title: true, slug: true, status: true, featured: true,
      author: true, updatedAt: true, publishedAt: true,
      region: { select: { name: true } },
      _count: { select: { faqs: true } },
    },
  });

  return (
    <>
      <AdminHeader
        title="Blog posts"
        description="Long-form guides. Each post carries BlogPosting + FAQPage schema and a key-takeaways box."
        action={{ href: "/admin/blogs/new", label: "New post" }}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {posts.length === 0 ? (
          <EmptyState href="/admin/blogs/new" label="Create your first blog post" />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Title</th>
                    <th className="px-4 py-3 font-bold">Region</th>
                    <th className="px-4 py-3 font-bold">Author</th>
                    <th className="px-4 py-3 font-bold">FAQs</th>
                    <th className="px-4 py-3 font-bold">Updated</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="transition hover:bg-ink-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/blogs/${post.id}`}
                          className="font-semibold text-ink-900 hover:text-brand-700"
                        >
                          {post.title}
                        </Link>
                        <span className="block text-xs text-ink-500">/blog/{post.slug}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-600">
                        {post.region?.name || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-600">
                        {post.author || "—"}
                      </td>
                      <td className="px-4 py-3 text-ink-600">{post._count.faqs}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-500">
                        {formatDate(post.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={post.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState({ href, label }: { href: string; label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-12 text-center">
      <p className="text-sm text-ink-500">Nothing here yet.</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
      >
        {label}
      </Link>
    </div>
  );
}

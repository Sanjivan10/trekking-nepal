import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, isoDate, cn } from "@/lib/utils";

export type BlogCardData = {
  slug: string;
  title: string;
  excerpt?: string | null;
  bannerImage?: string | null;
  bannerAlt?: string | null;
  author?: string | null;
  readMinutes?: number | null;
  publishedAt?: Date | string | null;
  region?: { name: string; slug: string } | null;
};

export function BlogCard({
  post,
  priority = false,
  compact = false,
  className,
}: {
  post: BlogCardData;
  priority?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-2xl border border-ink-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-ink-900/5",
        compact ? "flex-row gap-3 p-3" : "flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-ink-100",
          compact ? "h-20 w-24 rounded-xl" : "aspect-[16/9]",
        )}
      >
        {post.bannerImage ? (
          <Image
            src={post.bannerImage}
            alt={post.bannerAlt || post.title}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes={compact ? "96px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-ink-300">
            <FileText size={compact ? 20 : 32} aria-hidden />
          </div>
        )}
        {!compact && post.region && (
          <div className="absolute left-3 top-3">
            <Badge variant="dark">{post.region.name}</Badge>
          </div>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "min-w-0 py-0.5" : "p-4 sm:p-5")}>
        <h3
          className={cn(
            "font-bold leading-snug text-ink-900 transition group-hover:text-brand-700",
            compact ? "line-clamp-2 text-sm" : "text-[1.0625rem]",
          )}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>

        {!compact && post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600">{post.excerpt}</p>
        )}

        <div
          className={cn(
            "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500",
            compact ? "mt-1.5" : "mt-4 border-t border-ink-100 pt-3",
          )}
        >
          {post.publishedAt && (
            <time dateTime={isoDate(post.publishedAt)} className="flex items-center gap-1.5">
              <Calendar size={12} aria-hidden />
              {formatDate(post.publishedAt)}
            </time>
          )}
          {post.readMinutes ? (
            <span className="flex items-center gap-1.5">
              <Clock size={12} aria-hidden />
              {post.readMinutes} min read
            </span>
          ) : null}
          {!compact && post.author && <span className="font-medium text-ink-600">{post.author}</span>}
        </div>
      </div>
    </article>
  );
}

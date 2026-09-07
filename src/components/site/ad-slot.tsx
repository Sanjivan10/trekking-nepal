import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Advertisement / promotional banner slot.
 *
 * Renders nothing when no creative is configured, so pages never show an
 * empty box. Ad links are rel="sponsored nofollow" — the opposite of the
 * editorial backlinks, since paid placements must not pass equity.
 */
export function AdSlot({
  image,
  alt,
  href,
  label = "Sponsored",
  className,
  ratio = "wide",
}: {
  image?: string | null;
  alt?: string | null;
  href?: string | null;
  label?: string | null;
  className?: string;
  ratio?: "wide" | "leaderboard" | "box";
}) {
  if (!image?.trim()) return null;

  const ratioClass = {
    wide: "aspect-[16/5] sm:aspect-[1200/240]",
    leaderboard: "aspect-[8/1]",
    box: "aspect-[4/3]",
  }[ratio];

  const banner = (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-ink-200 bg-ink-100",
        ratioClass,
      )}
    >
      <Image
        src={image}
        alt={alt || "Advertisement"}
        fill
        loading="lazy"
        sizes="(max-width: 1024px) 100vw, 1200px"
        className="object-cover"
      />
      <span className="absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-white backdrop-blur">
        {label || "Sponsored"}
      </span>
    </div>
  );

  return (
    <aside
      aria-label="Advertisement"
      className={cn("not-prose", className)}
      data-ad-slot="true"
    >
      {href ? (
        <a href={href} target="_blank" rel="sponsored noopener nofollow" className="block">
          {banner}
        </a>
      ) : (
        banner
      )}
    </aside>
  );
}

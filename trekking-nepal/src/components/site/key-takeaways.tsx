import { Sparkles, Check } from "lucide-react";
import { splitLines } from "@/lib/utils";

/**
 * "Key Takeaways" / direct-answer box (AEO + GEO booster).
 *
 * Placed above the fold so answer engines lift a clean, factual summary.
 * Marked up as a <section> with an id so FAQ/answer extractors can anchor
 * to it, and the bullets are a real <ul> for structural parsing.
 */
export function KeyTakeaways({
  paragraph,
  bullets,
  title = "Key takeaways",
  className = "",
}: {
  paragraph?: string | null;
  bullets?: string | null;
  title?: string;
  className?: string;
}) {
  const items = splitLines(bullets);
  if (!paragraph?.trim() && items.length === 0) return null;

  return (
    <section
      id="key-takeaways"
      aria-labelledby="key-takeaways-heading"
      data-aeo="key-takeaways"
      className={`scroll-mt-28 overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-brand-200/70 bg-brand-100/50 px-4 py-2.5 sm:px-5">
        <Sparkles size={16} className="shrink-0 text-brand-700" aria-hidden />
        <h2
          id="key-takeaways-heading"
          className="text-sm font-bold uppercase tracking-wide text-brand-900"
        >
          {title}
        </h2>
      </div>

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        {paragraph?.trim() && (
          <p className="text-[0.975rem] leading-relaxed text-ink-800">
            <strong className="font-semibold text-ink-900">Short answer:</strong>{" "}
            {paragraph.trim()}
          </p>
        )}

        {items.length > 0 && (
          <ul className={paragraph?.trim() ? "mt-4 space-y-2.5" : "space-y-2.5"}>
            {items.map((item, index) => {
              // "Label: value" renders the label in bold for scannability.
              const splitAt = item.indexOf(":");
              const hasLabel = splitAt > 0 && splitAt < 42;
              return (
                <li key={index} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-ink-700">
                  <Check
                    size={16}
                    className="mt-1 shrink-0 text-brand-600"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <span>
                    {hasLabel ? (
                      <>
                        <strong className="font-semibold text-ink-900">
                          {item.slice(0, splitAt)}:
                        </strong>
                        {item.slice(splitAt + 1)}
                      </>
                    ) : (
                      item
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

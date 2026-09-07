import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Accessible star rating. Renders halves via a clipped overlay. */
export function Stars({
  rating,
  size = 16,
  className,
  showValue = false,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  const clamped = Math.max(0, Math.min(5, rating || 0));
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`Rated ${clamped.toFixed(1)} out of 5`}
    >
      <span className="relative inline-flex" style={{ lineHeight: 0 }}>
        <span className="inline-flex text-ink-200">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} aria-hidden />
          ))}
        </span>
        <span
          className="absolute inset-0 inline-flex overflow-hidden text-sun-500"
          style={{ width: `${(clamped / 5) * 100}%` }}
          aria-hidden
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} className="shrink-0" />
          ))}
        </span>
      </span>
      {showValue && (
        <span className="text-sm font-semibold text-ink-900">{clamped.toFixed(1)}</span>
      )}
    </span>
  );
}

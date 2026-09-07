import { cn } from "@/lib/utils";

const variants = {
  brand: "bg-brand-50 text-brand-800 ring-brand-200",
  neutral: "bg-ink-100 text-ink-700 ring-ink-200",
  sun: "bg-amber-50 text-amber-800 ring-amber-200",
  dark: "bg-ink-900/80 text-white ring-white/20 backdrop-blur",
} as const;

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

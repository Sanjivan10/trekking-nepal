import { Users, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export type TierRow = { id: string; label: string; price: number; note: string };

/**
 * Group discount table. The per-person price drops as the group grows, so the
 * cheapest row is highlighted as the headline "from" price.
 */
export function PriceTiers({
  tiers,
  currency,
  priceFrom,
  priceRegular,
  title = "Group discount pricing",
}: {
  tiers: TierRow[];
  currency: string;
  priceFrom: number;
  priceRegular?: number;
  title?: string;
}) {
  if (!tiers.length) return null;
  const cheapest = Math.min(...tiers.map((t) => t.price));

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink-200 bg-ink-50 px-5 py-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-700">
            <Users size={15} className="text-brand-600" aria-hidden />
            {title}
          </h3>
          <p className="mt-1 text-xs text-ink-500">Price per person. Bigger group, lower price.</p>
        </div>
        <p className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-ink-900">
            {formatPrice(priceFrom, currency)}
          </span>
          {priceRegular ? (
            <span className="text-sm font-medium text-ink-400 line-through">
              {formatPrice(priceRegular, currency)}
            </span>
          ) : null}
        </p>
      </div>

      <table className="w-full text-sm">
        <caption className="sr-only">Group discount pricing per person</caption>
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-ink-500">
            <th scope="col" className="px-5 py-2.5 font-bold">No. of travellers</th>
            <th scope="col" className="px-5 py-2.5 text-right font-bold">Price per person</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {tiers.map((tier) => {
            const best = tier.price === cheapest;
            return (
              <tr key={tier.id} className={best ? "bg-brand-50/60" : undefined}>
                <th scope="row" className="px-5 py-3 text-left font-semibold text-ink-800">
                  <span className="flex items-center gap-2">
                    {tier.label}
                    {best && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                        <Check size={9} strokeWidth={3} aria-hidden />
                        Best value
                      </span>
                    )}
                  </span>
                  {tier.note && <span className="mt-0.5 block text-xs font-normal text-ink-500">{tier.note}</span>}
                </th>
                <td className="px-5 py-3 text-right">
                  <span className={best ? "text-base font-extrabold text-brand-700" : "font-bold text-ink-900"}>
                    {formatPrice(tier.price, currency)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

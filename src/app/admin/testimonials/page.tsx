import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/page-header";
import { TestimonialManager } from "@/components/admin/testimonial-manager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const rows = await prisma.testimonial
    .findMany({ orderBy: [{ featured: "desc" }, { position: "asc" }] })
    .catch(() => []);

  return (
    <>
      <AdminHeader
        title="Testimonials"
        description="Reviews from Google and TripAdvisor, shown on the homepage. Paste new ones here — TripAdvisor blocks automated import, so those are added by hand."
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm leading-relaxed text-amber-900">
          <strong className="font-bold">Attribution matters.</strong> These are other people&apos;s
          words on other people&apos;s platforms. Each card shows its source and links back to the
          original, and they are deliberately kept out of the site&apos;s rating schema — Google&apos;s
          review-snippet policy forbids marking up third-party reviews as your own, and doing it
          risks a manual action.
        </div>
        <TestimonialManager initial={rows} />
      </div>
    </>
  );
}

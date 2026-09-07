import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/page-header";
import { BacklinkManager } from "@/components/admin/backlink-manager";
import { mainSite } from "@/lib/mainSite";

export const dynamic = "force-dynamic";

export default async function AdminBacklinksPage() {
  const rules = await prisma.backlinkTarget.findMany({
    orderBy: [{ priority: "desc" }, { keyword: "asc" }],
  });

  return (
    <>
      <AdminHeader
        title="Backlink engine"
        description={`Keyword rules that convert in-body phrases into dofollow links to ${mainSite.name}. Per-post overrides live on each itinerary and blog post under "Linking & backlinks".`}
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm leading-relaxed text-amber-900">
          <strong className="font-bold">Keep links editorial.</strong> These are dofollow links
          across domains you own. Google&apos;s link-spam policy targets large-scale, keyword-optimised
          cross-site linking, so favour a small number of genuinely relevant rules, vary the anchor
          text, and let context justify each link.
        </div>
        <BacklinkManager initial={rules} />
      </div>
    </>
  );
}

import { prisma } from "@/lib/prisma";
import { getSettingsForAdmin } from "@/lib/settings";
import { FooterForm } from "@/components/admin/footer-form";

export const dynamic = "force-dynamic";

export default async function AdminFooterPage() {
  const [settings, regions, trips] = await Promise.all([
    getSettingsForAdmin(),
    prisma.region.findMany({
      where: { status: "published" },
      orderBy: [{ position: "asc" }, { name: "asc" }],
      select: { slug: true, name: true },
    }).catch(() => []),
    prisma.itinerary.findMany({
      where: { status: "published" },
      orderBy: [{ featured: "desc" }, { ratingValue: "desc" }],
      take: 5,
      select: { slug: true, title: true },
    }).catch(() => []),
  ]);

  return <FooterForm initial={settings} preview={{ regions, trips }} />;
}

import { getSettingsForAdmin } from "@/lib/settings";
import { getRegions } from "@/lib/content";
import { HeroForm } from "@/components/admin/hero-form";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const [settings, regions] = await Promise.all([getSettingsForAdmin(), getRegions()]);
  return <HeroForm initial={settings} regions={regions.map((r) => ({ slug: r.slug, name: r.name }))} />;
}

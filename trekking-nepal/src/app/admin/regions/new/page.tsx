import { RegionForm } from "@/components/admin/region-form";
import { emptyRegion } from "@/lib/drafts";

export default function NewRegionPage() {
  return <RegionForm initial={emptyRegion()} />;
}

import { prisma } from "@/lib/prisma";
import { ItineraryForm } from "@/components/admin/itinerary-form";
import { emptyItinerary } from "@/lib/drafts";

export const dynamic = "force-dynamic";

export default async function NewItineraryPage() {
  const regions = await prisma.region.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return <ItineraryForm initial={emptyItinerary()} regions={regions} />;
}

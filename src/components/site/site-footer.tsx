import { FooterView, type FooterData } from "./footer-view";
import type { Settings } from "@/lib/settings";

/** Server wrapper — settings and nav data are fetched in the root layout. */
export function SiteFooter({
  settings,
  regions = [],
  trips = [],
}: {
  settings: Settings;
  regions?: FooterData["regions"];
  trips?: FooterData["trips"];
}) {
  return <FooterView settings={settings} data={{ regions, trips }} />;
}

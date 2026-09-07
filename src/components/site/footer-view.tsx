import Link from "next/link";
import {
  Mountain, Mail, Phone, MapPin, ExternalLink, ArrowRight,
  Facebook, Instagram, Youtube, Twitter,
} from "lucide-react";
import { MountainScene } from "./mountain-scene";
import { mainSite } from "@/lib/mainSite";
import type { Settings } from "@/lib/settings";

export type FooterData = {
  regions: Array<{ slug: string; name: string }>;
  trips: Array<{ slug: string; title: string }>;
};

/**
 * Presentational footer. Takes settings as props and holds no data access,
 * so both the live site (server) and the admin live preview (client) can
 * render exactly the same markup.
 */
export function FooterView({
  settings: s,
  data,
  preview = false,
}: {
  settings: Settings;
  data: FooterData;
  preview?: boolean;
}) {
  const socials = [
    { href: s.socialFacebook, Icon: Facebook, label: "Facebook" },
    { href: s.socialInstagram, Icon: Instagram, label: "Instagram" },
    { href: s.socialYoutube, Icon: Youtube, label: "YouTube" },
    { href: s.socialX, Icon: Twitter, label: "X" },
  ].filter((item) => item.href?.trim());

  const hasContact =
    s.showContact && (s.contactAddress || s.contactEmail || s.contactPhone);

  const headingStyle: React.CSSProperties = {
    color: s.footerHeading,
    fontSize: `${s.footerHeadingSize}px`,
  };

  // In preview, links must not navigate away from the admin screen.
  const A = ({ href, children, external, ...rest }: any) =>
    preview || external || /^https?:\/\//.test(href) ? (
      <a
        href={preview ? undefined : href}
        target={external || /^https?:\/\//.test(href) ? "_blank" : undefined}
        rel={external || /^https?:\/\//.test(href) ? "noopener" : undefined}
        {...rest}
      >
        {children}
      </a>
    ) : (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );

  return (
    <footer
      style={{
        background:
          s.footerBg === s.footerBgTo
            ? s.footerBg
            : `linear-gradient(180deg, ${s.footerBg} 0%, ${s.footerBgTo} 100%)`,
        color: s.footerText,
        fontSize: `${s.footerFontSize}px`,
        borderTopLeftRadius: s.footerRadius,
        borderTopRightRadius: s.footerRadius,
        overflow: "hidden",
      }}
      className={preview ? "" : "mt-20"}
    >
      {s.showMountains && (
        <MountainScene
          mountainColor={s.mountainColor}
          mountainColor2={s.mountainColor2}
          snowColor={s.snowColor}
          trekkerColor={s.trekkerColor}
          height={s.sceneHeight}
          showTrekkers={s.showTrekkers}
          showPrayerFlags={s.showPrayerFlags}
          showStars={s.showStars}
        />
      )}

      <div
        style={{ maxWidth: s.footerMaxWidth, paddingTop: s.footerPaddingY, paddingBottom: 20 }}
        className="mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* ---------------------------- CTA ---------------------------- */}
        {s.showCta && s.ctaTitle?.trim() && (
          <div
            className="mb-12 flex flex-col gap-4 rounded-2xl px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7"
            style={{ border: `1px solid ${s.footerBorder}`, background: "rgba(255,255,255,0.03)" }}
          >
            <div className="max-w-xl">
              <p className="font-bold leading-snug" style={{ color: s.footerHeading, fontSize: `${s.footerFontSize + 5}px` }}>
                {s.ctaTitle}
              </p>
              {s.ctaText?.trim() && <p className="mt-1.5 leading-relaxed">{s.ctaText}</p>}
            </div>
            {s.ctaLabel?.trim() && (
              <A
                href={s.ctaUrl || "/itinerary"}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 font-bold transition hover:opacity-90"
                style={{ background: s.footerAccent, color: s.footerBg }}
              >
                {s.ctaLabel}
                <ArrowRight size={15} aria-hidden />
              </A>
            )}
          </div>
        )}

        {/* --------------------------- Columns -------------------------- */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <A href="/" className="inline-flex items-center gap-2" style={{ color: s.footerHeading }}>
              <span
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{ background: s.footerAccent, color: s.footerBg }}
              >
                <Mountain size={19} strokeWidth={2.3} aria-hidden />
              </span>
              <span className="text-[1.0625rem] font-extrabold tracking-tight">
                Trekking<span style={{ color: s.footerAccent }}>Nepal</span>
              </span>
            </A>

            {s.footerTagline?.trim() && (
              <p className="mt-4 max-w-xs leading-relaxed">{s.footerTagline}</p>
            )}
            {s.footerAbout?.trim() && (
              <p className="mt-3 max-w-xs leading-relaxed opacity-80">{s.footerAbout}</p>
            )}

            {hasContact && (
              <ul className="mt-5 space-y-2">
                {s.contactAddress?.trim() && (
                  <li className="flex items-start gap-2">
                    <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: s.footerAccent }} aria-hidden />
                    {s.contactAddress}
                  </li>
                )}
                {s.contactEmail?.trim() && (
                  <li className="flex items-center gap-2">
                    <Mail size={15} className="shrink-0" style={{ color: s.footerAccent }} aria-hidden />
                    <a href={preview ? undefined : `mailto:${s.contactEmail}`} className="transition hover:opacity-80">
                      {s.contactEmail}
                    </a>
                  </li>
                )}
                {s.contactPhone?.trim() && (
                  <li className="flex items-center gap-2">
                    <Phone size={15} className="shrink-0" style={{ color: s.footerAccent }} aria-hidden />
                    <a href={preview ? undefined : `tel:${s.contactPhone.replace(/\s/g, "")}`} className="transition hover:opacity-80">
                      {s.contactPhone}
                    </a>
                  </li>
                )}
              </ul>
            )}

            {socials.length > 0 && (
              <ul className="mt-5 flex gap-2">
                {socials.map(({ href, Icon, label }) => (
                  <li key={label}>
                    <a
                      href={preview ? undefined : href}
                      target="_blank"
                      rel="noopener"
                      aria-label={label}
                      className="grid h-9 w-9 place-items-center rounded-lg transition hover:opacity-80"
                      style={{ border: `1px solid ${s.footerBorder}` }}
                    >
                      <Icon size={16} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Custom columns from the CMS, else sensible defaults */}
          {s.columns.filter((c) => c.visible !== false).length > 0 ? (
            s.columns
              .filter((c) => c.visible !== false)
              .map((column) => (
                <div key={column.id ?? column.title}>
                  <h2 className="font-bold uppercase tracking-wide" style={headingStyle}>
                    {column.title}
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {column.links.map((link, i) => (
                      <li key={link.id ?? i}>
                        <A href={link.href} external={link.external} className="transition hover:opacity-75">
                          {link.label}
                        </A>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
          ) : (
            <>
              <div>
                <h2 className="font-bold uppercase tracking-wide" style={headingStyle}>
                  Trekking regions
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {data.regions.map((region) => (
                    <li key={region.slug}>
                      <A href={`/region/${region.slug}`} className="transition hover:opacity-75">
                        {region.name}
                      </A>
                    </li>
                  ))}
                  <li>
                    <A href="/itinerary" className="transition hover:opacity-75">All itineraries</A>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-bold uppercase tracking-wide" style={headingStyle}>
                  Popular treks
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {data.trips.map((trip) => (
                    <li key={trip.slug}>
                      <A href={`/itinerary/${trip.slug}`} className="transition hover:opacity-75">
                        {trip.title}
                      </A>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-bold uppercase tracking-wide" style={headingStyle}>
                  Resources
                </h2>
                <ul className="mt-4 space-y-2.5">
                  <li><A href="/blog" className="transition hover:opacity-75">Blog</A></li>
                  <li><A href="/region" className="transition hover:opacity-75">Regions</A></li>
                  <li><A href="/sitemap.xml" className="transition hover:opacity-75">Sitemap</A></li>
                  <li><A href="/llms.txt" className="transition hover:opacity-75">llms.txt</A></li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ------------------------- Bottom bar ------------------------- */}
      <div style={{ borderTop: `1px solid ${s.footerBorder}` }}>
        <div
          style={{ maxWidth: s.footerMaxWidth }}
          className="mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs sm:flex-row sm:px-6 lg:px-8"
        >
          <p>
            {s.copyrightText?.trim()
              ? s.copyrightText.replace("{year}", String(new Date().getFullYear()))
              : `© ${new Date().getFullYear()} Trekking Nepal. All rights reserved.`}
          </p>
          {s.showCredit && (
            <p>
              Official bookings via{" "}
              <a
                href={preview ? undefined : mainSite.url}
                rel="noopener"
                target="_blank"
                className="font-semibold underline underline-offset-2"
                style={{ color: s.footerAccent }}
              >
                {mainSite.name}
              </a>
              <ExternalLink size={11} className="ml-1 inline" aria-hidden />
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

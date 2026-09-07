import Link from "next/link";
import { Mountain, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { site } from "@/lib/site";
import { mainSite } from "@/lib/mainSite";

export function SiteFooter({
  regions = [],
  trips = [],
}: {
  regions?: Array<{ slug: string; name: string }>;
  trips?: Array<{ slug: string; title: string }>;
}) {
  return (
    <footer className="mt-20 border-t border-ink-200 bg-ink-950 text-ink-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600">
              <Mountain size={19} strokeWidth={2.3} aria-hidden />
            </span>
            <span className="text-[1.0625rem] font-extrabold tracking-tight">
              Trekking<span className="text-brand-400">Nepal</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.description}</p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-brand-400" aria-hidden />
              {site.address.street}, {site.address.city}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="shrink-0 text-brand-400" aria-hidden />
              <a href={`mailto:${site.email}`} className="transition hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="shrink-0 text-brand-400" aria-hidden />
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="transition hover:text-white">
                {site.phone}
              </a>
            </li>
          </ul>
        </div>

        <FooterColumn title="Trekking regions">
          {regions.map((region) => (
            <FooterLink key={region.slug} href={`/region/${region.slug}`}>
              {region.name}
            </FooterLink>
          ))}
          <FooterLink href="/itinerary">All itineraries</FooterLink>
        </FooterColumn>

        <FooterColumn title="Popular treks">
          {trips.map((trip) => (
            <FooterLink key={trip.slug} href={`/itinerary/${trip.slug}`}>
              {trip.title}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Resources">
          <FooterLink href="/blog">Trekking guides</FooterLink>
          <FooterLink href="/itinerary">Compare treks</FooterLink>
          <FooterLink href="/llms.txt">llms.txt</FooterLink>
          <FooterLink href="/sitemap.xml">Sitemap</FooterLink>
          <li className="pt-2">
            {/* Sitewide dofollow link to the main booking site. */}
            <a
              href={mainSite.url}
              rel="noopener"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
            >
              Book on {mainSite.name}
              <ExternalLink size={13} aria-hidden />
            </a>
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>
            Official bookings via{" "}
            <a
              href={mainSite.url}
              rel="noopener"
              target="_blank"
              className="font-semibold text-brand-400 underline underline-offset-2 transition hover:text-brand-300"
            >
              {mainSite.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition hover:text-white">
        {children}
      </Link>
    </li>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormShell, Panel } from "./form-shell";
import { Field, Input, Textarea, Select, TagInput, ImageField, Toggle, CharCount } from "./fields";
import { FaqBuilder, DayBuilder, ReviewBuilder } from "./builders";
import type { ItineraryDraft } from "@/lib/drafts";

export type { ItineraryDraft };
import { slugify } from "@/lib/utils";
import { mainSite } from "@/lib/mainSite";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "days", label: "Day-by-day" },
  { id: "cost", label: "Cost & media" },
  { id: "seo", label: "SEO & AEO" },
  { id: "faqs", label: "FAQs" },
  { id: "reviews", label: "Reviews" },
  { id: "linking", label: "Linking & backlinks" },
];

const DIFFICULTIES = ["Easy", "Moderate", "Challenging", "Strenuous", "Extreme"];

export function ItineraryForm({
  initial,
  regions,
}: {
  initial: ItineraryDraft;
  regions: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<ItineraryDraft>(initial);
  const [tab, setTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));

  const set = <K extends keyof ItineraryDraft>(key: K, value: ItineraryDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  async function save() {
    if (!draft.title.trim()) {
      setError("A title is required.");
      setTab("overview");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...draft, slug: draft.slug || slugify(draft.title) };
      const response = await fetch(
        draft.id ? `/api/admin/itineraries/${draft.id}` : "/api/admin/itineraries",
        {
          method: draft.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Save failed");
      setSaved(true);
      if (!draft.id) router.replace(`/admin/itineraries/${json.id}`);
      else router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!draft.id) return;
    await fetch(`/api/admin/itineraries/${draft.id}`, { method: "DELETE" });
    router.replace("/admin/itineraries");
    router.refresh();
  }

  return (
    <FormShell
      title={draft.title || "New itinerary"}
      backHref="/admin/itineraries"
      tabs={TABS}
      activeTab={tab}
      onTabChange={setTab}
      status={draft.status}
      onStatusChange={(value) => set("status", value)}
      onSave={save}
      onDelete={draft.id ? remove : undefined}
      previewHref={draft.slug ? `/itinerary/${draft.slug}` : undefined}
      saving={saving}
      saved={saved}
      error={error}
    >
      {/* ----------------------------- Overview ----------------------------- */}
      {tab === "overview" && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            <Panel>
              <Field label="Trek title" required>
                <Input
                  value={draft.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!slugTouched) set("slug", slugify(e.target.value));
                  }}
                  placeholder="Manaslu Circuit Trek"
                />
              </Field>
              <Field label="Slug" hint={`URL: /itinerary/${draft.slug || "your-slug"}`}>
                <Input
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                />
              </Field>
              <Field label="Trip overview" hint="Markdown. Use ## headings for structure.">
                <Textarea
                  rows={14}
                  value={draft.overview}
                  onChange={(e) => set("overview", e.target.value)}
                  className="font-mono text-[0.8125rem]"
                />
              </Field>
              <Field label="Trip highlights" hint="One per line.">
                <Textarea
                  rows={6}
                  value={draft.highlights}
                  onChange={(e) => set("highlights", e.target.value)}
                  placeholder={"Cross the 5,106 m Larke La pass\nWalk through the restricted Nubri valley"}
                />
              </Field>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Trip specs" description="These fill the quick-specs ribbon and the TouristTrip schema.">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Days">
                  <Input
                    type="number"
                    min={0}
                    value={draft.durationDays}
                    onChange={(e) => set("durationDays", Number(e.target.value) || 0)}
                  />
                </Field>
                <Field label="Nights">
                  <Input
                    type="number"
                    min={0}
                    value={draft.durationNights}
                    onChange={(e) => set("durationNights", Number(e.target.value) || 0)}
                  />
                </Field>
              </div>
              <Field label="Max altitude">
                <Input
                  value={draft.maxAltitude}
                  onChange={(e) => set("maxAltitude", e.target.value)}
                  placeholder="5,106 m / 16,752 ft"
                />
              </Field>
              <Field label="Difficulty">
                <Select value={draft.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
                  {DIFFICULTIES.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Best season">
                <Input
                  value={draft.bestSeason}
                  onChange={(e) => set("bestSeason", e.target.value)}
                  placeholder="March–May, September–November"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start point">
                  <Input value={draft.startPoint} onChange={(e) => set("startPoint", e.target.value)} />
                </Field>
                <Field label="End point">
                  <Input value={draft.endPoint} onChange={(e) => set("endPoint", e.target.value)} />
                </Field>
              </div>
              <Field label="Group size">
                <Input
                  value={draft.groupSize}
                  onChange={(e) => set("groupSize", e.target.value)}
                  placeholder="2–12 trekkers"
                />
              </Field>
              <Field label="Accommodation">
                <Input
                  value={draft.accommodation}
                  onChange={(e) => set("accommodation", e.target.value)}
                  placeholder="Teahouse / lodge"
                />
              </Field>
              <Field label="Transportation">
                <Input
                  value={draft.transportation}
                  onChange={(e) => set("transportation", e.target.value)}
                  placeholder="Private jeep and domestic flight"
                />
              </Field>
            </Panel>

            <Panel title="Options">
              <Field label="Region">
                <Select value={draft.regionId} onChange={(e) => set("regionId", e.target.value)}>
                  <option value="">No region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Toggle
                checked={draft.featured}
                onChange={(value) => set("featured", value)}
                label="Featured"
                description="Pins this trek to the top of listings and the homepage."
              />
            </Panel>
          </div>
        </div>
      )}

      {/* ----------------------------- Day builder --------------------------- */}
      {tab === "days" && (
        <Panel title="Day-by-day itinerary">
          <DayBuilder items={draft.days} onChange={(items) => set("days", items)} />
        </Panel>
      )}

      {/* ---------------------------- Cost & media --------------------------- */}
      {tab === "cost" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Pricing">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field label="From">
                <Input
                  type="number"
                  min={0}
                  value={draft.priceFrom}
                  onChange={(e) => set("priceFrom", Number(e.target.value) || 0)}
                />
              </Field>
              <Field label="To">
                <Input
                  type="number"
                  min={0}
                  value={draft.priceTo}
                  onChange={(e) => set("priceTo", Number(e.target.value) || 0)}
                />
              </Field>
              <Field label="Currency">
                <Input
                  value={draft.currency}
                  onChange={(e) => set("currency", e.target.value.toUpperCase())}
                  maxLength={3}
                />
              </Field>
            </div>
            <Field label="Cost includes" hint="One per line.">
              <Textarea
                rows={8}
                value={draft.includes}
                onChange={(e) => set("includes", e.target.value)}
                placeholder={"All ground transportation\nLicensed English-speaking guide"}
              />
            </Field>
            <Field label="Cost excludes" hint="One per line.">
              <Textarea
                rows={6}
                value={draft.excludes}
                onChange={(e) => set("excludes", e.target.value)}
                placeholder={"International flights\nTravel insurance"}
              />
            </Field>
          </Panel>

          <div className="space-y-5">
            <Panel title="Hero & banner">
              <ImageField
                label="Hero image (full-width)"
                value={draft.heroImage}
                onChange={(value) => set("heroImage", value)}
                hint="High-resolution — this is the LCP image, so use at least 2000 px wide."
              />
              <ImageField
                label="Card banner"
                value={draft.bannerImage}
                onChange={(value) => set("bannerImage", value)}
                alt={draft.bannerAlt}
                onAltChange={(value) => set("bannerAlt", value)}
                hint="Used on listing cards and as the OG image."
              />
              <Field label="Gallery" hint="One image URL per line.">
                <Textarea
                  rows={5}
                  value={draft.gallery}
                  onChange={(e) => set("gallery", e.target.value)}
                  className="font-mono text-[0.8125rem]"
                />
              </Field>
            </Panel>

            <Panel
              title="Advertisement banner slot"
              description="Displayed beside the hero on desktop and below it on mobile. Ad links are rel=sponsored nofollow, so they never pass equity."
            >
              <ImageField
                label="Ad creative"
                value={draft.adImage}
                onChange={(value) => set("adImage", value)}
                alt={draft.adAlt}
                onAltChange={(value) => set("adAlt", value)}
              />
              <Field label="Ad click-through URL">
                <Input value={draft.adLink} onChange={(e) => set("adLink", e.target.value)} />
              </Field>
              <Field label="Ad label">
                <Input
                  value={draft.adLabel}
                  onChange={(e) => set("adLabel", e.target.value)}
                  placeholder="Sponsored"
                />
              </Field>
            </Panel>
          </div>
        </div>
      )}

      {/* -------------------------------- SEO -------------------------------- */}
      {tab === "seo" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Search metadata">
            <Field label="Meta title" hint="50–60 characters.">
              <Input value={draft.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
              <div className="mt-1 flex justify-end">
                <CharCount value={draft.metaTitle} ideal={50} max={60} />
              </div>
            </Field>
            <Field label="Meta description" hint="140–160 characters.">
              <Textarea
                rows={3}
                value={draft.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
              />
              <div className="mt-1 flex justify-end">
                <CharCount value={draft.metaDescription} ideal={140} max={160} />
              </div>
            </Field>
            <Field label="Target keywords">
              <TagInput
                value={draft.keywords}
                onChange={(value) => set("keywords", value)}
                placeholder="manaslu circuit trek"
              />
            </Field>
            <Field label="Canonical URL">
              <Input
                value={draft.canonicalUrl}
                onChange={(e) => set("canonicalUrl", e.target.value)}
              />
            </Field>
          </Panel>

          <Panel
            title="Key takeaways (AEO / GEO)"
            description="The direct-answer box above the fold. Answer engines quote this — keep it factual and specific."
          >
            <Field label="Direct answer paragraph">
              <Textarea
                rows={4}
                value={draft.keyTakeaway}
                onChange={(e) => set("keyTakeaway", e.target.value)}
                placeholder="The Manaslu Circuit Trek is a 14-day teahouse trek around the world's eighth-highest mountain, crossing the 5,106 m Larke La pass…"
              />
            </Field>
            <Field
              label="Bullet points"
              hint={'One per line. "Label: value" bolds the label.'}
            >
              <Textarea
                rows={8}
                value={draft.takeaways}
                onChange={(e) => set("takeaways", e.target.value)}
                className="font-mono text-[0.8125rem]"
                placeholder={"Best time: March–May and September–November\nTotal cost: USD 1,300–1,900 per person\nPermits: Restricted Area Permit, MCAP and ACAP required"}
              />
            </Field>
          </Panel>
        </div>
      )}

      {tab === "faqs" && (
        <Panel
          title="FAQ builder"
          description="Powers the FAQPage JSON-LD — the single highest-leverage block for AI citation."
        >
          <FaqBuilder items={draft.faqs} onChange={(items) => set("faqs", items)} />
        </Panel>
      )}

      {tab === "reviews" && (
        <Panel title="Reviews & aggregate rating">
          <ReviewBuilder items={draft.reviews} onChange={(items) => set("reviews", items)} />
        </Panel>
      )}

      {/* ----------------------------- Linking ------------------------------ */}
      {tab === "linking" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel
            title="Internal linking entities"
            description="Shared tags drive the related-trips and related-guides modules across the site."
          >
            <Field label="Entity tags">
              <TagInput
                value={draft.entityTags}
                onChange={(value) => set("entityTags", value)}
                placeholder="Manaslu, Larke La, Restricted Area"
              />
            </Field>
          </Panel>

          <Panel
            title={`Backlink controller → ${mainSite.name}`}
            description="Sets the hero CTA target and the in-body dofollow link for this trek."
          >
            <Toggle
              checked={draft.backlinksEnabled}
              onChange={(value) => set("backlinksEnabled", value)}
              label="Enable backlink injection"
            />
            <Field
              label="Target main-site URL"
              hint={`Defaults to ${mainSite.url}/<slug> when left empty.`}
            >
              <Input
                value={draft.mainSiteUrl}
                onChange={(e) => set("mainSiteUrl", e.target.value)}
                placeholder={`${mainSite.url}/trip/manaslu-circuit-trek`}
              />
            </Field>
            <Field label="Primary anchor text">
              <Input
                value={draft.primaryAnchor}
                onChange={(e) => set("primaryAnchor", e.target.value)}
                placeholder="book the official Manaslu trek"
              />
            </Field>
            <Field label="Anchor variations">
              <TagInput
                value={draft.secondaryAnchors}
                onChange={(value) => set("secondaryAnchors", value)}
              />
            </Field>
            <Field label="CTA headline">
              <Input
                value={draft.ctaHeadline}
                onChange={(e) => set("ctaHeadline", e.target.value)}
                placeholder="Book the official Manaslu Circuit Trek"
              />
            </Field>
            <Field label="CTA body text">
              <Textarea
                rows={3}
                value={draft.ctaText}
                onChange={(e) => set("ctaText", e.target.value)}
              />
            </Field>
          </Panel>
        </div>
      )}
    </FormShell>
  );
}

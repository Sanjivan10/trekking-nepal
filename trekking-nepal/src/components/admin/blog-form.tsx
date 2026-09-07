"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormShell, Panel } from "./form-shell";
import { Field, Input, Textarea, Select, TagInput, ImageField, Toggle, CharCount } from "./fields";
import { FaqBuilder } from "./builders";
import type { BlogDraft } from "@/lib/drafts";

export type { BlogDraft };
import { slugify, readingTime } from "@/lib/utils";
import { mainSite } from "@/lib/mainSite";

const TABS = [
  { id: "content", label: "Content" },
  { id: "seo", label: "SEO & AEO" },
  { id: "faqs", label: "FAQs" },
  { id: "linking", label: "Linking & backlinks" },
];

export function BlogForm({
  initial,
  regions,
}: {
  initial: BlogDraft;
  regions: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<BlogDraft>(initial);
  const [tab, setTab] = useState("content");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));

  const set = <K extends keyof BlogDraft>(key: K, value: BlogDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  async function save() {
    if (!draft.title.trim()) {
      setError("A title is required.");
      setTab("content");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...draft,
        slug: draft.slug || slugify(draft.title),
        readMinutes: draft.readMinutes || readingTime(draft.content),
      };
      const response = await fetch(
        draft.id ? `/api/admin/blogs/${draft.id}` : "/api/admin/blogs",
        {
          method: draft.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Save failed");
      setSaved(true);
      if (!draft.id) router.replace(`/admin/blogs/${json.id}`);
      else router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!draft.id) return;
    await fetch(`/api/admin/blogs/${draft.id}`, { method: "DELETE" });
    router.replace("/admin/blogs");
    router.refresh();
  }

  return (
    <FormShell
      title={draft.title || "New blog post"}
      backHref="/admin/blogs"
      tabs={TABS}
      activeTab={tab}
      onTabChange={setTab}
      status={draft.status}
      onStatusChange={(value) => set("status", value)}
      onSave={save}
      onDelete={draft.id ? remove : undefined}
      previewHref={draft.slug ? `/blog/${draft.slug}` : undefined}
      saving={saving}
      saved={saved}
      error={error}
    >
      {/* ----------------------------- Content ----------------------------- */}
      {tab === "content" && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            <Panel>
              <Field label="Title" required>
                <Input
                  value={draft.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!slugTouched) set("slug", slugify(e.target.value));
                  }}
                  placeholder="Everest Base Camp Trek: the complete 2026 guide"
                />
              </Field>

              <Field label="Slug" hint={`URL: /blog/${draft.slug || "your-slug"}`}>
                <Input
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                />
              </Field>

              <Field label="Excerpt" hint="One or two sentences. Shown on listing cards.">
                <Textarea
                  rows={2}
                  value={draft.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                />
              </Field>

              <Field
                label="Content"
                hint="Markdown. Use ## headings — they become the table of contents automatically. Tables are supported and scroll on mobile."
              >
                <Textarea
                  rows={24}
                  value={draft.content}
                  onChange={(e) => set("content", e.target.value)}
                  className="font-mono text-[0.8125rem]"
                  placeholder={"## Who this guide is for\n\nThe Everest Base Camp trek is…"}
                />
              </Field>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Banner image">
              <ImageField
                label="Banner URL"
                value={draft.bannerImage}
                onChange={(value) => set("bannerImage", value)}
                alt={draft.bannerAlt}
                onAltChange={(value) => set("bannerAlt", value)}
                hint="Used for the hero, OG image and BlogPosting schema."
              />
            </Panel>

            <Panel title="Author">
              <Field label="Name">
                <Input value={draft.author} onChange={(e) => set("author", e.target.value)} />
              </Field>
              <Field label="Role / title">
                <Input
                  value={draft.authorTitle}
                  onChange={(e) => set("authorTitle", e.target.value)}
                  placeholder="Lead trekking guide"
                />
              </Field>
              <Field label="Bio" hint="Shown in the author box. Builds E-E-A-T signals.">
                <Textarea
                  rows={3}
                  value={draft.authorBio}
                  onChange={(e) => set("authorBio", e.target.value)}
                />
              </Field>
              <ImageField
                label="Photo"
                value={draft.authorImage}
                onChange={(value) => set("authorImage", value)}
              />
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
              <Field label="Read time (minutes)" hint="Leave 0 to calculate automatically.">
                <Input
                  type="number"
                  min={0}
                  value={draft.readMinutes}
                  onChange={(e) => set("readMinutes", Number(e.target.value) || 0)}
                />
              </Field>
              <Toggle
                checked={draft.featured}
                onChange={(value) => set("featured", value)}
                label="Featured"
                description="Pins this post to the top of listings."
              />
            </Panel>
          </div>
        </div>
      )}

      {/* ------------------------------- SEO ------------------------------- */}
      {tab === "seo" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Search metadata" description="What Google shows in the results page.">
            <Field label="Meta title" hint="Aim for 50–60 characters. Falls back to the post title.">
              <Input value={draft.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
              <div className="mt-1 flex justify-end">
                <CharCount value={draft.metaTitle} ideal={50} max={60} />
              </div>
            </Field>

            <Field label="Meta description" hint="Aim for 140–160 characters, with the primary keyword early.">
              <Textarea
                rows={3}
                value={draft.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
              />
              <div className="mt-1 flex justify-end">
                <CharCount value={draft.metaDescription} ideal={140} max={160} />
              </div>
            </Field>

            <Field label="Canonical URL" hint="Only set this if the content is published elsewhere first.">
              <Input
                value={draft.canonicalUrl}
                onChange={(e) => set("canonicalUrl", e.target.value)}
                placeholder="https://…"
              />
            </Field>
          </Panel>

          <Panel title="Keywords" description="Unlimited tags. Comma or Enter to add.">
            <Field label="Primary keywords">
              <TagInput
                value={draft.primaryKeywords}
                onChange={(value) => set("primaryKeywords", value)}
                placeholder="everest base camp trek"
              />
            </Field>
            <Field label="Secondary keywords">
              <TagInput
                value={draft.secondaryKeywords}
                onChange={(value) => set("secondaryKeywords", value)}
                placeholder="ebc trek cost, ebc permits"
              />
            </Field>
          </Panel>

          <Panel
            title="Key takeaways (AEO / GEO)"
            description="The direct-answer box at the top of the post. This is what answer engines lift and cite — write it as a standalone factual answer."
            className="lg:col-span-2"
          >
            <Field
              label="Direct answer paragraph"
              hint="Answer the post's core question in 1–3 sentences, with no lead-in."
            >
              <Textarea
                rows={3}
                value={draft.keyTakeaway}
                onChange={(e) => set("keyTakeaway", e.target.value)}
                placeholder="The Everest Base Camp trek takes 12–14 days, reaches 5,364 m and costs USD 1,400–2,200 with a licensed guide…"
              />
            </Field>
            <Field
              label="Bullet points"
              hint={'One per line. Use "Label: value" to bold the label — e.g. "Best season: March–May and October–November".'}
            >
              <Textarea
                rows={6}
                value={draft.takeaways}
                onChange={(e) => set("takeaways", e.target.value)}
                className="font-mono text-[0.8125rem]"
                placeholder={"Duration: 12–14 days round trip from Lukla\nCost: USD 1,400–2,200 per person\nDifficulty: Moderate — no technical climbing"}
              />
            </Field>
          </Panel>
        </div>
      )}

      {/* ------------------------------- FAQs ------------------------------- */}
      {tab === "faqs" && (
        <Panel
          title="FAQ builder"
          description="Rendered as an accordion and emitted as FAQPage JSON-LD for rich snippets and AI citation."
        >
          <FaqBuilder items={draft.faqs} onChange={(items) => set("faqs", items)} />
        </Panel>
      )}

      {/* ----------------------------- Linking ------------------------------ */}
      {tab === "linking" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel
            title="Internal linking entities"
            description="Tags that drive the hub-and-spoke engine — posts and trips sharing tags are automatically cross-linked in the related modules."
          >
            <Field label="Entity tags">
              <TagInput
                value={draft.entityTags}
                onChange={(value) => set("entityTags", value)}
                placeholder="Everest, Permits, Gear"
              />
            </Field>
          </Panel>

          <Panel
            title={`Backlink controller → ${mainSite.name}`}
            description="Converts the first in-body match of the anchor into a dofollow link to the main site."
          >
            <Toggle
              checked={draft.backlinksEnabled}
              onChange={(value) => set("backlinksEnabled", value)}
              label="Enable backlink injection"
              description="Turn off to keep this post free of cross-domain links."
            />
            <Field label="Target main-site URL">
              <Input
                value={draft.mainSiteUrl}
                onChange={(e) => set("mainSiteUrl", e.target.value)}
                placeholder={`${mainSite.url}/trip/everest-base-camp-trek`}
              />
            </Field>
            <Field label="Primary anchor text" hint="The exact phrase to match in the body copy.">
              <Input
                value={draft.primaryAnchor}
                onChange={(e) => set("primaryAnchor", e.target.value)}
                placeholder="book the official Everest Base Camp trek"
              />
            </Field>
            <Field
              label="Anchor variations"
              hint="Rotated deterministically across pages so the anchor profile stays natural rather than exact-match on every link."
            >
              <TagInput
                value={draft.secondaryAnchors}
                onChange={(value) => set("secondaryAnchors", value)}
                placeholder="Everest Base Camp trek packages"
              />
            </Field>
          </Panel>
        </div>
      )}
    </FormShell>
  );
}

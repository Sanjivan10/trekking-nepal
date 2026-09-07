"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormShell, Panel } from "./form-shell";
import { Field, Input, Textarea, TagInput, ImageField, Toggle, CharCount } from "./fields";
import { FaqBuilder } from "./builders";
import type { RegionDraft } from "@/lib/drafts";

export type { RegionDraft };
import { slugify } from "@/lib/utils";

const TABS = [
  { id: "content", label: "Content" },
  { id: "seo", label: "SEO & AEO" },
  { id: "faqs", label: "FAQs" },
];

export function RegionForm({ initial }: { initial: RegionDraft }) {
  const router = useRouter();
  const [draft, setDraft] = useState<RegionDraft>(initial);
  const [tab, setTab] = useState("content");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));

  const set = <K extends keyof RegionDraft>(key: K, value: RegionDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  async function save() {
    if (!draft.name.trim()) {
      setError("A region name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        draft.id ? `/api/admin/regions/${draft.id}` : "/api/admin/regions",
        {
          method: draft.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, slug: draft.slug || slugify(draft.name) }),
        },
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Save failed");
      setSaved(true);
      if (!draft.id) router.replace(`/admin/regions/${json.id}`);
      else router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!draft.id) return;
    await fetch(`/api/admin/regions/${draft.id}`, { method: "DELETE" });
    router.replace("/admin/regions");
    router.refresh();
  }

  return (
    <FormShell
      title={draft.name || "New region"}
      backHref="/admin/regions"
      tabs={TABS}
      activeTab={tab}
      onTabChange={setTab}
      status={draft.status}
      onStatusChange={(value) => set("status", value)}
      onSave={save}
      onDelete={draft.id ? remove : undefined}
      previewHref={draft.slug ? `/region/${draft.slug}` : undefined}
      saving={saving}
      saved={saved}
      error={error}
    >
      {tab === "content" && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Panel>
            <Field label="Region name" required>
              <Input
                value={draft.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                placeholder="Everest"
              />
            </Field>
            <Field label="Slug" hint={`URL: /region/${draft.slug || "your-slug"}`}>
              <Input
                value={draft.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Headline" hint="One line shown under the H1 and on region cards.">
              <Input value={draft.headline} onChange={(e) => set("headline", e.target.value)} />
            </Field>
            <Field label="Pillar page content" hint="Markdown. This is the hub content that links down to child treks and guides.">
              <Textarea
                rows={16}
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                className="font-mono text-[0.8125rem]"
              />
            </Field>
          </Panel>

          <div className="space-y-5">
            <Panel title="Hero image">
              <ImageField
                label="Image URL"
                value={draft.heroImage}
                onChange={(value) => set("heroImage", value)}
                alt={draft.heroAlt}
                onAltChange={(value) => set("heroAlt", value)}
              />
            </Panel>
            <Panel title="Options">
              <Field label="Sort position" hint="Lower numbers appear first in navigation.">
                <Input
                  type="number"
                  value={draft.position}
                  onChange={(e) => set("position", Number(e.target.value) || 0)}
                />
              </Field>
              <Toggle
                checked={draft.featured}
                onChange={(value) => set("featured", value)}
                label="Featured region"
              />
            </Panel>
          </div>
        </div>
      )}

      {tab === "seo" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Search metadata">
            <Field label="Meta title">
              <Input value={draft.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
              <div className="mt-1 flex justify-end">
                <CharCount value={draft.metaTitle} ideal={50} max={60} />
              </div>
            </Field>
            <Field label="Meta description">
              <Textarea
                rows={3}
                value={draft.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
              />
              <div className="mt-1 flex justify-end">
                <CharCount value={draft.metaDescription} ideal={140} max={160} />
              </div>
            </Field>
            <Field label="Keywords">
              <TagInput value={draft.keywords} onChange={(value) => set("keywords", value)} />
            </Field>
            <Field label="Entity tags" hint="Drives which trips and guides this hub attracts.">
              <TagInput value={draft.entityTags} onChange={(value) => set("entityTags", value)} />
            </Field>
          </Panel>

          <Panel title="Key takeaways (AEO / GEO)">
            <Field label="Direct answer paragraph">
              <Textarea
                rows={4}
                value={draft.keyTakeaway}
                onChange={(e) => set("keyTakeaway", e.target.value)}
              />
            </Field>
            <Field label="Bullet points" hint="One per line.">
              <Textarea
                rows={7}
                value={draft.takeaways}
                onChange={(e) => set("takeaways", e.target.value)}
                className="font-mono text-[0.8125rem]"
              />
            </Field>
          </Panel>
        </div>
      )}

      {tab === "faqs" && (
        <Panel title="Region FAQs">
          <FaqBuilder items={draft.faqs} onChange={(items) => set("faqs", items)} />
        </Panel>
      )}
    </FormShell>
  );
}

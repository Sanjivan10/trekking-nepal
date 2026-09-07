/**
 * Cross-domain backlink engine.
 *
 * Converts the first N in-body occurrences of configured keywords into
 * dofollow links pointing at the main destination site.
 *
 * Link attributes: target="_blank" rel="noopener" — deliberately WITHOUT
 * `nofollow`/`sponsored`/`ugc`, so the links pass equity as editorial links.
 *
 * Safety rules the matcher obeys, so output stays valid HTML:
 *   - never matches inside an existing <a>...</a>
 *   - never matches inside <code>, <pre>, headings, or an HTML attribute
 *   - whole-phrase, case-insensitive, word-boundary matching only
 *   - longest/highest-priority phrase wins when two rules overlap
 *   - each rule fires at most `maxPerPage` times per page
 */
import { mainSiteUrl, mainSite } from "./mainSite";
import { splitList } from "./utils";

export type BacklinkRule = {
  keyword: string;
  targetUrl: string;
  anchorText?: string | null;
  variations?: string | null;
  priority?: number | null;
  maxPerPage?: number | null;
  active?: boolean;
};

export type ResolvedRule = {
  keyword: string;
  href: string;
  anchors: string[];
  priority: number;
  maxPerPage: number;
};

export type InjectionResult = {
  html: string;
  /** Which rules fired, for debugging + the admin link report. */
  injected: Array<{ keyword: string; anchor: string; href: string }>;
};

const ESCAPE_RE = /[.*+?^${}()|[\]\\]/g;
const escapeRe = (value: string) => value.replace(ESCAPE_RE, "\\$&");

/** Zones the injector must not touch: existing links, code, headings, tags. */
const PROTECTED_RE =
  /<a\b[^>]*>[\s\S]*?<\/a>|<code\b[^>]*>[\s\S]*?<\/code>|<pre\b[^>]*>[\s\S]*?<\/pre>|<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>|<[^>]+>/gi;

export function resolveRules(rules: BacklinkRule[]): ResolvedRule[] {
  return rules
    .filter((rule) => rule.active !== false && rule.keyword?.trim() && rule.targetUrl?.trim())
    .map((rule) => {
      const anchors = [
        rule.anchorText?.trim() || rule.keyword.trim(),
        ...splitList(rule.variations),
      ].filter(Boolean);
      return {
        keyword: rule.keyword.trim(),
        href: mainSiteUrl(rule.targetUrl.trim()),
        anchors,
        priority: rule.priority ?? 0,
        maxPerPage: Math.max(1, rule.maxPerPage ?? 1),
      };
    })
    // Longest phrase first so "Everest Base Camp Trek" beats "Everest".
    .sort((a, b) => b.priority - a.priority || b.keyword.length - a.keyword.length);
}

/**
 * Deterministically picks an anchor variation from the list, seeded by the
 * page key. Same page always renders the same anchor (stable for crawlers),
 * but different pages spread across the variation set for a natural profile.
 */
export function pickAnchor(anchors: string[], seed: string, occurrence = 0): string {
  if (anchors.length === 1) return anchors[0];
  let hash = 2166136261;
  const key = `${seed}::${occurrence}`;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return anchors[Math.abs(hash) % anchors.length];
}

function linkTag(href: string, anchor: string, keyword: string) {
  // rel is noopener only — no nofollow/sponsored, so equity passes.
  return (
    `<a href="${href}" rel="noopener" target="_blank" ` +
    `class="backlink" data-backlink="${escapeHtml(keyword)}" ` +
    `title="${escapeHtml(anchor)} on ${escapeHtml(mainSite.name)}">${escapeHtml(anchor)}` +
    `<span class="backlink-icon" aria-hidden="true"></span></a>`
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Splits HTML into [text, protected, text, protected, ...] segments so
 * replacement only ever runs on real body text.
 */
function segment(html: string) {
  const segments: Array<{ text: string; editable: boolean }> = [];
  let lastIndex = 0;
  PROTECTED_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = PROTECTED_RE.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: html.slice(lastIndex, match.index), editable: true });
    }
    segments.push({ text: match[0], editable: false });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < html.length) {
    segments.push({ text: html.slice(lastIndex), editable: true });
  }
  return segments;
}

/**
 * Injects dofollow backlinks into rendered HTML.
 *
 * @param html   Rendered post/itinerary HTML
 * @param rules  Keyword rules (global map + per-post override)
 * @param seed   Stable per-page key (the slug) for anchor variation
 */
export function injectBacklinks(
  html: string,
  rules: BacklinkRule[],
  seed = "",
): InjectionResult {
  const resolved = resolveRules(rules);
  if (!html || resolved.length === 0) return { html, injected: [] };

  const injected: InjectionResult["injected"] = [];
  const used = new Map<string, number>();
  const segments = segment(html);
  // Phrases already claimed by a longer/higher-priority rule. A later,
  // shorter rule must not link a fragment inside one of these — otherwise
  // a second "Everest Base Camp Trek" would get "Everest" linked out of it.
  const claimed: string[] = [];

  for (const rule of resolved) {
    // One regex alternating [already-claimed phrases | this rule's keyword],
    // so a claimed phrase is consumed before the keyword can match inside it.
    const guard = claimed.length ? `(${claimed.map(escapeRe).join("|")})|` : "()";
    const pattern = new RegExp(
      `\\b(?:${guard}(${escapeRe(rule.keyword)}))\\b`,
      "gi",
    );

    for (let i = 0; i < segments.length; i += 1) {
      const seg = segments[i];
      if (!seg.editable) continue;
      const count = used.get(rule.keyword) ?? 0;
      if (count >= rule.maxPerPage) break;

      let localCount = count;
      seg.text = seg.text.replace(pattern, (matched, claimedHit, keywordHit) => {
        // A claimed longer phrase — leave it exactly as it is.
        if (claimedHit || !keywordHit) return matched;
        if (localCount >= rule.maxPerPage) return matched;
        const anchor = pickAnchor(rule.anchors, `${seed}:${rule.keyword}`, localCount);
        localCount += 1;
        injected.push({ keyword: rule.keyword, anchor, href: rule.href });
        return linkTag(rule.href, anchor, rule.keyword);
      });

      if (localCount !== count) {
        used.set(rule.keyword, localCount);
        // The segment now contains an <a>, so re-protect it from later rules.
        const reSegmented = segment(seg.text);
        segments.splice(i, 1, ...reSegmented);
        i += reSegmented.length - 1;
      }
    }

    claimed.push(rule.keyword);
  }

  return { html: segments.map((s) => s.text).join(""), injected };
}

/**
 * Merges the global keyword map with a post's own backlink controller
 * settings. The per-post rule gets top priority so an editor's explicit
 * target always wins over the global map.
 */
export function buildRules(opts: {
  global: BacklinkRule[];
  post?: {
    title?: string | null;
    mainSiteUrl?: string | null;
    primaryAnchor?: string | null;
    secondaryAnchors?: string | null;
    backlinksEnabled?: boolean | null;
  } | null;
}): BacklinkRule[] {
  const rules = [...opts.global];
  const post = opts.post;
  if (post?.backlinksEnabled !== false && post?.mainSiteUrl?.trim()) {
    rules.unshift({
      keyword: post.primaryAnchor?.trim() || post.title?.trim() || "",
      targetUrl: post.mainSiteUrl.trim(),
      anchorText: post.primaryAnchor?.trim() || post.title?.trim() || "",
      variations: post.secondaryAnchors || "",
      priority: 1000,
      maxPerPage: 2,
      active: true,
    });
  }
  return rules.filter((rule) => rule.keyword);
}

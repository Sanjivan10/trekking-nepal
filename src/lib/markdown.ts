import { marked } from "marked";
import { injectBacklinks, type BacklinkRule } from "./backlinkEngine";
import { slugify } from "./utils";

marked.setOptions({ gfm: true, breaks: false });

export type TocItem = { id: string; text: string; level: number };

/**
 * Renders Markdown -> HTML, adds stable heading ids for the table of
 * contents, and injects cross-domain dofollow backlinks.
 */
export function renderMarkdown(
  markdown: string,
  opts: { backlinks?: BacklinkRule[]; seed?: string } = {},
): { html: string; toc: TocItem[] } {
  if (!markdown?.trim()) return { html: "", toc: [] };

  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const plain = text.replace(/<[^>]*>/g, "");
    let id = slugify(plain) || `section-${toc.length + 1}`;
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;
    if (depth === 2 || depth === 3) toc.push({ id, text: plain, level: depth });
    return `<h${depth} id="${id}" class="scroll-mt-28">${text}</h${depth}>\n`;
  };

  // External links open in a new tab; internal ones stay in-app.
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const isExternal = /^https?:\/\//i.test(href || "");
    const attrs = [
      `href="${href}"`,
      title ? `title="${title}"` : "",
      isExternal ? 'target="_blank" rel="noopener"' : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `<a ${attrs}>${text}</a>`;
  };

  // Tables get a horizontal scroll wrapper so they never break mobile layout.
  const baseTable = renderer.table.bind(renderer);
  renderer.table = function (token) {
    return `<div class="table-scroll">${baseTable(token)}</div>`;
  };

  const rawHtml = marked.parse(markdown, { renderer, async: false }) as string;
  const { html } = injectBacklinks(rawHtml, opts.backlinks || [], opts.seed || "");
  return { html, toc };
}

/** Lightweight inline markdown (bold/italic/links) for short fields. */
export function renderInline(markdown: string, opts: { backlinks?: BacklinkRule[]; seed?: string } = {}) {
  if (!markdown?.trim()) return "";
  const raw = marked.parseInline(markdown, { async: false }) as string;
  return injectBacklinks(raw, opts.backlinks || [], opts.seed || "").html;
}

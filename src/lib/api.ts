import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "./auth";
import { prisma } from "./prisma";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Wraps an admin handler with session + error handling. */
export async function withAdmin<T>(handler: () => Promise<T>) {
  const user = await getSession();
  if (!user) return fail("Unauthorized", 401);
  try {
    return json(await handler());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    // Prisma unique-constraint violation -> friendly message.
    if (message.includes("Unique constraint")) {
      return fail("That slug or keyword is already in use.", 409);
    }
    console.error("[admin api]", error);
    return fail(message, 500);
  }
}

/** Purges the caches touched by a content change. */
export function revalidateContent(paths: string[] = []) {
  const base = ["/", "/itinerary", "/blog", "/region", "/sitemap.xml", "/llms.txt"];
  for (const path of [...base, ...paths]) {
    try {
      revalidatePath(path);
    } catch {
      // revalidatePath throws outside a request scope — safe to ignore.
    }
  }
}

/**
 * Region hub pages list their child treks and guides, so re-assigning content
 * to a region must refresh that hub too — both the new region and the old one.
 */
export async function regionPaths(...ids: Array<string | null | undefined>) {
  const unique = [...new Set(ids.filter(Boolean) as string[])];
  if (unique.length === 0) return [];
  const regions = await prisma.region.findMany({
    where: { id: { in: unique } },
    select: { slug: true },
  });
  return regions.map((region) => `/region/${region.slug}`);
}

/* ------------------------------ coercion ------------------------------ */

export const str = (value: unknown, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

export const num = (value: unknown, fallback = 0) => {
  const parsed = typeof value === "number" ? value : parseFloat(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const int = (value: unknown, fallback = 0) => Math.trunc(num(value, fallback));

export const bool = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : value === "true" ? true : value === "false" ? false : fallback;

/** Normalises "a,b , c" or ["a","b"] into "a, b, c". */
export const csv = (value: unknown) => {
  const items = Array.isArray(value) ? value : String(value ?? "").split(",");
  return items
    .map((item) => String(item).trim())
    .filter(Boolean)
    .join(", ");
};

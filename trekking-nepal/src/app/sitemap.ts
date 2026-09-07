import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";

export const revalidate = 3600;

/**
 * Dynamic sitemap. New blogs, itineraries and region hubs appear here
 * automatically the moment they are published (within the revalidate window).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, itineraries, regions] = await Promise.all([
    prisma.blog
      .findMany({
        where: { status: "published" },
        select: { slug: true, updatedAt: true, publishedAt: true },
        orderBy: { publishedAt: "desc" },
      })
      .catch(() => []),
    prisma.itinerary
      .findMany({
        where: { status: "published" },
        select: { slug: true, updatedAt: true, publishedAt: true, featured: true },
        orderBy: { publishedAt: "desc" },
      })
      .catch(() => []),
    prisma.region
      .findMany({
        where: { status: "published" },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => []),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/itinerary`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/region`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  const regionRoutes: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${site.url}/region/${region.slug}`,
    lastModified: region.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tripRoutes: MetadataRoute.Sitemap = itineraries.map((trip) => ({
    url: `${site.url}/itinerary/${trip.slug}`,
    lastModified: trip.updatedAt ?? trip.publishedAt ?? now,
    changeFrequency: "weekly",
    priority: trip.featured ? 0.9 : 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...regionRoutes, ...tripRoutes, ...blogRoutes];
}

import type { MetadataRoute } from 'next';
import { getPlots, getPosts } from '@/lib/cms';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ktmplots.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/plots`,   lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/about`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/services`,lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/blog`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Fetch all plots (up to 200)
  const { data: plots } = await getPlots({ limit: 200 }).catch(() => ({ data: [] }));
  const plotPages: MetadataRoute.Sitemap = plots.map((plot) => ({
    url: `${BASE_URL}/plots/${plot.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Fetch all published posts (up to 200)
  const { data: posts } = await getPosts({ limit: 200 }).catch(() => ({ data: [] }));
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ?? post.createdAt ?? now,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [...staticPages, ...plotPages, ...blogPages];
}

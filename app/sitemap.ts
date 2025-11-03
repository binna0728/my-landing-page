import type { MetadataRoute } from "next";

type Post = { slug: string; updatedAt: string };

async function fetchPosts(): Promise<Post[]> {
  // 실제로는 API나 데이터베이스에서 가져옴
  return [
    { slug: "nextjs-setup", updatedAt: "2025-01-01" },
    { slug: "shadcn-setup", updatedAt: "2025-01-02" },
    { slug: "vercel-deployment", updatedAt: "2025-01-03" },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com";
  const now = new Date().toISOString().slice(0, 10);

  const statics: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const posts = (await fetchPosts()).map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...statics, ...posts];
}


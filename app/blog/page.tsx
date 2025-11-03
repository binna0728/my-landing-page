import { BlogList } from "@/components/blog/blog-list";

export const metadata = {
  title: "블로그 — AI 헬스케어 초격차 캠프",
  description: "기술 블로그 포스트 모음",
};

async function getBlogPosts() {
  try {
    // Use absolute URL in development, relative in production
    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev
      ? (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
      : '';
    const res = await fetch(`${baseUrl}/api/blog/posts?status=published`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      console.error('API response not OK:', res.status);
      return [];
    }

    const data = await res.json();
    return data.posts || [];
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return <BlogList initialPosts={posts} />;
}

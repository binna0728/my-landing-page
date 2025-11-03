import { BlogList } from "@/components/blog/blog-list";

export const metadata = {
  title: "블로그 — AI 헬스케어 초격차 캠프",
  description: "기술 블로그 포스트 모음",
};

async function getBlogPosts() {
  try {
    // API 라우트를 통해 데이터 가져오기 (환경변수 문제 회피)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const url = `${baseUrl}/api/blog/posts?status=published`;
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('API response not OK:', res.status);
      return [];
    }

    const data = await res.json();
    return data.posts || [];
  } catch (error: any) {
    console.error('Failed to fetch blog posts:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return <BlogList initialPosts={posts} />;
}

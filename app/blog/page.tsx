import { BlogList } from "@/components/blog/blog-list";

export const metadata = {
  title: "블로그 — AI 헬스케어 초격차 캠프",
  description: "기술 블로그 포스트 모음",
};

async function getBlogPosts() {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Supabase 환경변수 누락');
      return [];
    }

    // Supabase에 직접 연결
    const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=*&status=eq.published&order=publish_date.desc`;
    
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Supabase API error:', res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    const posts = Array.isArray(data) ? data : [];

    // 데이터 형식 변환
    return posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description || post.excerpt || '',
      content: post.content,
      date: post.publish_date || post.created_at,
      tags: post.tags || [],
      slug: post.slug,
      category: post.category,
      author: post.author,
      featured: post.featured,
      status: post.status,
    }));
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return <BlogList initialPosts={posts} />;
}

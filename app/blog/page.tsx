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
      console.error('Supabase 환경변수 누락:', {
        hasUrl: !!SUPABASE_URL,
        hasKey: !!SUPABASE_ANON_KEY,
        url: SUPABASE_URL ? '설정됨' : '없음',
        key: SUPABASE_ANON_KEY ? '설정됨' : '없음',
      });
      return [];
    }

    // Supabase에 직접 연결
    const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=*&status=eq.published&order=publish_date.desc`;
    
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      console.error('Supabase API error:', {
        status: res.status,
        statusText: res.statusText,
        error: errorText,
        url: url.replace(SUPABASE_ANON_KEY, '[HIDDEN]'),
      });
      return [];
    }

    const data = await res.json();
    const posts = Array.isArray(data) ? data : [];

    console.log(`✅ 블로그 포스트 ${posts.length}개 조회 성공`);

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
      view_count: post.view_count || 0,
    }));
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

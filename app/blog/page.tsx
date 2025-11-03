import { BlogList } from "@/components/blog/blog-list";
import { createClient } from '@supabase/supabase-js';

export const metadata = {
  title: "블로그 — AI 헬스케어 초격차 캠프",
  description: "기술 블로그 포스트 모음",
};

// 동적 렌더링 강제 (SSR) - ISR 방지
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const runtime = 'nodejs';

async function getBlogPosts() {
  try {
    // 환경변수 확인
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://udimchcvervbxcnqjrcl.supabase.co';
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaW1jaGN2ZXJ2YnhjbnFqcmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDUwODUsImV4cCI6MjA3NzcyMTA4NX0.uqd1qFh5tekwi4Sxyb3xrqOyThfJmIeW8phwxOMP8Kg';
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // content 필드는 제외하고 필요한 필드만 가져오기
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, description, excerpt, publish_date, created_at, tags, slug, category, author, featured, status, view_count')
      .eq('status', 'published')
      .order('publish_date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    if (!posts) {
      return [];
    }

    // 데이터 형식 변환
    return posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description || post.excerpt || '',
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

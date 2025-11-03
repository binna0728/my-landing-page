import { BlogList } from "@/components/blog/blog-list";
import { getSupabase } from "@/lib/supabase";

export const metadata = {
  title: "블로그 — AI 헬스케어 초격차 캠프",
  description: "기술 블로그 포스트 모음",
};

async function getBlogPosts() {
  try {
    const supabase = getSupabase();
    
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
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

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata = {
  title: "블로그 포스트 — AI 헬스케어 초격차 캠프",
  description: "블로그 포스트 상세 페이지",
};

async function getBlogPost(slug: string) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Supabase 환경변수 누락:', {
        hasUrl: !!SUPABASE_URL,
        hasKey: !!SUPABASE_ANON_KEY,
      });
      return null;
    }

    // Supabase에 직접 연결
    const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=*&slug=eq.${encodeURIComponent(slug)}`;
    
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
        slug,
      });
      return null;
    }

    const data = await res.json();
    const posts = Array.isArray(data) ? data : [];
    const post = posts[0] || null;

    if (!post) {
      console.error(`블로그 포스트를 찾을 수 없습니다: ${slug}`);
      return null;
    }

    // 데이터 형식 변환
    return {
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
    };
  } catch (error: any) {
    console.error('Error fetching blog post:', {
      message: error?.message,
      stack: error?.stack,
      slug,
    });
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }


  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Link>
        </Button>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              {post.description}
            </p>
            <div className="flex items-center gap-4 mb-4">
              <time className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString("ko-KR")}
              </time>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div className="prose prose-slate max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }: any) => {
                  const src = props?.src ? String(props.src) : '';
                  if (!src) return null;
                  const alt = props?.alt ? String(props.alt) : '';
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={alt}
                      className="max-w-full rounded-md border my-4"
                    />
                  );
                },
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
                code: (props: any) => {
                  const className = props?.className || '';
                  const isInline = !className || !className.includes('language-');
                  if (isInline) {
                    return <code className="bg-muted px-2 py-1 rounded text-sm" {...props} />;
                  }
                  return <code {...props} />;
                },
                pre: ({node, ...props}) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4 text-sm" {...props} />
                ),
                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 ml-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 ml-2" {...props} />,
                li: ({node, ...props}) => <li className="mb-2" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}

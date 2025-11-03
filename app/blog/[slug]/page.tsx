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
    // 서버 컴포넌트에서는 절대 URL 필요
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/posts?status=published`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('API response not OK:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const posts = data.posts || [];
    const post = posts.find((p: any) => p.slug === slug || p.id.toString() === slug);

    return post || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
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

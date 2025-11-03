import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Eye, User } from "lucide-react";

const CATEGORIES: Record<string, string> = {
  general: '일반',
  announcement: '공지',
  update: '업데이트',
};

async function getPost(category: string, slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notice?status=published`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return null;
    }

    const posts = await res.json();
    const post = posts.find((p: any) => 
      (p.slug === slug || p.id.toString() === slug) && p.category === category
    );

    return post || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = await getPost(category, slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/notice">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Link>
        </Button>

        {/* 게시글 */}
        <Card>
          <CardContent className="pt-6">
            {/* 카테고리 및 메타 정보 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {CATEGORIES[post.category] || post.category}
                </Badge>
                {post.featured && (
                  <Badge variant="default" className="bg-primary">
                    추천
                  </Badge>
                )}
              </div>
            </div>

            {/* 제목 */}
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              {post.title}
            </h1>

            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author || '관리자'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.publish_date || post.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {post.view_count > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.view_count}
                </span>
              )}
            </div>

            {/* 설명 */}
            {post.description && (
              <p className="text-lg text-muted-foreground mb-8">
                {post.description}
              </p>
            )}

            {/* 본문 */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .replace(/\n/g, '<br />')
                  .replace(/#{3}\s(.*)/g, '<h3>$1</h3>')
                  .replace(/#{2}\s(.*)/g, '<h2>$1</h2>')
                  .replace(/#{1}\s(.*)/g, '<h1>$1</h1>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
              }}
            />

            {/* 태그 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                {post.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { PasswordDialog } from "@/components/blog/password-dialog";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  date: string;
  tags: string[];
  slug: string;
  category?: string;
  author?: string;
  featured?: boolean;
  status?: string;
}

interface BlogListProps {
  initialPosts: BlogPost[];
}

export function BlogList({ initialPosts }: BlogListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [pendingPost, setPendingPost] = useState<BlogPost | null>(null);

  const handleDeleteClick = (post: BlogPost) => {
    if (!confirm(`"${post.title}" 글을 삭제하시겠습니까?`)) {
      return;
    }
    setPendingPost(post);
    setPasswordDialogOpen(true);
  };

  const handlePasswordConfirm = async () => {
    if (!pendingPost) return;

    try {
      const response = await fetch(`/api/blog/posts?id=${pendingPost.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('삭제되었습니다.');
        window.location.reload();
      } else {
        alert('삭제 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setPendingPost(null);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-4">블로그</h1>
              <p className="text-lg text-muted-foreground">
                AI 헬스케어 초격차 캠프 과정을 따라하며 배운 내용을 기록합니다.
              </p>
            </div>
            <Button asChild>
              <Link href="/blog/new">
                <Plus className="w-4 h-4 mr-2" />
                새 글 작성
              </Link>
            </Button>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="hover:underline"
                          >
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription>{post.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
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
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline">
                        <Link href={`/blog/${post.slug}`}>자세히 보기</Link>
                      </Button>
                      <Button asChild variant="outline" size="icon" title="수정">
                        <Link href={`/blog/edit/${post.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(post)}
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">아직 작성된 글이 없습니다.</p>
              <Button asChild>
                <Link href="/blog/new">
                  <Plus className="w-4 h-4 mr-2" />
                  첫 글 작성하기
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <PasswordDialog
        open={passwordDialogOpen}
        onOpenChange={(open) => {
          setPasswordDialogOpen(open);
          if (!open) {
            setPendingPost(null);
          }
        }}
        onConfirm={handlePasswordConfirm}
        title="비밀번호 확인"
        description="글을 삭제하려면 비밀번호를 입력해주세요."
      />
    </>
  );
}


"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Send, Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PasswordDialog } from "@/components/blog/password-dialog";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "learning",
    author: "김빛나",
    featured: false,
    tags: [] as string[],
    status: "draft" as string,
  });
  const [tagInput, setTagInput] = useState("");

  // 기존 글 데이터 가져오기
  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      
      try {
        const res = await fetch('/api/blog/posts?status=all');
        if (!res.ok) {
          alert('글을 불러올 수 없습니다.');
          router.push('/blog');
          return;
        }

        const data = await res.json();
        const posts = data.posts || [];
        const post = posts.find((p: any) => p.id.toString() === id);

        if (!post) {
          alert('글을 찾을 수 없습니다.');
          router.push('/blog');
          return;
        }

        setFormData({
          title: post.title || "",
          description: post.description || "",
          content: post.content || "",
          category: post.category || "learning",
          author: post.author || "김빛나",
          featured: post.featured || false,
          tags: post.tags || [],
          status: post.status || "draft",
        });
      } catch (error) {
        console.error('Error:', error);
        alert('글을 불러오는 중 오류가 발생했습니다.');
        router.push('/blog');
      } finally {
        setFetching(false);
      }
    }

    fetchPost();
  }, [id, router]);

  const handleSubmitClick = (status: string) => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setPendingStatus(status);
    setPasswordDialogOpen(true);
  };

  const handlePasswordConfirm = async () => {
    if (!pendingStatus || !id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/blog/posts?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: pendingStatus || formData.status,
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('수정되었습니다!');
        router.push(`/blog/${data.slug || ''}`);
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`수정 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setPendingStatus(null);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">블로그 글 수정</h1>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              placeholder="제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="category">카테고리</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="learning">학습</SelectItem>
                <SelectItem value="project">프로젝트</SelectItem>
                <SelectItem value="tutorial">튜토리얼</SelectItem>
                <SelectItem value="review">리뷰</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              placeholder="설명을 입력하세요"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="tags">태그</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="tags"
                placeholder="태그를 입력하고 Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={loading}
              />
              <Button type="button" onClick={handleAddTag} variant="outline" disabled={loading}>
                추가
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              placeholder="내용을 입력하세요 (마크다운 지원)"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={20}
              className="font-mono mt-2"
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              disabled={loading}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              추천 게시글
            </Label>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => handleSubmitClick("draft")} 
              disabled={loading || !formData.title}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              임시저장
            </Button>
            <Button 
              onClick={() => handleSubmitClick("published")} 
              disabled={loading || !formData.title || !formData.content}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              수정하기
            </Button>
          </div>
        </div>
      </div>

      <PasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onConfirm={handlePasswordConfirm}
        title="비밀번호 확인"
        description="글을 수정하려면 비밀번호를 입력해주세요."
      />
    </div>
  );
}


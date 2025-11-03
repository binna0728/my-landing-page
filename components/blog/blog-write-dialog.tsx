"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Send, Loader2 } from "lucide-react";

interface BlogPost {
  id?: number;
  title: string;
  description: string;
  content: string;
  category: string;
  author: string;
  featured: boolean;
  tags: string[];
  status?: string;
  publish_date?: string;
  date?: string;
}

interface BlogWriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editPost?: BlogPost | null;
}

export function BlogWriteDialog({ open, onOpenChange, onSuccess, editPost }: BlogWriteDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    content: "",
    category: "learning",
    author: "김빛나",
    featured: false,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = React.useState("");

  // 수정 모드일 때 기존 데이터 로드
  React.useEffect(() => {
    if (editPost && open) {
      setFormData({
        title: editPost.title || "",
        description: editPost.description || "",
        content: editPost.content || "",
        category: editPost.category || "learning",
        author: editPost.author || "김빛나",
        featured: editPost.featured || false,
        tags: editPost.tags || [],
      });
    } else if (!editPost && open) {
      // 새 글 작성 모드일 때 폼 초기화
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "learning",
        author: "김빛나",
        featured: false,
        tags: [],
      });
      setTagInput("");
    }
  }, [editPost, open]);

  const handleSubmit = async (status: string) => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const isEdit = !!editPost?.id;
      const url = isEdit 
        ? `/api/blog/posts?id=${editPost.id}`
        : '/api/blog/posts';
      
      const response = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: status || editPost?.status || 'draft',
          publish_date: editPost?.publish_date || new Date().toISOString()
        })
      });

      if (response.ok) {
        alert(`${isEdit ? '수정' : status === 'published' ? '발행' : '임시저장'}되었습니다!`);
        setFormData({
          title: "",
          description: "",
          content: "",
          category: "learning",
          author: "김빛나",
          featured: false,
          tags: [],
        });
        setTagInput("");
        onOpenChange(false);
        onSuccess?.();
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`저장 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPost?.id ? '블로그 글 수정' : '새 블로그 글 작성'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              placeholder="제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="category">카테고리</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
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
              rows={2}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="tags">태그</Label>
            <div className="flex gap-2">
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
              rows={15}
              className="font-mono"
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

          <div className="flex gap-2 justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit("draft")} 
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
              onClick={() => handleSubmit("published")} 
              disabled={loading || !formData.title || !formData.content}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              발행하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


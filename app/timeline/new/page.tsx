"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Send, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { PasswordDialog } from "@/components/blog/password-dialog";

export default function NewTimelinePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: "",
    description: "",
    content: "",
    category: "learning",
    author: "김빛나",
    tags: [] as string[],
    keywords: [] as string[],
    progress: "completed",
    week: undefined as number | undefined,
    link_url: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const handleSubmitClick = () => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    setPasswordDialogOpen(true);
  };

  const handlePasswordConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('타임라인 항목이 추가되었습니다!');
        router.push(`/`);
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

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({ ...formData, keywords: [...formData.keywords, keywordInput.trim()] });
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({ ...formData, keywords: formData.keywords.filter(k => k !== keyword) });
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">새 타임라인 항목 추가</h1>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="date">날짜 *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              placeholder="학습 내용 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">요약</Label>
            <Textarea
              id="description"
              placeholder="간단한 요약을 입력하세요"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="content">상세 내용 (마크다운)</Label>
            <Textarea
              id="content"
              placeholder="상세 내용을 입력하세요 (마크다운 지원)"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className="font-mono mt-2"
              disabled={loading}
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
                <SelectItem value="research">연구</SelectItem>
                <SelectItem value="project">프로젝트</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="progress">진행 상태</Label>
            <Select
              value={formData.progress}
              onValueChange={(value) => setFormData({ ...formData, progress: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="in-progress">진행중</SelectItem>
                <SelectItem value="planned">예정</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="week">주차</Label>
            <Input
              id="week"
              type="number"
              placeholder="예: 1"
              value={formData.week || ""}
              onChange={(e) => setFormData({ ...formData, week: e.target.value ? parseInt(e.target.value) : undefined })}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="link_url">관련 자료 링크</Label>
            <Input
              id="link_url"
              placeholder="https://..."
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
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
            <Label htmlFor="keywords">키워드</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="keywords"
                placeholder="키워드를 입력하고 Enter"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                disabled={loading}
              />
              <Button type="button" onClick={handleAddKeyword} variant="outline" disabled={loading}>
                추가
              </Button>
            </div>
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
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

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button 
              onClick={handleSubmitClick} 
              disabled={loading || !formData.title}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              저장하기
            </Button>
          </div>
        </div>
      </div>

      <PasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onConfirm={handlePasswordConfirm}
        title="비밀번호 확인"
        description="타임라인 항목을 저장하려면 비밀번호를 입력해주세요."
      />
    </div>
  );
}



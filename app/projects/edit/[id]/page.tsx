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

export default function EditProjectPage() {
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
    category: "research",
    author: "김빛나",
    featured: false,
    tags: [] as string[],
    thumbnail_url: "",
    images: [] as string[],
    project_date: "",
    project_period: "",
    award: "",
    link_url: "",
    github_url: "",
    status: "draft" as string,
  });
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  // 기존 프로젝트 데이터 가져오기
  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      
      try {
        const res = await fetch('/api/projects?status=all');
        if (!res.ok) {
          alert('프로젝트를 불러올 수 없습니다.');
          router.push('/projects');
          return;
        }

        const data = await res.json();
        const projects = data.projects || [];
        const project = projects.find((p: any) => p.id.toString() === id);

        if (!project) {
          alert('프로젝트를 찾을 수 없습니다.');
          router.push('/projects');
          return;
        }

        setFormData({
          title: project.title || "",
          description: project.description || "",
          content: project.content || "",
          category: project.category || "research",
          author: project.author || "김빛나",
          featured: project.featured || false,
          tags: project.tags || [],
          thumbnail_url: project.thumbnail_url || "",
          images: project.images || [],
          project_date: project.project_date ? project.project_date.split('T')[0] : "",
          project_period: project.project_period || "",
          award: project.award || "",
          link_url: project.link_url || "",
          github_url: project.github_url || "",
          status: project.status || "draft",
        });
      } catch (error) {
        console.error('Error:', error);
        alert('프로젝트를 불러오는 중 오류가 발생했습니다.');
        router.push('/projects');
      } finally {
        setFetching(false);
      }
    }

    fetchProject();
  }, [id, router]);

  const handleSubmitClick = (status: string) => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    setPendingStatus(status);
    setPasswordDialogOpen(true);
  };

  const handlePasswordConfirm = async () => {
    if (!pendingStatus || !id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: pendingStatus || formData.status,
          project_date: formData.project_date || null,
        })
      });

      if (response.ok) {
        alert('수정되었습니다!');
        router.push(`/projects`);
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

  const handleAddImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData({ ...formData, images: [...formData.images, imageInput.trim()] });
      setImageInput("");
    }
  };

  const handleRemoveImage = (image: string) => {
    setFormData({ ...formData, images: formData.images.filter(i => i !== image) });
  };

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">프로젝트 수정</h1>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              placeholder="프로젝트 제목을 입력하세요"
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
                <SelectItem value="research">연구</SelectItem>
                <SelectItem value="competition">대회</SelectItem>
                <SelectItem value="project">프로젝트</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              placeholder="프로젝트 설명을 입력하세요"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="thumbnail_url">썸네일 이미지 URL</Label>
            <Input
              id="thumbnail_url"
              placeholder="https://..."
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label>상세 이미지 (상장, PPT 등)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="이미지 URL을 입력하고 추가"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
                disabled={loading}
              />
              <Button type="button" onClick={handleAddImage} variant="outline" disabled={loading}>
                추가
              </Button>
            </div>
            {formData.images.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {formData.images.map((image, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={image} disabled className="text-xs" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveImage(image)}
                      disabled={loading}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="project_period">프로젝트 기간</Label>
            <Input
              id="project_period"
              placeholder="예: 2023.03 - 2023.09"
              value={formData.project_period}
              onChange={(e) => setFormData({ ...formData, project_period: e.target.value })}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="project_date">프로젝트 날짜</Label>
            <Input
              id="project_date"
              type="date"
              value={formData.project_date}
              onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="award">수상 내역</Label>
            <Input
              id="award"
              placeholder="예: 최우수상"
              value={formData.award}
              onChange={(e) => setFormData({ ...formData, award: e.target.value })}
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="link_url">외부 링크 URL</Label>
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
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              placeholder="https://github.com/..."
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
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
            <Label htmlFor="content">상세 내용 (마크다운)</Label>
            <Textarea
              id="content"
              placeholder="프로젝트 상세 내용을 입력하세요 (마크다운 지원)"
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
              추천 프로젝트
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
              disabled={loading || !formData.title}
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
        description="프로젝트를 수정하려면 비밀번호를 입력해주세요."
      />
    </div>
  );
}


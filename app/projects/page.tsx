"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ExternalLink, Github, Award } from "lucide-react";
import { PasswordDialog } from "@/components/blog/password-dialog";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail_url?: string;
  images: string[];
  project_date?: string;
  project_period?: string;
  award?: string;
  link_url?: string;
  github_url?: string;
  featured: boolean;
  slug?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [pendingProject, setPendingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects?status=all');
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Projects API error:', res.status, res.statusText, errorText);
        setProjects([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.error) {
        console.error('Projects API returned error:', data.error, data.details);
      }
      setProjects(data.projects || []);
    } catch (error: any) {
      console.error('Failed to fetch projects:', error);
      console.error('Error details:', error?.message, error?.stack);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (project: Project) => {
    if (!confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?`)) {
      return;
    }
    setPendingProject(project);
    setPasswordDialogOpen(true);
  };

  const handlePasswordConfirm = async () => {
    if (!pendingProject) return;

    try {
      const response = await fetch(`/api/projects?id=${pendingProject.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('삭제되었습니다.');
        fetchProjects();
      } else {
        alert('삭제 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setPendingProject(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <p>프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-4">프로젝트</h1>
              <p className="text-lg text-muted-foreground">
                진행한 프로젝트와 연구 결과를 소개합니다.
              </p>
            </div>
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="w-4 h-4 mr-2" />
                새 프로젝트 추가
              </Link>
            </Button>
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* 이미지 */}
                  {(() => {
                    const imageUrl = project.thumbnail_url || (project.images && project.images.length > 0 ? project.images[0] : null);
                    if (imageUrl) {
                      return (
                        <Link href={`/projects/${project.slug || project.id}`}>
                          <div className="relative w-full h-48 bg-muted overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </Link>
                      );
                    }
                    return (
                      <Link href={`/projects/${project.slug || project.id}`}>
                        <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">이미지 없음</span>
                        </div>
                      </Link>
                    );
                  })()}

                  <CardContent className="p-6">
                    {/* 카테고리 & 태그 */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {project.category === 'research' ? '연구' : 
                         project.category === 'competition' ? '대회' :
                         project.category === 'project' ? '프로젝트' : project.category}
                      </Badge>
                      {project.award && (
                        <Badge variant="default" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {project.award}
                        </Badge>
                      )}
                    </div>

                    {/* 제목 */}
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      <Link href={`/projects/${project.slug || project.id}`} className="hover:underline">
                        {project.title}
                      </Link>
                    </h3>

                    {/* 설명 */}
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* 기간 */}
                    {project.project_period && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {project.project_period}
                      </p>
                    )}

                    {/* 태그 */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-2 pt-4 border-t">
                      {project.link_url && (
                        <Button asChild variant="outline" size="sm">
                          <a href={project.link_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            보기
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button asChild variant="outline" size="sm">
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-3 h-3 mr-1" />
                            코드
                          </a>
                        </Button>
                      )}
                      <div className="flex-1" />
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="수정"
                      >
                        <Link href={`/projects/edit/${project.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteClick(project)}
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
              <p className="text-muted-foreground mb-4">아직 등록된 프로젝트가 없습니다.</p>
              <Button asChild>
                <Link href="/projects/new">
                  <Plus className="w-4 h-4 mr-2" />
                  첫 프로젝트 추가하기
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
            setPendingProject(null);
          }
        }}
        onConfirm={handlePasswordConfirm}
        title="비밀번호 확인"
        description="프로젝트를 삭제하려면 비밀번호를 입력해주세요."
      />
    </>
  );
}


import React from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

async function getProject(slugOrId: string) {
  // 숫자면 ID로, 아니면 slug로 조회
  const isNumeric = /^\d+$/.test(slugOrId);
  
  try {
    // API 라우트를 통해 데이터 가져오기
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    let url = `${baseUrl}/api/projects?status=all`;
    if (isNumeric) {
      url += `&id=${slugOrId}`;
    } else {
      try {
        const decodedSlug = decodeURIComponent(slugOrId);
        url += `&slug=${encodeURIComponent(decodedSlug)}`;
      } catch {
        url += `&slug=${encodeURIComponent(slugOrId)}`;
      }
    }
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('API response not OK:', res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    const projects = data.projects || [];
    
    if (projects.length === 0) {
      console.error(`프로젝트를 찾을 수 없습니다: ${slugOrId} (isNumeric: ${isNumeric})`);
      return null;
    }
    
    const project = projects[0];
    
    if (!project) {
      console.error(`프로젝트를 찾을 수 없습니다: ${slugOrId} (isNumeric: ${isNumeric})`);
      return null;
    }
    
    // 데이터 형식 변환
    return {
      id: project.id,
      title: project.title || '',
      description: project.description || '',
      content: project.content || '',
      category: project.category || 'project',
      author: project.author || '김빛나',
      slug: project.slug || '',
      tags: Array.isArray(project.tags) ? project.tags : (typeof project.tags === 'string' ? JSON.parse(project.tags || '[]') : []),
      featured: project.featured || false,
      thumbnail_url: project.thumbnail_url || null,
      images: Array.isArray(project.images) ? project.images : (typeof project.images === 'string' ? JSON.parse(project.images || '[]') : []),
      project_date: project.project_date || null,
      project_period: project.project_period || null,
      award: project.award || null,
      link_url: project.link_url || null,
      github_url: project.github_url || null,
      view_count: project.view_count || 0,
      created_at: project.created_at || new Date().toISOString(),
      status: project.status || 'published',
    };
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        {project.award && (
          <p className="text-sm text-primary mb-4">🏆 {project.award}</p>
        )}
        {project.images && project.images.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {project.images.filter((src: string) => src && src.trim()).map((src: string, idx: number) => (
              <img key={src || idx} src={src} alt={project.title} className="w-full rounded-md border" />
            ))}
          </div>
        )}
        {project.content && (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }: any) => {
                  const src = props?.src ? String(props.src) : '';
                  if (!src || !src.trim()) return null;
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
              }}
            >
              {project.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}



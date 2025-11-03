import React from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

async function getProject(slugOrId: string) {
  // 숫자면 ID로, 아니면 slug로 조회
  const isNumeric = /^\d+$/.test(slugOrId);
  
  try {
    // 서버 컴포넌트에서는 절대 URL 필요
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    let url = `${baseUrl}/api/projects?status=all`;
    if (isNumeric) {
      url += `&id=${slugOrId}`;
    } else {
      // slug는 이미 URL에 포함되어 있으므로 디코딩 후 다시 인코딩
      const decodedSlug = decodeURIComponent(slugOrId);
      url += `&slug=${encodeURIComponent(decodedSlug)}`;
    }
    
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error('API response not OK:', res.status, res.statusText);
      return null;
    }
    const data = await res.json();
    const list = data.projects || [];
    const project = list[0] || null;
    
    if (!project) {
      console.error(`프로젝트를 찾을 수 없습니다: ${slugOrId} (isNumeric: ${isNumeric})`);
    }
    
    return project;
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



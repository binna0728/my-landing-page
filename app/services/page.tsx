import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "서비스 — AI 헬스케어 초격차 캠프",
  description: "제공하는 서비스 소개",
};

export default function ServicesPage() {
  const services = [
    {
      title: "Next.js 랜딩 페이지",
      description: "TypeScript + Tailwind CSS + App Router 기반의 현대적인 랜딩 페이지 제작",
      tags: ["Next.js", "TypeScript", "Tailwind"],
    },
    {
      title: "Vercel 배포",
      description: "GitHub 연동 자동 배포, 성능 최적화, 커스텀 도메인 설정",
      tags: ["Vercel", "CI/CD", "DNS"],
    },
    {
      title: "SEO 최적화",
      description: "sitemap, robots.txt, 메타데이터, 구조화된 데이터로 검색 엔진 최적화",
      tags: ["SEO", "Metadata", "Schema"],
    },
    {
      title: "OAuth 인증",
      description: "Google, Kakao 소셜 로그인 구현으로 사용자 인증 시스템 구축",
      tags: ["OAuth", "Supabase", "Auth"],
    },
    {
      title: "블로그 시스템",
      description: "MDX 기반 콘텐츠 관리, 댓글 시스템, RSS 피드 생성",
      tags: ["MDX", "Contentlayer", "RSS"],
    },
    {
      title: "Cursor 자동화",
      description: "프롬프트 엔지니어링을 통한 개발 프로세스 자동화",
      tags: ["Cursor", "AI", "Automation"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">서비스</h1>
        <p className="text-lg text-muted-foreground mb-12">
          제공하는 주요 서비스와 기술 스택을 소개합니다.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


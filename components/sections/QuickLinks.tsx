import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BookOpen,
  Presentation,
  FileCode,
  ExternalLink,
  Download,
} from "lucide-react";
import Link from "next/link";

interface QuickLink {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  download?: boolean;
  type: "document" | "notebook" | "presentation" | "code";
}

const quickLinks: QuickLink[] = [
  {
    id: "course-log",
    title: "과정 로그",
    description: "AI 헬스케어 초격차 캠프 학습 기록",
    icon: <FileText className="h-5 w-5" />,
    href: "/blog",
    type: "document",
  },
  {
    id: "til",
    title: "TIL 모음",
    description: "Today I Learned - 일일 학습 정리",
    icon: <BookOpen className="h-5 w-5" />,
    href: "/blog?category=til",
    type: "document",
  },
  {
    id: "notebooks",
    title: "Jupyter 노트북",
    description: "데이터 분석 및 실험 노트북",
    icon: <FileCode className="h-5 w-5" />,
    href: "/blog?category=notebooks",
    type: "notebook",
  },
  {
    id: "presentations",
    title: "발표 자료",
    description: "프로젝트 및 연구 발표 슬라이드",
    icon: <Presentation className="h-5 w-5" />,
    href: "/blog?category=presentations",
    type: "presentation",
  },
];

export default function QuickLinks() {
  return (
    <section className="container mx-auto px-4 py-20 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">자료실</h2>
          <p className="text-lg text-muted-foreground">
            학습 자료와 문서에 빠르게 접근하세요.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const content = (
              <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-3 rounded-lg bg-primary/10 p-3 w-fit text-primary">
                    {link.icon}
                  </div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  <CardDescription className="text-sm">{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {link.download ? (
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      다운로드
                    </Button>
                  ) : (
                    <div className="flex items-center text-sm font-medium text-primary group-hover:underline">
                      바로가기
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );

            if (link.href) {
              return (
                <Link key={link.id} href={link.href}>
                  {content}
                </Link>
              );
            }

            return <div key={link.id}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}


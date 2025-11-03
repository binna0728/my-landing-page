import type { ResearchIssue } from "@/lib/content-extractor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Lightbulb, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ResearchIssuesProps {
  issues: ResearchIssue[];
}

export default function ResearchIssues({ issues }: ResearchIssuesProps) {
  return (
    <section className="container mx-auto px-4 py-20 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">연구 이슈</h2>
          <p className="text-lg text-muted-foreground">
            의료 AI 분야의 주요 연구 주제와 인사이트를 정리했습니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <Card
              key={issue.id}
              className="group flex flex-col shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="mb-3 flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="flex-1 text-lg">{issue.title}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  {issue.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* 문제 정의 */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    문제 정의
                  </div>
                  <p className="text-sm leading-relaxed">{issue.problem}</p>
                </div>

                {/* 인사이트 */}
                <div className="rounded-lg bg-accent/20 p-4">
                  <div className="mb-2 text-sm font-semibold text-accent-foreground">인사이트</div>
                  <p className="text-sm leading-relaxed">{issue.insight}</p>
                </div>

                {/* 링크 */}
                {issue.link && (
                  <Link
                    href={issue.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    자세히 보기
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}

                {/* 날짜 */}
                {issue.date && (
                  <div className="pt-2 text-xs text-muted-foreground border-t">
                    {new Date(issue.date).toLocaleDateString("ko-KR")}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


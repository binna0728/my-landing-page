"use client";

import { useState } from "react";
import type { TimelineEntry } from "@/lib/content-extractor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar, CheckCircle2, Clock, PlayCircle, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TimelineProps {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: TimelineProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const getProgressIcon = (progress: TimelineEntry["progress"]) => {
    switch (progress) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <PlayCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getProgressBadge = (progress: TimelineEntry["progress"]) => {
    const variants = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      planned: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    };
    const labels = {
      completed: "완료",
      "in-progress": "진행 중",
      planned: "예정",
    };
    return (
      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", variants[progress])}>
        {labels[progress]}
      </span>
    );
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">학습 타임라인</h2>
          <p className="text-lg text-muted-foreground">
            과정 진행 상황과 주요 학습 내용을 날짜별로 정리했습니다.
          </p>
        </div>

        <div className="relative">
          {/* 타임라인 라인 */}
          <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-border md:block" />

          {/* 스크롤 가능한 컨테이너 */}
          <div className="max-h-[800px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50">
            <Accordion
              type="multiple"
              value={expandedItems}
              onValueChange={setExpandedItems}
              className="space-y-4"
            >
            {entries.map((entry, index) => (
              <AccordionItem
                key={entry.id}
                value={entry.id}
                className="border-none"
              >
                <div className="relative flex gap-6">
                  {/* 날짜 표시 */}
                  <div className="flex shrink-0 flex-col items-center gap-2">
                    <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-card border-2 border-primary shadow-md md:flex">
                      {getProgressIcon(entry.progress)}
                    </div>
                    <div className="mt-1 text-left md:hidden">
                      {getProgressBadge(entry.progress)}
                    </div>
                  </div>

                  {/* 컨텐츠 카드 */}
                  <Card className="flex-1 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={entry.date}>
                              {new Date(entry.date).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                            {entry.week && (
                              <>
                                <span>•</span>
                                <span>주차 {entry.week}</span>
                              </>
                            )}
                          </div>
                          <AccordionTrigger className="hover:no-underline p-0">
                            <CardTitle className="mb-2 text-left group-hover:text-primary transition-colors">
                              {entry.title}
                            </CardTitle>
                          </AccordionTrigger>
                          <CardDescription className="text-base">{entry.summary}</CardDescription>
                        </div>
                        <div className="hidden md:flex md:flex-col md:items-end md:gap-2">
                          {getProgressBadge(entry.progress)}
                          <ChevronDown className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform duration-200",
                            expandedItems.includes(entry.id) && "rotate-180"
                          )} />
                        </div>
                      </div>
                    </CardHeader>

                    <AccordionContent className="pt-0">
                      <CardContent className="pt-0 space-y-4">
                        {/* 태그 */}
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* 키워드 */}
                        {entry.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs font-medium text-muted-foreground">핵심 키워드:</span>
                            {entry.keywords.map((keyword) => (
                              <span key={keyword} className="text-xs text-primary font-medium">
                                #{keyword}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 상세 페이지 링크 */}
                        <div className="pt-4 border-t">
                          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                            <Link href={`/blog/${entry.id}`} className="flex items-center gap-2">
                              자세히 보기
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </div>
              </AccordionItem>
            ))}
            </Accordion>
          </div>

          {/* 더 보기 버튼 */}
          {entries.length > 0 && (
            <div className="mt-8 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">
                  전체 타임라인 보기
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


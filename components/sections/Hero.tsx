import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Sparkles, Github, BookOpen } from "lucide-react";
import Orb from "@/components/ui/Orb";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-primary/5 via-accent/5 to-secondary/10" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-transparent to-primary/10" />
      
      {/* Orb 배경 */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="h-full w-full">
          <Orb
            hue={200}
            hoverIntensity={0.5}
            rotateOnHover={true}
            forceHoverState={false}
          />
        </div>
      </div>

      {/* 부드러운 그라데이션 장식 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* 우측 상단 - Primary 색상 */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-2xl" />
        
        {/* 좌측 하단 - Accent 색상 */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-2xl" />
        
        {/* 중앙 - Secondary 색상 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl" />
      </div>
      
      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <div className="container relative z-10 mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-5xl text-center">
          {/* 과정 정보 라벨 */}
          <div className="mb-6 flex justify-center">
            <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-gray-700 dark:text-gray-300">
              OZ 코딩스쿨 × DACON | AI 헬스케어 초격차 부트캠프 1기
            </Badge>
          </div>

          {/* 아이콘 영역 */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-secondary blur-xl opacity-50 animate-pulse" />
              <div className="relative rounded-full bg-card/80 backdrop-blur-sm p-4 shadow-lg border border-primary/10">
                <BrainCircuit className="h-12 w-12 text-primary" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* 이름 & 직함 */}
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            <span className="text-gray-800 dark:text-gray-100">
              김빛나
            </span>
            <span className="text-gray-700 dark:text-gray-200"> · 의료 AI 연구자</span>
          </h2>

          {/* 메인 슬로건 */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-primary">
              AI 진단은 이해다.
            </span>
          </h1>

          {/* 서브 카피 */}
          <p className="mb-4 text-xl font-medium text-gray-800 dark:text-gray-200 sm:text-2xl">
            예측을 넘어, 이해의 시대로.
          </p>

          {/* 추가 설명 */}
          <p className="mb-12 max-w-2xl mx-auto text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">
            변수와 오류로 이루어진 세계 속에서
            <br className="hidden sm:block" />
            기술은 생명의 방향을 계산한다.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="shadow-lg group">
              <Link href="/blog" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                실습 기록 보기
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow-lg group">
              <Link href="/blog" className="flex items-center gap-2">
                <Github className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                GitHub 로그 보기
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="group">
              <Link href="/about" className="flex items-center gap-2">
                나의 AI 여정 따라가기
                <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

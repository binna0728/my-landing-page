import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/Timeline";
import ResearchIssues from "@/components/sections/ResearchIssues";
import Projects from "@/components/sections/Projects";
import QuickLinks from "@/components/sections/QuickLinks";
import CTA from "@/components/sections/CTA";
import { getTimelineEntries, getResearchIssues, getProjects } from "@/lib/content";

export default async function Home() {
  // 데이터 로드
  const [timelineEntries, researchIssues, projects] = await Promise.all([
    getTimelineEntries(),
    getResearchIssues(),
    getProjects(),
  ]);

  return (
    <div className="flex flex-col">
      {/* 히어로 섹션: 김빛나 소개 */}
      <Hero />

      {/* 학습 타임라인: 날짜/주차별 정리 */}
      <Timeline entries={timelineEntries} />

      {/* 연구 이슈 섹션: 의료 AI 관련 논문/이슈 */}
      <ResearchIssues issues={researchIssues} />

      {/* 프로젝트 구역: 썸네일 대신 아이콘/배경 패턴 + 스택 배지 */}
      <Projects projects={projects} />

      {/* 자료실 Quick Links: 정리된 문서, 노트북, 발표자료 */}
      <QuickLinks />

      {/* CTA: 다음 연구 협업 제안 */}
      <CTA />
    </div>
  );
}

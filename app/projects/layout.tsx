import { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로젝트 — 김빛나 | AI 헬스케어 연구자",
  description: "김빛나가 진행한 AI 헬스케어 관련 프로젝트 및 연구 결과",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import path from "path";
import type {
  ContentMetadata,
  TimelineEntry,
  ResearchIssue,
  Project,
} from "./content-extractor";
import { extractFileMetadata, findMarkdownFiles } from "./content-extractor";

// 콘텐츠 데이터를 수집하고 구조화하는 함수들

export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  // 실제로는 파일 시스템에서 읽어오지만, 현재는 샘플 데이터 사용
  // 나중에 실제 파일에서 추출 가능
  const sampleData: TimelineEntry[] = [
    {
      id: "day-1",
      date: "2025-01-01",
      title: "Next.js 프로젝트 생성 및 기본 설정",
      summary:
        "TypeScript, Tailwind CSS, App Router를 활용한 Next.js 프로젝트 생성. shadcn/ui 컴포넌트 설치 및 기본 레이아웃 구성.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
      week: 1,
      progress: "completed",
      keywords: ["프로젝트 설정", "컴포넌트", "레이아웃"],
    },
    {
      id: "day-2",
      date: "2025-01-02",
      title: "페이지 구조 설계 및 라우팅",
      summary:
        "홈, 소개, 서비스, 블로그, 문의 페이지 구성. Header/Footer 레이아웃 컴포넌트 제작.",
      tags: ["Next.js", "라우팅", "컴포넌트"],
      week: 1,
      progress: "completed",
      keywords: ["라우팅", "페이지 구조", "네비게이션"],
    },
    {
      id: "day-3",
      date: "2025-01-03",
      title: "API 라우트 및 SEO 최적화",
      summary:
        "Contact, Blog, Newsletter, Stats API 구현. sitemap.ts, robots.ts 설정으로 SEO 최적화.",
      tags: ["API", "SEO", "sitemap"],
      week: 1,
      progress: "completed",
      keywords: ["API", "SEO", "검색 엔진 최적화"],
    },
  ];

  // 실제 파일에서 데이터 추출 시도 (옵셔널)
  // 프로덕션에서는 파일 시스템 접근이 제한될 수 있으므로 샘플 데이터 사용
  try {
    const parentDir = path.join(process.cwd(), "..");
    const files = await findMarkdownFiles(".", parentDir);
    const filteredFiles = files
      .filter((f) => f.includes("it-course-log") || f.includes("day"))
      .slice(0, 5);

    if (filteredFiles.length > 0) {
      const metadataList = await Promise.all(
        filteredFiles.map((f) => extractFileMetadata(f, parentDir))
      );

      const entries = metadataList
        .filter((m): m is ContentMetadata => m !== null)
        .filter((m) => m.type === "learning" && !m.draft)
        .map((m, idx) => ({
          id: `entry-${idx}`,
          date: m.date || new Date().toISOString().split("T")[0],
          title: m.title,
          summary: m.summary || m.description || "",
          tags: m.tags || [],
          progress: "completed" as const,
          keywords: m.tags?.slice(0, 4) || [],
          sourcePath: m.sourcePath,
        }));

      if (entries.length > 0) {
        return entries;
      }
    }
  } catch (error) {
    // 파일 읽기 실패 시 샘플 데이터 사용
    console.warn("Failed to load content from files, using sample data:", error);
  }

  return sampleData;
}

export async function getResearchIssues(): Promise<ResearchIssue[]> {
  return [
    {
      id: "research-1",
      title: "의료 이미지 분류를 위한 딥러닝 모델",
      problem:
        "X-ray 이미지에서 폐렴을 정확하게 감지하는 것이 의료진의 업무 부담을 줄일 수 있습니다.",
      insight:
        "Transfer learning과 Data augmentation을 활용하여 소규모 데이터셋에서도 높은 정확도를 달성할 수 있습니다.",
      tags: ["딥러닝", "의료 AI", "이미지 분류", "Transfer Learning"],
      date: "2025-01-15",
    },
    {
      id: "research-2",
      title: "환자 데이터 프라이버시 보호",
      problem:
        "의료 데이터는 민감정보이므로 HIPAA 규정을 준수하면서도 모델 학습이 가능해야 합니다.",
      insight:
        "Federated Learning과 Differential Privacy 기법을 조합하여 프라이버시를 보호하면서도 모델 성능을 유지할 수 있습니다.",
      tags: ["프라이버시", "Federated Learning", "HIPAA", "보안"],
      date: "2025-01-20",
    },
    {
      id: "research-3",
      title: "임상 의사결정 지원 시스템",
      problem:
        "의료진이 복잡한 환자 데이터를 빠르게 분석하고 최적의 치료 방법을 제안받을 수 있어야 합니다.",
      insight:
        "Graph Neural Network를 활용하여 환자-증상-질병 간의 관계를 모델링하면 더 정확한 진단이 가능합니다.",
      tags: ["임상 의사결정", "GNN", "진단 지원", "임상 AI"],
      date: "2025-01-25",
    },
  ];
}

export async function getProjects(): Promise<Project[]> {
  return [
    {
      id: "project-1",
      title: "AI 헬스케어 블로그 플랫폼",
      description:
        "Next.js와 Vercel을 활용한 개인 기술 블로그. 학습 기록과 연구 결과를 체계적으로 관리합니다.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      achievements: ["Lighthouse 95+", "SEO 최적화", "반응형 디자인"],
      date: "2025-01-01",
      status: "completed",
      icon: "blog",
    },
    {
      id: "project-2",
      title: "의료 이미지 분석 대시보드",
      description:
        "X-ray 이미지를 업로드하고 AI 모델로 분석 결과를 시각화하는 웹 대시보드.",
      stack: ["React", "TensorFlow.js", "FastAPI", "PostgreSQL"],
      achievements: ["정확도 92%", "실시간 분석", "히트맵 시각화"],
      status: "in-progress",
      icon: "dashboard",
    },
    {
      id: "project-3",
      title: "환자 데이터 관리 시스템",
      description:
        "HIPAA 규정을 준수하는 환자 데이터 관리 및 분석 시스템.",
      stack: ["Next.js", "Supabase", "PostgreSQL", "Encryption"],
      achievements: ["HIPAA 준수", "암호화 저장", "접근 제어"],
      status: "planned",
      icon: "database",
    },
  ];
}

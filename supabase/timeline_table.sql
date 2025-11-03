-- 학습 타임라인 테이블 생성
CREATE TABLE IF NOT EXISTS timeline (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT, -- summary 역할
  content TEXT, -- 상세 내용 (마크다운)
  category VARCHAR(50) DEFAULT 'learning',
  author VARCHAR(100) DEFAULT '김빛나',
  
  -- 메타 정보
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  progress VARCHAR(50) DEFAULT 'completed', -- completed, in-progress, planned
  week INTEGER, -- 주차 정보
  link_url TEXT, -- 관련 자료 링크

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_timeline_date ON timeline(date DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_progress ON timeline(progress);
CREATE INDEX IF NOT EXISTS idx_timeline_category ON timeline(category);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_timeline_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
DROP TRIGGER IF EXISTS update_timeline_updated_at ON timeline;
CREATE TRIGGER update_timeline_updated_at
    BEFORE UPDATE ON timeline
    FOR EACH ROW
    EXECUTE FUNCTION update_timeline_updated_at();

-- 샘플 데이터 삽입 (선택 사항)
INSERT INTO timeline (
  date, title, description, content, tags, keywords, progress, week, link_url
) VALUES
(
  '2025-01-01',
  'Next.js 프로젝트 생성 및 기본 설정',
  'TypeScript, Tailwind CSS, App Router를 활용한 Next.js 프로젝트 생성. shadcn/ui 컴포넌트 설치 및 기본 레이아웃 구성.',
  '# Next.js 프로젝트 생성 및 기본 설정\n\n이 글에서는 Next.js 프로젝트를 생성하고 기본 설정을 완료하는 방법을 알아봅니다.',
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui']::TEXT[],
  ARRAY['프로젝트 설정', '컴포넌트', '레이아웃']::TEXT[],
  'completed',
  1,
  'https://nextjs.org/docs'
),
(
  '2025-01-02',
  '페이지 구조 설계 및 라우팅',
  '홈, 소개, 서비스, 블로그, 문의 페이지 구성. Header/Footer 레이아웃 컴포넌트 제작.',
  '# 페이지 구조 설계 및 라우팅\n\nNext.js App Router를 활용한 페이지 구조 설계와 라우팅 설정 방법입니다.',
  ARRAY['Next.js', '라우팅', '컴포넌트']::TEXT[],
  ARRAY['라우팅', '페이지 구조', '네비게이션']::TEXT[],
  'completed',
  1,
  'https://nextjs.org/docs/app/building-your-application/routing'
) ON CONFLICT (date, title) DO NOTHING;



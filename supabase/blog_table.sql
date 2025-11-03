-- 블로그 게시판 테이블 생성
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'learning',
  author VARCHAR(100) DEFAULT '김빛나',
  slug VARCHAR(255) UNIQUE,
  
  -- 메타 정보
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft',
  
  -- 미디어
  thumbnail_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  reading_time VARCHAR(20),
  
  -- 타임스탬프
  publish_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_posts_updated_at();

-- 샘플 데이터 삽입
INSERT INTO blog_posts (
  title, description, content, category, author, 
  featured, status, tags, slug, publish_date
) VALUES
(
  'Next.js 프로젝트 생성하기',
  'TypeScript, Tailwind CSS, App Router를 사용한 Next.js 프로젝트 생성 방법',
  $content1$# Next.js 프로젝트 생성하기

이 글에서는 Next.js 프로젝트를 생성하는 방법을 알아봅니다.

## 설치

```bash
npx create-next-app@latest my-landing-page --typescript --tailwind --app
```

## 프로젝트 구조

- `app/` - App Router 기반 페이지
- `components/` - 재사용 가능한 컴포넌트
- `public/` - 정적 파일

## 다음 단계

프로젝트가 생성되면 개발 서버를 실행할 수 있습니다.$content1$,
  'learning',
  '김빛나',
  true,
  'published',
  ARRAY['Next.js', 'TypeScript', 'Tailwind']::TEXT[],
  'nextjs-setup',
  NOW()
),
(
  'shadcn/ui 컴포넌트 설치',
  'shadcn/ui를 활용한 현대적인 UI 컴포넌트 구축',
  $content2$# shadcn/ui 컴포넌트 설치

shadcn/ui는 복사-붙여넣기 방식의 컴포넌트 라이브러리입니다.

## 설치

```bash
npx shadcn@latest init
```

## 컴포넌트 추가

```bash
npx shadcn@latest add button card
```

이렇게 하면 컴포넌트가 `components/ui` 디렉토리에 추가됩니다.$content2$,
  'learning',
  '김빛나',
  false,
  'published',
  ARRAY['shadcn/ui', 'UI', '컴포넌트']::TEXT[],
  'shadcn-setup',
  NOW()
),
(
  'Vercel 배포 가이드',
  'GitHub와 연동하여 Vercel로 자동 배포하는 방법',
  $content3$# Vercel 배포 가이드

Vercel은 Next.js 프로젝트를 배포하기에 최적화된 플랫폼입니다.

## 배포 방법

1. GitHub에 프로젝트를 푸시합니다.
2. Vercel에 로그인하고 "New Project"를 클릭합니다.
3. GitHub 저장소를 선택합니다.
4. 환경 변수를 설정하고 배포합니다.

## 자동 배포

GitHub에 푸시하면 자동으로 배포가 시작됩니다.$content3$,
  'learning',
  '김빛나',
  false,
  'published',
  ARRAY['Vercel', '배포', 'CI/CD']::TEXT[],
  'vercel-deployment',
  NOW()
) ON CONFLICT (slug) DO NOTHING;


# 📝 Supabase 기반 게시판 시스템 구축 가이드

## Cursor 프롬프트 (복사해서 사용)

```
Supabase 기반 게시판 시스템을 구축해주세요.

게시판 정보:
- 게시판명: [게시판명]
- 테이블명: [테이블명]
- API 경로: /api/[게시판명]
- 페이지 경로: /[게시판명]
- 카테고리: [카테고리1, 카테고리2, 카테고리3]
- 컬러 테마: [색상명] (purple, blue, green 등)

구현 사항:
1. Supabase SQL 스크립트 생성
   - 테이블 생성 (id, title, description, content, category, author, slug, tags, featured, status, thumbnail_url, images, view_count, comment_count, publish_date, created_at, updated_at)
   - 인덱스 추가 (status, category, featured, publish_date, slug)
   - 샘플 데이터 1개

2. API 라우트 생성
   - app/api/[게시판명]/route.ts
   - GET: 게시글 목록 조회 (status, category 필터링 지원)
   - POST: 새 게시글 작성 (slug 자동 생성)
   - PATCH: 게시글 수정
   - DELETE: 게시글 삭제

3. 메인 리스트 페이지
   - app/[게시판명]/page.tsx
   - Hero 섹션 (제목, 설명, 검색바, 통계)
   - 카테고리 필터 버튼
   - 게시글 그리드 (3열 반응형)
   - 페이지네이션
   - Floating 작성 버튼

4. 글 작성 다이얼로그
   - components/[게시판명]/[게시판명]-write-dialog.tsx
   - 제목, 설명, 내용, 카테고리, featured 입력
   - 임시저장(draft) / 발행(published) 버튼

5. 상세 페이지 (선택사항)
   - app/[게시판명]/[category]/[slug]/page.tsx
   - 마크다운 렌더링
   - 조회수 증가
   - 이전/다음 글 네비게이션

기존 블로그(/blog)와 동일한 UI/UX 패턴을 유지하되, 
Supabase REST API를 직접 호출하는 방식으로 구현해주세요.

참고 파일:
- app/api/blog/posts/route.ts
- app/blog/page.tsx
```

## 빠른 시작

1. Supabase 프로젝트 생성 및 환경 변수 설정
2. 위 프롬프트를 Cursor에 붙여넣고 [게시판명] 부분만 원하는 이름으로 변경
3. 카테고리와 컬러 테마 지정
4. 생성된 SQL 스크립트를 Supabase SQL Editor에서 실행
5. 완성!

## 테이블 구조

```sql
CREATE TABLE IF NOT EXISTS [테이블명] (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(50) NOT NULL,
  author VARCHAR(100) DEFAULT '관리자',
  slug VARCHAR(255) UNIQUE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft',
  thumbnail_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  reading_time VARCHAR(20),
  publish_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 환경 변수

`.env.local`에 추가:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```


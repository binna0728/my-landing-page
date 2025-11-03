# 📝 공지사항 게시판 설정 가이드

## 완료된 작업

✅ Supabase 클라이언트 설정 (`lib/supabase.ts`)
✅ Supabase SQL 스크립트 (`supabase/notice_table.sql`)
✅ API 라우트 (`app/api/notice/route.ts`)
✅ 메인 리스트 페이지 (`app/notice/page.tsx`)
✅ 글 작성 다이얼로그 (`components/notice/notice-write-dialog.tsx`)
✅ 상세 페이지 (`app/notice/[category]/[slug]/page.tsx`)
✅ Select UI 컴포넌트 (`components/ui/select.tsx`)
✅ @supabase/supabase-js 패키지 설치

## 설정 방법

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성
3. 프로젝트 URL과 anon key 복사

### 2. 환경 변수 설정

`.env.local` 파일에 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Supabase 테이블 생성

1. Supabase 대시보드에서 SQL Editor 열기
2. `supabase/notice_table.sql` 파일의 내용을 복사해서 실행
3. 테이블과 인덱스가 생성되었는지 확인

### 4. 접속 확인

- 메인 페이지: `/notice`
- 상세 페이지: `/notice/[category]/[slug]`

## 사용 방법

1. **게시글 작성**: "새 글 작성" 버튼 또는 Floating 버튼 클릭
2. **카테고리 선택**: 일반, 공지, 업데이트
3. **임시저장**: draft 상태로 저장
4. **발행**: published 상태로 게시

## 주요 기능

- ✅ CRUD 기능 (생성, 조회, 수정, 삭제)
- ✅ 검색 기능
- ✅ 카테고리 필터
- ✅ 페이지네이션
- ✅ 추천 게시글 표시
- ✅ 조회수 표시
- ✅ 마크다운 지원

## 다음 단계

다른 게시판을 만들려면:
- `notice` → 원하는 게시판명으로 변경
- `notices` 테이블명 → 원하는 테이블명으로 변경
- 카테고리 수정
- 컬러 테마 변경


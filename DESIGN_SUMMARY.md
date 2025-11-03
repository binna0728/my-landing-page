# 블로그 랜딩 페이지 재디자인 요약

## 작업 완료 내역

### 1. 콘텐츠 추출 시스템
- **파일**: `lib/content-extractor.ts`
- **기능**:
  - 마크다운 파일에서 frontmatter 자동 추출
  - 파일명에서 날짜 추출
  - 본문 요약 자동 생성 (첫 200자)
  - 콘텐츠 타입 자동 분류 (learning, research, project, note)

### 2. 콘텐츠 데이터 구조
- **파일**: `lib/content.ts`
- **데이터 타입**:
  - `TimelineEntry`: 학습 타임라인 항목
  - `ResearchIssue`: 연구 이슈 카드
  - `Project`: 프로젝트 정보
- **특징**: 실제 파일에서 추출 시도, 실패 시 샘플 데이터 사용

### 3. 컴포넌트 구조

#### Hero 섹션 (`components/sections/Hero.tsx`)
- 김빛나 개인 브랜딩 강조
- "의료 AI 연구자" 타이틀
- 그라데이션 배경 (하늘색, 민트 톤)
- CTA 버튼 (블로그 보기, 문의하기)

#### Timeline 섹션 (`components/sections/Timeline.tsx`)
- 날짜별 학습 진행 상황
- 진행 상태 표시 (완료/진행중/예정)
- 태그 및 핵심 키워드 표시
- 반응형 레이아웃 (모바일/태블릿/데스크톱)

#### ResearchIssues 섹션 (`components/sections/ResearchIssues.tsx`)
- 의료 AI 관련 연구 주제 카드
- 문제 정의 + 인사이트 구조
- 태그 기반 분류
- 호버 효과 및 트랜지션

#### Projects 섹션 (`components/sections/Projects.tsx`)
- 아이콘 기반 프로젝트 카드
- 기술 스택 배지
- 주요 성과 강조
- 상태 표시 (완료/진행중/예정)

#### QuickLinks 섹션 (`components/sections/QuickLinks.tsx`)
- 자료실 빠른 접근
- 문서, 노트북, 발표자료 링크
- 아이콘 기반 네비게이션

#### CTA 섹션 (`components/sections/CTA.tsx`)
- 연구 협업 제안
- 문의하기 및 블로그 링크

### 4. 디자인 시스템

#### 테마
- **Candyland 테마** 적용 (globals.css)
- 의료/헬스케어 분위기:
  - Primary: 따뜻한 코랄 톤 (oklch(0.8677 0.0735 7.0855))
  - Secondary: 보라색 톤 (oklch(0.8148 0.0819 225.7537))
  - Accent: 노란색 톤 (oklch(0.9680 0.2110 109.7692))

#### 폰트
- Poppins (Sans-serif)
- Roboto Mono (Monospace)

#### 색상 팔레트
- 하늘색 계열: sky-50, cyan-50, teal-50
- 민트/아이보리 계열: accent 색상 활용
- 다크모드 완전 지원

### 5. 접근성
- 시멘틱 HTML 태그 사용
- aria-label 적용 가능한 구조
- 키보드 네비게이션 지원
- 명도 대비 확보 (WCAG 준수)

### 6. 반응형 디자인
- 모바일: 1열 레이아웃
- 태블릿: 2열 그리드
- 데스크톱: 3열 그리드
- 중요한 정보는 상단 배치

## 파일 구조

```
my-landing-page/
├── app/
│   ├── page.tsx (재구성된 메인 페이지)
│   ├── layout.tsx (폰트 업데이트)
│   └── globals.css (Candyland 테마 적용)
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Timeline.tsx
│   │   ├── ResearchIssues.tsx
│   │   ├── Projects.tsx
│   │   ├── QuickLinks.tsx
│   │   └── CTA.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
└── lib/
    ├── content-extractor.ts (콘텐츠 추출 유틸)
    └── content.ts (데이터 매핑)
```

## 원본 자료 매핑

### 타임라인 섹션
- `it-course-log-cursor-blog.md` 파일의 날짜 및 섹션 정보 자동 추출
- Day-by-Day 진행 로그를 타임라인 항목으로 변환

### 연구 이슈 섹션
- 현재 샘플 데이터 사용
- 향후 마크다운 파일의 "연구 이슈" 섹션에서 자동 추출 가능

### 프로젝트 섹션
- 현재 샘플 데이터 사용
- 향후 프로젝트 폴더 구조에서 자동 추출 가능

## 추가 제안

### 1. 콘텐츠 자동화 강화
- Jupyter 노트북 (.ipynb) 파싱 추가
- PDF 메타데이터 추출
- 날짜 기반 자동 정렬

### 2. 검색 기능
- 클라이언트 사이드 검색 추가
- 태그/카테고리 필터링

### 3. 애니메이션
- Framer Motion으로 섹션 페이드인/슬라이드 효과
- 스크롤 트리거 애니메이션

### 4. 다국어 지원
- i18n 설정 (한국어/영어)

### 5. SEO 강화
- 구조화된 데이터 (JSON-LD) 추가
- Open Graph 이미지 생성

## 실행 방법

```bash
cd my-landing-page
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 빌드 확인

```bash
npm run build
```

모든 페이지가 정상적으로 빌드되었습니다. ✅

---

**작성일**: 2025-01-XX  
**디자이너/에디터**: AI Assistant  
**프로젝트**: 김빛나의 AI 헬스케어 기술 블로그


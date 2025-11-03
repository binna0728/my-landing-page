# AI 헬스케어 초격차 캠프 — 빛나의 IT 기술 블로그

이 프로젝트는 AI 헬스케어 초격차 캠프 과정을 따라하며 만들어진 Next.js 랜딩 페이지입니다.

## 🚀 기능

- ✅ Next.js 16 (App Router)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ shadcn/ui 컴포넌트
- ✅ SEO 최적화 (sitemap, robots.txt)
- ✅ API 라우트 (Contact, Blog, Newsletter, Stats)
- ✅ Vercel 배포 설정
- ✅ 반응형 디자인

## 📁 프로젝트 구조

```
my-landing-page/
├── app/
│   ├── api/           # API 라우트
│   ├── about/         # 소개 페이지
│   ├── blog/          # 블로그 페이지
│   ├── contact/       # 문의 페이지
│   ├── services/      # 서비스 페이지
│   ├── layout.tsx     # 루트 레이아웃
│   ├── page.tsx       # 홈 페이지
│   ├── robots.ts      # robots.txt
│   └── sitemap.ts     # sitemap.xml
├── components/
│   ├── layout/        # 레이아웃 컴포넌트 (Header, Footer)
│   └── ui/            # shadcn/ui 컴포넌트
├── scripts/
│   └── check-dns.mjs  # DNS 체크 스크립트
└── vercel.json        # Vercel 배포 설정
```

## 🛠️ 설치 및 실행

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 📝 환경 변수

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

배포 시에는 실제 도메인 URL로 변경하세요.

## 🚀 배포

### Vercel 배포

1. GitHub에 프로젝트를 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인합니다.
3. "New Project"를 클릭하고 GitHub 저장소를 선택합니다.
4. 환경 변수를 설정하고 배포합니다.

### DNS 설정

DNS 체크 스크립트를 실행하여 DNS 설정을 확인하세요:

```bash
npm run check-dns yourdomain.com
```

## 📚 주요 페이지

- `/` - 홈 페이지
- `/about` - 소개
- `/services` - 서비스
- `/blog` - 블로그 목록
- `/contact` - 문의하기

## 🔧 사용 기술

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## 📖 참고 문서

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [Vercel 문서](https://vercel.com/docs)

## 📄 라이선스

이 프로젝트는 개인 학습 목적으로 만들어졌습니다.

---

> **코딩은 놀이, 기록은 자산!** ✨

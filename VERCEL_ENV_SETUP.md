# Vercel 환경변수 설정 가이드

## 문제 상황
블로그와 프로젝트가 Vercel 배포 사이트에서 표시되지 않습니다. 이는 환경변수가 설정되지 않았기 때문입니다.

## 해결 방법

### 1. Vercel 대시보드에서 환경변수 설정

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. 프로젝트 선택: `my-landing-page`
3. Settings → Environment Variables 메뉴 이동
4. 다음 환경변수를 추가:

```
NEXT_PUBLIC_SUPABASE_URL=https://udimchcvervbxcnqjrcl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaW1jaGN2ZXJ2YnhjbnFqcmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDUwODUsImV4cCI6MjA3NzcyMTA4NX0.uqd1qFh5tekwi4Sxyb3xrqOyThfJmIeW8phwxOMP8Kg
```

5. 각 환경변수에 대해 다음 환경을 선택:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

6. **중요**: 환경변수를 추가한 후 반드시 **Redeploy**를 해야 합니다!
   - Deployments 탭으로 이동
   - 최신 배포의 "..." 메뉴 클릭
   - "Redeploy" 선택

### 2. 환경변수 확인

환경변수가 제대로 설정되었는지 확인하려면:

1. Vercel Dashboard → 프로젝트 → Settings → Environment Variables
2. 다음 변수들이 있는지 확인:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. 배포 후 확인

환경변수를 설정하고 재배포한 후:
- https://my-landing-page-5hjx.vercel.app/blog - 블로그 목록이 표시되어야 함 (33개)
- https://my-landing-page-5hjx.vercel.app/projects - 프로젝트 목록이 표시되어야 함 (1개)

## 현재 상태

✅ 로컬 환경: 환경변수 설정 완료, 정상 작동
❌ Vercel 프로덕션: 환경변수 설정 필요

## 참고

- `.env.local` 파일은 Git에 커밋되지 않으므로, Vercel에 수동으로 설정해야 합니다.
- `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에서도 접근 가능합니다.
- 환경변수를 변경한 후에는 반드시 재배포해야 변경사항이 적용됩니다.

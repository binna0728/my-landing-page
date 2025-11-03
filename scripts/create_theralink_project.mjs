import fs from 'fs/promises';
import path from 'path';

async function loadEnvLocals() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const raw = await fs.readFile(envPath, 'utf-8');
    for (const line of raw.split(/\r?\n/)) {
      if (!line || line.trim().startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      if (process.env[key] == null) process.env[key] = val;
    }
  } catch {
    // ignore
  }
}

async function main() {
  await loadEnvLocals();
  
  // 환경변수가 없으면 직접 설정
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://udimchcvervbxcnqjrcl.supabase.co';
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaW1jaGN2ZXJ2YnhjbnFqcmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDUwODUsImV4cCI6MjA3NzcyMTA4NX0.uqd1qFh5tekwi4Sxyb3xrqOyThfJmIeW8phwxOMP8Kg';
  }
  
  // 이미지 파일 목록 수집
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'theralink-smoking-insight');
  const files = await fs.readdir(uploadsDir);
  const imageFiles = files
    .filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });

  const images = imageFiles.map(f => `/uploads/theralink-smoking-insight/${f}`);

  const content = `💡 데이터에서 행동으로 — TheraLink의 '흡연 인사이트' 프로젝트



10월 30일, TheraLink 팀이 오즈스쿨 4조에서 진행한 데이터 분석 발표가
'인사이트상'을 수상했습니다.

이번 프로젝트의 주제는 단순한 "흡연과 건강"이 아니었습니다.
우리는 데이터를 넘어서, 행동 변화를 만드는 방법을 고민했습니다.

🩺 1. 데이터가 말한 사실
헬스케어 데이터를 분석한 결과,
흡연자는 비흡연자보다 BMI와 중성지방 수치가 유의하게 높고,
좋은 콜레스테롤(HDL) 은 낮게 나타났습니다.
숫자가 보여준 건 분명했습니다.
흡연은 단순한 습관이 아니라, 신체의 지표를 바꾸는 위험요인이라는 사실.

🔍 2. 인사이트 — "보이지 않는 건강을, 보이게 하자"
인터뷰에서 청년층 흡연자들은 이렇게 말했습니다.
"몸이 망가진다는 걸 알아도, 실감이 안 나요."
우리는 이 말에서 출발했습니다.
즉각적 피드백이 없는 금연 캠페인 대신,
**'실시간으로 내 몸의 변화를 보여주는 연결 서비스'**를 만들기로 했습니다.

📱 3. 아이디어 제안 — '헬스커넥트: 금연관리 프로토타입'
TheraLink 팀은 데이터를 기반으로
보건소와 개인이 긴밀히 연결되어 관리받는
프로토타입 설문조사 앱 '헬스커넥트(Health Connect)' 를 제안했습니다.

- 개인은 흡연량·건강지표·기분 상태를 기록
- 앱은 실시간으로 건강 위험 신호를 시각화
- 보건소는 개별 맞춤 관리 피드백 제공

이 구조를 실제 UX로 구현하기 위해
러버블(Lovable) 을 활용해 작동 가능한 프로토타입을 제작했습니다.

🏆 4. 4조 오즈스쿨 '인사이트상' 수상
데이터 분석의 정교함,
서비스 기획의 실현 가능성,
그리고 디자인 완성도 모두에서 높은 평가를 받아
TheraLink는 인사이트상을 수상했습니다.

"데이터는 행동의 출발점이다.
우리의 목표는 '끊게 하는 금연'이 아니라, '돌아보게 하는 금연'이었다."

🌿 5. 다음 단계
TheraLink는 앞으로도
데이터로 문제를 발견하고,
디자인으로 행동을 이끄는 프로젝트를 이어갈 예정입니다.

#TheraLink #오즈스쿨4조 #흡연인사이트 #헬스커넥트 #러버블프로토타입 #인사이트상 #데이터기반디자인`;

  const payload = {
    title: 'TheraLink 흡연 인사이트 프로젝트',
    description: '데이터에서 행동으로 — 4조 오즈스쿨 발표 인사이트상 수상 프로젝트',
    content: content,
    category: 'project',
    author: '김빛나',
    featured: true,
    status: 'published',
    tags: ['TheraLink', '오즈스쿨 4조', '흡연인사이트', '헬스커넥트', '러버블프로토타입', '인사이트상', '데이터기반디자인'],
    thumbnail_url: images[0] || null,
    images: images,
    project_date: '2025-10-30',
    project_period: null,
    award: '인사이트상',
    link_url: null,
    github_url: null,
    slug: 'theralink-smoking-insight',
  };

  // Next.js API 라우트를 통해 생성 (서버 사이드이므로 RLS 우회)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API failed: ${res.status} ${res.statusText} ${text}`);
    }

    const data = await res.json();
    console.log('✓ 프로젝트 생성 완료:', data.id || data);
  } catch (error) {
    console.error('API 라우트 실패, Supabase 직접 시도...');
    
    // 폴백: Supabase 직접 호출
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase 환경변수가 필요합니다.');
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase failed: ${res.status} ${res.statusText} ${text}`);
    }

    const data = await res.json();
    console.log('✓ 프로젝트 생성 완료 (Supabase 직접):', Array.isArray(data) ? data[0]?.id : data?.id);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


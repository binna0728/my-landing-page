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

function toSlug(input) {
  return (input || '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyImagesInOrder(srcDir, destDir) {
  // destDir와 srcDir이 동일하면 복사 없이 파일명만 수집
  const sameDir = path.resolve(srcDir) === path.resolve(destDir);
  async function collectFilesRecursive(dir) {
    const out = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const nested = await collectFilesRecursive(full);
        out.push(...nested);
      } else if (/\.(png|jpg|jpeg|webp|gif)$/i.test(entry.name)) {
        out.push(full);
      }
    }
    return out;
  }

  const files = await collectFilesRecursive(srcDir);
  // 정렬: 경로/파일명 기준 한글 포함 정렬
  files.sort((a, b) => a.localeCompare(b, 'ko'));

  if (sameDir) {
    return files.map((f) => path.basename(f));
  } else {
    await ensureDir(destDir);
    const copied = [];
    for (const src of files) {
      const name = path.basename(src);
      const dest = path.join(destDir, name);
      await fs.copyFile(src, dest);
      copied.push(name);
    }
    return copied;
  }
}

function buildProjectPayload({
  title,
  description,
  content,
  category = 'project',
  award,
  projectDate,
  tags = [],
  imagesPaths = [],
}) {
  const slug = toSlug(title);
  const images = imagesPaths.map((p) => `/uploads/${slug}/${p}`);
  const thumbnail_url = images[0] || null;

  return {
    title,
    description,
    content,
    category,
    author: '김빛나',
    featured: true,
    status: 'published',
    tags,
    thumbnail_url,
    images,
    project_date: projectDate, // YYYY-MM-DD
    award,
    link_url: null,
    github_url: null,
    slug,
  };
}

async function createProject(payload) {
  // 1) 로컬 API 시도
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/projects`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return res.json();
  } catch (e) {
    // 무시하고 Supabase REST로 폴백
  }

  // 2) Supabase REST 폴백
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
    throw new Error(`Supabase create failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

async function main() {
  await loadEnvLocals();
  // Arguments
  // --src "D:\\00.test\\흡연 여부 데이터 분석을 통한 건강 인사이트 도출"
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const idx = args.findIndex((a) => a === name);
    if (idx >= 0 && args[idx + 1]) return args[idx + 1];
    return undefined;
  };

  const srcDir = getArg('--src');
  const argSupabaseUrl = getArg('--supabase-url');
  const argSupabaseKey = getArg('--supabase-key');
  if (argSupabaseUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = argSupabaseUrl;
  if (argSupabaseKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = argSupabaseKey;
  if (!srcDir) {
    console.error('사용법: node scripts/import_project_from_dir.mjs --src "<이미지 소스 폴더 경로>"');
    process.exit(1);
  }

  const title = 'TheraLink 흡연 인사이트 프로젝트';
  const description = '데이터에서 행동으로 — 4조 오즈스쿨 발표 인사이트상 수상 프로젝트';
  const content = `💡 데이터에서 행동으로 — TheraLink의 '흡연 인사이트' 프로젝트\n\n\n\n10월 30일, TheraLink 팀이 4조 오즈스쿨에서 진행한 데이터 분석 발표가\n\n‘인사이트상’을 수상했습니다.\n\n이번 프로젝트의 주제는 단순한 “흡연과 건강”이 아니었습니다.\n\n우리는 데이터를 넘어서, 행동 변화를 만드는 방법을 고민했습니다.\n\n🩺 1. 데이터가 말한 사실\n\n헬스케어 데이터를 분석한 결과,\n\n흡연자는 비흡연자보다 BMI와 중성지방 수치가 유의하게 높고,\n\n좋은 콜레스테롤(HDL) 은 낮게 나타났습니다.\n\n숫자가 보여준 건 분명했습니다.\n\n흡연은 단순한 습관이 아니라, 신체의 지표를 바꾸는 위험요인이라는 사실.\n\n🔍 2. 인사이트 — “보이지 않는 건강을, 보이게 하자”\n\n인터뷰에서 청년층 흡연자들은 이렇게 말했습니다.\n\n“몸이 망가진다는 걸 알아도, 실감이 안 나요.”\n\n우리는 이 말에서 출발했습니다.\n\n즉각적 피드백이 없는 금연 캠페인 대신,\n\n**‘실시간으로 내 몸의 변화를 보여주는 연결 서비스’**를 만들기로 했습니다.\n\n📱 3. 아이디어 제안 — ‘헬스커넥트: 금연관리 프로토타입’\n\nTheraLink 팀은 데이터를 기반으로\n\n보건소와 개인이 긴밀히 연결되어 관리받는\n\n프로토타입 설문조사 앱 ‘헬스커넥트(Health Connect)’ 를 제안했습니다.\n\n- 개인은 흡연량·건강지표·기분 상태를 기록\n- 앱은 실시간으로 건강 위험 신호를 시각화\n- 보건소는 개별 맞춤 관리 피드백 제공\n\n이 구조를 실제 UX로 구현하기 위해\n\n러버블(Lovable) 을 활용해 작동 가능한 프로토타입을 제작했습니다.\n\n🏆 4. 4조 오즈스쿨 '인사이트상' 수상\n\n데이터 분석의 정교함,\n\n서비스 기획의 실현 가능성,\n\n그리고 디자인 완성도 모두에서 높은 평가를 받아\n\nTheraLink는 인사이트상을 수상했습니다.\n\n“데이터는 행동의 출발점이다.\n\n우리의 목표는 ‘끊게 하는 금연’이 아니라, ‘돌아보게 하는 금연’이었다.”\n\n🌿 5. 다음 단계\n\nTheraLink는 앞으로도\n\n데이터로 문제를 발견하고,\n\n디자인으로 행동을 이끄는 프로젝트를 이어갈 예정입니다.\n\n#TheraLink #4조오즈스쿨 #흡연인사이트 #헬스커넥트 #러버블프로토타입 #인사이트상 #데이터기반디자인`;

  // 날짜: 요청 본문 기준 10월 30일, 연도는 현재 연도로 추정
  const now = new Date();
  const year = now.getFullYear();
  const projectDate = `${year}-10-30`;

  const tags = [
    'TheraLink',
    '4조 오즈스쿨',
    '흡연인사이트',
    '헬스커넥트',
    '러버블프로토타입',
    '인사이트상',
    '데이터기반디자인',
  ];

  const award = '인사이트상';
  const category = 'project';

  const slug = toSlug(title);
  const publicUploadsRoot = path.join(process.cwd(), 'public', 'uploads');
  const destDir = path.join(publicUploadsRoot, slug);

  const copied = await copyImagesInOrder(srcDir, destDir);
  if (copied.length === 0) {
    console.warn('이미지 파일을 찾지 못했습니다. (png, jpg, jpeg, webp, gif)');
  }

  const payload = buildProjectPayload({
    title,
    description,
    content,
    category,
    award,
    projectDate,
    tags,
    imagesPaths: copied,
  });

  const created = await createProject(payload);
  console.log('프로젝트 생성 완료:', created?.id || created);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



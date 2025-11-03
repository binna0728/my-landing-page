import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function loadEnvLocals() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

async function checkExistingPost(slug) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=id,title,slug`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    }
  } catch (e) {
    console.log(`  [디버그] 기존 포스트 확인 실패: ${e.message}`);
  }
  
  return null;
}

async function updatePost(id, payload) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const supabasePayload = {
    title: payload.title,
    content: payload.content,
    excerpt: payload.description,
    author: payload.author,
    category: payload.category,
    tags: payload.tags,
    status: payload.status,
    featured: payload.featured,
    publish_date: payload.publish_date,
    updated_at: new Date().toISOString(),
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(supabasePayload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`업데이트 실패: ${res.status} ${txt}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

async function postToApi(payload, updateMode = false) {
  console.log(`  [디버그] 포스트 처리 시작: ${payload.title} (slug: ${payload.slug})`);
  
  // 먼저 기존 포스트 확인
  const existing = await checkExistingPost(payload.slug);
  if (existing) {
    console.log(`  [디버그] 기존 포스트 발견: ID ${existing.id}`);
    if (updateMode) {
      console.log(`  [알림] 기존 포스트 업데이트: ${payload.title}`);
      return await updatePost(existing.id, payload);
    } else {
      console.log(`  [알림] 기존 포스트 건너뜀: ${payload.title}`);
      return existing;
    }
  }
  
  // 먼저 API를 시도하고, 실패하면 Supabase 직접 연결
  try {
    console.log(`  [디버그] API 라우트 시도: ${BASE_URL}/api/blog/posts`);
    const res = await fetch(`${BASE_URL}/api/blog/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (res.ok) {
      console.log(`  [디버그] API 라우트 성공`);
      return res.json();
    } else {
      console.log(`  [디버그] API 라우트 실패: ${res.status}`);
    }
  } catch (e) {
    console.log(`  [디버그] API 라우트 예외: ${e.message}`);
  }
  
  // 폴백: Supabase 직접 호출
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log(`  [디버그] Supabase 직접 호출 시도`);
  console.log(`  [디버그] SUPABASE_URL: ${SUPABASE_URL ? '설정됨' : '없음'}`);
  console.log(`  [디버그] SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '설정됨' : '없음'}`);
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase 환경변수가 필요합니다.');
  }

  // Supabase 형식에 맞게 데이터 변환
  const supabasePayload = {
    title: payload.title,
    content: payload.content,
    excerpt: payload.description,
    slug: payload.slug,
    author: payload.author,
    category: payload.category,
    tags: payload.tags,
    status: payload.status,
    featured: payload.featured,
    publish_date: payload.publish_date,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(supabasePayload),
  });

  if (!res.ok) {
    const txt = await res.text();
    const errorMsg = `Supabase ${res.status} ${res.statusText}: ${txt}`;
    console.log(`  [디버그] Supabase POST 실패: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const data = await res.json();
  console.log(`  [디버그] Supabase POST 성공`);
  return Array.isArray(data) ? data[0] : data;
}

async function main() {
  console.log('[디버그] 환경변수 로드 시작...');
  await loadEnvLocals();
  
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log(`[디버그] 환경변수 확인:`);
  console.log(`  SUPABASE_URL: ${SUPABASE_URL ? '✓ 설정됨' : '✗ 없음'}`);
  console.log(`  SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '✓ 설정됨' : '✗ 없음'}`);
  console.log(`  BASE_URL: ${BASE_URL}\n`);

  // 중복 처리 옵션 (명령줄에서 --skip 또는 --update 선택)
  const skipExisting = process.argv.includes('--skip');
  const updateExisting = process.argv.includes('--update');
  
  // JSON 파일 경로를 명령줄 인자로 받거나 기본값 사용
  const jsonFilePath = process.argv.find(arg => arg.endsWith('.json')) || path.join(__dirname, '..', 'blog_posts.json');
  
  console.log(`[디버그] JSON 파일 경로: ${jsonFilePath}`);
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`JSON 파일을 찾을 수 없습니다: ${jsonFilePath}`);
    process.exit(1);
  }

  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  const posts = jsonData.posts || [];
  console.log(`[디버그] JSON 파일에서 ${posts.length}개 포스트 로드됨\n`);

  if (posts.length === 0) {
    console.log('업로드할 포스트가 없습니다.');
    return;
  }

  console.log(`총 ${posts.length}개 포스트 처리 시작...`);
  console.log(`중복 처리 모드: ${skipExisting ? '건너뛰기' : updateExisting ? '업데이트' : '기본 (중복시 실패)'}\n`);

  let success = 0;
  let fail = 0;
  let skipped = 0;

  for (const post of posts) {
    try {
      // API 형식에 맞게 데이터 변환
      const payload = {
        title: post.title,
        description: post.description || '',
        content: post.content || '',
        category: post.category || 'learning',
        tags: Array.isArray(post.tags) ? post.tags : [],
        slug: post.slug,
        author: post.author || '김빛나',
        featured: post.featured || false,
        status: 'published',
        publish_date: post.date || post.publish_date || new Date().toISOString(),
      };

      // 기존 포스트 확인 (로깅용)
      const existing = await checkExistingPost(payload.slug);
      const data = await postToApi(payload, updateExisting);
      
      if (existing && data.id) {
        console.log(`✓ 업데이트 성공: ${post.title} -> ID: ${data.id}`);
      } else {
        console.log(`✓ 업로드 성공: ${post.title} -> ID: ${data.id || data.slug || 'unknown'}`);
      }
      success++;
      
      // API 부하를 줄이기 위해 약간의 딜레이
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      if (e.message.includes('already exists') || e.message.includes('duplicate')) {
        if (skipExisting) {
          console.log(`⊘ 건너뜀: ${post.title} (이미 존재)`);
          skipped++;
          continue;
        }
        if (updateExisting) {
          // 업데이트 시도
          try {
            const existing = await checkExistingPost(post.slug);
            if (existing) {
              const payload = {
                title: post.title,
                description: post.description || '',
                content: post.content || '',
                category: post.category || 'learning',
                tags: Array.isArray(post.tags) ? post.tags : [],
                slug: post.slug,
                author: post.author || '김빛나',
                featured: post.featured || false,
                status: 'published',
                publish_date: post.date || post.publish_date || new Date().toISOString(),
              };
              const updated = await updatePost(existing.id, payload);
              console.log(`✓ 업데이트 성공: ${post.title} -> ID: ${updated.id}`);
              success++;
              continue;
            }
          } catch (updateErr) {
            console.error(`  업데이트 실패: ${updateErr.message}`);
          }
        }
      }
      
      console.error(`✗ 업로드 실패: ${post.title || post.id || 'unknown'}`);
      console.error(`  오류: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n완료: 성공 ${success}, 실패 ${fail}${skipped > 0 ? `, 건너뜀 ${skipped}` : ''}`);
}

main().catch(err => {
  console.error('스크립트 실행 오류:', err);
  process.exit(1);
});


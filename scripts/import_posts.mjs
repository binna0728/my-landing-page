import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'posts');
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003';

function readFilesRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readFilesRecursively(fullPath));
    } else if (/\.(md|mdx|txt)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractTitleAndDescription(content, fallbackName) {
  const lines = content.split(/\r?\n/);
  let title = fallbackName;
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)/);
    if (m) { title = m[1].trim(); break; }
  }
  // 첫 번째 비어있지 않은 문단을 설명으로
  const para = content
    .split(/\n\n+/)
    .map(s => s.trim())
    .find(s => s && !s.startsWith('#')) || '';
  const description = para.slice(0, 200);
  return { title, description };
}

async function postToApi(payload) {
  const res = await fetch(`${BASE_URL}/api/blog/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${txt}`);
  }
  return res.json();
}

async function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`posts 폴더가 없습니다: ${POSTS_DIR}`);
    process.exit(1);
  }

  const files = readFilesRecursively(POSTS_DIR);
  if (files.length === 0) {
    console.log('업로드할 파일이 없습니다.');
    return;
  }

  console.log(`총 ${files.length}개 파일 업로드 시작...`);

  let success = 0, fail = 0;
  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const base = path.basename(file, path.extname(file));
      const { title, description } = extractTitleAndDescription(raw, base);
      const payload = {
        title,
        description,
        content: raw,
        category: 'learning',
        tags: [],
        status: 'published',
        author: '김빛나',
      };
      const data = await postToApi(payload);
      console.log(`✓ 업로드 성공: ${title} -> ${data.slug || data.id || ''}`);
      success++;
    } catch (e) {
      console.error(`✗ 업로드 실패: ${file} : ${e.message}`);
      fail++;
    }
  }

  console.log(`완료: 성공 ${success}, 실패 ${fail}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});




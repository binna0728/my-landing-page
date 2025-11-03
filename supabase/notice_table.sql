-- 공지사항 게시판 테이블 생성
CREATE TABLE IF NOT EXISTS notices (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  author VARCHAR(100) DEFAULT '관리자',
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
CREATE INDEX IF NOT EXISTS idx_notices_status ON notices(status);
CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category);
CREATE INDEX IF NOT EXISTS idx_notices_featured ON notices(featured);
CREATE INDEX IF NOT EXISTS idx_notices_publish_date ON notices(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_notices_slug ON notices(slug);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
DROP TRIGGER IF EXISTS update_notices_updated_at ON notices;
CREATE TRIGGER update_notices_updated_at
    BEFORE UPDATE ON notices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입
INSERT INTO notices (
  title, description, content, category, author, 
  featured, status, tags, slug, publish_date
) VALUES
(
  '환영합니다',
  '공지사항 게시판을 시작합니다',
  '# 환영합니다\n\n공지사항 게시판에 오신 것을 환영합니다.\n\n이 게시판은 Supabase를 활용한 게시판 시스템입니다.',
  'general',
  '관리자',
  true,
  'published',
  ARRAY['공지', '환영']::TEXT[],
  'welcome',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- RLS (Row Level Security) 설정 (선택사항)
-- ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read access" ON notices FOR SELECT USING (status = 'published');
-- CREATE POLICY "Public insert access" ON notices FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Public update access" ON notices FOR UPDATE USING (true);
-- CREATE POLICY "Public delete access" ON notices FOR DELETE USING (true);


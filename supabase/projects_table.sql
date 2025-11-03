-- 프로젝트 게시판 테이블 생성
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT, -- 상세 내용 (마크다운)
  category VARCHAR(50) NOT NULL DEFAULT 'research', -- 연구, 대회, 프로젝트
  author VARCHAR(100) DEFAULT '김빛나',
  slug VARCHAR(255) UNIQUE,

  -- 메타 정보
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft', -- draft, published

  -- 미디어
  thumbnail_url TEXT, -- 카드 썸네일 이미지
  images TEXT[] DEFAULT ARRAY[]::TEXT[], -- 상세 페이지 이미지 (상장, PPT 등)

  -- 프로젝트 관련 정보
  project_date DATE, -- 프로젝트 시작일 또는 완료일
  project_period VARCHAR(100), -- "2023.03 - 2023.09"
  award VARCHAR(255), -- 수상 내역
  link_url TEXT, -- 외부 링크 (데모, 결과 페이지 등)
  github_url TEXT, -- GitHub 저장소 링크

  -- 통계
  view_count INTEGER DEFAULT 0,

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_project_date ON projects(project_date DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_projects_updated_at();

-- 샘플 데이터 삽입
INSERT INTO projects (
  title, description, content, category, author, 
  featured, status, tags, thumbnail_url, images, 
  project_date, project_period, award, link_url, github_url, slug
) VALUES
(
  '의료 영상 기반 폐암 질환 예측 모델 개발',
  '석사논문 주제로 진행한 폐암 진단 AI 모델 개발 프로젝트입니다.',
  '# 프로젝트 개요\n\n폐암 진단을 위한 딥러닝 모델을 개발했습니다.\n\n## 사용 기술\n- TensorFlow, Keras\n- Python, OpenCV',
  'research',
  '김빛나',
  true,
  'published',
  ARRAY['AI', '의료', '폐암', '딥러닝']::TEXT[],
  'https://images.unsplash.com/photo-1612387642500-803727760869?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ARRAY['https://images.unsplash.com/photo-1612387642500-803727760869?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1584820927478-876437661268?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']::TEXT[],
  '2023-03-01',
  '2023.03 - 2023.09',
  '최우수상',
  'https://example.com/lung-cancer-project',
  'https://github.com/binna0728/lung-cancer-ai',
  'lung-cancer-prediction'
),
(
  '2022 정밀의료 빅데이터 아이디어 경진대회',
  '정밀의료 빅데이터를 활용한 아이디어 경진대회 참가 및 수상',
  '# 대회 개요\n\n정밀의료 빅데이터를 활용한 혁신적인 아이디어를 제안했습니다.\n\n## 수상 내역\n- 최우수상',
  'competition',
  '김빛나',
  false,
  'published',
  ARRAY['빅데이터', '정밀의료', '경진대회']::TEXT[],
  'https://images.unsplash.com/photo-1526657786165-ba1251459158?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ARRAY['https://images.unsplash.com/photo-1526657786165-ba1251459158?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']::TEXT[],
  '2022-11-01',
  '2022.11',
  '최우수상',
  'https://example.com/precision-medicine-contest',
  NULL,
  'precision-medicine-contest'
) ON CONFLICT (slug) DO NOTHING;



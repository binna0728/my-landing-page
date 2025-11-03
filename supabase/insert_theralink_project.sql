-- TheraLink 흡연 인사이트 프로젝트 INSERT SQL
-- Supabase SQL Editor에서 실행하세요

INSERT INTO projects (
  title, description, content, category, author,
  featured, status, tags, thumbnail_url, images,
  project_date, project_period, award, link_url, github_url, slug
) VALUES (
  'TheraLink 흡연 인사이트 프로젝트',
  '데이터에서 행동으로 — 4조 오즈스쿨 발표 인사이트상 수상 프로젝트',
  $content$
💡 데이터에서 행동으로 — TheraLink의 '흡연 인사이트' 프로젝트



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

#TheraLink #오즈스쿨4조 #흡연인사이트 #헬스커넥트 #러버블프로토타입 #인사이트상 #데이터기반디자인
$content$,
  'project',
  '김빛나',
  true,
  'published',
  ARRAY['TheraLink','오즈스쿨 4조','흡연인사이트','헬스커넥트','러버블프로토타입','인사이트상','데이터기반디자인']::TEXT[],
  '/uploads/theralink-smoking-insight/1.jpg',
  ARRAY[
    '/uploads/theralink-smoking-insight/1.jpg',
    '/uploads/theralink-smoking-insight/2.jpg',
    '/uploads/theralink-smoking-insight/3.jpg',
    '/uploads/theralink-smoking-insight/4.jpg',
    '/uploads/theralink-smoking-insight/5.jpg',
    '/uploads/theralink-smoking-insight/6.jpg',
    '/uploads/theralink-smoking-insight/7.jpg',
    '/uploads/theralink-smoking-insight/8.jpg',
    '/uploads/theralink-smoking-insight/9.jpg',
    '/uploads/theralink-smoking-insight/10.jpg',
    '/uploads/theralink-smoking-insight/11.jpg',
    '/uploads/theralink-smoking-insight/12.jpg',
    '/uploads/theralink-smoking-insight/13.jpg',
    '/uploads/theralink-smoking-insight/14.jpg',
    '/uploads/theralink-smoking-insight/15.jpg',
    '/uploads/theralink-smoking-insight/16.jpg',
    '/uploads/theralink-smoking-insight/17.jpg',
    '/uploads/theralink-smoking-insight/18.jpg',
    '/uploads/theralink-smoking-insight/19.jpg',
    '/uploads/theralink-smoking-insight/20.jpg',
    '/uploads/theralink-smoking-insight/21.jpg',
    '/uploads/theralink-smoking-insight/22.jpg',
    '/uploads/theralink-smoking-insight/23.jpg',
    '/uploads/theralink-smoking-insight/24.jpg',
    '/uploads/theralink-smoking-insight/25.jpg'
  ]::TEXT[],
  '2025-10-30',
  NULL,
  '인사이트상',
  NULL,
  NULL,
  'theralink-smoking-insight'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  images = EXCLUDED.images,
  thumbnail_url = EXCLUDED.thumbnail_url,
  updated_at = NOW();

-- 확인
SELECT id, title, status, thumbnail_url, array_length(images, 1) as image_count
FROM projects 
WHERE slug = 'theralink-smoking-insight';


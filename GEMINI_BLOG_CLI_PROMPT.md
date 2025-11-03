# Gemini CLI를 사용한 블로그 글 작성 프롬프트

## 기본 사용법

블로그에 새 글을 추가하려면 다음 프롬프트를 사용하세요:

```
Next.js 블로그에 새로운 글을 추가해야 해. 

API 엔드포인트: http://localhost:3000/api/blog/posts
메서드: POST
Content-Type: application/json

요청 본문 형식:
{
  "title": "글 제목",
  "description": "글 설명/요약",
  "content": "마크다운 형식의 본문 내용",
  "category": "learning|project|tutorial|review",
  "author": "김빛나",
  "featured": false,
  "tags": ["태그1", "태그2"],
  "status": "published|draft",
  "publish_date": "2025-01-XXT00:00:00.000Z"
}

참고:
- title: 필수
- content: 필수 (마크다운 지원)
- category: learning, project, tutorial, review 중 하나
- status: published (발행) 또는 draft (임시저장)
- publish_date: ISO 8601 형식
- tags: 문자열 배열

curl을 사용해서 POST 요청을 보내줘.
```

## 예시 프롬프트

### 1. 간단한 글 작성
```
curl을 사용해서 다음 내용으로 블로그 글을 작성해줘:
- 제목: "AI 헬스케어 첫걸음"
- 설명: "의료 AI 연구를 시작하며 배운 점들"
- 내용: "# AI 헬스케어 첫걸음\n\n의료 AI의 세계에 발을 디뎠다...\n\n## 배운 점\n\n1. 데이터의 중요성\n2. 모델 해석의 필요성"
- 카테고리: learning
- 태그: ["AI", "헬스케어", "학습"]
- 상태: published

API: POST http://localhost:3000/api/blog/posts
```

### 2. 마크다운 형식 글 작성
```
마크다운 형식으로 블로그 글을 작성하고 API로 전송해줘.

제목: "Next.js에서 Supabase 연동하기"
설명: "Supabase를 Next.js 프로젝트에 통합하는 방법"
카테고리: tutorial
태그: ["Next.js", "Supabase", "튜토리얼"]

내용은 마크다운으로 작성하고, 코드 블록도 포함해줘.
상태는 published로 설정.

API 엔드포인트: http://localhost:3000/api/blog/posts
```

### 3. 프로젝트 소개 글
```
블로그에 프로젝트 소개 글을 작성해줘.

- 제목: "폐암 예측 모델 프로젝트"
- 설명: "병리 영상 기반 폐암 질환 예측 모델 개발 경험"
- 카테고리: project
- 태그: ["프로젝트", "AI", "의료영상", "폐암"]
- 추천 게시글: true
- 상태: published

내용에는 프로젝트 배경, 사용 기술, 결과 등을 포함해줘.
마크다운 형식으로 작성하고 curl로 API에 전송해줘.

API: POST http://localhost:3000/api/blog/posts
```

## 전체 예시 curl 명령어

```bash
curl -X POST http://localhost:3000/api/blog/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "블로그 글 제목",
    "description": "글 설명",
    "content": "# 제목\n\n본문 내용...",
    "category": "learning",
    "author": "김빛나",
    "featured": false,
    "tags": ["태그1", "태그2"],
    "status": "published",
    "publish_date": "2025-01-15T00:00:00.000Z"
  }'
```

## 참고사항

1. **비밀번호**: 실제 웹 페이지에서 작성할 때는 "라떼최고" 비밀번호가 필요하지만, API 직접 호출 시에는 비밀번호 체크가 없습니다.

2. **slug 자동 생성**: slug는 제목에서 자동으로 생성되므로 별도로 보낼 필요 없습니다.

3. **카테고리 옵션**:
   - `learning`: 학습
   - `project`: 프로젝트
   - `tutorial`: 튜토리얼
   - `review`: 리뷰

4. **상태 옵션**:
   - `published`: 발행 (공개)
   - `draft`: 임시저장 (비공개)

5. **날짜 형식**: ISO 8601 형식 사용
   - 예: `2025-01-15T10:30:00.000Z`
   - 현재 시간: `new Date().toISOString()`

## Gemini에게 요청할 때 사용할 프롬프트 템플릿

```
나는 Next.js 블로그 API에 글을 추가하고 싶어.

API 정보:
- URL: http://localhost:3000/api/blog/posts
- Method: POST
- Content-Type: application/json

[여기에 원하는 글 내용 작성]
- 제목: ...
- 설명: ...
- 카테고리: ...
- 태그: ...
- 내용: ...

curl 명령어를 생성해서 실행해줘. 응답도 확인해줘.
```


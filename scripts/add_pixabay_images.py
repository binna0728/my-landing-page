#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
블로그 포스트에 Pixabay에서 적절한 이미지 추가
"""

import os
import sys
import io
import requests
import re
import time

# Windows 콘솔 UTF-8 설정
if sys.platform.startswith('win'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 설정
SUPABASE_URL = "https://udimchcvervbxcnqjrcl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaW1jaGN2ZXJ2YnhjbnFqcmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDUwODUsImV4cCI6MjA3NzcyMTA4NX0.uqd1qFh5tekwi4Sxyb3xrqOyThfJmIeW8phwxOMP8Kg"
PEXELS_API_KEY = "S95sM8CgZ6hRG3KKN6TXa5NKqOJ6OyxqDhtGKNj6u0L2HvD3LBNEfTsz"  # Pexels API 키

def get_pexels_image(query):
    """Pexels에서 이미지 검색"""
    try:
        url = "https://api.pexels.com/v1/search"
        params = {
            'query': query,
            'per_page': 1,
            'orientation': 'landscape'
        }
        headers = {
            'Authorization': PEXELS_API_KEY
        }

        response = requests.get(url, params=params, headers=headers, timeout=10)

        if response.status_code == 200:
            data = response.json()
            if data['photos']:
                img = data['photos'][0]
                return {
                    'url': img['src']['large'],
                    'preview': img['src']['medium'],
                    'photographer': img['photographer'],
                    'source': img['url']
                }
        return None
    except Exception as e:
        print(f"  Error fetching image: {e}")
        return None

def get_search_keywords(title, content):
    """포스트 내용에서 검색 키워드 추출"""
    keywords_map = {
        'Python': 'python programming',
        'NumPy': 'data science',
        'SQL': 'database',
        '통계': 'statistics',
        '시각화': 'data visualization',
        'Pandas': 'data analysis',
        '객체': 'programming',
        '함수': 'coding',
        '기초': 'learning education',
    }

    for key, query in keywords_map.items():
        if key in title or key in content[:500]:
            return query

    return "education learning"

def update_post_with_image(post_id, image_info, title):
    """포스트에 이미지 정보 업데이트"""
    try:
        # featured_image 필드 업데이트 (있다면)
        # 또는 content 앞부분에 이미지 추가

        # 먼저 현재 포스트 가져오기
        get_url = f"{SUPABASE_URL}/rest/v1/blog_posts?id=eq.{post_id}&select=content"
        response = requests.get(get_url, headers={
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}'
        })

        if response.status_code != 200:
            return False, "Failed to fetch post"

        posts = response.json()
        if not posts:
            return False, "Post not found"

        current_content = posts[0]['content']

        # 이미지가 이미 있는지 확인
        if '![' in current_content[:500] and 'pixabay' in current_content[:1000]:
            return True, "Image already exists"

        # 이미지 마크다운 생성
        image_md = f"""
![{title}]({image_info['url']})
*Photo by {image_info['photographer']} on [Pexels]({image_info['source']})*

---

"""

        # 첫 번째 # 제목 다음에 이미지 추가
        lines = current_content.split('\n')
        new_lines = []
        added = False

        for i, line in enumerate(lines):
            new_lines.append(line)
            if not added and line.startswith('# ') and i < 10:
                # 제목 다음 빈 줄 건너뛰고 이미지 추가
                if i + 1 < len(lines) and not lines[i + 1].strip():
                    continue
                new_lines.append('')
                new_lines.append(image_md)
                added = True

        new_content = '\n'.join(new_lines)

        # 포스트 업데이트
        update_url = f"{SUPABASE_URL}/rest/v1/blog_posts?id=eq.{post_id}"
        update_response = requests.patch(
            update_url,
            json={'content': new_content},
            headers={
                'apikey': SUPABASE_KEY,
                'Authorization': f'Bearer {SUPABASE_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
        )

        if update_response.status_code == 204:
            return True, "Success"
        else:
            return False, f"HTTP {update_response.status_code}"

    except Exception as e:
        return False, str(e)

def main():
    """메인 실행 함수"""
    print("=" * 70)
    print("블로그 포스트에 Pixabay 이미지 추가")
    print("=" * 70)

    # 모든 포스트 가져오기
    url = f"{SUPABASE_URL}/rest/v1/blog_posts?select=id,title,content&order=id.desc&limit=20"
    response = requests.get(url, headers={
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    })

    if response.status_code != 200:
        print(f"Error fetching posts: {response.status_code}")
        return

    posts = response.json()
    print(f"\n처리할 포스트: {len(posts)}개\n")

    success = 0
    skipped = 0
    failed = 0

    for post in posts:
        post_id = post['id']
        title = post['title']
        content = post.get('content', '')

        print(f"[{post_id}] {title[:50]}")

        # 검색 키워드 추출
        keywords = get_search_keywords(title, content)
        print(f"  검색어: {keywords}")

        # Pexels 이미지 검색
        image_info = get_pexels_image(keywords)

        if not image_info:
            print(f"  ✗ 이미지를 찾을 수 없음")
            failed += 1
            continue

        print(f"  찾은 이미지: {image_info['url'][:60]}...")

        # 포스트 업데이트
        result, message = update_post_with_image(post_id, image_info, title)

        if result:
            if "already exists" in message:
                print(f"  ○ 이미 이미지가 있음")
                skipped += 1
            else:
                print(f"  ✓ 이미지 추가 완료")
                success += 1
        else:
            print(f"  ✗ 실패: {message}")
            failed += 1

        # API 제한을 피하기 위해 딜레이
        time.sleep(1)
        print()

    print("=" * 70)
    print(f"완료! 성공: {success}, 건너뜀: {skipped}, 실패: {failed}")
    print("=" * 70)

if __name__ == "__main__":
    main()

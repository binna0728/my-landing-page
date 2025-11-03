#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
마크다운 파일들을 블로그 API를 통해 업로드
"""

import os
import sys
import io
import json
import re
import requests
from pathlib import Path

# Windows 콘솔 UTF-8 설정
if sys.platform.startswith('win'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 설정
POSTS_DIR = r"d:\oz blog\my-landing-page\posts"
SUPABASE_URL = "https://udimchcvervbxcnqjrcl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaW1jaGN2ZXJ2YnhjbnFqcmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDUwODUsImV4cCI6MjA3NzcyMTA4NX0.uqd1qFh5tekwi4Sxyb3xrqOyThfJmIeW8phwxOMP8Kg"
AUTHOR = "김빛나"
CATEGORY = "learning"

def parse_markdown_file(file_path):
    """마크다운 파일 파싱"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 제목 추출 (첫 번째 # 헤더)
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else "제목 없음"

    # 날짜 추출
    date_match = re.search(r'\*\*날짜:\*\*\s+(\d{4}-\d{2}-\d{2})', content)
    date = date_match.group(1) if date_match else None

    # 주제 추출
    topic_match = re.search(r'\*\*주제:\*\*\s+(.+)$', content, re.MULTILINE)
    topics = topic_match.group(1) if topic_match else ""

    # 태그 생성
    tags = ["학습자료", "의료AI"]
    if "Python" in topics or "Python" in title:
        tags.append("Python")
    if "NumPy" in topics:
        tags.append("NumPy")
    if "통계" in topics:
        tags.append("통계")
    if "시각화" in topics:
        tags.append("데이터시각화")
    if "SQL" in topics:
        tags.append("SQL")
    if "Pandas" in topics:
        tags.append("Pandas")

    # 설명 생성 (첫 문단)
    lines = content.split('\n')
    description = ""
    for line in lines:
        if line.strip() and not line.startswith('#') and not line.startswith('**') and not line.startswith('---'):
            description = line.strip()[:200]
            break

    if not description:
        description = f"{title}에 대한 학습 내용입니다."

    return {
        'title': title,
        'content': content,
        'description': description,
        'date': date,
        'tags': tags,
        'author': AUTHOR,
        'category': CATEGORY,
        'status': 'published',
        'featured': False
    }

def upload_post(post_data):
    """블로그 포스트 업로드 (Supabase 직접)"""
    try:
        # slug 생성
        slug = post_data['title'].lower().replace(' ', '-')
        slug = re.sub(r'[^a-z0-9-]', '', slug)

        # Supabase 형식에 맞게 데이터 변환
        supabase_data = {
            'title': post_data['title'],
            'content': post_data['content'],
            'excerpt': post_data['description'],
            'slug': slug,
            'author': post_data['author'],
            'category': post_data['category'],
            'tags': post_data['tags'],
            'status': post_data['status'],
            'featured': post_data.get('featured', False),
            'publish_date': post_data['date'] + 'T00:00:00Z' if post_data['date'] else None
        }

        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/blog_posts",
            json=supabase_data,
            headers={
                'apikey': SUPABASE_KEY,
                'Authorization': f'Bearer {SUPABASE_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            timeout=30
        )

        if response.status_code in [200, 201]:
            result = response.json()
            post_id = result[0]['id'] if isinstance(result, list) else result.get('id', 'unknown')
            return True, post_id
        elif response.status_code == 409:
            return False, "중복"
        else:
            error_text = response.text[:200] if response.text else "Unknown error"
            return False, f"HTTP {response.status_code}: {error_text}"

    except requests.exceptions.Timeout:
        return False, "타임아웃"
    except Exception as e:
        return False, str(e)

def main():
    """메인 실행 함수"""
    print("=" * 70)
    print("마크다운 파일을 블로그에 업로드")
    print("=" * 70)

    # 마크다운 파일 목록
    md_files = sorted(Path(POSTS_DIR).glob('*.md'))

    if not md_files:
        print(f"\n❌ {POSTS_DIR} 폴더에 마크다운 파일이 없습니다.")
        return

    print(f"\n발견된 파일: {len(md_files)}개\n")

    success_count = 0
    fail_count = 0
    duplicate_count = 0

    for md_file in md_files:
        filename = md_file.name
        print(f"[처리중] {filename}")

        try:
            # 파일 파싱
            post_data = parse_markdown_file(md_file)

            # 업로드
            success, result = upload_post(post_data)

            if success:
                print(f"  ✓ 업로드 성공 (ID: {result})")
                print(f"     제목: {post_data['title']}")
                print(f"     날짜: {post_data['date']}")
                success_count += 1
            else:
                if result == "중복":
                    print(f"  ○ 이미 존재함")
                    duplicate_count += 1
                else:
                    print(f"  ✗ 실패: {result}")
                    fail_count += 1

        except Exception as e:
            print(f"  ✗ 오류: {str(e)}")
            fail_count += 1

        print()

    print("=" * 70)
    print(f"완료! 성공: {success_count}, 중복: {duplicate_count}, 실패: {fail_count}")
    print("=" * 70)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
D:/00.test 폴더의 학습 자료를 사람이 쓴 것처럼 자연스러운 블로그 포스트로 변환
"""

import os
import sys
import io
import json
import re
from pathlib import Path
from datetime import datetime
import nbformat

# Windows 콘솔 UTF-8 설정
if sys.platform.startswith('win'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 설정
SOURCE_DIR = r"D:\00.test"
OUTPUT_DIR = r"d:\oz blog\my-landing-page\posts"

# 날짜 매핑 (폴더명 -> 실제 날짜)
DATE_MAPPING = {
    "0930": "2024-09-30",
    "1031": "2024-10-31",
    "3일차 0929": "2024-09-29",
    "5일차_1001": "2024-10-01",
    "6일차_1002": "2024-10-02",
    "7일차": "2024-10-03",
    "8일차": "2024-10-04",
    "9일차": "2024-10-05",
    "10일차": "2024-10-06",
    "11일차": "2024-10-07",
    "12일차": "2024-10-08",
    "13일차": "2024-10-09",
    "14일차": "2024-10-10",
    "15일차": "2024-10-11",
    "16일차": "2024-10-12",
    "17일차": "2024-10-13",
    "python": "2024-09-25",
}

def extract_day_number(folder_name):
    """폴더명에서 일차 번호 추출"""
    match = re.search(r'(\d+)일차', folder_name)
    if match:
        return int(match.group(1))
    if folder_name == "0930":
        return 4
    if folder_name == "1031":
        return 18
    if folder_name == "python":
        return 1
    return 99

def create_natural_intro(day_num, topics):
    """자연스러운 서론 생성"""
    intros = [
        f"오늘은 {day_num}일차 수업이었습니다. ",
        f"{day_num}일차 학습을 진행했습니다. ",
        f"드디어 {day_num}일차! ",
        f"{day_num}일차 수업 내용을 정리해봅니다. ",
    ]

    topic_intros = {
        "python": "Python 기초부터 차근차근 배웠습니다.",
        "통계": "기초 통계와 데이터 분석의 세계에 발을 들였습니다.",
        "numpy": "NumPy를 활용한 배열 연산을 학습했습니다.",
        "pandas": "Pandas로 데이터를 다루는 방법을 익혔습니다.",
        "matplotlib": "Matplotlib을 이용한 데이터 시각화를 배웠습니다.",
        "sql": "SQL을 통한 데이터베이스 조작을 학습했습니다.",
        "함수": "함수의 개념과 활용법을 익혔습니다.",
        "객체": "객체 지향 프로그래밍의 기초를 다졌습니다.",
    }

    intro = intros[day_num % len(intros)]
    for topic_key, topic_intro in topic_intros.items():
        if any(topic_key.lower() in t.lower() for t in topics):
            intro += topic_intro
            break
    else:
        intro += f"{'와 '.join(topics[:2])}에 대해 학습했습니다."

    return intro

def extract_notebook_content_natural(notebook_path):
    """Notebook 내용을 자연스러운 블로그 형식으로 추출"""
    try:
        with open(notebook_path, 'r', encoding='utf-8') as f:
            nb = nbformat.read(f, as_version=4)

        content_parts = []
        current_section = None
        code_count = 0

        for cell in nb.cells:
            if cell.cell_type == 'markdown':
                text = cell.source.strip()
                if not text:
                    continue

                # 제목 레벨 조정
                if text.startswith('#'):
                    # 최상위 제목은 ## 로 변환
                    level = len(re.match(r'^#+', text).group())
                    if level == 1:
                        text = '##' + text[1:]
                    current_section = text

                content_parts.append(text)
                content_parts.append('')

            elif cell.cell_type == 'code':
                code = cell.source.strip()
                if not code or len(code) < 5:
                    continue

                code_count += 1

                # 코드에 대한 자연스러운 설명 추가
                if code_count == 1:
                    content_parts.append("먼저 필요한 라이브러리를 불러옵니다:")
                elif 'def ' in code:
                    func_name = re.search(r'def\s+(\w+)', code)
                    if func_name:
                        content_parts.append(f"`{func_name.group(1)}` 함수를 정의했습니다:")
                elif 'import' not in code and code_count > 1:
                    content_parts.append("실행 결과:")

                content_parts.append(f"```python\n{code}\n```")
                content_parts.append('')

                # 출력 결과 추가
                if hasattr(cell, 'outputs') and cell.outputs:
                    for output in cell.outputs:
                        if output.output_type == 'stream':
                            output_text = output.text.strip()
                            if output_text:
                                content_parts.append("**출력:**")
                                content_parts.append(f"```\n{output_text}\n```")
                                content_parts.append('')

                        elif output.output_type == 'execute_result':
                            if 'text/plain' in output.data:
                                result = output.data['text/plain'].strip()
                                content_parts.append(f"**결과:** `{result}`")
                                content_parts.append('')

        return '\n'.join(content_parts)

    except Exception as e:
        return f"노트북 파일을 읽는 중 오류가 발생했습니다: {str(e)}"

def create_markdown_post(folder_path, folder_name, date):
    """각 폴더별로 마크다운 포스트 생성"""

    day_num = extract_day_number(folder_name)

    # 폴더 내 파일 목록
    files = []
    for root, dirs, filenames in os.walk(folder_path):
        for filename in filenames:
            if filename.endswith(('.ipynb', '.pdf', '.py')):
                files.append(os.path.join(root, filename))

    if not files:
        return None

    # 주제 추출
    topics = []
    for file in files:
        filename = os.path.basename(file)
        if 'statistics' in filename.lower() or '통계' in filename:
            topics.append('통계')
        if 'numpy' in filename.lower():
            topics.append('NumPy')
        if 'pandas' in filename.lower():
            topics.append('Pandas')
        if 'matplotlib' in filename.lower():
            topics.append('시각화')
        if 'sql' in filename.lower():
            topics.append('SQL')
        if '함수' in filename:
            topics.append('함수')
        if '객체' in filename:
            topics.append('객체지향')

    if not topics:
        topics = ['Python 기초']

    # 제목 생성
    title = f"{day_num}일차: {', '.join(set(topics))}"

    # 자연스러운 서론
    intro = create_natural_intro(day_num, topics)

    # 내용 구성
    content_parts = [
        f"# {title}\n",
        f"**날짜:** {date}  ",
        f"**주제:** {', '.join(set(topics))}\n",
        "---\n",
        intro,
        "\n"
    ]

    # Jupyter Notebook 파일 처리
    notebooks = [f for f in files if f.endswith('.ipynb')]
    for nb_path in notebooks:
        nb_name = os.path.basename(nb_path).replace('.ipynb', '')
        content_parts.append(f"\n## {nb_name}\n")
        nb_content = extract_notebook_content_natural(nb_path)
        content_parts.append(nb_content)
        content_parts.append("\n")

    # Python 파일 처리
    py_files = [f for f in files if f.endswith('.py') and 'pycache' not in f]
    if py_files:
        content_parts.append("\n## 실습 코드\n")
        for py_path in py_files[:2]:  # 최대 2개만
            py_name = os.path.basename(py_path)
            try:
                with open(py_path, 'r', encoding='utf-8') as f:
                    code = f.read().strip()
                    if len(code) < 5000:  # 너무 긴 코드는 제외
                        content_parts.append(f"\n### {py_name}\n")
                        content_parts.append(f"```python\n{code}\n```\n")
            except:
                pass

    # 마무리
    content_parts.append("\n---\n")
    content_parts.append(f"\n오늘 {day_num}일차 학습을 마치며, ")
    content_parts.append(f"{topics[0]}에 대한 이해가 한층 깊어졌습니다. ")
    content_parts.append("앞으로 배울 내용들이 더욱 기대됩니다! 💪\n")

    # 파일명 생성 (날짜 기반)
    filename = f"{date}-day{day_num:02d}.md"

    return {
        'filename': filename,
        'content': '\n'.join(content_parts),
        'title': title,
        'date': date,
        'day': day_num
    }

def main():
    """메인 실행 함수"""
    # 출력 디렉토리 생성
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("=" * 70)
    print("D:/00.test 학습 자료를 마크다운 포스트로 변환")
    print("=" * 70)

    posts = []

    # 모든 폴더 처리
    for folder_name in os.listdir(SOURCE_DIR):
        folder_path = os.path.join(SOURCE_DIR, folder_name)

        if not os.path.isdir(folder_path):
            continue

        if folder_name.startswith('__') or folder_name in ['files', 'bmi-module', 'bmi-package']:
            continue

        # 날짜 확인
        date = DATE_MAPPING.get(folder_name)
        if not date:
            # 날짜를 찾을 수 없는 경우 폴더명에서 추출 시도
            if '일차' in folder_name:
                day_num = extract_day_number(folder_name)
                date = f"2024-09-{25 + day_num:02d}"
            else:
                print(f"[SKIP] {folder_name} - 날짜를 알 수 없음")
                continue

        print(f"\n[처리중] {folder_name} ({date})")

        post = create_markdown_post(folder_path, folder_name, date)

        if post:
            # 마크다운 파일 저장
            output_path = os.path.join(OUTPUT_DIR, post['filename'])
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(post['content'])

            print(f"  ✓ 생성됨: {post['filename']}")
            print(f"     제목: {post['title']}")
            posts.append(post)
        else:
            print(f"  ✗ 내용 없음")

    # 날짜순 정렬
    posts.sort(key=lambda x: x['date'])

    print("\n" + "=" * 70)
    print(f"완료! 총 {len(posts)}개의 마크다운 파일 생성")
    print(f"저장 위치: {OUTPUT_DIR}")
    print("=" * 70)

    # 생성된 파일 목록
    print("\n생성된 파일:")
    for post in posts:
        print(f"  - {post['filename']}: {post['title']}")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
D:/00.test 폴더의 PDF와 Jupyter Notebook을 분석하여 블로그 포스트 생성
"""

import os
import json
import glob
from pathlib import Path
from datetime import datetime
import sys
import io

# Windows 콘솔 인코딩 설정
if sys.platform.startswith('win'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

try:
    import fitz  # PyMuPDF
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False

import nbformat
import requests

# 설정
SOURCE_DIR = r"D:\00.test"
API_ENDPOINT = "http://localhost:3000/api/blog/posts"
AUTHOR = "김빛나"
CATEGORY = "learning"
COMMON_TAGS = ["학습자료", "의료AI"]

def extract_notebook_content(notebook_path):
    """Notebook에서 마크다운 추출"""
    try:
        with open(notebook_path, 'r', encoding='utf-8') as f:
            notebook = nbformat.read(f, as_version=4)

        markdown_content = []

        for cell in notebook.cells:
            if cell.cell_type == 'markdown':
                markdown_content.append(cell.source)
            elif cell.cell_type == 'code':
                code = cell.source
                if code.strip():
                    markdown_content.append(f"```python\n{code}\n```")

                if hasattr(cell, 'outputs') and cell.outputs:
                    for output in cell.outputs:
                        if output.output_type == 'stream':
                            markdown_content.append(f"```\n{output.text}\n```")
                        elif output.output_type == 'execute_result':
                            if hasattr(output, 'data'):
                                if 'text/plain' in output.data:
                                    markdown_content.append(f"```\n{output.data['text/plain']}\n```")
                        elif output.output_type == 'display_data':
                            if hasattr(output, 'data'):
                                if 'text/plain' in output.data:
                                    markdown_content.append(f"```\n{output.data['text/plain']}\n```")

        return "\n\n".join(markdown_content) if markdown_content else "내용 없음"
    except Exception as e:
        return f"Notebook 읽기 실패: {str(e)}"

def extract_pdf_text(pdf_path):
    """PDF에서 텍스트 추출"""
    try:
        if not HAS_PYMUPDF:
            return "PyMuPDF 라이브러리 필요: pip install PyMuPDF"

        doc = fitz.open(pdf_path)
        text = ""
        for page_num in range(len(doc)):
            page = doc[page_num]
            text += f"## 페이지 {page_num + 1}\n\n"
            text += page.get_text()
            text += "\n\n"
        return text if text.strip() else "텍스트 없음"
    except Exception as e:
        return f"PDF 읽기 실패: {str(e)}"

def get_folder_files(folder_path):
    """폴더 내 PDF와 Notebook 파일 목록 반환"""
    files = {'notebooks': [], 'pdfs': []}

    try:
        for file_path in glob.glob(os.path.join(folder_path, '*')):
            if file_path.endswith('.ipynb'):
                files['notebooks'].append(os.path.basename(file_path))
            elif file_path.endswith('.pdf'):
                files['pdfs'].append(os.path.basename(file_path))
    except:
        pass

    return files

def create_post(folder_path, folder_name):
    """포스트 객체 생성"""
    files = get_folder_files(folder_path)

    if not files['notebooks'] and not files['pdfs']:
        return None

    # 제목 생성
    file_names = []
    if files['notebooks']:
        file_names.extend([f.replace('.ipynb', '') for f in files['notebooks'][:2]])
    if files['pdfs']:
        file_names.extend([f.replace('.pdf', '') for f in files['pdfs'][:2]])

    title = f"{folder_name}"
    if file_names:
        title += f" - {', '.join(file_names[:3])}"
    title = title[:120]

    # 설명 생성
    total_files = len(files['notebooks']) + len(files['pdfs'])
    description = f"{folder_name}에서 {total_files}개의 학습 자료 정리"

    # 본문 생성
    content_parts = []

    for nb_file in sorted(files['notebooks']):
        nb_path = os.path.join(folder_path, nb_file)
        title_text = nb_file.replace('.ipynb', '')
        content_parts.append(f"## {title_text}\n")
        content_parts.append(extract_notebook_content(nb_path))
        content_parts.append("\n---\n")

    for pdf_file in sorted(files['pdfs']):
        pdf_path = os.path.join(folder_path, pdf_file)
        title_text = pdf_file.replace('.pdf', '')
        content_parts.append(f"## {title_text}\n")
        content_parts.append(extract_pdf_text(pdf_path))
        content_parts.append("\n---\n")

    # 태그 생성
    tags = list(COMMON_TAGS)
    all_filenames = " ".join(files['notebooks'] + files['pdfs']).lower()

    if any(keyword in all_filenames for keyword in ['sql', 'database', 'db']):
        tags.append("SQL")
    if any(keyword in all_filenames for keyword in ['python', 'numpy', 'pandas']):
        tags.append("Python")
    if any(keyword in all_filenames for keyword in ['통계', 'statistics']):
        tags.append("통계")
    if any(keyword in all_filenames for keyword in ['시각화', 'visualization', 'matplotlib']):
        tags.append("시각화")

    post = {
        'title': title,
        'description': description,
        'content': "\n".join(content_parts),
        'category': CATEGORY,
        'author': AUTHOR,
        'featured': False,
        'tags': list(set(tags)),  # 중복 제거
        'status': 'published',
        'publish_date': datetime.now().isoformat() + 'Z'
    }

    return post

def publish_post(post):
    """API를 통해 포스트 발행"""
    try:
        # JSON 데이터를 명시적으로 UTF-8로 인코딩
        json_data = json.dumps(post, ensure_ascii=False, indent=2)

        response = requests.post(
            API_ENDPOINT,
            data=json_data.encode('utf-8'),
            headers={'Content-Type': 'application/json; charset=utf-8'},
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            print(f"[OK] {post['title'][:50]}")
            print(f"     ID: {result.get('id')}")
            return True
        else:
            print(f"[FAIL] {post['title'][:50]}")
            print(f"       Status: {response.status_code}")
            try:
                error_msg = response.json()
                print(f"       Error: {str(error_msg)[:100]}")
            except:
                print(f"       Response: {response.text[:100]}")
            return False
    except Exception as e:
        print(f"[ERROR] {post['title'][:50]}")
        print(f"        {str(e)[:100]}")
        return False

def main():
    """메인 함수"""
    print("=" * 70)
    print("D:/00.test 블로그 포스트 자동 생성 시작")
    print("=" * 70)

    # 모든 하위 폴더 스캔
    folders = []
    try:
        for item in os.listdir(SOURCE_DIR):
            item_path = os.path.join(SOURCE_DIR, item)
            if os.path.isdir(item_path) and not item.startswith('.'):
                folders.append((item_path, item))
    except Exception as e:
        print(f"폴더 스캔 실패: {e}")
        return

    print(f"발견된 폴더: {len(folders)}개\n")

    success_count = 0
    fail_count = 0

    for folder_path, folder_name in sorted(folders):
        try:
            post = create_post(folder_path, folder_name)

            if post is None:
                continue

            if publish_post(post):
                success_count += 1
            else:
                fail_count += 1

        except Exception as e:
            print(f"[ERROR] {folder_name}: {str(e)[:50]}")
            fail_count += 1

    print("\n" + "=" * 70)
    print(f"완료! 성공: {success_count}, 실패: {fail_count}")
    print("=" * 70)

if __name__ == '__main__':
    main()

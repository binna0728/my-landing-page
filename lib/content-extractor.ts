import fs from "fs";
import path from "path";

export interface ContentMetadata {
  title: string;
  description?: string;
  author?: string;
  tags?: string[];
  date?: string;
  draft?: boolean;
  sourcePath: string;
  summary?: string;
  type: "learning" | "research" | "project" | "note";
}

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  week?: number;
  progress: "completed" | "in-progress" | "planned";
  keywords: string[];
  sourcePath?: string;
}

export interface ResearchIssue {
  id: string;
  title: string;
  problem: string;
  insight: string;
  tags: string[];
  date?: string;
  link?: string;
  sourcePath?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  achievements?: string[];
  date?: string;
  status: "completed" | "in-progress" | "planned";
  icon?: string;
  sourcePath?: string;
}

/**
 * 마크다운 파일에서 frontmatter 추출
 */
function extractFrontmatter(content: string): {
  frontmatter: Record<string, any>;
  body: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];

  const frontmatter: Record<string, any> = {};
  const lines = frontmatterText.split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // 배열 처리
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1);
      frontmatter[key] = value
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""));
    }
    // 불린 처리
    else if (value === "true" || value === "false") {
      frontmatter[key] = value === "true";
    }
    // 문자열 처리 (따옴표 제거)
    else {
      frontmatter[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return { frontmatter, body };
}

/**
 * 본문에서 요약 추출 (첫 200자)
 */
function extractSummary(body: string): string {
  // 코드 블록 제거
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  // 마크다운 링크/이미지 제거
  const cleanText = withoutCode
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "")
    .replace(/#+\s+/g, "")
    .replace(/\*\*/g, "")
    .trim();

  return cleanText.slice(0, 200).replace(/\n+/g, " ");
}

/**
 * 파일에서 메타데이터 추출
 */
export async function extractFileMetadata(
  filePath: string,
  rootDir: string = process.cwd()
): Promise<ContentMetadata | null> {
  try {
    const fullPath = path.join(rootDir, filePath);
    const content = fs.readFileSync(fullPath, "utf-8");
    const { frontmatter, body } = extractFrontmatter(content);

    // 파일명에서 날짜 추출 (YYYY-MM-DD 형식)
    const filename = path.basename(filePath, path.extname(filePath));
    const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
    const extractedDate = dateMatch ? dateMatch[1] : null;

    // 타입 추론
    let type: ContentMetadata["type"] = "note";
    const lowerPath = filePath.toLowerCase();
    if (lowerPath.includes("research") || lowerPath.includes("논문") || lowerPath.includes("이슈")) {
      type = "research";
    } else if (lowerPath.includes("project") || lowerPath.includes("프로젝트")) {
      type = "project";
    } else if (lowerPath.includes("til") || lowerPath.includes("day") || lowerPath.includes("학습")) {
      type = "learning";
    }

    return {
      title: frontmatter.title || filename.replace(/\d{4}-\d{2}-\d{2}[_-]?/, ""),
      description: frontmatter.description || extractSummary(body),
      author: frontmatter.author,
      tags: frontmatter.tags || [],
      date: frontmatter.date || extractedDate || null,
      draft: frontmatter.draft ?? false,
      sourcePath: filePath,
      summary: extractSummary(body),
      type,
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

/**
 * 디렉토리에서 모든 마크다운 파일 찾기
 */
export async function findMarkdownFiles(
  dir: string = ".",
  rootDir: string = process.cwd()
): Promise<string[]> {
  const files: string[] = [];
  const fullPath = path.join(rootDir, dir);

  try {
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // node_modules 등 제외
        if (entry.name.startsWith(".") || entry.name === "node_modules") {
          continue;
        }
        const subFiles = await findMarkdownFiles(entryPath, rootDir);
        files.push(...subFiles);
      } else if (entry.isFile() && /\.(md|mdx|txt)$/i.test(entry.name)) {
        files.push(entryPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}


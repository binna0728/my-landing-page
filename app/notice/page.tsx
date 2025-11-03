"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { NoticeWriteDialog } from "@/components/notice/notice-write-dialog";
import {
  Calendar,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PenSquare,
  Eye,
} from "lucide-react";

// 카테고리 설정
const CATEGORIES: Record<string, string> = {
  general: '일반',
  announcement: '공지',
  update: '업데이트',
};

export default function NoticePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [writeDialogOpen, setWriteDialogOpen] = useState(false);
  const postsPerPage = 9;

  // 데이터 가져오기
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/notice?status=published');
        if (!res.ok) {
          setPosts([]);
          return;
        }
        const data = await res.json();
        const sortedPosts = (Array.isArray(data) ? data : []).sort((a: any, b: any) =>
          new Date(b.publish_date || b.created_at).getTime() - 
          new Date(a.publish_date || a.created_at).getTime()
        );
        setPosts(sortedPosts);
        setFilteredPosts(sortedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, posts]);

  // 페이지네이션
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // 카테고리 통계
  const categoriesMap = new Map<string, number>();
  posts.forEach((post: any) => {
    const count = categoriesMap.get(post.category) || 0;
    categoriesMap.set(post.category, count + 1);
  });

  const categories = Array.from(categoriesMap.entries()).map(([category, count]) => ({
    category,
    name: CATEGORIES[category] || category,
    count
  }));

  const featured = posts.filter((post: any) => post.featured).slice(0, 2);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notice?status=published');
      const data = await res.json();
      const sortedPosts = (Array.isArray(data) ? data : []).sort((a: any, b: any) =>
        new Date(b.publish_date || b.created_at).getTime() - 
        new Date(a.publish_date || a.created_at).getTime()
      );
      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts);
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background via-primary/5 to-secondary/10 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 text-foreground">
              공지사항
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              중요한 소식과 공지사항을 확인하세요
            </p>

            {/* 검색바 */}
            <div className="max-w-2xl mx-auto relative">
              <Input
                type="text"
                placeholder="검색어를 입력하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-base"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>

            {/* 통계 */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{posts.length}</div>
                <div className="text-sm text-muted-foreground">게시글</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{categories.length}</div>
                <div className="text-sm text-muted-foreground">카테고리</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{featured.length}</div>
                <div className="text-sm text-muted-foreground">추천글</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* 카테고리 필터 */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              전체
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.category}
                variant={selectedCategory === cat.category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.category)}
              >
                {cat.name} ({cat.count})
              </Button>
            ))}
          </div>

          <Button onClick={() => setWriteDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            새 글 작성
          </Button>
        </div>

        {/* 게시글 그리드 */}
        {currentPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((post: any) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/notice/${post.category}/${post.slug || post.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {CATEGORIES[post.category] || post.category}
                      </Badge>
                      {post.featured && (
                        <Badge variant="default" className="bg-primary">
                          추천
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {post.description || post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.publish_date || post.created_at).toLocaleDateString('ko-KR')}
                      </span>
                      {post.view_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.view_count}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">게시글이 없습니다</h3>
            <Button onClick={() => setWriteDialogOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              첫 글 작성하기
            </Button>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* 글 작성 다이얼로그 */}
      <NoticeWriteDialog
        open={writeDialogOpen}
        onOpenChange={setWriteDialogOpen}
        onSuccess={handleRefresh}
      />

      {/* Floating 작성 버튼 */}
      <Button
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setWriteDialogOpen(true)}
        size="icon"
      >
        <PenSquare className="w-6 h-6" />
      </Button>
    </>
  );
}


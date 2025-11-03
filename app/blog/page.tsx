"use client";

import { BlogList } from "@/components/blog/blog-list";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog/posts?status=published');
        if (!res.ok) {
          console.error('API response not OK:', res.status);
          setPosts([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error: any) {
        console.error('Failed to fetch blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <p>블로그 포스트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return <BlogList initialPosts={posts} />;
}
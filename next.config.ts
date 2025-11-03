import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // ISR 페이지 크기 제한 우회
    isrMemoryCacheSize: 0,
  },
  // 블로그 페이지는 동적 렌더링만 사용
  output: 'standalone',
};

export default nextConfig;

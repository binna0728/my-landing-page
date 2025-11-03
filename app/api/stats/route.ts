import { NextResponse } from "next/server";

interface StatsData {
  totalPosts: number;
  totalViews: number;
  totalSubscribers: number;
  lastUpdated: string;
}

// 임시 데이터 (실제로는 데이터베이스에서 가져옴)
const mockStats: StatsData = {
  totalPosts: 12,
  totalViews: 1234,
  totalSubscribers: 56,
  lastUpdated: new Date().toISOString(),
};

export async function GET() {
  try {
    // CORS 헤더 설정 (필요한 경우)
    const response = NextResponse.json(mockStats, { status: 200 });
    
    // CORS 설정 (실제 환경에서는 특정 도메인만 허용)
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // CORS preflight 요청 처리
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}


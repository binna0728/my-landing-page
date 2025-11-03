import { NextRequest, NextResponse } from "next/server";

interface NewsletterData {
  email: string;
  name?: string;
}

// Rate limiting을 위한 간단한 메모리 저장소 (실제로는 Redis 등 사용 권장)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5분에 5번
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5분

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    const body: NewsletterData = await request.json();

    // 입력 검증
    if (!body.email) {
      return NextResponse.json(
        { error: "이메일 주소를 입력해주세요." },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "유효한 이메일 주소를 입력해주세요." },
        { status: 400 }
      );
    }

    // TODO: 실제로는 이메일 구독 서비스(예: Mailchimp, ConvertKit) 또는 데이터베이스에 저장
    console.log("Newsletter subscription:", {
      email: body.email,
      name: body.name,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "뉴스레터 구독이 완료되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}


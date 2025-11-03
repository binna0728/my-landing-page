import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// GET: 타임라인 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const status = searchParams.get("status") || "published";

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ timeline: [], total: 0 }, { status: 200 });
    }

    let url = `${SUPABASE_URL}/rest/v1/timeline?select=*&order=date.desc,created_at.desc`;
    
    if (status !== 'all') {
      url += `&status=eq.${status}`;
    }

    if (limit) {
      url += `&limit=${limit}`;
    }

    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('Supabase API error:', response.statusText);
      return NextResponse.json({ timeline: [], total: 0 }, { status: 200 });
    }

    const data = await response.json();
    const timeline = Array.isArray(data) ? data : [];

    const formattedTimeline = timeline.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      content: item.content,
      category: item.category,
      date: item.date,
      tags: item.tags || [],
      keywords: item.keywords || [],
      progress: item.progress || 'completed',
      week: item.week,
      link_url: item.link_url,
      created_at: item.created_at,
    }));

    return NextResponse.json(
      {
        timeline: formattedTimeline,
        total: formattedTimeline.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Timeline API error:", error);
    return NextResponse.json(
      { timeline: [], total: 0, error: "서버 오류가 발생했습니다." },
      { status: 200 }
    );
  }
}

// POST: 새 타임라인 항목 추가
export async function POST(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase 설정이 필요합니다.' }, { status: 500 });
    }

    const body = await request.json();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/timeline`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: 타임라인 항목 수정
export async function PATCH(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase 설정이 필요합니다.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/timeline?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...body,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Update failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE: 타임라인 항목 삭제
export async function DELETE(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase 설정이 필요합니다.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/timeline?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Delete failed' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}



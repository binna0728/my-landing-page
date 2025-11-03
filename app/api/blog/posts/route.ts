import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// GET: 블로그 포스트 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const status = searchParams.get("status") || "published";

    // Supabase 환경 변수가 없으면 빈 배열 반환
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ posts: [], total: 0 }, { status: 200 });
    }

    let url = `${SUPABASE_URL}/rest/v1/blog_posts?select=*&order=publish_date.desc`;
    
    // status가 'all'이 아닐 때만 필터 적용
    if (status !== 'all') {
      url += `&status=eq.${status}`;
    }

    if (limit) {
      url += `&limit=${limit}`;
    }
    if (offset) {
      url += `&offset=${offset}`;
    }

    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('Supabase API error:', response.statusText);
      return NextResponse.json({ posts: [], total: 0 }, { status: 200 });
    }

    const data = await response.json();
    const posts = Array.isArray(data) ? data : [];

    // 데이터 형식 변환 (기존 형식과 호환)
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description || post.excerpt,
      content: post.content,
      date: post.publish_date || post.created_at,
      tags: post.tags || [],
      slug: post.slug,
      category: post.category,
      author: post.author,
      featured: post.featured,
      view_count: post.view_count || 0,
    }));

    return NextResponse.json(
      {
        posts: formattedPosts,
        total: formattedPosts.length,
        limit: limit ? parseInt(limit, 10) : undefined,
        offset: offset ? parseInt(offset, 10) : undefined,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    );
  } catch (error) {
    console.error("Blog posts API error:", error);
    return NextResponse.json(
      { posts: [], total: 0, error: "서버 오류가 발생했습니다." },
      { status: 200 }
    );
  }
}

// POST: 새 블로그 포스트 작성
export async function POST(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase 설정이 필요합니다.' }, { status: 500 });
    }

    const body = await request.json();

    // slug 생성
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...body,
        slug,
        publish_date: body.publish_date || body.date || new Date().toISOString()
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json({ error }, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }

    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
}

// PATCH: 블로그 포스트 수정
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

    // slug가 변경되었을 경우만 업데이트
    const updateData: any = { ...body };
    if (updateData.title && !updateData.slug) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...updateData,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Update failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Update failed' }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
}

// DELETE: 블로그 포스트 삭제
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
      `${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${id}`,
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

    return NextResponse.json({ success: true }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Delete failed' }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
}

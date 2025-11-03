import { NextRequest, NextResponse } from "next/server";

// 환경 변수가 없으면 기본값 사용 (Vercel 배포를 위해)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://udimchcvervbxcnqjrcl.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaW1jaGN2ZXJ2YnhjbnFqcmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDUwODUsImV4cCI6MjA3NzcyMTA4NX0.uqd1qFh5tekwi4Sxyb3xrqOyThfJmIeW8phwxOMP8Kg';

export async function GET(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ projects: [], total: 0, error: "Missing env vars" }, { status: 200 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "published";
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    let url = `${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`;
    
    if (id) {
      url += `&id=eq.${id}`;
    }
    if (slug && slug.trim()) {
      try {
        // slug가 이미 인코딩되어 있을 수 있으므로 디코딩 후 다시 인코딩
        const decodedSlug = decodeURIComponent(slug);
        url += `&slug=eq.${encodeURIComponent(decodedSlug)}`;
      } catch {
        // 디코딩 실패시 그대로 사용
        url += `&slug=eq.${encodeURIComponent(slug)}`;
      }
    }
    if (status !== 'all') {
      url += `&status=eq.${status}`;
    }

    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY!}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return NextResponse.json({ 
        projects: [], 
        total: 0, 
        error: `Supabase error: ${response.status} ${errorText}` 
      }, { status: 200 });
    }

    const data = await response.json();
    const projects = Array.isArray(data) ? data : [];

    const formatted = projects.map((p: any) => ({
      id: p.id,
      title: p.title || '',
      description: p.description || '',
      content: p.content || '',
      category: p.category || 'project',
      author: p.author || '김빛나',
      slug: p.slug || '',
      tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : []),
      featured: p.featured || false,
      thumbnail_url: p.thumbnail_url || null,
      images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []),
      project_date: p.project_date || null,
      project_period: p.project_period || null,
      award: p.award || null,
      link_url: p.link_url || null,
      github_url: p.github_url || null,
      view_count: p.view_count || 0,
      created_at: p.created_at || new Date().toISOString(),
    }));

    return NextResponse.json({ projects: formatted, total: formatted.length }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ 
      projects: [], 
      total: 0, 
      error: error?.message || String(error) 
    }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase 설정이 필요합니다.' }, { status: 500 });
    }
    const body = await request.json();
    const slug = body.slug || body.title?.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY!}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ ...body, slug }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json({ error }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase 설정이 필요합니다.' }, { status: 500 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY!}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ ...body, updated_at: new Date().toISOString() }),
    });
    if (!response.ok) return NextResponse.json({ error: 'Update failed' }, { status: response.status });
    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase 설정이 필요합니다.' }, { status: 500 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY!}`,
      }
    });
    if (!response.ok) return NextResponse.json({ error: 'Delete failed' }, { status: response.status });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

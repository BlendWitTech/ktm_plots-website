import { NextRequest, NextResponse } from 'next/server';

const API = process.env.CMS_API_URL || process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('postId') || '';
  try {
    const res = await fetch(`${API}/comments?postId=${postId}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to post comment.' }, { status: 500 });
  }
}

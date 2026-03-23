import { NextRequest, NextResponse } from 'next/server';

const API = process.env.CMS_API_URL || process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API}/leads/public/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to submit. Please try again.' }, { status: 500 });
  }
}

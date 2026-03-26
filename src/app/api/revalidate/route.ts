import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const SECRET = process.env.REVALIDATE_SECRET || '';

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-revalidate-secret') || req.nextUrl.searchParams.get('secret');

  if (SECRET && token !== SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

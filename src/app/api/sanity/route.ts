import { client } from '@/utils/sanity/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');
  const params = request.nextUrl.searchParams.get('params');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const parsedParams = params ? JSON.parse(params) : {};
    const result = await client.fetch(query, parsedParams);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Sanity proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from Sanity' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

function getClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-11',
    token: process.env.SANITY_API_TOKEN,
    useCdn: true,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const params = searchParams.get('params');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const client = getClient();
    const parsedParams = params ? JSON.parse(params) : {};
    const result = await client.fetch(query, parsedParams);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Sanity proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from Sanity' }, { status: 500 });
  }
}

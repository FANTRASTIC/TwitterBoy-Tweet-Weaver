import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Avoid static caching

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic') || 'technology'; // Default to a broad topic
  const max = searchParams.get('max') || '5';
  const pageSize = parseInt(max, 10);

  const key = process.env.NEWS_API_KEY;

  if (!key) {
    return NextResponse.json(
      { error: 'NewsAPI key is not configured on the server.' },
      { status: 500 }
    );
  }

  const url = new URL('https://newsapi.org/v2/everything');
  url.searchParams.set('q', topic);
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('language', 'en');
  url.searchParams.set('sortBy', 'relevancy');

  try {
    const res = await fetch(url.toString(), {
      headers: { 'X-Api-Key': key },
      cache: 'no-store', // Ensure fresh data on every request
    });

    if (!res.ok) {
      // Pass the error from NewsAPI to the client
      const errorData = await res.json();
      console.error('NewsAPI error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch from NewsAPI' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ articles: data.articles ?? [] });
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

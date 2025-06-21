import { NextRequest, NextResponse } from 'next/server';
import { getJson } from 'serpapi';

// Use environment variable for API key
const API_KEY = process.env.SERPAPI_KEY || '';

export async function GET(request: NextRequest) {
  // Check if API key is configured
  if (!API_KEY) {
    console.error('SERPAPI_KEY environment variable is not set');
    return NextResponse.json(
      { error: 'Search service is not properly configured' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    const results = await new Promise((resolve, reject) => {
      getJson(
        {
          engine: 'google',
          q: query,
          api_key: API_KEY,
        },
        (json) => {
          if (json.error) {
            reject(new Error(json.error));
          } else {
            resolve(json);
          }
        }
      );
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('SerpAPI search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 }
    );
  }
}

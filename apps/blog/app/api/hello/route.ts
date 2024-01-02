import { NextResponse } from 'next/server';
export async function GET(request: Request) {
  const headers = new Headers(request.headers);
  headers.set('Content-Type', 'text/xml');

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

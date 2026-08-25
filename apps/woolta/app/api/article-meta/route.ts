import { NextRequest, NextResponse } from 'next/server';

const FETCH_TIMEOUT_MS = 5000;
const MAX_HTML_LENGTH = 300_000;

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();

const extractMetaContent = (html: string, patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const matched = html.match(pattern);
    if (matched?.[1]) {
      return decodeHtmlEntities(matched[1]);
    }
  }
  return undefined;
};

const metaPattern = (attr: 'property' | 'name', key: string) => [
  new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
  new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${key}["']`, 'i'),
];

/**
 * 외부 아티클 URL의 SEO 메타(og:title/description/image)를 서버에서 수집한다.
 * 브라우저 직접 fetch 시 발생하는 CORS 를 우회하기 위한 프록시 성격의 라우트.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ message: 'invalid url' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WooltaBot/1.0)' },
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ message: 'fetch failed' }, { status: 502 });
    }

    const html = (await response.text()).slice(0, MAX_HTML_LENGTH);

    const title = extractMetaContent(html, [
      ...metaPattern('property', 'og:title'),
      ...metaPattern('name', 'twitter:title'),
      /<title[^>]*>([^<]+)<\/title>/i,
    ]);
    const description = extractMetaContent(html, [
      ...metaPattern('property', 'og:description'),
      ...metaPattern('name', 'description'),
      ...metaPattern('name', 'twitter:description'),
    ]);
    const imageUrl = extractMetaContent(html, [
      ...metaPattern('property', 'og:image'),
      ...metaPattern('name', 'twitter:image'),
    ]);

    return NextResponse.json({ title, description, imageUrl });
  } catch {
    return NextResponse.json({ message: 'fetch failed' }, { status: 502 });
  }
}

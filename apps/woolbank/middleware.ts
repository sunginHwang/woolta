import { NextURL } from 'next/dist/server/web/next-url';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import appConfig, { setConfig } from './utils/config';

setConfig();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const ALLOW_ALL_USER_PAGE_LIST = ['/user/login'];

export async function middleware(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/user/login';
  const pathname = request.nextUrl.pathname;

  const isNoneAuthPage = ALLOW_ALL_USER_PAGE_LIST.some((path) => path === pathname);

  if (isNoneAuthPage) {
    return NextResponse.next();
  }

  return await withoutAuth(request, loginUrl);
}

export async function withoutAuth(req: NextRequest, loginUrl: NextURL) {
  try {
    // 개발 환경에서만 SSL 인증서 검증 비활성화
    if (process.env.NODE_ENV === 'development') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Cookie': req.cookies.toString(),
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${appConfig.apiUrl}/user`, fetchOptions);
    const info = await response.json();
    const isLoggendIn = info.status === 200 && !!info.data;

    if (isLoggendIn) {
      return NextResponse.next();
    }

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - menifest.json
     * - service-worker.js
     * - android-chrome-*
     */
    '/((?!api|_next/static|static|_next/image|favicon.ico|service-worker|manifest|android-chrome-*).*)',
  ],
};

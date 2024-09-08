import { NextURL } from 'next/dist/server/web/next-url';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ALLOW_ALL_USER_PAGE_LIST = ['/user/login'];

export async function middleware(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/user/login';
  const pathname = request.nextUrl.pathname;

  const isNoneAuthPage = ALLOW_ALL_USER_PAGE_LIST.some((path) => path === pathname);

  if (isNoneAuthPage) {
    return NextResponse.next();
  }
  return NextResponse.next();
  return await withoutAuth(request, loginUrl);
}

export async function withoutAuth(req: NextRequest, loginUrl: NextURL) {
  try {
    console.log('init');
    console.log(req.cookies);
    const response = await fetch('http://bank-api-local.woolta.com:4000/user', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Cookie': req.cookies.toString(),
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    const info = await response.json();
    const isLoggendIn = info.status === 200 && !!info.data;
    if (isLoggendIn) {
      return NextResponse.next();
    }

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.log(error);
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
    '/((?!api|_next/static|_next/image|favicon.ico|service-worker|manifest|android-chrome-*).*)',
  ],
};

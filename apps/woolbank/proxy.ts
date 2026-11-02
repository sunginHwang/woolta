import type { NextURL } from 'next/dist/server/web/next-url';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { setConfig } from './utils/config';

setConfig();

const ALLOW_ALL_USER_PAGE_LIST = ['/user/login'];

/** woolta-api(GraphQL) 호스트. graphqlFetch 의 서버 분기와 같은 규칙을 쓴다. */
const graphqlHost =
  process.env.NEXT_PUBLIC_GRAPHQL_API ?? process.env.NEXT_PUBLIC_BLOG_API ?? 'https://api-blog.woolta.com';

/** 세션 유효성만 확인하는 최소 쿼리 — 사용자 정보를 통째로 받아올 필요가 없다. */
const CHECK_ACCESS_QUERY = '{ checkAccess }';

export async function proxy(request: NextRequest) {
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
    // 개발 환경에서만 SSL 인증서 검증 비활성화 (자체 서명 인증서로 API를 띄운 경우)
    if (process.env.NODE_ENV === 'development') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    // 미들웨어는 브라우저 쿠키를 자동으로 실어주지 않으므로 요청 쿠키를 그대로 넘긴다.
    const response = await fetch(`${graphqlHost}/user/graphql`, {
      method: 'POST',
      headers: {
        'Cookie': req.cookies.toString(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: CHECK_ACCESS_QUERY }),
    });

    const json = (await response.json()) as { data?: { checkAccess?: number }; errors?: unknown[] };
    // 미인증이면 UNAUTHENTICATED 가 errors 로 온다 — access 만료 시에는 서버가 refresh 쿠키로 자동 회전한다.
    const isLoggedIn = response.ok && !json.errors?.length && !!json.data?.checkAccess;

    const next = isLoggedIn ? NextResponse.next() : NextResponse.redirect(loginUrl);

    /**
     * 회전된 쿠키를 브라우저로 반드시 흘려보낸다.
     *
     * access 가 만료된 상태로 이 게이트를 통과하면 서버가 refresh 토큰을 **1회용으로 소비**하고
     * 새 토큰쌍을 Set-Cookie 로 내려준다. 그걸 여기서 버리면 브라우저에는 이미 폐기된 refresh 가
     * 남아, 다음 요청이 재사용으로 감지돼 로그인 패밀리 전체가 폐기된다(= 강제 로그아웃).
     */
    forwardSetCookie(response, next);

    return next;
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}

const forwardSetCookie = (from: Response, to: NextResponse) => {
  const cookies =
    typeof from.headers.getSetCookie === 'function'
      ? from.headers.getSetCookie()
      : [from.headers.get('set-cookie')].filter((value): value is string => Boolean(value));

  for (const cookie of cookies) {
    to.headers.append('set-cookie', cookie);
  }
};

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
     * - android-chrome-* / badge-* (푸시 알림 아이콘 — 서비스워커가 세션 없이도 받아야 한다)
     */
    '/((?!api|_next/static|static|_next/image|favicon.ico|service-worker|manifest|android-chrome-|badge-).*)',
  ],
};

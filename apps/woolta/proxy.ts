import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const LOGIN_PATH = '/login';

/**
 * woolta-api(GraphQL) 호스트. `libs/common` 의 getGraphqlHost 서버 분기와 같은 규칙을 쓴다.
 * 이 호스트가 응답하지 않으면 게이트는 로그인으로 보낸다(fail closed) — 데이터 조회도 어차피 불가능하다.
 */
const graphqlHost =
  process.env.NEXT_PUBLIC_GRAPHQL_API ?? process.env.NEXT_PUBLIC_BLOG_API ?? 'https://api-blog.woolta.com';

/** 세션 유효성만 확인하는 최소 쿼리 — 사용자 정보를 통째로 받아올 필요가 없다. */
const CHECK_ACCESS_QUERY = '{ checkAccess }';

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  return checkSession(request, `${pathname}${search}`);
}

async function checkSession(request: NextRequest, from: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = LOGIN_PATH;
  // 로그인 후 원래 보려던 화면으로 돌려보낸다.
  loginUrl.search = from === '/' ? '' : `?next=${encodeURIComponent(from)}`;

  try {
    // 미들웨어는 브라우저 쿠키를 자동으로 실어주지 않으므로 요청 쿠키를 그대로 넘긴다.
    const response = await fetch(`${graphqlHost}/user/graphql`, {
      method: 'POST',
      headers: {
        'Cookie': request.cookies.toString(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: CHECK_ACCESS_QUERY }),
    });

    const json = (await response.json()) as { data?: { checkAccess?: number }; errors?: unknown[] };
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
     * 아래를 제외한 모든 경로를 보호한다:
     * - api (라우트 핸들러)
     * - _next/static, _next/image (빌드 산출물)
     * - favicon.ico, manifest, service-worker, static (정적 자산)
     */
    '/((?!api|_next/static|_next/image|static|favicon.ico|service-worker|manifest).*)',
  ],
};

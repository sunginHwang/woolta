/**
 * woolta-api(GraphQL) 호출용 fetcher 팩토리.
 *
 * woolta-api 는 도메인별로 엔드포인트가 분리되어 있다(/todo/graphql, /memo/graphql 등).
 * 각 도메인 lib 이 `createGraphqlFetch('todo')` 로 자기 도메인 전용 fetcher 를 만들고,
 * graphql-codegen(typescript-react-query) 이 생성한 훅이 이 fetcher 를 사용한다.
 *
 * - 브라우저: CORS 우회를 위해 호스트 앱 rewrites 프록시(/api/blog) 경유 — 쿠키(JWT)가 그대로 전달된다.
 * - 서버(SSR): woolta-api 호스트 직접 호출.
 * - 호스트는 NEXT_PUBLIC_GRAPHQL_API(_BROWSER) 로 지정한다. 미설정 시 레거시 변수
 *   NEXT_PUBLIC_BLOG_API(_BROWSER) 로 폴백한다 — 이관 기간용이며 getGraphqlHost 주석 참고.
 */

export type WooltaGraphqlDomain = 'blog' | 'woolBank' | 'user' | 'todo' | 'memo' | 'article' | 'calendar';

interface GraphqlErrorItem {
  message: string;
  extensions?: Record<string, unknown>;
}

export class GraphqlFetchError extends Error {
  constructor(
    message: string,
    public readonly errors: GraphqlErrorItem[] = [],
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'GraphqlFetchError';
  }
}

const DEFAULT_API_HOST = 'https://api-blog.woolta.com';

/**
 * GraphQL 호스트 해석.
 *
 * 이관 기간에는 레거시 REST(Spring blog API)와 woolta-api GraphQL이 서로 다른 서버에 있어서
 * NEXT_PUBLIC_BLOG_API 하나로 양쪽을 가리킬 수 없다. GraphQL 전용 변수를 먼저 보고 없으면
 * 기존 변수로 폴백한다(설정하지 않은 환경의 동작을 그대로 보존).
 * 이관이 끝나면 폴백을 제거하고 NEXT_PUBLIC_GRAPHQL_API 로 수렴한다.
 * 배경: docs/rest-to-graphql-migration.md
 */
const getGraphqlHost = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_GRAPHQL_API ?? process.env.NEXT_PUBLIC_BLOG_API ?? DEFAULT_API_HOST;
  }
  return (
    process.env.NEXT_PUBLIC_GRAPHQL_API_BROWSER ??
    process.env.NEXT_PUBLIC_GRAPHQL_API ??
    process.env.NEXT_PUBLIC_BLOG_API_BROWSER ??
    process.env.NEXT_PUBLIC_BLOG_API ??
    DEFAULT_API_HOST
  );
};

/**
 * RSC 프리페치 공통 옵션.
 *
 * 사용자별 데이터는 인증 쿠키가 필요한데, RSC 의 fetch 는 브라우저 쿠키를 자동으로 실어주지 않는다.
 * 호출부(page.tsx)가 `(await cookies()).toString()` 을 넘겨야 한다.
 * 쿠키가 없거나 만료돼 프리페치가 실패하면 dehydrate 대상에서 빠지고 클라이언트가 다시 조회한다.
 */
export interface PrefetchOptions {
  /** RSC 에서 전달하는 요청 쿠키 헤더 */
  cookie?: string;
}

/**
 * refresh 쿠키는 프리페치에서 제외한다.
 *
 * 서버는 access 가 만료되면 refresh 토큰을 **1회용으로 소비**하고 새 토큰쌍을 Set-Cookie 로 내려준다.
 * 그런데 RSC 렌더 중에는 응답 쿠키를 브라우저로 되돌릴 수 없다(서버 컴포넌트에서 쿠키 수정 불가).
 * 그대로 두면 서버에서 refresh 가 소비되고 브라우저에는 폐기된 값이 남아, 다음 요청이 재사용으로
 * 감지돼 로그인 패밀리 전체가 폐기된다(= 강제 로그아웃).
 *
 * refresh 를 빼면 만료된 세션의 프리페치는 UNAUTHENTICATED 로 실패하고 dehydrate 대상에서 빠진다.
 * 브라우저가 다시 조회할 때는 자기 쿠키로 요청하므로 회전과 쿠키 갱신이 정상적으로 일어난다.
 * 즉 회전은 브라우저 요청과 미들웨어(쿠키를 흘려보내는 쪽)에서만 발생한다.
 */
const REFRESH_COOKIE_NAME = 'w.refresh';

const stripRefreshCookie = (cookie: string) =>
  cookie
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part !== '' && !part.startsWith(`${REFRESH_COOKIE_NAME}=`))
    .join('; ');

export const toPrefetchHeaders = ({ cookie }: PrefetchOptions) => {
  if (!cookie) {
    return undefined;
  }

  const forwarded = stripRefreshCookie(cookie);

  return forwarded === '' ? undefined : { cookie: forwarded };
};

export const createGraphqlFetch = (domain: WooltaGraphqlDomain) =>
  // query 는 plain string 또는 codegen 이 생성한 TypedDocumentString(String 서브클래스)
  function gqlFetch<TData, TVariables>(
    query: string | { toString(): string },
    variables?: TVariables,
    options?: RequestInit['headers'],
  ) {
    return async (): Promise<TData> => {
      const headers = new Headers(options);
      headers.set('Content-Type', 'application/json');

      const res = await fetch(`${getGraphqlHost()}/${domain}/graphql`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ query: query.toString(), variables }),
      });

      const json = (await res.json().catch(() => null)) as {
        data?: TData;
        errors?: GraphqlErrorItem[];
      } | null;

      if (!res.ok || !json || json.errors?.length) {
        const message = json?.errors?.[0]?.message ?? `GraphQL 요청 실패 (${domain}, status: ${res.status})`;
        throw new GraphqlFetchError(message, json?.errors ?? [], res.status);
      }

      return json.data as TData;
    };
  };

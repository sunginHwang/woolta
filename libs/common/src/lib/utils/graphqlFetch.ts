/**
 * woolta-api(GraphQL) 호출용 fetcher 팩토리.
 *
 * woolta-api 는 도메인별로 엔드포인트가 분리되어 있다(/todo/graphql, /memo/graphql 등).
 * 각 도메인 lib 이 `createGraphqlFetch('todo')` 로 자기 도메인 전용 fetcher 를 만들고,
 * graphql-codegen(typescript-react-query) 이 생성한 훅이 이 fetcher 를 사용한다.
 *
 * - 브라우저: CORS 우회를 위해 호스트 앱 rewrites 프록시(/api/blog) 경유 — 쿠키(JWT)가 그대로 전달된다.
 * - 서버(SSR): woolta-api 호스트 직접 호출.
 * - NEXT_PUBLIC_BLOG_API 는 이름과 달리 woolta-api 호스트 전체를 가리킨다(api-blog.woolta.com).
 */

export type WooltaGraphqlDomain = 'blog' | 'woolBank' | 'user' | 'todo' | 'memo' | 'article';

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

const getGraphqlHost = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_BLOG_API ?? DEFAULT_API_HOST;
  }
  return process.env.NEXT_PUBLIC_BLOG_API_BROWSER ?? process.env.NEXT_PUBLIC_BLOG_API ?? DEFAULT_API_HOST;
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

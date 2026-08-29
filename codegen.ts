import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * GraphQL codegen — woolta-api 통합 스키마(tools/external-schema/api-autogen.graphql) 기반으로
 * 각 도메인 lib 의 *.graphql 문서를 순회하며 타입 + TanStack Query 훅을 생성한다.
 *
 * 서버 엔드포인트가 도메인별로 분리되어 있으므로(/todo/graphql 등) 생성 파일도 도메인 단위로 나누고,
 * 각 도메인은 `_shared/api/fetcher.ts` 에서 `createGraphqlFetch('{domain}')` 로 만든 gqlFetch 를 노출해야 한다.
 *
 * 실행: pnpm codegen (스키마 갱신은 woolta-api 레포에서 npm run mergeSchema 후 복사)
 */

const domainOutput = (documents: string[]) => ({
  documents,
  // typescript-operations v6+ 는 오퍼레이션이 참조하는 input/enum 타입까지 자체 생성하므로 typescript 플러그인 불필요
  plugins: ['typescript-operations', 'typescript-react-query'],
  config: {
    reactQueryVersion: 5,
    addSuspenseQuery: true,
    exposeQueryKeys: true,
    exposeFetcher: true,
    fetcher: { func: './fetcher#gqlFetch' },
    scalars: { DateTime: 'string', JSON: 'unknown' },
    enumsAsTypes: true,
    skipTypename: true,
  },
});

const config: CodegenConfig = {
  schema: 'tools/external-schema/api-autogen.graphql',
  ignoreNoDocuments: true,
  generates: {
    // 도메인 추가 시: '{lib}/src/_shared/api/gql.generated.ts': domainOutput(['libs/{domain}/**/*.graphql'])
    'libs/todo/features/src/_shared/api/gql.generated.ts': domainOutput(['libs/todo/**/*.graphql']),
  },
};

export default config;

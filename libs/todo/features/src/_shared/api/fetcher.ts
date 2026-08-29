import { createGraphqlFetch } from '@common';

// gql.generated.ts(graphql-codegen)가 사용하는 todo 도메인 전용 fetcher
export const gqlFetch = createGraphqlFetch('todo');

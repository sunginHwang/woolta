// @common 배럴은 클라이언트 전용 훅/컨텍스트까지 끌고 와 RSC 에서 못 쓴다.
// 서버 프리페치에서도 이 모듈을 import 하므로 순수 유틸 경로로 직접 가져온다.
import { createGraphqlFetch } from '@common/graphql';

// gql.generated.ts(graphql-codegen)가 사용하는 calendar 도메인 전용 fetcher
export const gqlFetch = createGraphqlFetch('calendar');

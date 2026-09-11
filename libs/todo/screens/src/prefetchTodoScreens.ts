import type { PrefetchOptions } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';
import { prefetchCategoryList, prefetchTodos } from '@todo/features';

/**
 * Todo 화면(사이드바 + 리스트 + 상세)이 쓰는 두 조회를 한 번에 프리페치한다.
 *
 * 두 도메인 각자의 프리페치를 조합한 것뿐이다 — 개별 queryKey 는 여전히 각 도메인 모듈만 안다.
 */
export async function prefetchTodoScreens(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await Promise.all([prefetchTodos(queryClient, options), prefetchCategoryList(queryClient, options)]);
}

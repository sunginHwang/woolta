import { prefetchArticles, prefetchCategoryList, prefetchCurationList } from '@article-curations/features';
import type { PrefetchOptions } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';

/**
 * 아티클 화면(사이드바 + 리스트)이 쓰는 세 조회를 한 번에 프리페치한다.
 *
 * 세 도메인 각자의 프리페치를 조합한 것뿐이다 — 개별 queryKey 는 여전히 각 도메인 모듈만 안다.
 * 리스트/큐레이션/카테고리 라우트가 모두 같은 셋을 필요로 해서 페이지마다 반복하지 않도록 여기 둔다.
 */
export async function prefetchArticleScreens(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await Promise.all([
    prefetchArticles(queryClient, options),
    prefetchCategoryList(queryClient, options),
    prefetchCurationList(queryClient, options),
  ]);
}

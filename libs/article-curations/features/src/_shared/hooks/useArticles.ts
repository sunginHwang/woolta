// 이 모듈은 '아티클 목록' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchArticles 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useArticleListQuery, useSuspenseArticleListQuery } from '../api/gql.generated';
import type { Article } from '../types';

/**
 * 등록된 전체 아티클을 반환한다. (정렬은 화면별로 useArticleList 가 담당)
 *
 * 카테고리별로 나눠 받지 않는 이유는 article.graphql 주석 참고 — 사이드바 뱃지가
 * 전체를 카테고리별로 세야 해서 목록을 한 번만 받고 클라이언트에서 나눈다.
 */
export const useArticles = (): Article[] => {
  const { data } = useSuspenseArticleListQuery();

  return data.articleList.itemList;
};

/** 아티클 목록 캐시 조작. */
export const useArticlesCache = () => {
  const queryClient = useQueryClient();

  const invalidateArticles = useCallback(
    () => queryClient.invalidateQueries({ queryKey: useArticleListQuery.getKey() }),
    [queryClient],
  );

  return { invalidateArticles };
};

/** RSC 프리페치 — codegen 의 `.fetcher` 로 서버에서 목록 캐시를 채운다. */
export async function prefetchArticles(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await queryClient.prefetchQuery({
    queryKey: useArticleListQuery.getKey(),
    queryFn: useArticleListQuery.fetcher(undefined, toPrefetchHeaders(options)),
  });
}

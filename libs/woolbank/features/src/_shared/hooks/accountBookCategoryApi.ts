// 카테고리 · 카테고리 이미지 조회의 쿼리키 · fetcher · 서버 프리페치를 소유한다.
// RSC 에서 import 해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';
import type { AccountBookCategoryImagePartsFragment, AccountBookCategoryPartsFragment } from '../api/gql.generated';
import { useAccountBookCategoryImageListQuery, useAccountBookCategoryListQuery } from '../api/gql.generated';

export type AccountBookCategory = AccountBookCategoryPartsFragment;
export type AccountBookCategoryImage = AccountBookCategoryImagePartsFragment;

export const accountBookCategoryListKey = () => useAccountBookCategoryListQuery.getKey();
export const accountBookCategoryImageListKey = () => useAccountBookCategoryImageListQuery.getKey();

export const fetchAccountBookCategories = async (options: PrefetchOptions = {}) => {
  const data = await useAccountBookCategoryListQuery.fetcher(undefined, toPrefetchHeaders(options))();

  return data.accountBookCategoryList.itemList;
};

export const fetchAccountBookCategoryImages = async (options: PrefetchOptions = {}) => {
  const data = await useAccountBookCategoryImageListQuery.fetcher(undefined, toPrefetchHeaders(options))();

  return data.accountBookCategoryImageList.itemList;
};

/**
 * RSC 프리페치.
 *
 * 반드시 훅과 **같은 queryFn** 을 써야 한다. 생성 훅의 `.fetcher()` 를 그대로 넘기면
 * 캐시에 `{ accountBookCategoryList: { totalCount, itemList } }` 가 들어가는데 훅은 itemList 배열을
 * 기대하므로, 하이드레이션 직후 `categories.filter is not a function` 으로 터진다.
 */
export function prefetchAccountBookCategories(queryClient: QueryClient, options: PrefetchOptions = {}) {
  return queryClient.prefetchQuery({
    queryKey: accountBookCategoryListKey(),
    queryFn: () => fetchAccountBookCategories(options),
  });
}

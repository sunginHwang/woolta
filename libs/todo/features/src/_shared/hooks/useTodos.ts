// 이 모듈은 '할 일 목록' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchTodos 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useSuspenseTodoListQuery, useTodoListQuery } from '../api/gql.generated';
import type { Todo } from '../types';

/**
 * 등록된 전체 할 일을 반환한다. (완료·휴지통 포함 — 리스트별 필터는 useFilteredTodoList 가 담당)
 *
 * 사이드바 뱃지가 오늘/미래/기본함/완료/휴지통을 한 번에 세야 해서 목록을 통째로 받고
 * 클라이언트에서 나눈다. 서버 쿼리도 필터 인자가 없다.
 */
export const useTodos = (): Todo[] => {
  const { data } = useSuspenseTodoListQuery();

  return data.todoList.itemList;
};

/** 할 일 목록 캐시 조작. */
export const useTodosCache = () => {
  const queryClient = useQueryClient();

  const invalidateTodos = useCallback(
    () => queryClient.invalidateQueries({ queryKey: useTodoListQuery.getKey() }),
    [queryClient],
  );

  return { invalidateTodos };
};

/** RSC 프리페치 — codegen 의 `.fetcher` 로 서버에서 목록 캐시를 채운다. */
export async function prefetchTodos(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await queryClient.prefetchQuery({
    queryKey: useTodoListQuery.getKey(),
    queryFn: useTodoListQuery.fetcher(undefined, toPrefetchHeaders(options)),
  });
}

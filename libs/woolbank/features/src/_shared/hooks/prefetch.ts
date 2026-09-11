import type { QueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { prefetchAccountBookCategories } from './accountBookCategoryApi';
import { prefetchAccountBookList } from './accountBookListApi';

/**
 * AccountBookMain 스크린에 필요한 데이터를 서버에서 prefetch합니다.
 *
 * 쿼리키와 조회 함수는 각 api 모듈이 소유한다 — 여기서는 조합만 한다.
 */
export async function prefetchAccountBookMain(queryClient: QueryClient, opts: { cookie?: string } = {}) {
  await Promise.all([
    prefetchAccountBookCategories(queryClient, { cookie: opts.cookie }),
    prefetchAccountBookList(queryClient, {
      selectedDate: dayjs().format('YYYY-MM'),
      cookie: opts.cookie,
    }),
  ]);
}

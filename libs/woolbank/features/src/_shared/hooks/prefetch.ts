import { QueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getData } from '../api';
// Hardcoded to avoid circular dependency (account-book-form → _shared → account-book-form)
const ACCOUNT_BOOK_CATEGORIES_QUERY_KEY = 'getAccountBookCategories';
import { prefetchAccountBookList } from './accountBookListApi';

/**
 * AccountBookMain 스크린에 필요한 데이터를 서버에서 prefetch합니다.
 */
export async function prefetchAccountBookMain(
  queryClient: QueryClient,
  opts: { cookie?: string } = {},
) {
  const headers = opts.cookie ? { Cookie: opts.cookie } : undefined;
  const config = headers ? { headers } : undefined;

  await queryClient.prefetchQuery({
    queryKey: [ACCOUNT_BOOK_CATEGORIES_QUERY_KEY],
    queryFn: async () => {
      const { data } = await getData('/account-book-categories', config);
      return data;
    },
  });

  await prefetchAccountBookList(queryClient, {
    selectedDate: dayjs().format('YYYY-MM'),
    config,
  });
}

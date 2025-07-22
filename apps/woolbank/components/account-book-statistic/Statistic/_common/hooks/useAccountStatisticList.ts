import { useAtomValue } from 'jotai';
import { AccountBookStatisticFilterAtom, allVisibilityStatisticAtom } from '../stores/statisticFilter';
import { useAccountStatisticListQuery } from './useAccountStatisticListQuery';

export const ACCOUNT_BOOK_LIST_QUERY_KEY = 'accountBookList';

export const useAccountStatisticList = () => {
  const allVisibilityStatistic = useAtomValue(allVisibilityStatisticAtom);
  const AccountBookStatisticFilter = useAtomValue(AccountBookStatisticFilterAtom);

  const { accountBookStatisticList, ...rest } = useAccountStatisticListQuery(
    AccountBookStatisticFilter,
    allVisibilityStatistic,
  );

  return {
    accountBookStatisticList,
    ...rest,
  };
};

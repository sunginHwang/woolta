'use client';

import { DehydratedState, HydrationBoundary } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import Header from '../../common/Header';
import AccountBookForm from './AccountBookForm';
import { AccountBookSaveForm } from './AccountBookForm/hooks/useAccountBookForm';
import { AccountBookDetail, useAccountBookDetail } from './hooks/useAccountBookDetail';
import { useAccountBookSaveRouterProps } from './hooks/useAccountBookSaveRouterProps';

interface Props {
  dehydratedState?: DehydratedState;
}
export const AccountBookSavePage: NextPage<Props> = ({ dehydratedState }) => {
  const { account_book_id } = useAccountBookSaveRouterProps();
  const { accountBookDetail, upsertAccountBook, removeAccountBook } = useAccountBookDetail(account_book_id);
  const accountBookForm = getAccountBookFrom(accountBookDetail);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Header.Sub title={accountBookDetail ? accountBookDetail.title : '거래 내역 추가'} />
      <AccountBookForm
        accountBookForm={accountBookForm}
        submitForm={upsertAccountBook}
        removeAccountBookForm={removeAccountBook}
      />
    </HydrationBoundary>
  );
};

function getAccountBookFrom(accountBookDetail: AccountBookDetail | null): AccountBookSaveForm | undefined {
  if (!accountBookDetail) {
    return undefined;
  }

  const { id, title, amount, memo = '', registerDateTime, category, type, isDisabledBudget } = accountBookDetail;
  return {
    id,
    title,
    amount,
    memo,
    registerDateTime: dayjs(registerDateTime),
    isDisabledBudget,
    category: {
      ...category,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    },
    type,
  };
}

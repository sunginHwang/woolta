'use client';

import { DehydratedState, HydrationBoundary } from '@tanstack/react-query';
import {
  AccountBookDetail,
  AccountBookForm,
  useAccountBookDetail,
  useAccountBookSaveRouterProps,
} from '@woolta/woolbank-features';
import dayjs from 'dayjs';
import { ScreenBoundary } from '../common/ScreenBoundary';

interface Props {
  dehydratedState?: DehydratedState;
}

const AccountBookSaveContent = () => {
  const { account_book_id } = useAccountBookSaveRouterProps();
  const { accountBookDetail, upsertAccountBook, removeAccountBook } = useAccountBookDetail(account_book_id);
  const accountBookForm = getAccountBookForm(accountBookDetail);

  return (
    <AccountBookForm
      accountBookForm={accountBookForm}
      submitForm={upsertAccountBook}
      removeAccountBookForm={removeAccountBook}
    />
  );
};

export const AccountBookSaveScreen = ({ dehydratedState }: Props) => {
  return (
    <HydrationBoundary state={dehydratedState}>
      <ScreenBoundary mountGate>
        <AccountBookSaveContent />
      </ScreenBoundary>
    </HydrationBoundary>
  );
};

function getAccountBookForm(accountBookDetail: AccountBookDetail | null | undefined) {
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

'use client';

import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import { Header } from '../../../components/Header/Header';
import { type AccountBookDetail, useAccountBookDetail } from './_common/hooks/useAccountBookDetail';
import { useAccountBookSaveRouterProps } from './_common/hooks/useAccountBookSaveRouterProps';
import {
  type AccountBookSaveForm,
  createInitialAccountBookForm,
} from './account-book-form/_common/hooks/useAccountBookForm';
import { AccountBookForm } from './account-book-form/AccountBookForm';

interface Props {
  dehydratedState?: DehydratedState;
}
export const AccountBookSavePage: NextPage<Props> = ({ dehydratedState }) => {
  const { account_book_id, initial_date } = useAccountBookSaveRouterProps();
  const { accountBookDetail, upsertAccountBook, removeAccountBook } = useAccountBookDetail(account_book_id);
  const accountBookForm = getAccountBookFrom(accountBookDetail) ?? getInitialForm(initial_date);

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

  const { id, title, amount, memo, registerDateTime, accountBookCategory, type, isDisabledBudget } = accountBookDetail;

  return {
    id,
    title,
    amount,
    memo: memo ?? '',
    registerDateTime: dayjs(registerDateTime),
    isDisabledBudget,
    // 생성 fragment 가 폼이 요구하는 카테고리 형태와 같다 — 그대로 넘긴다
    category: accountBookCategory,
    type,
  };
}

/** 달력에서 넘어온 날짜가 있으면 그날(현재 시각)로 시작한다. 없으면 폼 기본값을 쓴다 */
function getInitialForm(initialDate: string | null): AccountBookSaveForm | undefined {
  if (!initialDate) {
    return undefined;
  }

  const now = dayjs();

  return createInitialAccountBookForm({ registerDateTime: dayjs(initialDate).hour(now.hour()).minute(now.minute()) });
}

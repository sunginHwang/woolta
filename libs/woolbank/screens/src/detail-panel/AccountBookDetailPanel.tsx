'use client';

import { Text } from '@wds';
import {
  AccountBookDetail,
  AccountBookForm,
  selectedAccountBookIdAtom,
  useAccountBookDetail,
} from '@woolta/woolbank-features';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { ScreenBoundary } from '../common/ScreenBoundary';

const DetailContent = ({ accountBookId }: { accountBookId: number }) => {
  const { accountBookDetail, upsertAccountBook, removeAccountBook } = useAccountBookDetail(String(accountBookId));
  const accountBookForm = getAccountBookForm(accountBookDetail);

  return (
    <AccountBookForm
      accountBookForm={accountBookForm}
      submitForm={upsertAccountBook}
      removeAccountBookForm={removeAccountBook}
    />
  );
};

/**
 * 대시보드(woolta) 가계부 우측 상세 패널.
 * 리스트에서 선택한 내역(selectedAccountBookIdAtom)의 수정 폼을 보여준다.
 */
export const AccountBookDetailPanel = () => {
  const selectedId = useAtomValue(selectedAccountBookIdAtom);

  if (selectedId === null) {
    return (
      <SC.Empty>
        <Text as='p' variant='title5Bold' color='textSecondary' alignment='center'>
          내역을 선택하세요
        </Text>
        <Text as='p' variant='body3' color='textTertiary' alignment='center' mt={8}>
          좌측 리스트에서 내역을 선택하면 상세가 여기에 표시됩니다
        </Text>
      </SC.Empty>
    );
  }

  return (
    <SC.Container>
      <ScreenBoundary mountGate>
        <DetailContent key={selectedId} accountBookId={selectedId} />
      </ScreenBoundary>
    </SC.Container>
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

const SC = {
  Container: styled.div`
    position: relative;
    min-height: 100%;
    background-color: ${({ theme }) => theme.colors.bgSurface};
  `,
  Empty: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
  `,
};

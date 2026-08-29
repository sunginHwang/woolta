'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import {
  type AccountBookDetail,
  AccountBookForm,
  NEW_ACCOUNT_BOOK_ID,
  selectedAccountBookIdAtom,
  useAccountBookDetail,
} from '@woolta/woolbank-features';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { ScreenBoundary } from '../common/ScreenBoundary';

const styles = stylex.create({
  container: {
    position: 'relative',
    minHeight: '100%',
    padding: '1.6rem',
    backgroundColor: colorVars['--color-bgSurface'],
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '2rem',
  },
});

const DetailContent = ({ accountBookId }: { accountBookId: number | null }) => {
  // accountBookId 가 null 이면 작성 모드 — detail fetch 를 건너뛰고 빈 작성 폼을 보여준다.
  const { accountBookDetail, upsertAccountBook, removeAccountBook } = useAccountBookDetail(
    accountBookId === null ? null : String(accountBookId),
  );
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
      <div {...stylex.props(styles.empty)}>
        <Text as='p' variant='title5Bold' color='textSecondary' alignment='center'>
          내역을 선택하세요
        </Text>
        <Text as='p' variant='body3' color='textTertiary' alignment='center' mt={8}>
          좌측 리스트에서 내역을 선택하면 상세가 여기에 표시됩니다
        </Text>
        <Text as='p' variant='body3' color='textTertiary' alignment='center' mt={4}>
          Q 키 또는 + 버튼으로 새 내역을 작성할 수 있어요
        </Text>
      </div>
    );
  }

  const accountBookId = selectedId === NEW_ACCOUNT_BOOK_ID ? null : selectedId;

  return (
    <div {...stylex.props(styles.container)}>
      <ScreenBoundary mountGate>
        <DetailContent key={selectedId} accountBookId={accountBookId} />
      </ScreenBoundary>
    </div>
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

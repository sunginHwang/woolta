import * as stylex from '@stylexjs/stylex';
import { ListRow } from '@wds';
import { formatWon } from '@woolta/woolbank-features';
import Link from 'next/link';
import { memo } from 'react';
import type { AccountBook } from '../_common/hooks/useAccountBookList';

interface Props {
  accountBook: AccountBook;
}

const styles = stylex.create({
  icon: {
    width: '2rem',
    height: '2rem',
    objectFit: 'contain',
  },
});

/**
 * 가계부 한 건 — wds ListRow. 수입은 "+" finIncome, 지출은 "−" textPrimary.
 * @component
 */
export const AccountBookListRow = memo(({ accountBook }: Props) => {
  const { id, title, amount, type, isRegularExpenditure, accountBookCategory } = accountBook;
  const isIncome = type === 'INCOME';

  return (
    <ListRow
      leading={
        <img src={accountBookCategory.accountBookCategoryImage.imageUrl} alt='' {...stylex.props(styles.icon)} />
      }
      leadingTone='primary'
      title={title}
      subtitle={`${accountBookCategory.name}${isRegularExpenditure ? ' · 매월' : ''}`}
      value={formatWon(isIncome ? amount : -amount, { sign: true })}
      valueTone={isIncome ? 'income' : 'default'}
      href={`/account-books/save?id=${id}`}
      linkComponent={Link}
    />
  );
});

AccountBookListRow.displayName = 'AccountBookListRow';

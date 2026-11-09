'use client';

import * as stylex from '@stylexjs/stylex';
import { BottomSheet, Button, EmptyState, IconPlus, Text } from '@wds';
import { formatDayTitle, formatWon } from '@woolta/woolbank-features';
import type { AccountBook } from '../_common/hooks/useAccountBookList';
import { AccountBookListRow } from '../daily-list/AccountBookListRow';

export interface DaySheetProps {
  open: boolean;
  onClose: () => void;
  /** 'YYYY-MM-DD' */
  date: string;
  /** 그날 내역 */
  items: AccountBook[];
  /** 공유코드 세션은 추가 버튼을 숨긴다 */
  canAdd: boolean;
  onAddClick: () => void;
}

const styles = stylex.create({
  summary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingInline: '2rem',
    paddingBottom: '0.8rem',
  },
  tabular: {
    fontVariantNumeric: 'tabular-nums',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    marginInline: '-1.2rem',
    paddingBlock: 0,
    paddingInline: 0,
  },
  empty: {
    paddingBlock: '2rem',
  },
  cta: {
    paddingTop: '1.2rem',
  },
});

/**
 * 달력에서 날짜를 탭하면 뜨는 그날 내역 시트. 제목·건수·합계 + 리스트 + "이날 내역 추가".
 * @component
 */
export const DaySheet = ({ open, onClose, date, items, canAdd, onAddClick }: DaySheetProps) => {
  const expenseCount = items.filter((item) => item.type === 'EXPENDITURE').length;
  const total = items.reduce((acc, item) => acc + (item.type === 'INCOME' ? item.amount : -item.amount), 0);

  return (
    <BottomSheet open={open} onClose={onClose} title={formatDayTitle(date)} maxHeight='72dvh'>
      <div {...stylex.props(styles.summary)}>
        <Text variant='body4Regular' color='textSecondary'>
          {items.length === 0 ? '기록 없음' : expenseCount > 0 ? `지출 ${expenseCount}건` : '수입만 있어요'}
        </Text>
        {items.length > 0 && (
          <Text variant='title3Bold' color='textPrimary' xstyle={styles.tabular}>
            {formatWon(total, { sign: true })}
          </Text>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyState size='small' message='이날은 기록이 없어요' xstyle={styles.empty} />
      ) : (
        <ul {...stylex.props(styles.list)}>
          {items.map((item) => (
            <li key={item.id}>
              <AccountBookListRow accountBook={item} />
            </li>
          ))}
        </ul>
      )}
      {canAdd && (
        <div {...stylex.props(styles.cta)}>
          <Button variant='secondary' size='large' fill startIcon={<IconPlus size={18} />} onClick={onAddClick}>
            이날 내역 추가
          </Button>
        </div>
      )}
    </BottomSheet>
  );
};

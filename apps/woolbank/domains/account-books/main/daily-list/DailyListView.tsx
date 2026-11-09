import * as stylex from '@stylexjs/stylex';
import { EmptyState } from '@wds';
import { toIsoDate } from '@woolta/woolbank-features';
import type { AccountBook } from '../_common/hooks/useAccountBookList';
import { AccountBookListRow } from './AccountBookListRow';
import { DayHeader } from './DayHeader';

export interface DailyListGroup {
  /** 일(day) 문자열 — useAccountBookList 의 그룹 키 */
  days: string;
  totalAmount: number;
  accountBookList: AccountBook[];
}

export interface DailyListViewProps {
  /** 'YYYY-MM' */
  month: string;
  /** 최신 날짜부터 */
  groups: DailyListGroup[];
}

const styles = stylex.create({
  list: {
    paddingTop: '0.8rem',
  },
  empty: {
    paddingBlock: '4rem',
  },
  ul: {
    listStyle: 'none',
    margin: 0,
    paddingBlock: 0,
    paddingInline: 0,
  },
});

/**
 * 일별 가계부 리스트 — 날짜 헤더 + ListRow 들. 비어 있으면 EmptyState.
 * @component
 */
export const DailyListView = ({ month, groups }: DailyListViewProps) => {
  if (groups.length === 0) {
    return (
      <EmptyState
        message='이달 내역이 없어요'
        description='＋ 버튼으로 첫 내역을 추가해 보세요'
        xstyle={styles.empty}
      />
    );
  }

  return (
    <section aria-label='일별 내역' {...stylex.props(styles.list)}>
      {groups.map(({ days, totalAmount, accountBookList }, index) => (
        <div key={days}>
          <DayHeader date={toIsoDate(month, days)} totalAmount={totalAmount} first={index === 0} />
          <ul aria-label={`${days}일 내역`} {...stylex.props(styles.ul)}>
            {accountBookList.map((item) => (
              <li key={item.id}>
                <AccountBookListRow accountBook={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

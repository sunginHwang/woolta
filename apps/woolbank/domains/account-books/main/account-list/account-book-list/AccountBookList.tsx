'use client';

import { withSuspense } from '@common';
import * as stylex from '@stylexjs/stylex';
import dayjs from 'dayjs';
import groupBy from 'lodash-es/groupBy';
import { EmptyInfo } from '../../../../../components/empty-info/EmptyInfo';
import { type AccountBook, useAccountBookList } from '../../_common/hooks/useAccountBookList';
import { AccountBookListSkeleton } from './AccountBookListSkeleton';
import DayGroup from './DayGroup';
import Item from './Item';

const styles = stylex.create({
  accountBookList: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
    marginBottom: '10rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '3.4rem',
  },
});

/**
 * 가계부 리스트
 * @component
 */
const AccountBookList = () => {
  const { accountBookList } = useAccountBookList();
  const accountBookListGroupByDay = getAccountListGroupByDay(accountBookList);

  if (accountBookListGroupByDay.length === 0) {
    return (
      <div {...stylex.props(styles.accountBookList)}>
        <EmptyInfo msg='작성한 소비 내역이 없습니다.' />
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.accountBookList)}>
      {accountBookListGroupByDay.map(({ totalAmount, accountBookList, days }) => {
        return (
          <DayGroup key={days} days={days} totalAmount={totalAmount}>
            {accountBookList.map((item) => (
              <Item key={item.id} accountBook={item} />
            ))}
          </DayGroup>
        );
      })}
    </div>
  );
};

export default withSuspense(AccountBookList, <AccountBookListSkeleton />);

/**
 * 가계부 리스트의 총합금액 구하기 (소비, 지출 포함)
 */
function getTotalAmount(accountBookList: AccountBook[]) {
  return accountBookList.reduce((prev, item) => {
    const addPrice = item.type === 'income' ? item.amount : -item.amount;
    return prev + addPrice;
  }, 0);
}

function getAccountListGroupByDay(accountBookList: AccountBook[]) {
  const accountBookListGroupDays = groupBy(accountBookList, (item) => dayjs(item.registerDateTime).format('D'));
  return Object.entries(accountBookListGroupDays)
    .map(([days, accountBookList]) => {
      const totalAmount = getTotalAmount(accountBookList);

      return {
        accountBookList,
        totalAmount,
        days,
      };
    })
    .reverse();
}

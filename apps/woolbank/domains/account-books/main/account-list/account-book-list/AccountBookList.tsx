'use client';

import dayjs from 'dayjs';
import groupBy from 'lodash-es/groupBy';
import { styled } from 'styled-components';
import { EmptyInfo } from '../../../../../components/empty-info/EmptyInfo';
import { AccountBook, useAccountBookList } from '../../_common/hooks/useAccountBookList';
import { AccountBookListSkeleton } from './AccountBookListSkeleton';
import DayGroup from './DayGroup';
import Item from './Item';
import { withSuspense } from '@common';

/**
 * 가계부 리스트
 * @component
 */
const AccountBookList = () => {
  const { accountBookList } = useAccountBookList();
  const accountBookListGroupByDay = getAccountListGroupByDay(accountBookList);

  if (accountBookListGroupByDay.length === 0) {
    return (
      <SC.AccountBookList>
        <EmptyInfo msg='작성한 소비 내역이 없습니다.' />
      </SC.AccountBookList>
    );
  }

  return (
    <SC.AccountBookList>
      {accountBookListGroupByDay.map(({ totalAmount, accountBookList, days }) => {
        return (
          <DayGroup key={days} days={days} totalAmount={totalAmount}>
            {accountBookList.map((item) => (
              <Item key={item.id} accountBook={item} />
            ))}
          </DayGroup>
        );
      })}
    </SC.AccountBookList>
  );
};

export default withSuspense(AccountBookList, <AccountBookListSkeleton />);

const SC = {
  AccountBookList: styled.div`
    padding: 0 1.6rem;
    margin-bottom: 10rem;
  `,
};

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

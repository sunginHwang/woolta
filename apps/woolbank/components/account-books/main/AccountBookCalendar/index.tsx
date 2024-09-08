'use client';

import { Text } from '@wds';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { AccountbookBottomSheet, AccountBookSheetItem } from '../../common/AccountbookBottomSheet';
import { selectedAccountBookDateAtom } from '../AccountList/store';
import { useAccountBookList } from '../hooks/useAccountBookList';
import { Day } from './Day';
import { WeekInfo } from './WeekInfo';

const WEEK_DAY_KO_LIST = ['일', '월', '화', '수', '목', '금', '토'];

export const AccountBookCalendar = () => {
  const { colors } = useTheme();
  const { accountBookListGroupByDay } = useAccountBookList();
  const selectedAccountBookDate = useAtomValue(selectedAccountBookDateAtom);
  const [accountBookSheetItemList, setAccountBookSheetItemList] = useState<AccountBookSheetItem[]>([]);
  const renderCalendar = () => {
    const totalDays = dayjs(selectedAccountBookDate).daysInMonth();
    const firstDay = dayjs(`${selectedAccountBookDate}-01`).day();

    // 주차별로 일자를 그룹화한 배열 생성
    const calendarDays = Array.from({ length: Math.ceil((totalDays + firstDay) / 7) }, (_, weekIndex) => {
      const startDay = weekIndex * 7 - firstDay + 1;
      return Array.from({ length: 7 }, (_, dayIndex) => {
        const day = startDay + dayIndex;
        const isValidDay = day > 0 && day <= totalDays;
        return isValidDay ? day : 0;
      });
    });

    // 각 주차별로 Day 컴포넌트 렌더링
    return calendarDays.map((weekDays, index) => {
      const accountBookListByWeek = accountBookListGroupByDay.filter((accountBook) =>
        weekDays.some((day) => Number(accountBook.days) === day),
      );

      const weekInfo = accountBookListByWeek?.reduce(
        (acc, accountBook) => {
          acc.incomeAmount += accountBook.incomeAmount;
          acc.expenditureAmount += accountBook.expenditureAmount;
          return acc;
        },
        {
          expenditureAmount: 0,
          incomeAmount: 0,
        },
      );

      return (
        <div key={`week-${index}`}>
          <SC.Week>
            {weekDays.map((day, index) => {
              const key = `day-${day}-${index}`;

              if (day === 0) {
                return <SC.Empty key={key} />;
              }
              const accountBookByDay = accountBookListByWeek.find((accountBook) => Number(accountBook.days) === day);

              const handleDayClick = () => {
                setAccountBookSheetItemList(
                  accountBookByDay?.accountBookList.map((item) => ({
                    title: item.title,
                    iconImageUrl: item.category.accountBookCategoryImage.imageUrl,
                    amount: item.amount,
                    registerDateTime: dayjs(item.registerDateTime),
                  })) ?? [],
                );
              };
              return (
                <Day
                  key={key}
                  day={day}
                  income_amount={accountBookByDay?.incomeAmount}
                  expenditure_amount={accountBookByDay?.expenditureAmount}
                  onDayClick={handleDayClick}
                />
              );
            })}
          </SC.Week>
          <WeekInfo expenditure_amount={weekInfo.expenditureAmount} income_amount={weekInfo.incomeAmount} />
        </div>
      );
    });
  };

  return (
    <>
      <SC.Container>
        <SC.Week>
          {WEEK_DAY_KO_LIST.map((day) => (
            <SC.WEEK_DAY key={day}>
              <Text variant='body2' color='gray600' alignment='center' mb={5} as='p'>
                {day}
              </Text>
            </SC.WEEK_DAY>
          ))}
        </SC.Week>
        <SC.DaysContainer>{renderCalendar()}</SC.DaysContainer>
      </SC.Container>
      <AccountbookBottomSheet
        isOpen={accountBookSheetItemList.length !== 0}
        list={accountBookSheetItemList}
        title='일자별 통계 내역'
        titleColor={colors.gray700}
        onClose={() => {
          setAccountBookSheetItemList([]);
        }}
      />
    </>
  );
};

const SC = {
  WEEK_DAY: styled.div`
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  Container: styled.div`
    border-radius: 5px;
    width: 100%;
    margin: 0 auto;
    margin-top: 1rem;
  `,
  DaysContainer: styled.div`
    display: grid;
    gap: 5px;
  `,
  Week: styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  `,
  Empty: styled.div`
    visibility: hidden;
    flex: 1;
  `,
};

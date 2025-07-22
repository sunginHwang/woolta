import { useToggle } from '@common';
import { Text } from '@wds';
import dayjs from 'dayjs';
import { useState } from 'react';
import { styled } from 'styled-components';
import {
  AccountBookSheetItem,
  AccountBookBottomSheet,
} from '../../../account-books/_common/components/account-book-bottom-sheet/AccountBookBottomSheet';
import { Button } from '../../../atom/Button';
import { AccountBookChartData } from './StatisticChart';

interface ActiveSheet {
  color: string;
  label: string;
  list: AccountBookSheetItem[];
}

const initActiveSheet: ActiveSheet = {
  color: '',
  label: '',
  list: [],
};

const FLIP_COUNT = 4;

interface Props {
  accountBookChartList: AccountBookChartData[];
}

/**
 * 가계부 통계 - 통계 리스트
 * @component
 */
const StatisticList = ({ accountBookChartList }: Props) => {
  const [isAllView, toggleIsAllView] = useToggle(false);
  const [activeSheetList, setActiveSheetList] = useState<ActiveSheet>(initActiveSheet);
  const chartList = isAllView ? accountBookChartList : accountBookChartList.filter((_, index) => index < FLIP_COUNT);
  const isOpenSheet = activeSheetList.list.length !== 0;

  const handleCloseSheetClick = () => {
    setActiveSheetList(initActiveSheet);
  };
  return (
    <>
      <SC.Container>
        {chartList.map(({ label, percentage, value, color, list }) => {
          const handleItemClick = () => {
            setActiveSheetList({
              color,
              label,
              list: list.map(({ title, amount, registerDateTime }) => ({
                title,
                amount,
                registerDateTime: dayjs(registerDateTime),
              })),
            });
          };
          return (
            <SC.Item key={label} onClick={handleItemClick}>
              <div className='left'>
                <SC.CategoryLabel color={color} />
                <Text variant='title6Medium' color='gray800' as='p' ml={10}>
                  {label}({percentage})
                </Text>
              </div>
              <Text variant='body3' color='gray700'>
                {value.toLocaleString('ko-KR')}원
              </Text>
            </SC.Item>
          );
        })}
        <Button className='more' variant='tertiaryGray' fill onClick={() => toggleIsAllView()}>
          {isAllView ? '접기' : '전체보기'}
        </Button>
      </SC.Container>
      <AccountBookBottomSheet
        isOpen={isOpenSheet}
        title={activeSheetList?.label ?? ''}
        titleColor={activeSheetList?.color ?? ''}
        list={activeSheetList?.list ?? []}
        onClose={handleCloseSheetClick}
      />
    </>
  );
};

export default StatisticList;

const SC = {
  Container: styled.div`
    padding-bottom: 1rem;
    margin: 0 1.6rem;

    .more {
      margin-top: 1.6rem;
    }
  `,
  Item: styled.div`
    display: flex;
    justify-content: space-between;

    & + & {
      margin-top: 2rem;
    }

    .left {
      display: flex;
      align-items: center;
    }
  `,
  CategoryLabel: styled.div<{ color: string }>`
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 0.8rem;
    background-color: ${({ color }) => color};
  `,
};

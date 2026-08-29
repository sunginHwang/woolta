import { useToggle } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Button } from '../../../../components/atom/Button';
import {
  AccountBookBottomSheet,
  type AccountBookSheetItem,
} from '../../../account-books/_common/components/account-book-bottom-sheet/AccountBookBottomSheet';
import type { AccountBookChartData } from './StatisticChart';

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

const dynamicStyles = stylex.create({
  categoryColor: (color: string) => ({ backgroundColor: color }),
});

const styles = stylex.create({
  container: {
    paddingBottom: '1rem',
    marginBlock: 0,
    marginInline: '1.6rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  categoryLabel: {
    width: '2.4rem',
    height: '2.4rem',
    borderRadius: '0.8rem',
  },
  more: {
    marginTop: '1.6rem',
  },
});

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
      <div {...stylex.props(styles.container)}>
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
            <div {...stylex.props(styles.item)} key={label} onClick={handleItemClick}>
              <div {...stylex.props(styles.itemLeft)}>
                <div {...stylex.props(styles.categoryLabel, dynamicStyles.categoryColor(color))} />
                <Text variant='title6Medium' color='gray800' as='p' ml={10}>
                  {label}({percentage})
                </Text>
              </div>
              <Text variant='body3' color='gray700'>
                {value.toLocaleString('ko-KR')}원
              </Text>
            </div>
          );
        })}
        <div {...stylex.props(styles.more)}>
          <Button variant='tertiaryGray' fill onClick={() => toggleIsAllView()}>
            {isAllView ? '접기' : '전체보기'}
          </Button>
        </div>
      </div>
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

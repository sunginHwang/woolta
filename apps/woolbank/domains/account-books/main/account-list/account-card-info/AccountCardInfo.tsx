'use client';

import { useToggle, withSuspense } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import dayjs, { Dayjs } from 'dayjs';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { BottomSheet } from '../../../../../components/bottom-sheet/BottomSheet';
import { BottomMenu } from '../../../../../components/bottom-sheet/menu-sheet/MenuSheet';
import { DropdownTitle } from '../../../../../components/dropdown-title/DropdownTitle';
import { useAccountBookList } from '../../_common/hooks/useAccountBookList';
import { selectedAccountBookDateAtom } from '../_common/stores/accountbookDate';
import { Skeleton } from './Skeleton';

const MONTH_FOR_5_YEAR = 60;

const styles = stylex.create({
  container: {
    display: 'flex',
    marginTop: '1rem',
    marginInline: '1.6rem',
    marginBottom: 0,
  },
  card: {
    backgroundColor: colorVars['--color-red500'],
    borderRadius: '16px',
    paddingBlock: '1.6rem',
    paddingInline: '1.6rem',
    width: '100%',
    display: 'flex',
  },
  totalSection: {
    marginTop: '1.2rem',
  },
});

/**
 * 이달의 가계부 통계 영역
 * @component
 */
const AccountCardInfo = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedAccountBookDateAtom);
  const { totalExpenditureAmount, totalIncomeAmount } = useAccountBookList();
  const [isOpenMonthPicker, setToggleMonthPicker] = useToggle(false);
  const openMonthPicker = () => setToggleMonthPicker(true);
  const closeMonthPicker = () => setToggleMonthPicker(false);

  const fiveYearMonthList: BottomMenu[] = useMemo(() => {
    return [...Array(MONTH_FOR_5_YEAR)].map((_, index) => getMonthMenu(dayjs().add(-index, 'month')));
  }, []);

  const onMonthClick = (month: string) => {
    setSelectedDate(month);
    closeMonthPicker();
  };

  const titleMsg = useMemo(() => getTitleMsg(selectedDate), [selectedDate]);
  const activeMonthMenu = getMonthMenu(dayjs(selectedDate));

  return (
    <>
      <header {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.card)}>
          <DropdownTitle title={titleMsg} onClick={openMonthPicker} />
          <section {...stylex.props(styles.totalSection)}>
            <Text variant='title4Bold' color='red500' mt={5} as='p'>
              지출 : {totalExpenditureAmount.toLocaleString('ko-KR')}원
            </Text>
            <Text variant='title4Bold' color='graySecondary' mt={5} as='p'>
              수입 : {totalIncomeAmount.toLocaleString('ko-KR')}원
            </Text>
          </section>
        </div>
      </header>
      <BottomSheet.Menu
        title='월 선택하기'
        menus={fiveYearMonthList}
        activeMenuType={activeMonthMenu.type}
        visible={isOpenMonthPicker}
        oncloseModal={closeMonthPicker}
        onEditClick={onMonthClick}
      />
    </>
  );
};

function getMonthMenu(month: Dayjs) {
  return {
    type: month.format('YYYY-MM'),
    value: month.format('YYYY년 M월'),
  };
}

function getTitleMsg(selectedDate: string) {
  return dayjs().isSame(dayjs(selectedDate), 'year')
    ? `${dayjs(selectedDate).format('M월')}`
    : `${dayjs(selectedDate).format('YYYY년 M월')}`;
}

export default withSuspense(AccountCardInfo, <Skeleton />);

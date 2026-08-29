'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import dayjs from 'dayjs';
import { useRegularExtentureList } from '../hooks/useRegularExtentureList';
import type { RegularExpenditure } from '../hooks/useRegularExtentureListQuery';
import OneWeekAgoList from './OneWeekAgoList';
import RegularAmountInfo from './RegularAmountInfo';

const ONE_WEEK_DAY = 7;

const styles = stylex.create({
  container: {
    paddingTop: '2rem',
    paddingRight: '1.6rem',
    paddingBottom: 0,
    paddingLeft: '1.6rem',
  },
  line: {
    backgroundColor: colorVars['--color-gray100'],
    height: '0.7rem',
    marginTop: '2rem',
  },
});

/**
 * 정기 지출 리스트 -> 상단 지출 정보 모음
 * @component
 */
const SummeryInfo = () => {
  const { totalAmount, flatRegularExpenditureTypeList } = useRegularExtentureList();

  const oneWeekRemainList: RegularExpenditure[] = flatRegularExpenditureTypeList
    .filter(isOneWeekRemain)
    .sort((a, b) => a.regularDate - b.regularDate);

  return (
    <header>
      <section {...stylex.props(styles.container)}>
        <RegularAmountInfo amount={totalAmount} />
        <OneWeekAgoList regularExpenditureList={oneWeekRemainList} />
      </section>
      <div {...stylex.props(styles.line)} />
    </header>
  );
};

export default SummeryInfo;

function isOneWeekRemain(item: RegularExpenditure) {
  const remainDay = dayjs().diff(dayjs(item.regularExpenditureDay), 'day');
  return remainDay >= 0 && remainDay <= ONE_WEEK_DAY;
}

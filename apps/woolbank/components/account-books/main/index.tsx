'use client';
import { Suspense } from '@wds';
import { layout } from '../../../style/layout';
import Header from '../../common/Header';
import Loading from '../../common/Loading';
import Tabs from '../../common/Tabs';
import AccountList from './AccountList';
import RegularExpenditure from './RegularExtenditure';
import RegularExpenditureSkeleton from './RegularExtenditure/RegularExpenditureSkeleton';
import StatisticTab from './Statistic';

const TAB_LIST = [
  {
    label: '리스트',
    value: '1',
    link: '',
  },
  {
    label: '정기지출',
    value: '2',
    link: '',
  },
  {
    label: '통계',
    value: '3',
    link: '',
  },
];

const AccountBookList = () => {
  return (
    <>
      <Header title='가계부' />
      <Tabs tabs={TAB_LIST} value='1' stickeyHeight={layout.headerHeight} />
      {/* <AccountList /> */}
      {/* <Suspense fallback={<RegularExpenditureSkeleton />}>
        <RegularExpenditure />
      </Suspense> */}
      <Suspense fallback={<Loading loading message='잠시만 기다려 주세요.' />}>
        <StatisticTab />
      </Suspense>
    </>
  );
};

export default AccountBookList;

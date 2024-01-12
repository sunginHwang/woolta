'use client';

import { useSearchParams } from 'next/navigation';
import { layout } from '../../../style/layout';
import Header from '../../common/Header';
import Tabs from '../../common/Tabs';
import AccountList from './AccountList';
import RegularExpenditure from './RegularExtenditure';
import StatisticTab from './Statistic';

enum TabType {
  AccountList = 'account-list',
  RegularExpenditure = 'regular-expenditure',
  Statistic = 'statistic',
}

const TAB_COMPONENT_LIST = {
  [TabType.AccountList]: AccountList,
  [TabType.RegularExpenditure]: RegularExpenditure,
  [TabType.Statistic]: StatisticTab,
};

const TAB_LIST = [
  {
    label: '리스트',
    value: TabType.AccountList,
    link: `/account-books?tab=${TabType.AccountList}`,
  },
  {
    label: '정기지출',
    value: TabType.RegularExpenditure,
    link: `/account-books?tab=${TabType.RegularExpenditure}`,
  },
  {
    label: '통계',
    value: TabType.Statistic,
    link: `/account-books?tab=${TabType.Statistic}`,
  },
];

/**
 * 가계부
 * @component
 */
const AccountBookList = () => {
  const { get } = useSearchParams();
  const activeTabId = getActiveTabId(get('tab'));
  const ActiveSubTabComponent = TAB_COMPONENT_LIST[activeTabId];
  return (
    <>
      <Header title='가계부' />
      <Tabs tabs={TAB_LIST} value={activeTabId} stickeyHeight={layout.headerHeight} />
      <ActiveSubTabComponent />
    </>
  );
};

export default AccountBookList;

function getActiveTabId(tabId: string | null): TabType {
  if (!tabId) {
    return TabType.AccountList;
  }

  const is_exist_tab_type = Object.values(TabType).includes(tabId as TabType);

  if (is_exist_tab_type) {
    return tabId as TabType;
  }

  return TabType.AccountList;
}

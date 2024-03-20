'use client';

import { withSuspense } from '@common';
import AddButton from '../../common/AddButton';
import ExtentureTypeList from './ExtentureTypeList';
import RegularExpenditureSkeleton from './RegularExpenditureSkeleton';
import SummeryInfo from './SummeryInfo';

/**
 * 정기 지출 리스트
 * @component
 */

export const RegularExpenditure = withSuspense(() => {
  return (
    <>
      <SummeryInfo />
      <ExtentureTypeList />
      <AddButton href='/account-books/save/regular-expenditure' />
    </>
  );
}, <RegularExpenditureSkeleton />);

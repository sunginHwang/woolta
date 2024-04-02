'use client';

import { withSuspense } from '@common';
import AddButton from '../../common/AddButton';
import ExtentureTypeList from './ExtentureTypeList';
import RegularExpenditureSkeleton from './RegularExpenditureSkeleton';
import SummeryInfo from './SummeryInfo';
import { useUserInfo } from '../../../hooks/queries/useUserInfo';

/**
 * 정기 지출 리스트
 * @component
 */

export const RegularExpenditure = withSuspense(() => {
  const { isShareUser } = useUserInfo();

  return (
    <>
      <SummeryInfo />
      <ExtentureTypeList />
      {!isShareUser && <AddButton href='/regular-extenditure/save' />}
    </>
  );
}, <RegularExpenditureSkeleton />);

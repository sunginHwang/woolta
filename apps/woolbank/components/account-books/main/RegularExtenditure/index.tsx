import { withSuspense } from '@common';
import AddButton from '../../../../components/common/AddButton';
import ExtentureTypeList from './ExtentureTypeList';
import RegularExpenditureSkeleton from './RegularExpenditureSkeleton';
import SummeryInfo from './SummeryInfo';

/**
 * 정기 지출 리스트 탭
 * @component
 */
function RegularExpenditure() {
  return (
    <>
      <SummeryInfo />
      <ExtentureTypeList />
      <AddButton href='/account-books/save/regular-expenditure' />
    </>
  );
}

export default withSuspense(RegularExpenditure, <RegularExpenditureSkeleton />);

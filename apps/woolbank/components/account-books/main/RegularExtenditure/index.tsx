import AddButton from '../../../../components/common/AddButton';
import SummeryInfo from './SummeryInfo';

/**
 * 정기 지출 리스트 탭
 * @component
 */
function RegularExpenditure() {
  return (
    <>
      <SummeryInfo />
      <AddButton href='/account-books/save/regular-expenditure' />
    </>
  );
}

export default RegularExpenditure;

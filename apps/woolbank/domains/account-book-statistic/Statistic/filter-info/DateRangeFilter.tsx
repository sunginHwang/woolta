import { useToggle } from '@common';
import { Dayjs } from 'dayjs';
import { getDateRange, DateRange } from '../../../../utils/date';
import { BottomSheet } from '../../../../components/bottom-sheet/BottomSheet';
import { BottomMenu } from '../../../../components/bottom-sheet/menu-sheet/MenuSheet';
import { DropdownTitle } from '../../../../components/dropdown-title/DropdownTitle';

const PICKER_OPTIONS: BottomMenu<DateRange>[] = [
  {
    type: 'month',
    value: '월별',
  },
  {
    type: 'year',
    value: '연도별',
  },
  {
    type: 'week',
    value: '주별',
  },
];

interface Props {
  dateRange: DateRange;
  onDateRangeChange: (props: { startDate: Dayjs; endDate: Dayjs; dateRange: DateRange }) => void;
}

/**
 * 가계부 통계 상단 - 통계 범위 설정
 * @component
 */
const DateRangeFilter = ({ dateRange, onDateRangeChange }: Props) => {
  const [isOpenPicker, togglePicker] = useToggle(false);
  const onPicker = () => togglePicker(true);
  const offPicker = () => togglePicker(false);

  const handlePickerClick = (menuType: string) => {
    const activeMenu = getActivePicker(menuType as DateRange);

    if (!activeMenu) {
      return;
    }
    offPicker();
    const [startDate, endDate] = getDateRange(activeMenu.type);
    onDateRangeChange({ startDate, endDate, dateRange: activeMenu.type });
  };

  const activePicker = getActivePicker(dateRange);

  return (
    <>
      <DropdownTitle onClick={onPicker} title={`${activePicker?.value} 통계`} />
      <BottomSheet.Menu
        title='통계 범위 선택'
        menus={PICKER_OPTIONS}
        activeMenuType={activePicker?.type || ''}
        visible={isOpenPicker}
        oncloseModal={offPicker}
        onEditClick={handlePickerClick}
      />
    </>
  );
};

function getActivePicker(activeType: DateRange) {
  const activeMenu = Object.entries(PICKER_OPTIONS).find(([, item]) => {
    return item.type === activeType;
  });

  if (!activeMenu) {
    return null;
  }

  return activeMenu[1];
}

export default DateRangeFilter;

import { FC } from 'react';
import BotttomSheet from '../../../../components/BotttomSheet';
import { BottomMenu } from '../../../../components/BotttomSheet/MenuSheet';

interface Props {
  selectDate: number;
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: number) => void;
}

const dateMenus: BottomMenu[] = [...Array(30)].map((_, key) => {
  return { type: String(key + 1), value: `${key + 1}일` };
});

export const DateSelectSheet: FC<Props> = ({ visible, selectDate, onClose, onSelectDate }) => {
  const selectMenu =
    selectDate === 0 ? { type: '', value: '' } : { type: String(selectDate), value: `${selectDate}일` };

  const onSelectDateClick = (date: string) => {
    onSelectDate(Number(date));
  };

  return (
    <BotttomSheet.Menu
      title='정기지출일'
      activeMenuType={selectMenu.type}
      menus={dateMenus}
      visible={visible}
      oncloseModal={onClose}
      onEditClick={onSelectDateClick}
    />
  );
};

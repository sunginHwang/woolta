import { useToggle } from '@common';
import { FC } from 'react';
import Modal from '../../../../../components/common/Modal';
import { BottomMenu } from '../../../../../components/common/Modal/ButtonSheet';
import { AccountBookCategoryType } from '../store';
import Label from './Label';

const CATEGORY_BOTTOM_MENU_LIST: BottomMenu<AccountBookCategoryType>[] = [
  {
    type: 'income',
    value: '수입',
  },
  {
    type: 'expenditure',
    value: '지출',
  },
];

interface Props {
  activeType: AccountBookCategoryType;
  onTypeChange: (type: AccountBookCategoryType) => void;
}
/**
 * 가계부 레이블 필터 - 지출,소비 필터
 * @component
 */
const TypeFilter: FC<Props> = ({ activeType, onTypeChange }) => {
  const [isOpenModal, toggleModal] = useToggle(false);

  const handleTypeClick = (type: string) => {
    toggleModal();
    onTypeChange(type as AccountBookCategoryType);
  };

  const activeMenu = Object.entries(CATEGORY_BOTTOM_MENU_LIST).find(([, item]) => {
    return item.type === activeType;
  });

  return (
    <>
      <Label text={activeMenu?.[1].value || ''} onClick={() => toggleModal()} />
      <Modal.BottomSheet
        title='통계 종류를 선택해 주세요.'
        menus={CATEGORY_BOTTOM_MENU_LIST}
        activeMenuType={activeType}
        visible={isOpenModal}
        oncloseModal={toggleModal}
        onEditClick={handleTypeClick}
      />
    </>
  );
};

export default TypeFilter;

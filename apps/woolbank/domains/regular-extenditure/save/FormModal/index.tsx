import dayjs, { Dayjs } from 'dayjs';
import { FC } from 'react';
import { AccountBookCategory } from '../../../account-books/save/_common/hooks/useAccountBookCategories';
import { AmountCategorySheet } from '../../../account-books/save/_common/components/amount-category-sheet/AmountCategorySheet';
import BotttomSheet from '../../../common/BotttomSheet';
import { RegularExtenditureForm } from '../hooks/useRegularExtenditureForm';
import { DateSelectSheet } from './DateSelectSheet';

interface Props {
  openModalName: string;
  formData: RegularExtenditureForm;
  onCloseModal: () => void;
  onChangeAmount: (amount: number) => void;
  onChangeCategory: (category: AccountBookCategory) => void;
  onChangeDate: (date: number) => void;
}

/**
 * @component
 */
const FormModal: FC<Props> = ({
  openModalName,
  onCloseModal,
  onChangeDate,
  onChangeAmount,
  onChangeCategory,
  formData,
}) => {
  const handleDateClick = (date: number) => {
    onChangeDate(date);
    onCloseModal();
  };

  const handleAmountClick = (amount: number) => {
    onChangeAmount(amount);
    onCloseModal();
  };

  const handleCategoryClick = (category: AccountBookCategory) => {
    onChangeCategory(category);
    onCloseModal();
  };
  return (
    <>
      <DateSelectSheet
        visible={openModalName === 'regularDate'}
        onClose={onCloseModal}
        onSelectDate={handleDateClick}
        selectDate={formData.regularDate}
      />
      <AmountCategorySheet
        open={openModalName === 'category'}
        type='expenditure'
        onClose={onCloseModal}
        selectCategoryId={formData.category.id}
        onCategorySelect={handleCategoryClick}
      />
      <BotttomSheet.Amount
        title='금액 입력'
        visible={openModalName === 'amount'}
        currentAmount={formData.amount}
        oncloseModal={onCloseModal}
        onComplete={handleAmountClick}
      />
    </>
  );
};

export default FormModal;

import dayjs, { Dayjs } from 'dayjs';
import { FC } from 'react';
import BotttomSheet from '../../../../components/common/BotttomSheet';
import AmountCategorySheet from '../common/AmountCategorySheet';
import { AccountBookCategory } from '../hooks/useAccountBookCategories';
import { AccountBookSaveForm } from './hooks/useAccountBookForm';

interface Props {
  openModalName: string;
  formData: AccountBookSaveForm;
  onCloseModal: () => void;
  onChangeAmount: (amount: number) => void;
  onChangeCategory: (category: AccountBookCategory) => void;
  onChangeDateTime: (date: Dayjs) => void;
}

/**
 * 가계부 지출 / 수입 작성 폼 선택 모달 리스트
 * @component
 */
const FormModal: FC<Props> = ({
  openModalName,
  onCloseModal,
  onChangeDateTime,
  onChangeAmount,
  onChangeCategory,
  formData,
}) => {
  const handleDateTimeClick = (date: Date) => {
    onChangeDateTime(dayjs(date));
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
      <BotttomSheet.DateTime
        visible={openModalName === 'registerDateTime'}
        onClose={onCloseModal}
        onChangeDateTime={handleDateTimeClick}
        date={formData.registerDateTime}
      />
      <AmountCategorySheet
        open={openModalName === 'category'}
        type={formData.type}
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

import dayjs, { Dayjs } from 'dayjs';
import { BottomSheet } from '../../../../../components/bottom-sheet/BottomSheet';
import { AmountCategorySheet } from '../../_common/components/amount-category-sheet/AmountCategorySheet';
import { AccountBookCategory } from '../../_common/hooks/useAccountBookCategories';
import { AccountBookSaveForm, ScheduledPaymentType } from '../_common/hooks/useAccountBookForm';
import { ScheduledPaymentBottomSheet } from './ScheduledPaymentBottomSheet';

interface Props {
  openModalName: string;
  formData: AccountBookSaveForm;
  onCloseModal: () => void;
  onChangeAmount: (amount: number) => void;
  onChangeCategory: (category: AccountBookCategory) => void;
  onChangeDateTime: (date: Dayjs) => void;
  onChangeScheduledPayment: (scheduledPayment: {
    scheduledPaymentType: ScheduledPaymentType;
    scheduledPaymentDay: number;
    installmentMonth?: number;
  }) => void;
}

/**
 * 가계부 지출 / 수입 작성 폼 선택 모달 리스트
 * @component
 */
export const FormModal = ({
  openModalName,
  onCloseModal,
  onChangeDateTime,
  onChangeAmount,
  onChangeCategory,
  onChangeScheduledPayment,
  formData,
}: Props) => {
  const handleDateTimeClick = (date: string) => {
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

  const handleSaveScheduledPaymentClick = (scheduledPayment: {
    scheduledPaymentType: ScheduledPaymentType;
    scheduledPaymentDay: number;
    installmentMonth?: number;
  }) => {
    onChangeScheduledPayment(scheduledPayment);
    onCloseModal();
  };

  return (
    <>
      <BottomSheet.Date
        visible={openModalName === 'registerDateTime'}
        onclose={onCloseModal}
        onDateChange={handleDateTimeClick}
        date={formData.registerDateTime.toDate()}
      />
      <AmountCategorySheet
        open={openModalName === 'category'}
        type={formData.type}
        onClose={onCloseModal}
        selectCategoryId={formData.category.id}
        onCategorySelect={handleCategoryClick}
      />
      <BottomSheet.Amount
        title='금액 입력'
        visible={openModalName === 'amount'}
        currentAmount={formData.amount}
        oncloseModal={onCloseModal}
        onChange={onChangeAmount}
        onComplete={handleAmountClick}
      />
      <ScheduledPaymentBottomSheet
        is_open={openModalName === 'scheduled'}
        scheduledPaymentType={formData.scheduledPaymentType}
        scheduledPaymentDay={formData.scheduledPaymentDay}
        installmentMonth={formData.installmentMonth}
        setSaveScheduledPayments={handleSaveScheduledPaymentClick}
        onCloseModal={onCloseModal}
      />
    </>
  );
};

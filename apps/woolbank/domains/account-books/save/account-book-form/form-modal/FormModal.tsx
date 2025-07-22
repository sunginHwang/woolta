import dayjs, { Dayjs } from 'dayjs';
import BotttomSheet from '../../../../../components/BotttomSheet';
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
  onChangeScheduledPayment: (scheduled_payment: {
    scheduled_payments_type: ScheduledPaymentType;
    scheduled_payments_value: number;
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

  const handleSaveScheduledPaymentClick = (scheduled_payment: {
    scheduled_payments_type: ScheduledPaymentType;
    scheduled_payments_value: number;
  }) => {
    onChangeScheduledPayment(scheduled_payment);
    onCloseModal();
  };

  return (
    <>
      <BotttomSheet.Date
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
      <BotttomSheet.Amount
        title='금액 입력'
        visible={openModalName === 'amount'}
        currentAmount={formData.amount}
        oncloseModal={onCloseModal}
        onChange={onChangeAmount}
        onComplete={handleAmountClick}
      />
      <ScheduledPaymentBottomSheet
        is_open={openModalName === 'scheduled'}
        scheduled_payments_type={formData.scheduled_payments_type}
        scheduled_payments_value={formData.scheduled_payments_value}
        setSaveScheduledPayments={handleSaveScheduledPaymentClick}
        onCloseModal={onCloseModal}
      />
    </>
  );
};

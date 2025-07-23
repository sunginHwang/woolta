import { delay } from '@common';
import { colors, Text } from '@wds';
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { IconTrashCan } from '../../../../components/atom/Icon';
import { IconCalendar } from '../../../../components/atom/Icon/Calendar';
import { IconChevronRight } from '../../../../components/atom/Icon/ChevronRight';
import { IconSwap } from '../../../../components/atom/Icon/Swap';
import { ToggleTab } from '../../../../components/toggle-tab/ToggleTab';
import { useUserInfo } from '../../../../hooks/queries/useUserInfo';
import { useToast } from '../../../../hooks/useToast';
import getCategoryMsg from '../../../../utils/account-books';
import { Button } from '../../../../components/atom/Button';
import { useConfirm } from '../../../../components/confirm/ConfirmContext';
import { useAccountBookSaveRouterProps } from '../_common/hooks/useAccountBookSaveRouterProps';
import { FormField } from './form-field/FormField';
import { FormInput } from './form-field/FormInput';
import { Switch } from './form-field/Switch';
import { FormModal } from './form-modal/FormModal';
import { AccountBookSaveForm, ScheduledPaymentType, useAccountBookForm } from './_common/hooks/useAccountBookForm';

const TAB_LIST = [
  {
    type: 'income',
    name: '수입',
  },
  {
    type: 'expenditure',
    name: '지출',
  },
];

const SCHEDULED_PAYMENT_LABEL_MAPPER: Record<ScheduledPaymentType, string> = { repeat: '매월', installment: '할부' };

interface Props {
  accountBookForm?: AccountBookSaveForm;
  submitForm: (accountForm: AccountBookSaveForm) => void;
  removeAccountBookForm: (id: string) => void;
}

export const AccountBookForm = ({ accountBookForm, submitForm, removeAccountBookForm }: Props) => {
  const {
    formData,
    isActiveSubmit,
    onChange,
    setAmount,
    setType,
    validateForm,
    setAccountBookCategoryType,
    setRegisterDateTime,
    setScheduledPayment,
    toggleDisabledBudget,
    onClear,
  } = useAccountBookForm(accountBookForm);
  const { openConfirm } = useConfirm();
  const { onToast } = useToast();
  const { isShareUser } = useUserInfo();
  const { is_insert_mode } = useAccountBookSaveRouterProps();
  const [openModalName, setModalName] = useState('');
  const title_ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (is_insert_mode) {
      setModalName('amount');
    }
  }, [is_insert_mode]);

  const handleClearClick = (e: MouseEvent<HTMLLIElement>) => {
    const type = e.currentTarget.dataset.type || '';
    onClear(type as keyof AccountBookSaveForm);
  };

  const handleSubmitClick = () => {
    const { isValid, message } = validateForm();

    if (!formData) {
      return;
    }

    if (!isValid) {
      onToast(message);
      return;
    }

    // console.log('handleSubmitClick', formData);
    // return;

    submitForm(formData);
  };

  const handleAmountClick = (amount: number) => {
    setAmount(amount);
    if (is_insert_mode && formData.title === '') {
      title_ref.current?.focus();
    }
  };

  // AOS에서는 이 이벤트 가 동작하지 않는다 (IOS키보드 오픈)
  const handleTitleKeyDownEnter = async (e: KeyboardEvent<HTMLInputElement>) => {
    const isKeyboardEnter = e.key === 'Enter';
    const isAvailOpenModal = is_insert_mode && formData.category.name === '';

    if (isKeyboardEnter && isAvailOpenModal) {
      title_ref.current?.blur();
      await delay(400);
      setModalName('category');
    }
  };

  const handleRemoveClick = async () => {
    if (!accountBookForm?.id) {
      return;
    }

    const isConfirm = await openConfirm({ message: '정말 삭제 하시겠습니까?' });

    if (isConfirm) {
      removeAccountBookForm(String(accountBookForm.id));
    }
  };

  const openFormBottomSheet = (type: 'registerDateTime' | 'amount' | 'category' | 'scheduled') => () => {
    console.log('openFormBottomSheet', type);
    setModalName(type);
  };

  const closeModal = () => {
    setModalName('');
  };

  const typeMsg = getCategoryMsg(formData.type);
  const isUpdateForm = !accountBookForm;

  return (
    <>
      <SC.Form>
        <SC.Content>
          <div className='toggle'>
            <ToggleTab size='small' tabs={TAB_LIST} value={formData.type} onChangeTab={setType} />
          </div>
          <div className='center-box' onClick={openFormBottomSheet('registerDateTime')}>
            <Text variant='body3' color='gray600' as='p'>
              {formData.registerDateTime.format('YYYY-MM-DD')}
            </Text>
            <IconCalendar width={12} height={12} fill={colors.gray500} />
          </div>
          <Text className='title' variant='title1Bold' color='gray900' onClick={openFormBottomSheet('amount')} as='p'>
            {`${formData.amount.toLocaleString('ko-KR')}원`}
          </Text>
        </SC.Content>
        <div>
          <FormField title={`${typeMsg}처`}>
            <FormInput
              ref={title_ref}
              name='title'
              disable={isShareUser}
              placeholder={`${typeMsg}처를 선택해 주세요.`}
              maxLength={20}
              value={formData.title}
              onChange={onChange}
              onClear={handleClearClick}
              onKeyDown={handleTitleKeyDownEnter}
              enterKeyHint='done'
            />
          </FormField>
          <FormField title='카테고리' onClick={openFormBottomSheet('category')}>
            <SC.FormContent>
              <Text variant='body1' color='gray900'>
                {formData.category.name}
              </Text>
              <IconChevronRight width={16} height={16} fill={colors.gray600} />
            </SC.FormContent>
          </FormField>
          <FormField title='예산에서 제외'>
            <div className='content-wrapper'>
              <Switch checked={formData.isDisabledBudget} onClick={toggleDisabledBudget} />
            </div>
          </FormField>
          <FormField
            title={
              formData.scheduled_payments_type
                ? SCHEDULED_PAYMENT_LABEL_MAPPER[formData.scheduled_payments_type]
                : '반복/할부'
            }
            onClick={openFormBottomSheet('scheduled')}
          >
            <div className='content-wrapper'>
              {formData.scheduled_payments_value && (
                <Text variant='body3' color='red500'>
                  {formData.scheduled_payments_value} {formData.scheduled_payments_type === 'repeat' ? '일' : '개월'}
                </Text>
              )}
              <IconSwap width={16} height={16} fill={colors.gray500} />
            </div>
          </FormField>
          <FormField title='메모' />
          <SC.Memo name='memo' value={formData.memo} tabIndex={-1} maxLength={100} onChange={onChange} />
        </div>
        {!isShareUser && (
          <SC.ButtonArea>
            <div className='bottom-wrapper'>
              {!isUpdateForm && (
                <Button variant='tertiaryGray' onClick={handleRemoveClick} disabled={!isActiveSubmit}>
                  <IconTrashCan />
                </Button>
              )}
              <Button fill onClick={handleSubmitClick} disabled={!isActiveSubmit}>
                {isUpdateForm ? '작성하기' : '수정하기'}
              </Button>
            </div>
          </SC.ButtonArea>
        )}
      </SC.Form>
      <FormModal
        openModalName={openModalName}
        formData={formData}
        onCloseModal={closeModal}
        onChangeAmount={handleAmountClick}
        onChangeCategory={setAccountBookCategoryType}
        onChangeDateTime={setRegisterDateTime}
        onChangeScheduledPayment={setScheduledPayment}
      />
    </>
  );
};

const SC = {
  Form: styled.main`
    margin-top: 3rem;
    padding: 0 1.6rem;

    .content-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      gap: 1rem;
    }

    .center-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;

      svg {
        margin-bottom: 2px;
      }
    }
    > div + div {
      margin-top: 4rem;
    }
  `,
  MemoWrapper: styled.div`
    height: 15rem;
    width: 100%;
  `,
  Memo: styled.textarea`
    border-radius: 1.3rem;
    background-color: ${({ theme }) => theme.colors.gray100};
    height: 15rem;
    padding: 1.6rem;
    width: calc(100% - 3.2rem);
    border: none;
  `,
  FormContent: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.6rem 0;
  `,
  Content: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    .toggle {
      width: 120px;
      margin-bottom: 2rem;
    }

    .title {
      margin: 3rem 0;
      font-size: 4rem;
    }
  `,
  ButtonArea: styled.footer`
    position: fixed;
    bottom: 2rem;
    bottom: calc(constant(safe-area-inset-bottom) + 2rem);
    bottom: calc(env(safe-area-inset-bottom) + 2rem);
    width: 100%;
    height: 5.5rem;
    z-index: 100;
    left: 0;

    .bottom-wrapper {
      display: flex;
      gap: 0.8rem;
      padding: 0 1.6rem;
    }
  `,
};

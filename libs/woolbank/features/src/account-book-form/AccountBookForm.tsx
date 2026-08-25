'use client';

import { delay, useIsDashboardHost } from '@common';
import { Text, typography } from '@wds';
import { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { styled, useTheme } from 'styled-components';
import { Button } from '../_shared/components/button/Button';
import { ToggleTab } from '../_shared/components/toggle-tab/ToggleTab';
import { useConfirm } from '../_shared/confirm/ConfirmContext';
import { useUserInfo } from '../_shared/hooks/useUserInfo';
import { IconCalendar, IconChevronRight, IconSwap, IconTrashCan } from '../_shared/icons';
import { useToast } from '../_shared/toast/useToast';
import getCategoryMsg from '../_shared/utils/account-books';
import { AccountBookSaveForm, ScheduledPaymentType, useAccountBookForm } from './_common/hooks/useAccountBookForm';
import { useAccountBookSaveRouterProps } from './_common/hooks/useAccountBookSaveRouterProps';
import { FormField } from './form-field/FormField';
import { FormInput } from './form-field/FormInput';
import { Switch } from './form-field/Switch';
import { FormModal } from './form-modal/FormModal';

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
  const { colors } = useTheme();
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
  const isDashboardHost = useIsDashboardHost();

  // 대시보드에서는 바텀시트 대신 금액을 인라인 input 으로 직접 입력한다
  const handleAmountInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
    setAmount(digits === '' ? 0 : Number(digits));
  };

  const amountDisplayLength =
    formData.amount === 0 ? 1 : formData.amount.toLocaleString('ko-KR').length;
  const { is_insert_mode: isInsertMode } = useAccountBookSaveRouterProps();
  const [openModalName, setModalName] = useState('');
  const title_ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 대시보드에서는 금액을 인라인 input 으로 받으므로 금액 바텀시트를 자동으로 열지 않는다
    if (isInsertMode && !isDashboardHost) {
      setModalName('amount');
    }
  }, [isInsertMode, isDashboardHost]);

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

    submitForm(formData);
  };

  const handleAmountClick = (amount: number) => {
    setAmount(amount);
    if (isInsertMode && formData.title === '') {
      title_ref.current?.focus();
    }
  };

  // AOS에서는 이 이벤트 가 동작하지 않는다 (IOS키보드 오픈)
  const handleTitleKeyDownEnter = async (e: KeyboardEvent<HTMLInputElement>) => {
    const isKeyboardEnter = e.key === 'Enter';
    const isAvailOpenModal = isInsertMode && formData.category.name === '';

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
    setModalName(type);
  };

  const closeModal = () => {
    setModalName('');
  };

  const typeMsg = getCategoryMsg(formData.type);
  const isUpdateForm = !accountBookForm;

  return (
    <>
      <SC.Form $isDashboardHost={isDashboardHost}>
        <SC.Content>
          <div className='toggle'>
            <ToggleTab size='small' tabs={TAB_LIST} value={formData.type} onChangeTab={setType} />
          </div>
          <div className='center-box' onClick={openFormBottomSheet('registerDateTime')}>
            <Text variant='body3' color='textTertiary' as='p'>
              {formData.registerDateTime.format('YYYY-MM-DD')}
            </Text>
            <IconCalendar width={12} height={12} fill={colors.textTertiary} />
          </div>
          {isDashboardHost ? (
            <SC.AmountRow>
              <SC.AmountInput
                inputMode='numeric'
                placeholder='0'
                value={formData.amount === 0 ? '' : formData.amount.toLocaleString('ko-KR')}
                onChange={handleAmountInputChange}
                style={{ width: `${Math.max(1, amountDisplayLength)}ch` }}
              />
              <Text variant='title1Bold' color='textPrimary'>
                원
              </Text>
            </SC.AmountRow>
          ) : (
            <Text className='title' variant='title1Bold' color='textPrimary' onClick={openFormBottomSheet('amount')} as='p'>
              {`${formData.amount.toLocaleString('ko-KR')}원`}
            </Text>
          )}
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
              <Text variant='body1' color='textPrimary'>
                {formData.category.name}
              </Text>
              <IconChevronRight width={16} height={16} fill={colors.textTertiary} />
            </SC.FormContent>
          </FormField>
          <FormField title='예산에서 제외'>
            <div className='content-wrapper'>
              <Switch checked={formData.isDisabledBudget} onClick={toggleDisabledBudget} />
            </div>
          </FormField>
          <FormField
            title={
              formData.scheduledPaymentType
                ? SCHEDULED_PAYMENT_LABEL_MAPPER[formData.scheduledPaymentType]
                : '반복/할부'
            }
            onClick={isInsertMode ? openFormBottomSheet('scheduled') : undefined}
          >
            <div className='content-wrapper'>
              {formData.scheduledPaymentDay && (
                <Text variant='body3' color='red500'>
                  {formData.scheduledPaymentType === 'repeat' && `${formData.scheduledPaymentDay}일`}
                  {formData.scheduledPaymentType === 'installment' &&
                    `매월${formData.installmentMonth}일 (1/${formData.scheduledPaymentDay})`}
                </Text>
              )}
              {isInsertMode && <IconSwap width={16} height={16} fill={colors.textTertiary} />}
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
  AmountRow: styled.div`
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.2rem;
  `,
  AmountInput: styled.input`
    ${typography.title1Bold}
    min-width: 1ch;
    max-width: 100%;
    border: none;
    background: transparent;
    text-align: right;
    color: ${({ theme }) => theme.colors.textPrimary};
    caret-color: ${({ theme }) => theme.colors.orangePrimary};

    &::placeholder {
      color: ${({ theme }) => theme.colors.textDisabled};
    }
  `,
  Form: styled.main<{ $isDashboardHost: boolean }>`
    margin-top: ${({ $isDashboardHost }) => ($isDashboardHost ? '0' : '3rem')};
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
    background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    height: 15rem;
    padding: 1.6rem;
    width: 100%;
    box-sizing: border-box;
    border: none;
    color: ${({ theme }) => theme.colors.textPrimary};
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
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 5.5rem;
    z-index: 100;

    .bottom-wrapper {
      display: flex;
      gap: 0.8rem;
    }
  `,
};

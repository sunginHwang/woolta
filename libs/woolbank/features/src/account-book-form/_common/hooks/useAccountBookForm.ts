'use client';

import { useInputs } from '@common';
import dayjs, { type Dayjs } from 'dayjs';
import type { ToggleTabItem } from '../../../_shared/components/toggle-tab/ToggleTab';
import type { AccountBookCategoryType } from '../../../_shared/utils/account-books';
import type { AccountBookCategory } from './useAccountBookCategories';

export type ScheduledPaymentType = 'repeat' | 'installment';

export interface AccountBookSaveForm {
  id?: number;
  title: string;
  amount: number;
  memo: string;
  registerDateTime: Dayjs;
  isDisabledBudget?: boolean;
  scheduledPaymentType?: ScheduledPaymentType;
  scheduledPaymentDay?: number;
  installmentMonth?: number;
  category: AccountBookCategory;
  type: AccountBookCategoryType;
}

const INIT_FORM_DATA: AccountBookSaveForm = {
  title: '',
  amount: 0,
  category: {
    id: -1,
    name: '',
    type: 'income',
    accountBookCategoryImage: {
      imageUrl: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  registerDateTime: dayjs(),
  scheduledPaymentType: undefined,
  scheduledPaymentDay: undefined,
  installmentMonth: undefined,
  isDisabledBudget: false,
  type: 'expenditure',
  memo: '',
};

export const useAccountBookForm = (saveForm?: AccountBookSaveForm) => {
  const {
    inputs: formData,
    onChange,
    setInput,
    onClear,
    setInputs,
  } = useInputs<AccountBookSaveForm>(saveForm ?? INIT_FORM_DATA);

  const validateForm = () => {
    if (formData.title.length > 20) {
      const typeMsg = formData.type === 'income' ? '수입' : '지출';
      return {
        message: `${typeMsg}명은 20글자 까지 작성 가능합니다.`,
        isValid: false,
      };
    }

    if (formData.amount <= 0) {
      return { message: '금액을 입력해 주세요.', isValid: false };
    }

    return { message: '', isValid: true };
  };

  const setAmount = (amount: number) => setInput('amount', amount);

  const setRegisterDateTime = (date: Dayjs) => setInput('registerDateTime', date);

  const setType = (tab: ToggleTabItem) => {
    setInputs((prev) => ({
      ...prev,
      type: tab.type as AccountBookCategoryType,
      category: INIT_FORM_DATA.category,
    }));
  };

  const setScheduledPayment = ({
    scheduledPaymentType,
    scheduledPaymentDay,
    installmentMonth,
  }: {
    scheduledPaymentType: ScheduledPaymentType;
    scheduledPaymentDay: number;
    installmentMonth?: number;
  }) => {
    setInputs((prev) => ({
      ...prev,
      scheduledPaymentType,
      scheduledPaymentDay,
      installmentMonth,
    }));
  };

  const toggleDisabledBudget = () => {
    setInputs((prev) => ({
      ...prev,
      isDisabledBudget: !prev.isDisabledBudget,
    }));
  };

  const setAccountBookCategoryType = (accountBookCategory: AccountBookCategory) => {
    setInput('category', accountBookCategory);
  };

  const isActiveSubmit = isValidSubmit(formData);
  // 수정 폼에서 최초 값과 달라졌는지 여부. 신규 작성(초기값 없음)은 항상 변경으로 본다.
  const isFormChanged = saveForm === undefined || !isSameSaveForm(saveForm, formData);

  return {
    formData,
    onChange,
    setInput,
    onClear,
    setInputs,
    setAmount,
    toggleDisabledBudget,
    setType,
    setRegisterDateTime,
    setAccountBookCategoryType,
    setScheduledPayment,
    validateForm,
    isActiveSubmit,
    isFormChanged,
  };
};

function isValidSubmit(form: AccountBookSaveForm) {
  const { title, type, amount, category } = form;
  return title.length > 0 && type.length > 0 && amount > 0 && category.id > 0;
}

// 날짜는 선택 UI 정밀도(분)까지만 비교한다.
function isSameSaveForm(a: AccountBookSaveForm, b: AccountBookSaveForm) {
  return (
    a.title === b.title &&
    a.amount === b.amount &&
    a.memo === b.memo &&
    a.type === b.type &&
    a.category.id === b.category.id &&
    Boolean(a.isDisabledBudget) === Boolean(b.isDisabledBudget) &&
    a.scheduledPaymentType === b.scheduledPaymentType &&
    a.scheduledPaymentDay === b.scheduledPaymentDay &&
    a.installmentMonth === b.installmentMonth &&
    a.registerDateTime.isSame(b.registerDateTime, 'minute')
  );
}

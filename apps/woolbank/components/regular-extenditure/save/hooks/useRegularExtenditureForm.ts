import { useInputs } from '@common';
import { AccountBookCategory } from '../../../account-books/save/_common/hooks/useAccountBookCategories';

export interface RegularExtenditureForm {
  title: string;
  amount: number;
  regularDate: number;
  category: AccountBookCategory;
  isAutoExpenditure: boolean;
}

const INIT_FORM_DATA: RegularExtenditureForm = {
  title: '',
  amount: 0,
  category: {
    id: -1,
    name: '',
    type: 'income',
    createdAt: new Date(),
    updatedAt: new Date(),
    accountBookCategoryImage: {
      imageUrl: '',
    },
  },
  regularDate: 0,
  isAutoExpenditure: false,
};

export const useRegularExtenditureForm = () => {
  const {
    inputs: formData,
    onChange,
    setInput,
    onClear,
    setInputs,
  } = useInputs<RegularExtenditureForm>(INIT_FORM_DATA);

  const validateForm = () => {
    if (formData.title.length > 20) {
      return {
        message: '제목은 20글자 까지 작성 가능합니다.',
        isValid: false,
      };
    }

    if (formData.amount <= 0) {
      return {
        message: '금액을 입력해 주세요.',
        isValid: false,
      };
    }

    if (formData.regularDate <= 0) {
      return {
        message: '정기 지출일을 선택해 주세요.',
        isValid: false,
      };
    }

    return {
      message: '',
      isValid: true,
    };
  };

  const setAmount = (amount: number) => {
    setInput('amount', amount);
  };

  const setRegularDate = (date: number) => {
    setInput('regularDate', date);
  };

  const setAutoExpenditure = (isAutoExpenditure: boolean) => {
    setInput('isAutoExpenditure', isAutoExpenditure);
  };

  const setAccountBookCategoryType = (accountBookCategory: AccountBookCategory) => {
    setInput('category', accountBookCategory);
  };

  const isActiveSubmit = isValidSubmit(formData);
  return {
    formData,
    onChange,
    setInput,
    onClear,
    setInputs,
    setAmount,
    setAutoExpenditure,
    setRegularDate,
    setAccountBookCategoryType,
    validateForm,
    isActiveSubmit,
  };
};

function isValidSubmit(form: RegularExtenditureForm) {
  const { title, amount, category, regularDate } = form;

  return title.length > 0 && amount > 0 && regularDate > 0 && category.id > 0;
}

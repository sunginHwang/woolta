import { useInputs } from '@common';
import dayjs, { Dayjs } from 'dayjs';
import { ToggleTabItem } from '../../../../../components/common/ToggleTab';
import getCategoryMsg, { AccountBookCategoryType } from '../../../../../utils/account-books';
import { AccountBookCategory } from '../../hooks/useAccountBookCategories';

export interface AccountBookSaveForm {
  id?: number;
  title: string;
  amount: number;
  memo: string;
  registerDateTime: Dayjs;
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  registerDateTime: dayjs(),
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
      const typeMsg = getCategoryMsg(formData.type);

      return {
        message: `${typeMsg}명은 20글자 까지 작성 가능합니다.`,
        isValid: false,
      };
    }

    if (formData.amount <= 0) {
      return {
        message: '금액을 입력해 주세요.',
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

  const setRegisterDateTime = (date: Dayjs) => {
    setInput('registerDateTime', date);
  };

  const setType = (tab: ToggleTabItem) => {
    setInputs((prev) => ({
      ...prev,
      type: tab.type as AccountBookCategoryType,
      category: INIT_FORM_DATA.category,
    }));
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
    setType,
    setRegisterDateTime,
    setAccountBookCategoryType,
    validateForm,
    isActiveSubmit,
  };
};

function isValidSubmit(form: AccountBookSaveForm) {
  const { title, type, amount, category } = form;

  return title.length > 0 && type.length > 0 && amount > 0 && category.id > 0;
}

import { useInputs } from '@common';
import dayjs, { Dayjs } from 'dayjs';
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

  // const setType = (tab: IAssetType) => {
  //   setInputs((prev) => ({
  //     ...prev,
  //     type: '',
  //     category: INIT_FORM_DATA.category,
  //   }));
  // };

  return {
    formData,
    onChange,
    setInput,
    onClear,
    setInputs,
    validateForm,
  };
};

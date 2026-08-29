import { useMount } from '@common';
import * as stylex from '@stylexjs/stylex';
import { FC, KeyboardEvent, MouseEvent, useRef, useState } from 'react';
import { Button } from '../../../../components/atom/Button';
import { BaseInput } from '../../../../components/base-input/BaseInput';
import { ToggleTab } from '../../../../components/toggle-tab/ToggleTab';
import { useToast } from '../../../../hooks/useToast';
import FormModal from '../FormModal';
import { RegularExtenditureForm as FormType, useRegularExtenditureForm } from '../hooks/useRegularExtenditureForm';

const TAB_LIST = [
  {
    type: 'autoExpenditure',
    name: '자동이체',
  },
  {
    type: 'selfExpenditure',
    name: '수동이체',
  },
];

interface Props {
  submitForm: (form: FormType) => void;
}

const styles = stylex.create({
  form: {
    marginTop: '2rem',
    paddingBlock: 0,
    paddingInline: '1.6rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
  },
  buttonArea: {
    marginTop: '5rem',
    paddingBottom: '5rem',
    display: 'flex',
    width: '100%',
    gap: '1.6rem',
  },
});

export const RegularExtenditureForm: FC<Props> = ({ submitForm }) => {
  const {
    formData,
    isActiveSubmit,
    onChange,
    setAmount,
    setAutoExpenditure,
    validateForm,
    setAccountBookCategoryType,
    setRegularDate,
    onClear,
  } = useRegularExtenditureForm();
  const { onToast } = useToast();
  const [openModalName, setModalName] = useState('');
  const title_ref = useRef<HTMLInputElement>(null);

  useMount(() => {
    setModalName('amount');
  });

  const handleClearClick = (e: MouseEvent<HTMLLIElement>) => {
    const type = e.currentTarget.dataset.type || '';
    onClear(type as keyof FormType);
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
    if (formData.title === '') {
      title_ref.current?.focus();
    }
  };

  const handleRegularDateClick = (date: number) => {
    setRegularDate(date);
    if (formData.category.id === -1) {
      setModalName('category');
    }
  };

  const handleTitleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.regularDate === 0) {
      setModalName('regularDate');
    }
  };

  const openModal = (e: MouseEvent<HTMLElement | HTMLDivElement>) => {
    const type = e.currentTarget.dataset.type || '';
    setModalName(type);
  };

  const closeModal = () => {
    setModalName('');
  };

  return (
    <>
      <main {...stylex.props(styles.form)}>
        <BaseInput
          readOnly
          dataType='amount'
          label='지출액'
          placeholder='정기적으로 지출되는 금액을 작성해주세요.'
          value={formData.amount === 0 ? '' : `${formData.amount.toLocaleString('ko-KR')}원`}
          onClick={openModal}
          onClear={handleClearClick}
        />
        <BaseInput
          ref={title_ref}
          dataType='title'
          name='title'
          label='제목'
          placeholder='제목을 입력해주세요.'
          maxLength={20}
          value={formData.title}
          onChange={onChange}
          onClear={handleClearClick}
          onKeyDown={handleTitleEnter}
        />
        <BaseInput
          readOnly
          dataType='regularDate'
          label='정기 지출일'
          placeholder='정기 지출일을 선택해주세요.'
          value={`${formData.regularDate}일`}
          onClick={openModal}
          onClear={handleClearClick}
        />
        <BaseInput
          readOnly
          dataType='category'
          label='지출 카테고리'
          placeholder='지출 카테고리를 선택해 주세요.'
          value={formData.category.name}
          onClick={openModal}
          onClear={handleClearClick}
        />
        <ToggleTab
          tabs={TAB_LIST}
          value={TAB_LIST[formData.isAutoExpenditure ? 0 : 1].type}
          onChangeTab={(tab) => {
            setAutoExpenditure(tab.type === 'autoExpenditure');
          }}
        />
        <div {...stylex.props(styles.buttonArea)}>
          <Button fill onClick={handleSubmitClick} disabled={!isActiveSubmit}>
            작성
          </Button>
        </div>
      </main>
      <FormModal
        openModalName={openModalName}
        formData={formData}
        onCloseModal={closeModal}
        onChangeAmount={handleAmountClick}
        onChangeCategory={setAccountBookCategoryType}
        onChangeDate={handleRegularDateClick}
      />
    </>
  );
};

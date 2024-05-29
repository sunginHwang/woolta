import { FC, MouseEvent, useEffect, useRef, KeyboardEvent, useState } from 'react';
import { styled } from 'styled-components';
import { IconTrashCan } from '../../../../components/atom/Icon';
import BaseInput from '../../../../components/common/BaseInput';
import ToggleTab from '../../../../components/common/ToggleTab';
import { useUserInfo } from '../../../../hooks/queries/useUserInfo';
import { useToast } from '../../../../hooks/useToast';
import getCategoryMsg from '../../../../utils/account-books';
import { Button } from '../../../atom/Button';
import { useConfirm } from '../../../common/Confirm/ConfirmContext';
import { useAccountBookSaveRouterProps } from '../hooks/useAccountBookSaveRouterProps';
import FormModal from './FormModal';
import { AccountBookSaveForm, useAccountBookForm } from './hooks/useAccountBookForm';
import { useDetectKeyboardOpen } from '@common';

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

interface Props {
  accountBookForm?: AccountBookSaveForm;
  submitForm: (accountForm: AccountBookSaveForm) => void;
  removeAccountBookForm: (id: string) => void;
}

const AccountBookForm: FC<Props> = ({ accountBookForm, submitForm, removeAccountBookForm }) => {
  const {
    formData,
    isActiveSubmit,
    onChange,
    setAmount,
    setType,
    validateForm,
    setAccountBookCategoryType,
    setRegisterDateTime,
    onClear,
  } = useAccountBookForm(accountBookForm);
  const { openConfirm } = useConfirm();
  const { onToast } = useToast();
  const { isShareUser } = useUserInfo();
  const { is_insert_mode } = useAccountBookSaveRouterProps();
  const isKeyboardOpen = useDetectKeyboardOpen();
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

    submitForm(formData);
  };

  const handleAmountClick = (amount: number) => {
    setAmount(amount);
    if (is_insert_mode && formData.title === '') {
      title_ref.current?.focus();
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

  const handleTitleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && is_insert_mode && formData.category.name === '') {
      setModalName('category');
    }
  };

  const openModal = (e: MouseEvent<HTMLElement | HTMLDivElement>) => {
    if (isKeyboardOpen) {
      return;
    }

    const type = e.currentTarget.dataset.type || '';
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
        <ToggleTab tabs={TAB_LIST} value={formData.type} onChangeTab={setType} />
        <BaseInput
          readOnly
          disable={isShareUser}
          dataType='amount'
          label={`${typeMsg}금액`}
          placeholder={`${typeMsg}금액을 입력해 주세요.`}
          value={formData.amount === 0 ? '' : `${formData.amount.toLocaleString('ko-KR')}원`}
          onClick={openModal}
          onClear={handleClearClick}
        />
        <BaseInput
          ref={title_ref}
          name='title'
          disable={isShareUser}
          label={`${typeMsg}처`}
          placeholder={`${typeMsg}처를 선택해 주세요.`}
          maxLength={20}
          value={formData.title}
          onChange={onChange}
          onClear={handleClearClick}
          onKeyDown={handleTitleEnter}
        />
        <BaseInput
          readOnly
          disable={isShareUser}
          dataType='registerDateTime'
          label={`${typeMsg}일시`}
          placeholder={`${typeMsg}일시를 선택해 주세요.`}
          value={formData.registerDateTime.format('YYYY-MM-DD')}
          onClick={openModal}
          onClear={handleClearClick}
        />
        <BaseInput
          readOnly
          disable={isShareUser}
          dataType='category'
          label={`${typeMsg}카테고리`}
          placeholder={`${typeMsg} 카테고리를 선택해 주세요.`}
          value={formData.category.name}
          onClick={openModal}
          onClear={handleClearClick}
        />
        <BaseInput
          name='memo'
          label='메모'
          disable={isShareUser}
          placeholder='메모를 입력해주세요.'
          maxLength={20}
          value={formData.memo}
          onChange={onChange}
          onClear={handleClearClick}
        />
        {!isShareUser && (
          <SC.ButtonArea>
            {!isUpdateForm && (
              <Button variant='tertiaryGray' onClick={handleRemoveClick} disabled={!isActiveSubmit}>
                <IconTrashCan />
              </Button>
            )}
            <Button fill onClick={handleSubmitClick} disabled={!isActiveSubmit}>
              {isUpdateForm ? '작성하기' : '수정하기'}
            </Button>
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
      />
    </>
  );
};

export default AccountBookForm;

const SC = {
  Form: styled.div`
    margin-top: 2rem;
    padding: 0 1.6rem;

    > div + div {
      margin-top: 4rem;
    }
  `,
  ButtonArea: styled.div`
    margin-top: 5rem;
    padding-bottom: 5rem;
    display: flex;
    width: 100%;
    gap: 1.6rem;
  `,
};

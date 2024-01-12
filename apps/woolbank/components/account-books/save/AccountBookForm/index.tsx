import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { FC, MouseEvent, useState } from 'react';
import { Button } from '../../../../components/atom/Button';
import { IconTrashCan } from '../../../../components/atom/Icon';
import BaseInput from '../../../../components/common/BaseInput';
import ToggleTab from '../../../../components/common/ToggleTab';
import getCategoryMsg from '../../../../utils/account-books';
import { useAccountBookDetail, AccountBookDetail } from '../hooks/useAccountBookDetail';
import FormModal from './FormModal';
import { AccountBookSaveForm, useAccountBookForm } from './hooks/useAccountBookForm';

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
}
const AccountBookForm: FC<Props> = ({ accountBookForm }) => {
  const {
    formData,
    isActiveSubmit,
    onChange,
    setAmount,
    setType,
    setAccountBookCategoryType,
    setRegisterDateTime,
    onClear,
  } = useAccountBookForm(accountBookForm);
  const [openModalName, setModalName] = useState('');

  const handleClearClick = (e: MouseEvent<HTMLLIElement>) => {
    const type = e.currentTarget.dataset.type || '';
    onClear(type as keyof AccountBookSaveForm);
  };

  const handleSubmitClick = () => {
    console.log(formData);
  };

  const openModal = (e: MouseEvent<HTMLElement | HTMLDivElement>) => {
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
          dataType='amount'
          label={`${typeMsg}금액`}
          placeholder={`${typeMsg}금액을 입력해 주세요.`}
          value={formData.amount === 0 ? '' : `${formData.amount.toLocaleString('ko-KR')}원`}
          onClick={openModal}
          onClear={handleClearClick}
        />
        <BaseInput
          name='title'
          label={`${typeMsg}처`}
          placeholder={`${typeMsg}처를 선택해 주세요.`}
          maxLength={20}
          value={formData.title}
          onChange={onChange}
          onClear={handleClearClick}
        />
        <BaseInput
          readOnly
          dataType='registerDateTime'
          label={`${typeMsg}일시`}
          placeholder={`${typeMsg}일시를 선택해 주세요.`}
          value={formData.registerDateTime.format('YYYY-MM-DD HH:mm')}
          onClick={openModal}
          onClear={handleClearClick}
        />
        <BaseInput
          readOnly
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
          placeholder='메모를 입력해주세요.'
          maxLength={20}
          value={formData.memo}
          onChange={onChange}
          onClear={handleClearClick}
        />
        <SC.ButtonArea>
          {!isUpdateForm && (
            <Button
              variant='tertiaryGray'
              // loading={addAccountBookMutation.isLoading}
              // onClick={onSubmitClick}
              disabled={!isActiveSubmit}
            >
              <IconTrashCan />
            </Button>
          )}
          <Button
            fill
            // loading={addAccountBookMutation.isLoading}
            onClick={handleSubmitClick}
            disabled={!isActiveSubmit}
          >
            {isUpdateForm ? '작성하기' : '수정하기'}
          </Button>
        </SC.ButtonArea>
      </SC.Form>
      <FormModal
        openModalName={openModalName}
        formData={formData}
        onCloseModal={closeModal}
        onChangeAmount={setAmount}
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

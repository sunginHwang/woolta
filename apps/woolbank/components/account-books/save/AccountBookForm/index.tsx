import styled from '@emotion/styled';
import { MouseEvent } from 'react';
import { Button } from '../../../../components/atom/Button';
import { IconTrashCan } from '../../../../components/atom/Icon';
import BaseInput from '../../../../components/common/BaseInput';
import ToggleTab from '../../../../components/common/ToggleTab';
import getCategoryMsg from '../../../../utils/account-books';
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

const AccountBookForm = () => {
  const typeMsg = getCategoryMsg('income');
  const { formData, onChange, onClear } = useAccountBookForm();

  const handleClearClick = (e: MouseEvent<HTMLLIElement>) => {
    const type = e.currentTarget.dataset.type || '';
    onClear(type as keyof AccountBookSaveForm);
  };

  return (
    <SC.Form>
      <ToggleTab tabs={TAB_LIST} value={formData.type} onChangeTab={() => console.log('')} />
      <BaseInput
        disable
        dataType='amount'
        label={`${typeMsg}금액`}
        placeholder={`${typeMsg}금액을 입력해 주세요.`}
        value={formData.amount === 0 ? '' : `${formData.amount.toLocaleString('ko-KR')}원`}
        // onClick={setModalWithType}
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
        disable
        dataType='registerDateTime'
        label={`${typeMsg}일시`}
        placeholder={`${typeMsg}일시를 선택해 주세요.`}
        value={formData.registerDateTime.format('YYYY-MM-DD HH:mm')}
        // onClick={setModalWithType}
        onClear={handleClearClick}
      />
      <BaseInput
        disable
        dataType='category'
        label={`${typeMsg}카테고리`}
        placeholder={`${typeMsg} 카테고리를 선택해 주세요.`}
        value={formData.category.name}
        // onClick={setModalWithType}
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
        <Button
          variant='tertiaryGray'
          // loading={addAccountBookMutation.isLoading}
          // onClick={onSubmitClick}
          // active={isActiveSendButton}
        >
          <IconTrashCan />
        </Button>
        <Button
          fill
          // loading={addAccountBookMutation.isLoading}
          // onClick={onSubmitClick}
          // active={isActiveSendButton}
        >
          {true ? '작성하기' : '수정하기'}
        </Button>
      </SC.ButtonArea>
    </SC.Form>
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

'use client';

import { styled } from 'styled-components';
import AddButton from '../../../../components/common/AddButton';
import AccountBookList from './AccountBookList';
import MonthStatistics from './MonthStatistics';

/**
 * 가계부 리스트
 * @component
 */
const AccountList = () => {
  return (
    <>
      <MonthStatistics />
      <SC.Line />
      <AccountBookList />
      <AddButton href='/account-books/save' />
    </>
  );
};

export default AccountList;

const SC = {
  Line: styled.div`
    background-color: ${({ theme }) => theme.colors.gray100};
    height: 0.7rem;

    margin: 2rem 0 3rem;
  `,
};

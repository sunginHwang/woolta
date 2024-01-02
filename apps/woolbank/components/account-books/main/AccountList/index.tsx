import styled from '@emotion/styled';
import AddButton from '../../../../components/common/AddButton';
import AccountBookList from './AccountBookList';
import MonthStatistics from './MonthStatistics';

const AccountList = () => {
  return (
    <SC.Container>
      <MonthStatistics />
      <AccountBookList />
      <AddButton href='/account-books/save' />
    </SC.Container>
  );
};

export default AccountList;

const SC = {
  Container: styled.div`
    padding: 0 1.6rem 20rem;
  `,
};

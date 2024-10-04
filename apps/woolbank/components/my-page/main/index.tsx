'use client';

import { styled } from 'styled-components';
import Header from '../../common/Header';
import UserInfoCard from './UserInfoCard';

const MyPageMain = () => {
  return (
    <>
      <Header title='나의 뱅킷리스트' />
      <SC.Container>
        <UserInfoCard />
      </SC.Container>
    </>
  );
};

export default MyPageMain;

const SC = {
  Container: styled.main`
    padding: 0 1.6rem;
  `,
};

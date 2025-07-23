'use client';

import { styled } from 'styled-components';
import { Header } from '../../../components/header/Header';
import { UserInfoCard } from './user-info-card/UserInfoCard';

export const MyPageMain = () => {
  return (
    <>
      <Header title='나의 뱅킷리스트' />
      <SC.Container>
        <UserInfoCard />
      </SC.Container>
    </>
  );
};

const SC = {
  Container: styled.main`
    padding: 0 1.6rem;
  `,
};

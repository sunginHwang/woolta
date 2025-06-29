'use client';

import { typography } from '@wds';
import Link from 'next/link';
import { styled } from 'styled-components';
import { useUserInfo } from '../../../hooks/queries/useUserInfo';

export const AddButton = () => {
  const { isShareUser } = useUserInfo();

  if (isShareUser) {
    return null;
  }

  return (
    <SC.Container href='/account-books/save' data-cy='addButton'>
      +
    </SC.Container>
  );
};

const SC = {
  Container: styled(Link)`
    ${typography.title1Bold}
    display: flex;
    justify-content: center;
    align-items: center;

    width: 4rem;
    height: 4rem;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.red500};
    border-radius: 100% !important;
    box-shadow: 0.2rem 0.2rem 0.5rem 0.2rem rgba(0, 0, 0, 0.16);
  `,
};

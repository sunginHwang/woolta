'use client';

import { useTodoDetailVisibility } from '@todo/features';
import { FiX } from 'react-icons/fi';
import { styled } from 'styled-components';

export const TodoDetailHeader = () => {
  const { hideDetail } = useTodoDetailVisibility();

  return (
    <SC.Header>
      <SC.CloseButton type='button' title='상세 보기 닫기' aria-label='상세 보기 닫기' onClick={hideDetail}>
        <FiX size={16} />
      </SC.CloseButton>
    </SC.Header>
  );
};

const SC = {
  Header: styled.div`
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    padding: 0.8rem 0.8rem 0;
  `,
  CloseButton: styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border: none;
    border-radius: 0.6rem;
    background: none;
    color: ${({ theme }) => theme.colors.textTertiary};
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,
};

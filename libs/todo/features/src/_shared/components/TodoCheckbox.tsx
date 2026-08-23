'use client';

import { MouseEvent } from 'react';
import { FiCheck } from 'react-icons/fi';
import { styled } from 'styled-components';

interface Props {
  /** 완료 여부 */
  isCompleted: boolean;
  /** 체크박스 클릭 시 호출 */
  onCheckClick: () => void;
}

/** 할 일 완료 토글 체크박스 (원형) */
export const TodoCheckbox = ({ isCompleted, onCheckClick }: Props) => {
  const handleCheckClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onCheckClick();
  };

  return (
    <SC.Checkbox
      type='button'
      role='checkbox'
      aria-checked={isCompleted}
      $isCompleted={isCompleted}
      onClick={handleCheckClick}
    >
      {isCompleted && <FiCheck size={12} />}
    </SC.Checkbox>
  );
};

const SC = {
  Checkbox: styled.button<{ $isCompleted: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    border: 1px solid
      ${({ theme, $isCompleted }) => ($isCompleted ? theme.colors.interactivePrimary : theme.colors.borderStrong)};
    background-color: ${({ theme, $isCompleted }) => ($isCompleted ? theme.colors.interactivePrimary : 'transparent')};
    color: ${({ theme }) => theme.colors.textInverse};
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;

    &:hover {
      border-color: ${({ theme }) => theme.colors.interactivePrimary};
    }
  `,
};

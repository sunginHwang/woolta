'use client';

import { ChangeEvent, useState } from 'react';
import { styled } from 'styled-components';

const PLACEHOLDER = '제목 없음';
interface Props {
  title: string;
  isCompleted: boolean;
  readOnly: boolean;
  onTitleChange: (newTitle: string) => void;
}

export const Title = ({ title, isCompleted, readOnly, onTitleChange }: Props) => {
  const [titleState, setTitleState] = useState(title);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleState(e.target.value);
    onTitleChange(e.target.value);
  };

  return (
    <SC.TitleInput
      placeholder={PLACEHOLDER}
      value={titleState}
      readOnly={readOnly}
      $isCompleted={isCompleted}
      onChange={handleTitleChange}
    />
  );
};

const SC = {
  TitleInput: styled.input<{ $isCompleted: boolean }>`
    width: 100%;
    margin-top: 1.6rem;
    border: none;
    background: transparent;
    color: ${({ theme, $isCompleted }) => ($isCompleted ? theme.colors.textTertiary : theme.colors.textPrimary)};
    text-decoration: ${({ $isCompleted }) => ($isCompleted ? 'line-through' : 'none')};
    font-size: 1.8rem;
    line-height: 2.6rem;
    font-weight: 600;
    outline: none;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textDisabled};
    }
  `,
};

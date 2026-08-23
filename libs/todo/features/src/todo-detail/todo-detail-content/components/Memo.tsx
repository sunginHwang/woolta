'use client';

import { ChangeEvent, useState } from 'react';
import { styled } from 'styled-components';

const PLACEHOLDER = '메모를 입력해 주세요.';
interface Props {
  memo: string;
  readOnly: boolean;
  onMemoChange: (newMemo: string) => void;
}

export const Memo = ({ memo, readOnly, onMemoChange }: Props) => {
  const [memoState, setMemoState] = useState(memo);

  const handleMemoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newMemo = e.target.value;
    setMemoState(newMemo);
    onMemoChange(newMemo);
  };

  return (
    <SC.MemoTextarea placeholder={PLACEHOLDER} value={memoState} readOnly={readOnly} onChange={handleMemoChange} />
  );
};

const SC = {
  MemoTextarea: styled.textarea`
    flex: 1;
    width: 100%;
    margin-top: 1.2rem;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.4rem;
    line-height: 2.2rem;
    font-family: inherit;
    resize: none;
    outline: none;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textDisabled};
    }
  `,
};

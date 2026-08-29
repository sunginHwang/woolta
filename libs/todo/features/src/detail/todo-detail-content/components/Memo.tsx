'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { ChangeEvent, useState } from 'react';

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
    <textarea
      placeholder={PLACEHOLDER}
      value={memoState}
      readOnly={readOnly}
      onChange={handleMemoChange}
      {...stylex.props(styles.memoTextarea)}
    />
  );
};

const styles = stylex.create({
  memoTextarea: {
    flex: 1,
    width: '100%',
    marginTop: '1.2rem',
    borderWidth: 0,
    background: 'transparent',
    color: colorVars['--color-textSecondary'],
    fontSize: '1.4rem',
    lineHeight: '2.2rem',
    fontFamily: 'inherit',
    resize: 'none',
    outline: 'none',
    '::placeholder': {
      color: colorVars['--color-textDisabled'],
    },
  },
});

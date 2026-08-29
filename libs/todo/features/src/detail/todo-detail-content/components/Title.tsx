'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { ChangeEvent, useState } from 'react';

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
    <input
      placeholder={PLACEHOLDER}
      value={titleState}
      readOnly={readOnly}
      onChange={handleTitleChange}
      {...stylex.props(styles.titleInput, isCompleted && styles.titleInputCompleted)}
    />
  );
};

const styles = stylex.create({
  titleInput: {
    width: '100%',
    marginTop: '1.6rem',
    borderWidth: 0,
    background: 'transparent',
    color: colorVars['--color-textPrimary'],
    textDecoration: 'none',
    fontSize: '1.8rem',
    lineHeight: '2.6rem',
    fontWeight: 600,
    outline: 'none',
    '::placeholder': {
      color: colorVars['--color-textDisabled'],
    },
  },
  titleInputCompleted: {
    color: colorVars['--color-textTertiary'],
    textDecoration: 'line-through',
  },
});

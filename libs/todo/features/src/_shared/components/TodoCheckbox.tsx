'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import type { MouseEvent } from 'react';
import { FiCheck } from 'react-icons/fi';

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
    <button
      type='button'
      role='checkbox'
      aria-checked={isCompleted}
      onClick={handleCheckClick}
      {...stylex.props(styles.checkbox, isCompleted && styles.checkboxCompleted)}
    >
      {isCompleted && <FiCheck size={12} />}
    </button>
  );
};

const styles = stylex.create({
  checkbox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '1.8rem',
    height: '1.8rem',
    borderRadius: '50%',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderStrong'],
      ':hover': colorVars['--color-interactivePrimary'],
    },
    backgroundColor: 'transparent',
    color: colorVars['--color-textInverse'],
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
  },
  checkboxCompleted: {
    borderColor: colorVars['--color-interactivePrimary'],
    backgroundColor: colorVars['--color-interactivePrimary'],
  },
});

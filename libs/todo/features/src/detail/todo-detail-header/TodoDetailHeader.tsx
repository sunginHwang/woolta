'use client';

import * as stylex from '@stylexjs/stylex';
import { useTodoDetailVisibility } from '@todo/features';
import { colorVars } from '@wds/tokens.stylex';
import { FiX } from 'react-icons/fi';

export const TodoDetailHeader = () => {
  const { hideDetail } = useTodoDetailVisibility();

  return (
    <div {...stylex.props(styles.header)}>
      <button
        type='button'
        title='상세 보기 닫기'
        aria-label='상세 보기 닫기'
        onClick={hideDetail}
        {...stylex.props(styles.closeButton)}
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

const styles = stylex.create({
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexShrink: 0,
    paddingTop: '0.8rem',
    paddingInline: '0.8rem',
    paddingBottom: 0,
  },
  closeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    borderWidth: 0,
    borderRadius: '0.6rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    cursor: 'pointer',
  },
});

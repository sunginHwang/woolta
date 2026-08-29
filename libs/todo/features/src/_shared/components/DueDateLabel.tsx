'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { FiCalendar } from 'react-icons/fi';
import { formatDueDate } from '../utils/formatDueDate';
import { getTodayKey } from '../utils/todoDate';

interface Props {
  /** 마감일 (YYYY-MM-DD) */
  dueDate: string;
}

/** 마감일 라벨. 지연된 마감일은 경고색으로 표시한다. */
export const DueDateLabel = ({ dueDate }: Props) => {
  const { label, isOverdue } = formatDueDate(dueDate, getTodayKey());

  return (
    <span {...stylex.props(styles.label, isOverdue && styles.labelOverdue)}>
      <FiCalendar size={11} />
      {label}
    </span>
  );
};

const styles = stylex.create({
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '1.1rem',
    lineHeight: '1.4rem',
    color: colorVars['--color-interactivePrimary'],
    whiteSpace: 'nowrap',
  },
  labelOverdue: {
    color: colorVars['--color-statusError'],
  },
});

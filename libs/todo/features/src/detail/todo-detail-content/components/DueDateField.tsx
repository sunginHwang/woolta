'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import type { ChangeEvent } from 'react';
import { FiCalendar, FiX } from 'react-icons/fi';
import { formatDueDate } from '../../../_shared/utils/formatDueDate';
import { getTodayKey } from '../../../_shared/utils/todoDate';

interface Props {
  /** 마감일 (YYYY-MM-DD, 없으면 null) */
  dueDate: string | null;
  /** 마감일 변경 시 호출 */
  onDueDateChange: (dueDate: string | null) => void;
}

/** 상세 패널의 마감일 필드. 네이티브 date input 위에 라벨을 겹쳐 표시한다. */
export const DueDateField = ({ dueDate, onDueDateChange }: Props) => {
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    onDueDateChange(e.target.value.length > 0 ? e.target.value : null);
  };

  const labelInfo = dueDate !== null ? formatDueDate(dueDate, getTodayKey()) : null;
  const isOverdue = labelInfo?.isOverdue ?? false;
  const hasValue = dueDate !== null;

  return (
    <div {...stylex.props(styles.field)}>
      <label
        {...stylex.props(
          styles.dateButton,
          hasValue && styles.dateButtonHasValue,
          isOverdue && styles.dateButtonOverdue,
        )}
      >
        <FiCalendar size={13} />
        {labelInfo?.label ?? '날짜 없음'}
        <input type='date' value={dueDate ?? ''} onChange={handleDateChange} {...stylex.props(styles.dateInput)} />
      </label>
      {dueDate !== null && (
        <button
          type='button'
          title='날짜 제거'
          onClick={() => onDueDateChange(null)}
          {...stylex.props(styles.clearButton)}
        >
          <FiX size={12} />
        </button>
      )}
    </div>
  );
};

const styles = stylex.create({
  field: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
  },
  dateButton: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    paddingBlock: '0.4rem',
    paddingInline: '0.8rem',
    borderRadius: '0.6rem',
    fontSize: '1.2rem',
    lineHeight: '1.6rem',
    cursor: 'pointer',
    color: colorVars['--color-textTertiary'],
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
  },
  dateButtonHasValue: {
    color: colorVars['--color-interactivePrimary'],
  },
  dateButtonOverdue: {
    color: colorVars['--color-statusError'],
  },
  dateInput: {
    position: 'absolute',
    inset: 0,
    opacity: 0,
    cursor: 'pointer',
    '::-webkit-calendar-picker-indicator': {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
    },
  },
  clearButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.3rem',
    borderWidth: 0,
    borderRadius: '0.4rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    cursor: 'pointer',
  },
});

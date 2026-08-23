'use client';

import { FiCalendar } from 'react-icons/fi';
import { styled } from 'styled-components';
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
    <SC.Label $isOverdue={isOverdue}>
      <FiCalendar size={11} />
      {label}
    </SC.Label>
  );
};

const SC = {
  Label: styled.span<{ $isOverdue: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 1.1rem;
    line-height: 1.4rem;
    color: ${({ theme, $isOverdue }) => ($isOverdue ? theme.colors.statusError : theme.colors.interactivePrimary)};
    white-space: nowrap;
  `,
};

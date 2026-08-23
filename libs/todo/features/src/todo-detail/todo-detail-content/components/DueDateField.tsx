'use client';

import { ChangeEvent } from 'react';
import { FiCalendar, FiX } from 'react-icons/fi';
import { styled } from 'styled-components';
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

  return (
    <SC.Field>
      <SC.DateButton $isOverdue={labelInfo?.isOverdue ?? false} $hasValue={dueDate !== null}>
        <FiCalendar size={13} />
        {labelInfo?.label ?? '날짜 없음'}
        <SC.DateInput type='date' value={dueDate ?? ''} onChange={handleDateChange} />
      </SC.DateButton>
      {dueDate !== null && (
        <SC.ClearButton type='button' title='날짜 제거' onClick={() => onDueDateChange(null)}>
          <FiX size={12} />
        </SC.ClearButton>
      )}
    </SC.Field>
  );
};

const SC = {
  Field: styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
  `,
  DateButton: styled.label<{ $isOverdue: boolean; $hasValue: boolean }>`
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    border-radius: 0.6rem;
    font-size: 1.2rem;
    line-height: 1.6rem;
    cursor: pointer;
    color: ${({ theme, $isOverdue, $hasValue }) => {
      if ($isOverdue) {
        return theme.colors.statusError;
      }
      return $hasValue ? theme.colors.interactivePrimary : theme.colors.textTertiary;
    }};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
  DateInput: styled.input`
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;

    &::-webkit-calendar-picker-indicator {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  `,
  ClearButton: styled.button`
    display: inline-flex;
    align-items: center;
    padding: 0.3rem;
    border: none;
    border-radius: 0.4rem;
    background: none;
    color: ${({ theme }) => theme.colors.textTertiary};
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,
};

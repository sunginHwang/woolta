'use client';

import { styled } from 'styled-components';
import { PriorityFlag } from '../../../_shared/components/PriorityFlag';
import { TodoPriority } from '../../../_shared/types';

const PRIORITY_OPTIONS: { value: TodoPriority; label: string }[] = [
  { value: 'high', label: '높음' },
  { value: 'medium', label: '중간' },
  { value: 'low', label: '낮음' },
  { value: 'none', label: '없음' },
];

interface Props {
  /** 현재 우선순위 */
  priority: TodoPriority;
  /** 우선순위 변경 시 호출 */
  onPriorityChange: (priority: TodoPriority) => void;
}

/** 상세 패널의 우선순위 선택. 깃발 아이콘 + 네이티브 select 조합 */
export const PrioritySelect = ({ priority, onPriorityChange }: Props) => {
  return (
    <SC.Field>
      <PriorityFlag priority={priority} />
      <SC.Select value={priority} onChange={(e) => onPriorityChange(e.target.value as TodoPriority)}>
        {PRIORITY_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            우선순위: {label}
          </option>
        ))}
      </SC.Select>
    </SC.Field>
  );
};

const SC = {
  Field: styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.2rem 0.4rem;
    border-radius: 0.6rem;

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
  Select: styled.select`
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.2rem;
    cursor: pointer;
    outline: none;
  `,
};

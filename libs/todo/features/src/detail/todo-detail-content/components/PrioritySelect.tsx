'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
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
    <div {...stylex.props(styles.field)}>
      <PriorityFlag priority={priority} />
      <select
        value={priority}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onPriorityChange(e.target.value as TodoPriority)}
        {...stylex.props(styles.select)}
      >
        {PRIORITY_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            우선순위: {label}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles = stylex.create({
  field: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    paddingBlock: '0.2rem',
    paddingInline: '0.4rem',
    borderRadius: '0.6rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
  },
  select: {
    borderWidth: 0,
    background: 'transparent',
    color: colorVars['--color-textSecondary'],
    fontSize: '1.2rem',
    cursor: 'pointer',
    outline: 'none',
  },
});

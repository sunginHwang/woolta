'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { FiFlag } from 'react-icons/fi';
import { TodoPriority } from '../types';

interface Props {
  /** 우선순위 */
  priority: TodoPriority;
  /** 아이콘 크기(px) @default 14 */
  size?: number;
}

const styles = stylex.create({
  high: { color: colorVars['--color-statusError'] },
  medium: { color: colorVars['--color-statusWarning'] },
  low: { color: colorVars['--color-statusInfo'] },
});

const flagStyleByPriority = {
  high: styles.high,
  medium: styles.medium,
  low: styles.low,
} as const;

/** 우선순위 깃발 아이콘. 우선순위가 없으면 렌더링하지 않는다. */
export const PriorityFlag = ({ priority, size = 14 }: Props) => {
  if (priority === 'none') {
    return null;
  }

  return (
    <span {...stylex.props(flagStyleByPriority[priority])}>
      <FiFlag size={size} />
    </span>
  );
};

'use client';

import { FiFlag } from 'react-icons/fi';
import { useTheme } from 'styled-components';
import { TodoPriority } from '../types';

interface Props {
  /** 우선순위 */
  priority: TodoPriority;
  /** 아이콘 크기(px) @default 14 */
  size?: number;
}

/** 우선순위 깃발 아이콘. 우선순위가 없으면 렌더링하지 않는다. */
export const PriorityFlag = ({ priority, size = 14 }: Props) => {
  const theme = useTheme();

  if (priority === 'none') {
    return null;
  }

  const colorByPriority = {
    high: theme.colors.statusError,
    medium: theme.colors.statusWarning,
    low: theme.colors.statusInfo,
  };

  return <FiFlag size={size} color={colorByPriority[priority]} fill={colorByPriority[priority]} />;
};

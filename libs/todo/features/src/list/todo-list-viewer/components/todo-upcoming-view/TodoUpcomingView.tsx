'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { useUpcomingGroups } from '../../../../_shared/hooks/useUpcomingGroups';
import { DateGroup } from './components/DateGroup';

/** 미래 탭 — 내일 이후 마감 할 일을 날짜별 그룹으로 표시한다. */
export const TodoUpcomingView = () => {
  const groups = useUpcomingGroups();

  if (groups.length === 0) {
    return (
      <div {...stylex.props(styles.empty)}>
        <Text as='p' variant='body3' color='textTertiary' alignment='center'>
          예정된 할 일이 없어요
          <br />
          마감일을 정하면 여기에 모여요
        </Text>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.container)}>
      {groups.map(({ date, todos }) => (
        <DateGroup key={date} date={date} todos={todos} />
      ))}
    </div>
  );
};

const styles = stylex.create({
  container: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBlock: '4rem',
    paddingInline: 0,
  },
});

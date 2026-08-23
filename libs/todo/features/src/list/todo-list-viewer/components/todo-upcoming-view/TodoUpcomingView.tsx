'use client';

import { Text } from '@wds';
import { styled } from 'styled-components';
import { useUpcomingGroups } from '../../../../_shared/hooks/useUpcomingGroups';
import { DateGroup } from './components/DateGroup';

/** 미래 탭 — 내일 이후 마감 할 일을 날짜별 그룹으로 표시한다. */
export const TodoUpcomingView = () => {
  const groups = useUpcomingGroups();

  if (groups.length === 0) {
    return (
      <SC.Empty>
        <Text as='p' variant='body3' color='textTertiary' alignment='center'>
          예정된 할 일이 없어요
          <br />
          마감일을 정하면 여기에 모여요
        </Text>
      </SC.Empty>
    );
  }

  return (
    <SC.Container>
      {groups.map(({ date, todos }) => (
        <DateGroup key={date} date={date} todos={todos} />
      ))}
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  `,
  Empty: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 4rem 0;
  `,
};

'use client';

import { Text } from '@wds';
import { styled } from 'styled-components';

export const TodoListEmpty = () => {
  return (
    <SC.Empty>
      <Text as='p' variant='body3' color='textTertiary' alignment='center'>
        리스트를 찾을 수 없어요
      </Text>
    </SC.Empty>
  );
};

const SC = {
  Empty: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  `,
};

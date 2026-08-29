'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';

export const TodoListEmpty = () => {
  return (
    <div {...stylex.props(styles.empty)}>
      <Text as='p' variant='body3' color='textTertiary' alignment='center'>
        리스트를 찾을 수 없어요
      </Text>
    </div>
  );
};

const styles = stylex.create({
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

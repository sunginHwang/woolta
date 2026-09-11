'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { Suspense } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCreateMemo } from '../_shared/hooks/useCreateMemo';
import { MemoListItems } from './components/MemoListItems';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingBlock: '1.6rem',
    paddingInline: '1.2rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingBottom: '1.2rem',
    paddingInline: '0.4rem',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    paddingBlock: '0.6rem',
    paddingInline: '1rem',
    borderRadius: '0.8rem',
    fontSize: '1.3rem',
    color: colorVars['--color-interactivePrimary'],
    backgroundColor: {
      default: colorVars['--color-bgSurfaceSecondary'],
      ':hover': colorVars['--color-borderSubtle'],
    },
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export const MemoList = () => {
  const { createMemo, isCreating } = useCreateMemo();

  const handleCreateClick = () => {
    createMemo();
  };

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.header)}>
        <Text as='h2' variant='title5Bold' color='textPrimary'>
          메모
        </Text>
        <button
          type='button'
          title='새 메모'
          disabled={isCreating}
          {...stylex.props(styles.createButton)}
          onClick={handleCreateClick}
        >
          <FiPlus size={16} />새 메모
        </button>
      </div>
      <Suspense
        fallback={
          <div {...stylex.props(styles.loading)}>
            <Text as='p' variant='body3' color='textTertiary' alignment='center'>
              메모를 불러오는 중이에요
            </Text>
          </div>
        }
      >
        <MemoListItems />
      </Suspense>
    </div>
  );
};

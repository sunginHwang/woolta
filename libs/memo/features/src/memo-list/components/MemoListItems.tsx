'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { MouseEvent } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useDeleteMemo } from '../../_shared/hooks/useDeleteMemo';
import { useMemoList } from '../../_shared/hooks/useMemoList';
import { useMemoStore } from '../../_shared/stores/useMemoStore';
import { formatMemoDate } from '../../_shared/utils/formatMemoDate';

const styles = stylex.create({
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    overflowY: 'auto',
  },
  // CSS 변수로 자손 opacity 토글 — Item hover 시 RemoveButton 이 나타남
  item: {
    display: 'flex',
    alignItems: 'center',
    paddingBlock: '1rem',
    paddingInline: '1.2rem',
    borderRadius: '0.8rem',
    cursor: 'pointer',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    '--memo-remove-opacity': {
      default: '0',
      ':hover': '1',
    },
  },
  itemActive: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  itemBody: {
    flex: 1,
    minWidth: 0,
  },
  // opacity 는 CSS 변수로 제어 — 부모 item hover 시 '1' 로 전환됨
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.4rem',
    height: '2.4rem',
    borderRadius: '0.6rem',
    opacity: 'var(--memo-remove-opacity)' as unknown as number,
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-statusError'],
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-borderSubtle'],
    },
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

/**
 * 메모 목록 본문. suspense 조회를 쓰므로 상위가 <Suspense> 로 감싼다.
 * 헤더(새 메모 버튼)는 로딩 중에도 눌려야 해서 경계 바깥(MemoList)에 둔다.
 */
export const MemoListItems = () => {
  const memoList = useMemoList();
  const selectedMemoId = useMemoStore((state) => state.selectedMemoId);
  const selectMemo = useMemoStore((state) => state.selectMemo);
  const { deleteMemo } = useDeleteMemo();

  const handleRemoveClick = (id: string) => (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();

    if (window.confirm('메모를 삭제할까요?')) {
      deleteMemo(id);
    }
  };

  if (memoList.length === 0) {
    return (
      <div {...stylex.props(styles.empty)}>
        <Text as='p' variant='body3' color='textTertiary' alignment='center'>
          메모가 없어요
          <br />새 메모를 만들어보세요
        </Text>
      </div>
    );
  }

  return (
    <ul {...stylex.props(styles.items)}>
      {memoList.map((memo) => (
        <li
          key={memo.id}
          {...stylex.props(styles.item, memo.id === selectedMemoId && styles.itemActive)}
          onClick={() => selectMemo(memo.id)}
        >
          <div {...stylex.props(styles.itemBody)}>
            <Text as='p' variant='body3' color={memo.id === selectedMemoId ? 'textPrimary' : 'textSecondary'}>
              {memo.title || '제목 없음'}
            </Text>
            <Text as='p' variant='small3Regular' color='textTertiary' mt={4}>
              {formatMemoDate(memo.updatedAt)}
            </Text>
          </div>
          <span role='button' title='삭제' {...stylex.props(styles.removeButton)} onClick={handleRemoveClick(memo.id)}>
            <FiTrash2 size={14} />
          </span>
        </li>
      ))}
    </ul>
  );
};

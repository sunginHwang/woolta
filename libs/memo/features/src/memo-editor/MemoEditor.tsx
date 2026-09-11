'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { type ChangeEvent, Suspense, useState } from 'react';
import { useMemoDetail } from '../_shared/hooks/useMemoDetail';
import { useMemoStore } from '../_shared/stores/useMemoStore';
import type { Memo } from '../_shared/types';
import { formatMemoDate } from '../_shared/utils/formatMemoDate';
import { useMemoAutoSave } from './hooks/useMemoAutoSave';
import { TiptapEditor } from './TiptapEditor';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '86rem',
    minHeight: '100%',
    marginBlock: 0,
    marginInline: 'auto',
    paddingBlock: '3.2rem',
    paddingInline: '4rem',
  },
  titleInput: {
    borderWidth: 0,
    borderStyle: 'none',
    background: 'transparent',
    fontSize: '2.8rem',
    fontWeight: 700,
    color: colorVars['--color-textPrimary'],
    '::placeholder': {
      color: colorVars['--color-textDisabled'],
    },
  },
  dateRow: {
    display: 'flex',
    gap: '1.6rem',
    marginTop: '0.8rem',
    marginBottom: '2rem',
    marginInline: 0,
    paddingBottom: '1.6rem',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

export const MemoEditor = () => {
  const selectedMemoId = useMemoStore((state) => state.selectedMemoId);

  if (selectedMemoId === null) {
    return (
      <div {...stylex.props(styles.empty)}>
        <Text as='p' variant='title5Bold' color='textSecondary' alignment='center'>
          메모를 선택하세요
        </Text>
        <Text as='p' variant='body3' color='textTertiary' alignment='center' mt={8}>
          좌측 목록에서 메모를 선택하거나 새 메모를 만들어보세요
        </Text>
      </div>
    );
  }

  // suspense 조회는 끌 수 없으므로 id 가 있을 때만 마운트한다.
  // key 로 경계를 갈아끼워 메모를 바꿀 때마다 fallback 을 다시 보여준다.
  return (
    <Suspense
      key={selectedMemoId}
      fallback={
        <div {...stylex.props(styles.empty)}>
          <Text as='p' variant='body3' color='textTertiary' alignment='center'>
            메모를 불러오는 중이에요
          </Text>
        </div>
      }
    >
      <SelectedMemoEditor memoId={selectedMemoId} />
    </Suspense>
  );
};

interface SelectedProps {
  /** 선택된 메모 id */
  memoId: string;
}

const SelectedMemoEditor = ({ memoId }: SelectedProps) => {
  const memo = useMemoDetail(memoId);

  if (!memo) {
    return (
      <div {...stylex.props(styles.empty)}>
        <Text as='p' variant='title5Bold' color='textSecondary' alignment='center'>
          메모를 찾을 수 없어요
        </Text>
        <Text as='p' variant='body3' color='textTertiary' alignment='center' mt={8}>
          이미 삭제된 메모일 수 있어요
        </Text>
      </div>
    );
  }

  return <MemoEditorContent memo={memo} />;
};

interface ContentProps {
  /** 편집 대상 메모 */
  memo: Memo;
}

const MemoEditorContent = ({ memo }: ContentProps) => {
  const [title, setTitle] = useState(memo.title);
  const { saveTitle, saveContent } = useMemoAutoSave(memo.id);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    saveTitle(e.target.value);
  };

  return (
    <div {...stylex.props(styles.container)}>
      <input {...stylex.props(styles.titleInput)} placeholder='제목 없음' value={title} onChange={handleTitleChange} />
      <div {...stylex.props(styles.dateRow)}>
        <Text variant='small3Regular' color='textTertiary'>
          작성일 {formatMemoDate(memo.createdAt)}
        </Text>
        <Text variant='small3Regular' color='textTertiary'>
          수정일 {formatMemoDate(memo.updatedAt)}
        </Text>
      </div>
      <TiptapEditor initialContent={memo.content} onChangeContent={saveContent} />
    </div>
  );
};

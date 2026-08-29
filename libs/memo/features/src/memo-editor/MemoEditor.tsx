'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { ChangeEvent, useState } from 'react';
import { useSelectedMemo } from '../_shared/hooks/useSelectedMemo';
import { Memo } from '../_shared/types';
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
  const selectedMemo = useSelectedMemo();

  if (!selectedMemo) {
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

  return <MemoEditorContent key={selectedMemo.id} memo={selectedMemo} />;
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

'use client';

import { Text } from '@wds';
import { ChangeEvent, useState } from 'react';
import { styled } from 'styled-components';
import { useSelectedMemo } from '../_shared/hooks/useSelectedMemo';
import { Memo } from '../_shared/types';
import { formatMemoDate } from '../_shared/utils/formatMemoDate';
import { useMemoAutoSave } from './hooks/useMemoAutoSave';
import { TiptapEditor } from './TiptapEditor';

export const MemoEditor = () => {
  const selectedMemo = useSelectedMemo();

  if (!selectedMemo) {
    return (
      <SC.Empty>
        <Text as='p' variant='title5Bold' color='textSecondary' alignment='center'>
          메모를 선택하세요
        </Text>
        <Text as='p' variant='body3' color='textTertiary' alignment='center' mt={8}>
          좌측 목록에서 메모를 선택하거나 새 메모를 만들어보세요
        </Text>
      </SC.Empty>
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
    <SC.Container>
      <SC.TitleInput placeholder='제목 없음' value={title} onChange={handleTitleChange} />
      <SC.DateRow>
        <Text variant='small3Regular' color='textTertiary'>
          작성일 {formatMemoDate(memo.createdAt)}
        </Text>
        <Text variant='small3Regular' color='textTertiary'>
          수정일 {formatMemoDate(memo.updatedAt)}
        </Text>
      </SC.DateRow>
      <TiptapEditor initialContent={memo.content} onChangeContent={saveContent} />
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    max-width: 86rem;
    min-height: 100%;
    margin: 0 auto;
    padding: 3.2rem 4rem;
  `,
  TitleInput: styled.input`
    border: 0;
    background: transparent;
    font-size: 2.8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};

    &::placeholder {
      color: ${({ theme }) => theme.colors.textDisabled};
    }
  `,
  DateRow: styled.div`
    display: flex;
    gap: 1.6rem;
    margin: 0.8rem 0 2rem;
    padding-bottom: 1.6rem;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.borderSubtle};
  `,
  Empty: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  `,
};

'use client';

import { Text } from '@wds';
import { MouseEvent } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { styled } from 'styled-components';
import { useMemoList } from '../_shared/hooks/useMemoList';
import { useMemoStore } from '../_shared/stores/useMemoStore';
import { formatMemoDate } from '../_shared/utils/formatMemoDate';

export const MemoList = () => {
  const memoList = useMemoList();
  const selectedMemoId = useMemoStore((state) => state.selectedMemoId);
  const createMemo = useMemoStore((state) => state.createMemo);
  const removeMemo = useMemoStore((state) => state.removeMemo);
  const selectMemo = useMemoStore((state) => state.selectMemo);

  const handleCreateClick = () => {
    createMemo();
  };

  const handleRemoveClick = (id: string) => (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();

    if (window.confirm('메모를 삭제할까요?')) {
      removeMemo(id);
    }
  };

  return (
    <SC.Container>
      <SC.Header>
        <Text as='h2' variant='title5Bold' color='textPrimary'>
          메모
        </Text>
        <SC.CreateButton type='button' title='새 메모' onClick={handleCreateClick}>
          <FiPlus size={16} />새 메모
        </SC.CreateButton>
      </SC.Header>
      {memoList.length === 0 ? (
        <SC.Empty>
          <Text as='p' variant='body3' color='textTertiary' alignment='center'>
            메모가 없어요
            <br />새 메모를 만들어보세요
          </Text>
        </SC.Empty>
      ) : (
        <SC.Items>
          {memoList.map((memo) => (
            <SC.Item key={memo.id} $isActive={memo.id === selectedMemoId} onClick={() => selectMemo(memo.id)}>
              <SC.ItemBody>
                <Text as='p' variant='body3' color={memo.id === selectedMemoId ? 'textPrimary' : 'textSecondary'}>
                  {memo.title || '제목 없음'}
                </Text>
                <Text as='p' variant='small3Regular' color='textTertiary' mt={4}>
                  {formatMemoDate(memo.updatedAt)}
                </Text>
              </SC.ItemBody>
              <SC.RemoveButton title='삭제' onClick={handleRemoveClick(memo.id)}>
                <FiTrash2 size={14} />
              </SC.RemoveButton>
            </SC.Item>
          ))}
        </SC.Items>
      )}
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.6rem 1.2rem;
  `,
  Header: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.4rem 1.2rem;
  `,
  CreateButton: styled.button`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1rem;
    border-radius: 0.8rem;
    font-size: 1.3rem;
    color: ${({ theme }) => theme.colors.interactivePrimary};
    background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.borderSubtle};
    }
  `,
  Items: styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    overflow-y: auto;
  `,
  Item: styled.li<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    padding: 1rem 1.2rem;
    border-radius: 0.8rem;
    cursor: pointer;
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : 'transparent')};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }

    &:hover .memo-remove {
      opacity: 1;
    }
  `,
  ItemBody: styled.div`
    flex: 1;
    min-width: 0;
  `,
  RemoveButton: styled.span.attrs({ className: 'memo-remove', role: 'button' })`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 0.6rem;
    opacity: 0;
    color: ${({ theme }) => theme.colors.textTertiary};

    &:hover {
      color: ${({ theme }) => theme.colors.statusError};
      background-color: ${({ theme }) => theme.colors.borderSubtle};
    }
  `,
  Empty: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  `,
};

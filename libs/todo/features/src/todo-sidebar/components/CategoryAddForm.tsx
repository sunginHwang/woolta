'use client';

import { useRouter } from 'next/navigation';
import { KeyboardEvent, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { styled } from 'styled-components';
import { getCategoryListKey, getTodoListHref } from '../../_shared/routes';
import { useTodoStore } from '../../_shared/stores/useTodoStore';

/** 사이드바 하단 카테고리 추가 폼. 버튼 클릭 시 인라인 입력으로 전환된다. */
export const CategoryAddForm = () => {
  const router = useRouter();
  const addCategory = useTodoStore((state) => state.addCategory);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');

  const submit = () => {
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      const categoryId = addCategory(trimmedName);
      router.push(getTodoListHref(getCategoryListKey(categoryId)));
    }
    setName('');
    setIsAdding(false);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === 'Enter') {
      submit();
    }
    if (e.key === 'Escape') {
      setName('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <SC.Input
        autoFocus
        placeholder='리스트 이름'
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={submit}
        onKeyDown={handleInputKeyDown}
      />
    );
  }

  return (
    <SC.AddButton type='button' onClick={() => setIsAdding(true)}>
      <FiPlus size={14} />
      리스트 추가
    </SC.AddButton>
  );
};

const SC = {
  AddButton: styled.button`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
    padding: 0.7rem 1rem;
    border: none;
    border-radius: 0.8rem;
    background: none;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 1.3rem;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,
  Input: styled.input`
    width: 100%;
    padding: 0.7rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.interactivePrimary};
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.3rem;
    outline: none;
  `,
};

'use client';

import { useRouter } from 'next/navigation';
import { KeyboardEvent, MouseEvent, useState } from 'react';
import { FiEdit2, FiHash, FiTrash2 } from 'react-icons/fi';
import { styled } from 'styled-components';
import { ARTICLES_BASE_PATH, getArticleListHref, getCategoryListKey, isArticleListActive } from '../../../_shared/routes';
import { useArticleStore } from '../../../_shared/stores/useArticleStore';
import { ArticleCategory } from '../../../_shared/types';
import { SidebarItem } from './SidebarItem';

interface Props {
  /** 카테고리 정보 */
  category: ArticleCategory;
  /** 뱃지에 표시할 아티클 개수 */
  count: number;
  /** 현재 경로 */
  pathname: string;
}

/** 사이드바 카테고리 항목. hover 시 이름 변경/삭제, 편집 모드 시 인라인 입력을 제공한다. */
export const CategoryItem = ({ category, count, pathname }: Props) => {
  const router = useRouter();
  const updateCategory = useArticleStore((state) => state.updateCategory);
  const removeCategory = useArticleStore((state) => state.removeCategory);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);

  const listKey = getCategoryListKey(category.id);
  const isActive = isArticleListActive(listKey, pathname);

  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditName(category.name);
    setIsEditing(true);
  };

  const handleRemoveClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!window.confirm(`'${category.name}' 카테고리를 삭제할까요?\n소속 아티클도 함께 삭제됩니다.`)) {
      return;
    }

    removeCategory(category.id);
    if (isActive) {
      router.push(ARTICLES_BASE_PATH);
    }
  };

  const submitEdit = () => {
    const name = editName.trim();
    if (name.length > 0 && name !== category.name) {
      updateCategory(category.id, name);
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === 'Enter') {
      submitEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <SC.EditRow>
        <FiHash size={14} />
        <SC.EditInput
          autoFocus
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={submitEdit}
          onKeyDown={handleEditKeyDown}
        />
      </SC.EditRow>
    );
  }

  return (
    <SidebarItem
      href={getArticleListHref(listKey)}
      icon={<FiHash size={14} />}
      label={category.name}
      count={count}
      isActive={isActive}
      hoverActions={
        <>
          <SC.ActionButton type='button' title='이름 변경' onClick={handleEditClick}>
            <FiEdit2 size={12} />
          </SC.ActionButton>
          <SC.ActionButton type='button' title='삭제' onClick={handleRemoveClick}>
            <FiTrash2 size={12} />
          </SC.ActionButton>
        </>
      }
    />
  );
};

const SC = {
  EditRow: styled.li`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.4rem 1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  `,
  EditInput: styled.input`
    flex: 1;
    min-width: 0;
    padding: 0.3rem 0.6rem;
    border: 1px solid ${({ theme }) => theme.colors.interactivePrimary};
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.3rem;
    outline: none;
  `,
  ActionButton: styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border: none;
    border-radius: 0.4rem;
    background: none;
    color: ${({ theme }) => theme.colors.textTertiary};
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.statusError};
    }
  `,
};

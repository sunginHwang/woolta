'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useRouter } from 'next/navigation';
import { type KeyboardEvent, type MouseEvent, useState } from 'react';
import { FiEdit2, FiHash, FiTrash2 } from 'react-icons/fi';
import {
  ARTICLES_BASE_PATH,
  getArticleListHref,
  getCategoryListKey,
  isArticleListActive,
} from '../../../_shared/routes';
import { useArticleStore } from '../../../_shared/stores/useArticleStore';
import type { ArticleCategory } from '../../../_shared/types';
import { SidebarItem } from './SidebarItem';

interface Props {
  /** 카테고리 정보 */
  category: ArticleCategory;
  /** 뱃지에 표시할 아티클 개수 */
  count: number;
  /** 현재 경로 */
  pathname: string;
}

const styles = stylex.create({
  editRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    paddingBlock: '0.4rem',
    paddingInline: '1rem',
    color: colorVars['--color-textSecondary'],
  },
  editInput: {
    flex: 1,
    minWidth: 0,
    paddingBlock: '0.3rem',
    paddingInline: '0.6rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-interactivePrimary'],
    borderRadius: '0.6rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.3rem',
    outline: 'none',
  },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.2rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.4rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-statusError'],
    },
    cursor: 'pointer',
  },
});

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
      <li {...stylex.props(styles.editRow)}>
        <FiHash size={14} />
        <input
          {...stylex.props(styles.editInput)}
          autoFocus
          value={editName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
          onBlur={submitEdit}
          onKeyDown={handleEditKeyDown}
        />
      </li>
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
          <button type='button' {...stylex.props(styles.actionButton)} title='이름 변경' onClick={handleEditClick}>
            <FiEdit2 size={12} />
          </button>
          <button type='button' {...stylex.props(styles.actionButton)} title='삭제' onClick={handleRemoveClick}>
            <FiTrash2 size={12} />
          </button>
        </>
      }
    />
  );
};

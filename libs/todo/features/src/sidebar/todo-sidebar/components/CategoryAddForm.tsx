'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useRouter } from 'next/navigation';
import { type KeyboardEvent, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { getCategoryListKey, getTodoListHref } from '../../../_shared/routes';
import { useTodoStore } from '../../../_shared/stores/useTodoStore';

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
      <input
        autoFocus
        placeholder='리스트 이름'
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        onBlur={submit}
        onKeyDown={handleInputKeyDown}
        {...stylex.props(styles.input)}
      />
    );
  }

  return (
    <button type='button' onClick={() => setIsAdding(true)} {...stylex.props(styles.addButton)}>
      <FiPlus size={14} />
      리스트 추가
    </button>
  );
};

const styles = stylex.create({
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    width: '100%',
    paddingBlock: '0.7rem',
    paddingInline: '1rem',
    borderWidth: 0,
    borderRadius: '0.8rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    fontSize: '1.3rem',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    paddingBlock: '0.7rem',
    paddingInline: '1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-interactivePrimary'],
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.3rem',
    outline: 'none',
  },
});

'use client';

import { FiInbox } from 'react-icons/fi';
import { styled } from 'styled-components';
import { useCategoryList } from '../../../_shared/hooks/useCategoryList';

interface Props {
  /** 현재 카테고리 id (null = 기본함) */
  categoryId: string | null;
  /** 카테고리 변경 시 호출 */
  onCategoryChange: (categoryId: string | null) => void;
}

/** 상세 패널 하단의 카테고리 선택 */
export const CategorySelect = ({ categoryId, onCategoryChange }: Props) => {
  const categoryList = useCategoryList();

  return (
    <SC.Field>
      <FiInbox size={13} />
      <SC.Select
        value={categoryId ?? ''}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value.length > 0 ? e.target.value : null)}
      >
        <option value=''>기본함</option>
        {categoryList.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </SC.Select>
    </SC.Field>
  );
};

const SC = {
  Field: styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.2rem 0.4rem;
    border-radius: 0.6rem;
    color: ${({ theme }) => theme.colors.textTertiary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
  Select: styled.select`
    max-width: 16rem;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.2rem;
    cursor: pointer;
    outline: none;
  `,
};

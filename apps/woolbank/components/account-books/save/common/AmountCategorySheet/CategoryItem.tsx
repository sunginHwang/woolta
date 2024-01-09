import styled from '@emotion/styled';
import React, { FC } from 'react';

interface Props {
  accountBookCategory: IAccountBookCategory;
  isActive: boolean;
  onSelect: (accountBookCategory: IAccountBookCategory) => void;
}

/**
 * 가계부 카테고리 선택 영역 Item
 * @component
 */

const CategoryItem: FC<Props> = ({ accountBookCategory, isActive, onSelect }) => {
  const handleCategoryClick = () => {
    onSelect(accountBookCategory);
  };

  return (
    <SC.AccountBookCategoryItem isActive={isActive} onClick={handleCategoryClick}>
      {accountBookCategory.name}
    </SC.AccountBookCategoryItem>
  );
};

const SC = {
  AccountBookCategoryItem: styled.div<{ isActive: boolean }>`
    height: 6rem;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.gray800};
    background-color: ${({ theme, isActive }) => (isActive ? theme.colors.gray100 : theme.colors.white)};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.8rem;
  `,
};

export default CategoryItem;
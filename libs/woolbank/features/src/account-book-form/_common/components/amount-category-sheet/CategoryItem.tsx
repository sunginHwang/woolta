'use client';

import { Text } from '@wds';
import { styled } from 'styled-components';
import { AccountBookCategory } from '../../hooks/useAccountBookCategories';

interface Props {
  accountBookCategory: AccountBookCategory;
  isActive: boolean;
  onSelect: (accountBookCategory: AccountBookCategory) => void;
}

/**
 * 가계부 카테고리 선택 영역 Item
 * @component
 */
export const CategoryItem = ({ accountBookCategory, isActive, onSelect }: Props) => {
  const handleCategoryClick = () => {
    onSelect(accountBookCategory);
  };

  return (
    <SC.AccountBookCategoryItem $isActive={isActive} onClick={handleCategoryClick}>
      <img src={accountBookCategory.accountBookCategoryImage.imageUrl} alt='icon-image' />
      <Text variant='small1Regular' color='textPrimary' mt={5}>
        {accountBookCategory.name}
      </Text>
    </SC.AccountBookCategoryItem>
  );
};

const SC = {
  AccountBookCategoryItem: styled.div<{ $isActive: boolean }>`
    img {
      width: 25px;
      height: 25px;
    }
    height: 6rem;
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : theme.colors.bgSurface)};
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 0.8rem;
  `,
};
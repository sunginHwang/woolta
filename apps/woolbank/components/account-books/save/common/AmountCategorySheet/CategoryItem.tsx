import { Text } from '@wds';
import { FC } from 'react';
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

const CategoryItem: FC<Props> = ({ accountBookCategory, isActive, onSelect }) => {
  const handleCategoryClick = () => {
    onSelect(accountBookCategory);
  };

  return (
    <SC.AccountBookCategoryItem $isActive={isActive} onClick={handleCategoryClick}>
      <img src={accountBookCategory.accountBookCategoryImage.imageUrl} alt='icon-image' />
      <Text variant='small1Regular' color='gray800' mt={5}>
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
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.gray100 : theme.colors.white)};
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 0.8rem;
  `,
};

export default CategoryItem;

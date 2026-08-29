'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { AccountBookCategory } from '../../hooks/useAccountBookCategories';

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
    <div
      {...stylex.props(styles.item, isActive ? styles.itemActive : styles.itemInactive)}
      onClick={handleCategoryClick}
    >
      <img {...stylex.props(styles.img)} src={accountBookCategory.accountBookCategoryImage.imageUrl} alt='icon-image' />
      <Text variant='small1Regular' color='textPrimary' mt={5}>
        {accountBookCategory.name}
      </Text>
    </div>
  );
};

const styles = stylex.create({
  item: {
    height: '6rem',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '0.8rem',
  },
  itemActive: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  itemInactive: {
    backgroundColor: colorVars['--color-bgSurface'],
  },
  img: {
    width: '25px',
    height: '25px',
  },
});

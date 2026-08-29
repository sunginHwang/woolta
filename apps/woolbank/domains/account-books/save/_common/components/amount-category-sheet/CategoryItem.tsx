import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { AccountBookCategory } from '../../hooks/useAccountBookCategories';

interface Props {
  accountBookCategory: AccountBookCategory;
  isActive: boolean;
  onSelect: (accountBookCategory: AccountBookCategory) => void;
}

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
    backgroundColor: colorVars['--color-gray100'],
  },
  itemInactive: {
    backgroundColor: colorVars['--color-white'],
  },
  icon: {
    width: '25px',
    height: '25px',
  },
});

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
      <img
        src={accountBookCategory.accountBookCategoryImage.imageUrl}
        alt='icon-image'
        {...stylex.props(styles.icon)}
      />
      <Text variant='small1Regular' color='gray800' mt={5}>
        {accountBookCategory.name}
      </Text>
    </div>
  );
};

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import { memo } from 'react';
import type { AccountBook } from '../../_common/hooks/useAccountBookList';

interface Props {
  accountBook: AccountBook;
}

const styles = stylex.create({
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.8rem',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconWrapper: {
    width: '30px',
    height: '30px',
    backgroundColor: colorVars['--color-red150'],
    borderRadius: '30px',
    marginRight: '10px',
  },
  iconImg: {
    width: '20px',
    height: '20px',
    margin: '5px',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  category: {
    width: '7.5rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginRight: '1rem',
  },
  price: {
    whiteSpace: 'nowrap',
  },
});

/**
 * 가계부 리스트 아이템
 * @component
 */
const Item = ({ accountBook }: Props) => {
  const { category, title, amount, isRegularExpenditure, type, id } = accountBook;

  const isIncomeType = type === 'income';
  const displayAmount = isIncomeType ? amount : -amount;
  const iconImage = category.accountBookCategoryImage.imageUrl;

  return (
    <Link href={`/account-books/save?id=${id}`}>
      <div {...stylex.props(styles.item)}>
        <div {...stylex.props(styles.left)}>
          <div {...stylex.props(styles.iconWrapper)}>
            <img src={iconImage} alt='' {...stylex.props(styles.iconImg)} />
          </div>
          <div>
            <Text variant='small1Regular' color='grayPrimary' as='p'>
              {title}
            </Text>
            <div {...stylex.props(styles.info)}>
              <Text variant='small3Regular' color='gray600' as='p' xstyle={styles.category}>
                {category.name} {isRegularExpenditure && ' | 매월'}
              </Text>
            </div>
          </div>
        </div>
        <Text variant='body3' color={isIncomeType ? 'red500' : 'gray600'} as='p' xstyle={styles.price}>
          {displayAmount.toLocaleString('ko-KR')}원
        </Text>
      </div>
    </Link>
  );
};

export default memo(Item);

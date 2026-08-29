'use client';

import { useIsDashboardHost } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { memo, type ReactNode } from 'react';
import type { AccountBook } from '../_shared/hooks/useAccountBookListQuery';
import { useWoolbankRoutes } from '../_shared/routes/context';
import { selectedAccountBookIdAtom } from '../_shared/stores/selectedAccountBook';

interface Props {
  accountBook: AccountBook;
}

/**
 * 가계부 리스트 아이템
 * - 원본 woolbank 앱: 클릭 시 작성 화면으로 라우트 이동 (기존 동작)
 * - 대시보드(woolta): 클릭 시 우측 패널에서 상세가 열리도록 선택 상태만 변경
 * @component
 */
const Item = ({ accountBook }: Props) => {
  const routes = useWoolbankRoutes();
  const isDashboardHost = useIsDashboardHost();
  const [selectedId, setSelectedId] = useAtom(selectedAccountBookIdAtom);
  const { category, title, amount, isRegularExpenditure, type, id } = accountBook;

  const isIncomeType = type === 'income';
  const displayAmount = isIncomeType ? amount : -amount;
  const iconImage = category.accountBookCategoryImage.imageUrl;

  const content: ReactNode = (
    <>
      <div {...stylex.props(styles.left)}>
        <div {...stylex.props(styles.iconWrapper)}>
          <img {...stylex.props(styles.icon)} src={iconImage} alt='' />
        </div>
        <div>
          <Text variant='small1Regular' color='grayPrimary' as='p'>
            {title}
          </Text>
          <div {...stylex.props(styles.info)}>
            <Text xstyle={styles.category} variant='small3Regular' color='textTertiary' as='p'>
              {category.name} {isRegularExpenditure && ' | 매월'}
            </Text>
          </div>
        </div>
      </div>
      <Text xstyle={styles.price} variant='body3' color={isIncomeType ? 'statusError' : 'textTertiary'} as='p'>
        {displayAmount.toLocaleString('ko-KR')}원
      </Text>
    </>
  );

  if (isDashboardHost) {
    return (
      <button
        type='button'
        {...stylex.props(styles.item, selectedId === id && styles.itemActive)}
        onClick={() => setSelectedId(id)}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={`${routes.save}?id=${id}`}>
      <div {...stylex.props(styles.item)}>{content}</div>
    </Link>
  );
};

export default memo(Item);

const styles = stylex.create({
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
  icon: {
    width: '20px',
    height: '20px',
    margin: '5px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '1.8rem',
    textAlign: 'left',
    borderRadius: '0.8rem',
    backgroundColor: 'transparent',
  },
  itemActive: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
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

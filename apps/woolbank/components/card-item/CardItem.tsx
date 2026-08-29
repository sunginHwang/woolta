import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  useSideMargin?: boolean;
}

/**
 * 공통 카드 아이템 영역
 * @component
 */

export const CardItem = ({ children, useSideMargin = false }: Props) => {
  return (
    <div {...stylex.props(styles.cardItem, useSideMargin && styles.cardItemWithMargin)}>{children}</div>
  );
};

const styles = stylex.create({
  cardItem: {
    paddingBlock: '2rem',
    paddingInline: '2rem',
    backgroundColor: colorVars['--color-white'],
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1.6rem',
    borderRadius: '1.2rem',
    boxShadow: 'rgb(220, 220, 233) 0.1rem 0.3rem 1rem 0.3rem',
  },
  cardItemWithMargin: {
    marginInline: '2rem',
  },
});

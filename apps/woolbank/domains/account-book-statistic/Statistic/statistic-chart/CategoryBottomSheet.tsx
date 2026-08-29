import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import type { FC } from 'react';
import { BottomSheet } from '../../../../components/bottom-sheet/BottomSheet';
import type { AccountBookStatisticCategoryItem } from '../_common/hooks/useAccountStatisticListQuery';

interface Props {
  title: string;
  titleColor: string;
  list: AccountBookStatisticCategoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

const dynamicStyles = stylex.create({
  titleColor: (color: string) => ({ color }),
});

const styles = stylex.create({
  categoryBottomSheet: {
    paddingBlock: 0,
    paddingInline: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
  },
  list: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    color: colorVars['--color-gray700'],
  },
  itemLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: '1.4rem',
  },
  itemDate: {
    fontSize: '1.1rem',
    color: colorVars['--color-gray150'],
  },
  itemAmount: {
    fontWeight: 'bold',
    fontSize: '1.6rem',
  },
});

/**
 * 가계부 통계 - 통계 bottomSheet
 * @component
 */
const CategoryBottomSheet: FC<Props> = ({ isOpen, title, titleColor, list, onClose }) => {
  return (
    <BottomSheet.Snap useDeem isOpen={isOpen} onClose={onClose} snapPhase={1}>
      <div {...stylex.props(styles.categoryBottomSheet)}>
        <h3 {...stylex.props(styles.title, dynamicStyles.titleColor(titleColor))}>{title}</h3>
        <ul {...stylex.props(styles.list)}>
          {list.map(({ title, amount, registerDateTime }, key) => (
            <li {...stylex.props(styles.item)} key={key}>
              <div {...stylex.props(styles.itemLeft)}>
                <p {...stylex.props(styles.itemTitle)}>{title}</p>
                <span {...stylex.props(styles.itemDate)}>{registerDateTime.format('MM-DD~')}</span>
              </div>
              <span {...stylex.props(styles.itemAmount)}>{amount.toLocaleString('ko-KR')}원</span>
            </li>
          ))}
        </ul>
      </div>
    </BottomSheet.Snap>
  );
};

export default CategoryBottomSheet;

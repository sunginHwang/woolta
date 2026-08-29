import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { Dayjs } from 'dayjs';
import { BottomSheet } from '../../../../../components/bottom-sheet/BottomSheet';

export interface AccountBookSheetItem {
  title: string;
  amount: number;
  registerDateTime: Dayjs;
  iconImageUrl?: string;
}

interface Props {
  title: string;
  titleColor: string;
  list: AccountBookSheetItem[];
  isOpen: boolean;
  onClose: () => void;
}

const dynamicStyles = stylex.create({
  titleColor: (color: string) => ({ color }),
});

const styles = stylex.create({
  categoryBottomSheet: {
    paddingTop: '2rem',
    paddingInline: '2rem',
    paddingBottom: 0,
  },
  title: {
    textAlign: 'left',
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: 500,
    marginBottom: '1.5rem',
  },
  list: {
    marginBottom: '2rem',
    maxHeight: '40rem',
    overflowY: 'scroll',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
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
});

export const AccountBookBottomSheet = ({ isOpen, title, titleColor, list, onClose }: Props) => {
  return (
    <BottomSheet visible={isOpen} oncloseModal={onClose} contentHeight={600}>
      <div {...stylex.props(styles.categoryBottomSheet)}>
        <h3 {...stylex.props(styles.title, dynamicStyles.titleColor(titleColor))}>{title}</h3>
        <ul {...stylex.props(styles.list)}>
          {list.map(({ title, amount, iconImageUrl, registerDateTime }, key) => (
            <li {...stylex.props(styles.item)} key={key}>
              <div {...stylex.props(styles.itemLeft)}>
                {iconImageUrl && (
                  <div {...stylex.props(styles.iconWrapper)}>
                    <img src={iconImageUrl} alt={`${title}_아이콘`} {...stylex.props(styles.iconImg)} />
                  </div>
                )}
                <div {...stylex.props(styles.itemInfo)}>
                  <Text variant='body3' color='gray700'>
                    {title}
                  </Text>
                  <Text variant='small1Regular' color='gray400'>
                    {registerDateTime.format('MM-DD')}
                  </Text>
                </div>
              </div>
              <Text variant='body2' color='gray800'>
                {amount.toLocaleString('ko-KR')}원
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </BottomSheet>
  );
};

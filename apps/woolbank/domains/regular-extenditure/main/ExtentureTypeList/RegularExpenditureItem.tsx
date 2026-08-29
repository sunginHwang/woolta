import { useLongPress } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { FC } from 'react';
import { useConfirm } from '../../../../components/Confirm/ConfirmContext';
import { useToast } from '../../../../hooks/useToast';
import { getRemainDay } from '../../../../utils/date';
import { useRegularExtentureList } from '../hooks/useRegularExtentureList';
import type { RegularExpenditure } from '../hooks/useRegularExtentureListQuery';

interface Props {
  type: string;
  // 정기지출 아이템
  regularExpenditure: RegularExpenditure;
  hasDeleteAuth: boolean;
}

const styles = stylex.create({
  expenditureTypeItem: {
    marginTop: '1rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
    borderRadius: '1.8rem',
    boxShadow: '0 0.1rem 0.3rem 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  wrap: {
    width: 'auto',
    display: 'block',
    alignItems: 'center',
    height: '100%',
    paddingBlock: '1.2rem',
    paddingInline: '1.5rem',
    position: 'relative',
  },
  wrapInner: {
    display: 'inline-block',
  },
  content: {
    width: '100%',
    height: '100%',
    verticalAlign: 'bottom',
  },
  contentInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.3rem',
  },
  label: {
    fontSize: '1rem',
    backgroundColor: colorVars['--color-red050'],
    color: colorVars['--color-red500'],
    borderRadius: '1.3rem',
    paddingBlock: '0.1rem',
    paddingInline: '0.8rem',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
  },
});

/**
 * 정기 지출 리스트 -> 정기 지출 리스트 아이탬
 * @component
 */
const RegularExpenditureItem: FC<Props> = ({ type, hasDeleteAuth, regularExpenditure }) => {
  const { title, isAutoExpenditure, amount, id, regularExpenditureDay } = regularExpenditure;
  const { remainDayKo, remainDay } = getRemainDay(regularExpenditureDay, { completeMsg: '지출일' });
  const isAccentRemainDay = remainDay <= 3;

  const { onToast } = useToast();
  const { openConfirm, setConfirmLoading } = useConfirm();
  const longPressAction = useLongPress({
    ms: 700,
    onLongPress: async () => {
      if (!hasDeleteAuth) {
        return;
      }

      const isConfirm = await openConfirm({
        message: '정말 삭제하시겠습니까?',
        useAutoClose: false,
      });

      if (isConfirm) {
        setConfirmLoading(true);
        removeeRegularExtentureMutate.mutate(id, {
          onSuccess: () => {
            onToast('삭제 되었습니다.');
            removeRegularExtentureItem(type, id);
          },
          onError: () => onToast('다시 시도해 주세요.'),
          onSettled: () => setConfirmLoading(false),
        });
      }
    },
  });
  const { removeRegularExtentureItem, removeeRegularExtentureMutate } = useRegularExtentureList();

  return (
    <li {...stylex.props(styles.expenditureTypeItem)} {...longPressAction}>
      <div {...stylex.props(styles.wrap)}>
        <div {...stylex.props(styles.wrapInner)}>
          <div {...stylex.props(styles.content)}>
            <div {...stylex.props(styles.contentInner)}>
              <div {...stylex.props(styles.left)}>
                <div {...stylex.props(styles.title)}>
                  <Text variant='body3' color='black' as='p' mr={4}>
                    {title}
                  </Text>
                  {isAutoExpenditure && <label {...stylex.props(styles.label)}>정기이체</label>}
                </div>
                <Text variant='small1Regular' color='gray600'>
                  {amount.toLocaleString('ko-KR')}원
                </Text>
              </div>
              <Text
                variant={isAccentRemainDay ? 'body4Bold' : 'body4Regular'}
                color={isAccentRemainDay ? 'orange600' : 'gray600'}
                as='p'
              >
                {remainDayKo}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default RegularExpenditureItem;

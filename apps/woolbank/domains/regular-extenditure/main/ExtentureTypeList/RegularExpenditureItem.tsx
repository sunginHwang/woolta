import { useLongPress } from '@common';
import { Text } from '@wds';
import { FC } from 'react';
import { styled } from 'styled-components';
import { useToast } from '../../../../hooks/useToast';
import { getRemainDay } from '../../../../utils/date';
import { useConfirm } from '../../../../components/confirm/ConfirmContext';
import { useRegularExtentureList } from '../hooks/useRegularExtentureList';
import { RegularExpenditure } from '../hooks/useRegularExtentureListQuery';

interface Props {
  type: string;
  // 정기지출 아이템
  regularExpenditure: RegularExpenditure;
  hasDeleteAuth: boolean;
}

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
    <SC.ExpenditureTypeItem {...longPressAction}>
      <SC.Wrap>
        <SC.Content>
          <div>
            <SC.Left>
              <SC.Title>
                <Text variant='body3' color='black' as='p' mr={4}>
                  {title}
                </Text>
                {isAutoExpenditure && <label>정기이체</label>}
              </SC.Title>
              <Text variant='small1Regular' color='gray600'>
                {amount.toLocaleString('ko-KR')}원
              </Text>
            </SC.Left>
            <Text
              variant={isAccentRemainDay ? 'body4Bold' : 'body4Regular'}
              color={isAccentRemainDay ? 'orange600' : 'gray600'}
              as='p'
            >
              {remainDayKo}
            </Text>
          </div>
        </SC.Content>
      </SC.Wrap>
    </SC.ExpenditureTypeItem>
  );
};

export default RegularExpenditureItem;

const SC = {
  ExpenditureTypeItem: styled.li`
    margin-top: 1rem;
    border: 0.1rem solid #e6e6e6;
    border-radius: 1.8rem;
    box-shadow: 0 0.1rem 0.3rem 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    white-space: nowrap;
  `,
  Wrap: styled.div`
    width: auto;
    display: block;
    align-items: center;
    height: 100%;
    padding: 1.2rem 1.5rem;
    position: relative;

    > div {
      display: inline-block;
    }
  `,
  Content: styled.div`
    width: 100%;
    height: 100%;
    vertical-align: bottom;

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `,
  Title: styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.3rem;

    label {
      font-size: 1rem;
      background-color: ${({ theme }) => theme.colors.red050};
      color: ${({ theme }) => theme.colors.red500};
      border-radius: 1.3rem;
      padding: 0.1rem 0.8rem;
    }
  `,
  Left: styled.div`
    display: flex;
    flex-direction: column;
  `,
};

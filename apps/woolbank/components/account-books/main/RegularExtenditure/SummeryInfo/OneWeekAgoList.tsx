import styled from '@emotion/styled';
import { Text } from '@wds';
import { FC } from 'react';
import { getRemainDay } from '../../../../../utils/date';
import { RegularExpenditure } from '../hooks/useRegularExtentureList';

interface Props {
  // 일주일 안남은 정기지출 리스트
  regularExpenditureList: RegularExpenditure[];
}

/**
 * 정기 지출 리스트 -> 이주일 이내 지출 리스트
 * @component
 */

const OneWeekAgoList: FC<Props> = ({ regularExpenditureList }) => {
  const isEmptyList = regularExpenditureList.length === 0;

  return (
    <SC.ExpenditureType>
      <Text variant='body4Medium' color='grayPrimary' as='p' mb={15}>
        일주일 이내 이체 예정 지출 목록
      </Text>
      {isEmptyList && (
        <Text variant='small2Regular' color='gray600' as='p'>
          당분간 지출할 내역이 없어요. :)
        </Text>
      )}
      {!isEmptyList && (
        <SC.OneWeekAgoList>
          {regularExpenditureList.map((item) => {
            const { title, regularExpenditureDay } = item;
            const { remainDayKo } = getRemainDay(regularExpenditureDay, { completeMsg: '지출일' });

            return (
              <SC.OneWeekAgoItem key={item.id}>
                <SC.Content>
                  <Text variant='small1Regular' color='gray700' as='p' className='name'>
                    {title}
                  </Text>
                  <Text variant='small1Regular' color='orangePrimary' alignment='center' mt={3}>
                    {remainDayKo}
                  </Text>
                </SC.Content>
              </SC.OneWeekAgoItem>
            );
          })}
        </SC.OneWeekAgoList>
      )}
    </SC.ExpenditureType>
  );
};

const SC = {
  ExpenditureType: styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;

    .empty {
      padding: 1.1rem 1.2rem;
    }
  `,
  OneWeekAgoList: styled.ul`
    white-space: nowrap;
    overflow: auto;
  `,
  OneWeekAgoItem: styled.li`
    margin-right: 1.5rem;
    display: inline-block;
  `,
  Content: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 1.3rem;
    padding: 0.5rem 1.2rem;
    max-width: 7.2rem;

    background-color: ${({ theme }) => theme.colors.gray150};

    .name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      max-width: 7rem;
    }
  `,
};

export default OneWeekAgoList;

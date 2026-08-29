import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { FC } from 'react';
import { getRemainDay } from '../../../../utils/date';
import type { RegularExpenditure } from '../hooks/useRegularExtentureListQuery';

interface Props {
  // 일주일 안남은 정기지출 리스트
  regularExpenditureList: RegularExpenditure[];
}

const styles = stylex.create({
  expenditureType: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '2rem',
  },
  oneWeekAgoList: {
    whiteSpace: 'nowrap',
    overflowX: 'auto',
  },
  oneWeekAgoItem: {
    marginRight: '1.5rem',
    display: 'inline-block',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '1.3rem',
    paddingBlock: '0.5rem',
    paddingInline: '1.2rem',
    maxWidth: '7.2rem',
    backgroundColor: colorVars['--color-gray150'],
  },
  nameText: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '7rem',
  },
});

/**
 * 정기 지출 리스트 -> 이주일 이내 지출 리스트
 * @component
 */

const OneWeekAgoList: FC<Props> = ({ regularExpenditureList }) => {
  const isEmptyList = regularExpenditureList.length === 0;

  return (
    <div {...stylex.props(styles.expenditureType)}>
      <Text variant='body4Medium' color='grayPrimary' as='p' mb={15}>
        일주일 이내 이체 예정 지출 목록
      </Text>
      {isEmptyList && (
        <Text variant='small2Regular' color='gray600' as='p'>
          당분간 지출할 내역이 없어요. :)
        </Text>
      )}
      {!isEmptyList && (
        <ul {...stylex.props(styles.oneWeekAgoList)}>
          {regularExpenditureList.map((item) => {
            const { title, regularExpenditureDay } = item;
            const { remainDayKo } = getRemainDay(regularExpenditureDay, { completeMsg: '지출일' });

            return (
              <li {...stylex.props(styles.oneWeekAgoItem)} key={item.id}>
                <div {...stylex.props(styles.content)}>
                  <Text xstyle={styles.nameText} variant='small1Regular' color='gray700' as='p'>
                    {title}
                  </Text>
                  <Text variant='small1Regular' color='orangePrimary' alignment='center' mt={3}>
                    {remainDayKo}
                  </Text>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OneWeekAgoList;

'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { useUserInfo } from '../../../../hooks/queries/useUserInfo';
import { useRegularExtentureList } from '../hooks/useRegularExtentureList';
import ExpenditureTypeItem from './RegularExpenditureItem';

const styles = stylex.create({
  container: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
  expenditureType: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '3rem',
    paddingBottom: {
      default: null,
      ':last-child': '20rem',
    },
  },
  typeInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  leftText: {
    display: 'flex',
    height: '30px',
    lineHeight: '32px',
  },
  leftImg: {
    width: '30px',
    height: '30px',
  },
});

/**
 * 정기 지출 리스트 -> 정기 지출 타입별 리스트
 * @component
 */
const ExtentureTypeList = () => {
  const { isShareUser } = useUserInfo();
  const { regularExpenditureTypeList } = useRegularExtentureList();

  if (regularExpenditureTypeList.length === 0) {
    return null;
  }

  return (
    <main {...stylex.props(styles.container)}>
      {regularExpenditureTypeList.map(({ name, type, imageUrl, list }, index) => {
        const totalAmount = list.reduce((acc, item) => item.amount + acc, 0);

        return (
          <div {...stylex.props(styles.expenditureType)} key={`${name}-${index}`}>
            <div {...stylex.props(styles.typeInfo)}>
              <div {...stylex.props(styles.leftGroup)}>
                <img {...stylex.props(styles.leftImg)} src={imageUrl} alt={`${name} 아이콘`} />
                <Text xstyle={styles.leftText} ml={6} variant='title4Bold' color='gray600' as='p'>
                  {name}
                </Text>
              </div>
              <Text variant='title5Medium' color='gray800'>
                {totalAmount.toLocaleString('ko-KR')} 원
              </Text>
            </div>
            <ul>
              {list.map((item) => {
                return (
                  <ExpenditureTypeItem
                    hasDeleteAuth={!isShareUser}
                    key={item.id}
                    type={type}
                    regularExpenditure={item}
                  />
                );
              })}
            </ul>
          </div>
        );
      })}
    </main>
  );
};

export default ExtentureTypeList;

import { Text } from '@wds';
import { styled } from 'styled-components';
import { useRegularExtentureList } from '../hooks/useRegularExtentureList';
import ExpenditureTypeItem from './RegularExpenditureItem';

/**
 * 정기 지출 리스트 -> 정기 지출 타입별 리스트
 * @component
 */
const ExtentureTypeList = () => {
  const { regularExpenditureTypeList } = useRegularExtentureList();

  if (regularExpenditureTypeList.length === 0) {
    return null;
  }

  return (
    <SC.Container>
      {regularExpenditureTypeList.map(({ name, type, list }, index) => {
        const totalAmount = list.reduce((acc, item) => item.amount + acc, 0);

        return (
          <SC.ExpenditureType key={`${name}-${index}`}>
            <SC.TypeInfo>
              <Text variant='title4Bold' color='gray600'>
                {name}
              </Text>
              <Text variant='title5Medium' color='gray800'>
                {totalAmount.toLocaleString('ko-KR')} 원
              </Text>
            </SC.TypeInfo>
            <ul>
              {list.map((item) => {
                return <ExpenditureTypeItem key={item.id} type={type} regularExpenditure={item} />;
              })}
            </ul>
          </SC.ExpenditureType>
        );
      })}
    </SC.Container>
  );
};

const SC = {
  Container: styled.section`
    padding: 0 1.6rem;
  `,
  ExpenditureType: styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 3rem;

    &:last-child {
      padding-bottom: 20rem;
    }

    b {
      font-size: 1.4rem;
    }
  `,
  TypeInfo: styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  `,
};

export default ExtentureTypeList;

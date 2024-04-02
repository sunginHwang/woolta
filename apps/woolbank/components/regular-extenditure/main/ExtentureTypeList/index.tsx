import { Text } from '@wds';
import { styled } from 'styled-components';
import { useUserInfo } from '../../../../hooks/queries/useUserInfo';
import { useRegularExtentureList } from '../hooks/useRegularExtentureList';
import ExpenditureTypeItem from './RegularExpenditureItem';

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
    <SC.Container>
      {regularExpenditureTypeList.map(({ name, type, imageUrl, list }, index) => {
        const totalAmount = list.reduce((acc, item) => item.amount + acc, 0);

        return (
          <SC.ExpenditureType key={`${name}-${index}`}>
            <SC.TypeInfo>
              <div className='left'>
                <img src={imageUrl} alt={`${name} 아이콘`} />
                <Text ml={6} variant='title4Bold' color='gray600' as='p'>
                  {name}
                </Text>
              </div>
              <Text variant='title5Medium' color='gray800'>
                {totalAmount.toLocaleString('ko-KR')} 원
              </Text>
            </SC.TypeInfo>
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
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    .left {
      display: flex;
      align-items: center;

      p {
        display: flex;
        height: 30px;
        line-height: 32px;
      }

      img {
        width: 30px;
        height: 30px;
      }
    }
  `,
};

export default ExtentureTypeList;

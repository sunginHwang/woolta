import { styled } from 'styled-components';
import { SkeletonBar } from '@wds';

const LIST_ITEM_HEIGHT = '2.1rem';

/**
 * 가계부 리스트 스켈레톤
 * @component
 */
export const AccountBookListSkeleton = () => {
  return (
    <SC.Container>
      {[...Array(5)].map((_, index) => (
        <SC.Item key={index}>
          <SC.DayGroup>
            <SkeletonBar width='3rem' height={LIST_ITEM_HEIGHT} />
            <SkeletonBar width='8rem' height={LIST_ITEM_HEIGHT} />
          </SC.DayGroup>
          <SC.List>
            <SkeletonBar width='100%' height={LIST_ITEM_HEIGHT} />
            <SkeletonBar width='100%' height={LIST_ITEM_HEIGHT} />
            <SkeletonBar width='100%' height={LIST_ITEM_HEIGHT} />
          </SC.List>
        </SC.Item>
      ))}
    </SC.Container>
  );
};

const SC = {
  Container: styled.section`
    padding: 0 1.6rem;
  `,
  DayGroup: styled.div`
    padding-bottom: 1rem;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray150};
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 1rem 0;
  `,
  List: styled.div`
    > div {
      margin-bottom: 1rem;
    }
  `,
  Item: styled.div`
    & + & {
      margin-top: 2.4rem;
    }
  `,
};

import { FC } from 'react';
import { styled } from 'styled-components';
import { BottomSheet } from '../../../../components/bottom-sheet/BottomSheet';
import { AccountBookStatisticCategoryItem } from '../_common/hooks/useAccountStatisticListQuery';

interface Props {
  title: string;
  titleColor: string;
  list: AccountBookStatisticCategoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 가계부 통계 - 통계 bottomSheet
 * @component
 */
const CategoryBottomSheet: FC<Props> = ({ isOpen, title, titleColor, list, onClose }) => {
  return (
    <BottomSheet.Snap useDeem isOpen={isOpen} onClose={onClose} snapPhase={1}>
      <S.CategoryBottomSheet>
        <S.Title color={titleColor}>{title}</S.Title>
        <S.List>
          {list.map(({ title, amount, registerDateTime }, key) => (
            <S.Item key={key}>
              <div className='left'>
                <p>{title}</p>
                <span>{registerDateTime.format('MM-DD~')}</span>
              </div>
              <span className='amount'>{amount.toLocaleString('ko-KR')}원</span>
            </S.Item>
          ))}
        </S.List>
      </S.CategoryBottomSheet>
    </BottomSheet.Snap>
  );
};

export default CategoryBottomSheet;

const S = {
  CategoryBottomSheet: styled.div`
    padding: 0 2rem;
  `,
  Title: styled.h3<{
    color: string;
  }>`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: ${({ color }) => color};
  `,
  List: styled.ul`
    margin-bottom: 2rem;

    & > * + * {
      margin-top: 1rem;
    }
  `,
  Item: styled.li`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: ${({ theme }) => theme.colors.gray700};

    .left {
      display: flex;
      flex-direction: column;

      > p {
        font-size: 1.4rem;
      }

      > span {
        font-size: 1.1rem;
        color: ${({ theme }) => theme.colors.gray150};
      }
    }

    .amount {
      font-weight: bold;
      font-size: 1.6rem;
    }
  `,
};

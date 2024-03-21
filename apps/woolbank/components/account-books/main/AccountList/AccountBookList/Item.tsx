import { Text } from '@wds';
import Link from 'next/link';
import React, { FC } from 'react';
import { styled } from 'styled-components';
import { AccountBook } from '../../hooks/useAccountBookList';

interface Props {
  accountBook: AccountBook;
}

/**
 * 가계부 리스트 아이템
 * @component
 */
const Item: FC<Props> = ({ accountBook }) => {
  const { category, title, amount, isRegularExpenditure, type, id } = accountBook;

  const isIncomeType = type === 'income';
  const displayAmount = isIncomeType ? amount : -amount;
  const iconImage = category.accountBookCategoryImage.imageUrl;

  return (
    <Link href={`/account-books/save?id=${id}`}>
      <SC.Item>
        <SC.Left>
          <SC.IconWrapper>
            <img src={iconImage} alt='' />
          </SC.IconWrapper>
          <div>
            <Text className='title' variant='small1Regular' color='grayPrimary' as='p'>
              {title}
            </Text>
            <SC.Info>
              <Text className='category' variant='small3Regular' color='gray600' as='p'>
                {category.name} {isRegularExpenditure && ' | 매월'}
              </Text>
            </SC.Info>
          </div>
        </SC.Left>
        <Text className='price' variant='body3' color={isIncomeType ? 'red500' : 'gray700'} as='p'>
          {displayAmount.toLocaleString('ko-KR')}원
        </Text>
      </SC.Item>
    </Link>
  );
};

const SC = {
  Left: styled.div`
    display: flex;
    align-items: center;
  `,
  IconWrapper: styled.div`
    width: 30px;
    height: 30px;
    background-color: ${({ theme }) => theme.colors.red150};
    border-radius: 30px;
    margin-right: 10px;

    img {
      width: 20px;
      height: 20px;
      margin: 5px;
    }
  `,
  Item: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.8rem;

    .category {
      width: 7.5rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-right: 1rem;
    }

    .price {
      white-space: nowrap;
    }
    > div:first-child {
      display: flex;
      justify-content: flex-start;
    }
  `,
  Info: styled.div`
    display: flex;
    align-items: center;

    span {
      text-overflow: ellipsis;
      word-break: break-all;
      overflow-wrap: break-word;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  `,
  Label: styled.label`
    text-align: center;
    width: 2rem;
    font-size: 1rem;
    background-color: ${({ theme }) => theme.colors.gray150};
    color: ${({ theme }) => theme.colors.gray600};
    border-radius: 1.3rem;
    padding: 0.3rem 0.7rem;
    margin-left: 0.7rem;
  `,
};

export default React.memo(Item);

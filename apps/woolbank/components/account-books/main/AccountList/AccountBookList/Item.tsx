import { styled } from 'styled-components';
import { Text } from '@wds';
import Link from 'next/link';
import React, { FC } from 'react';
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

  return (
    <Link href={`/account-books/save?id=${id}`}>
      <SC.Item>
        <div>
          <Text className='category' variant='small1Regular' color='gray600' as='p'>
            {category.name}
          </Text>
          <SC.Info>
            <Text className='title' variant='small1Regular' color='grayPrimary' as='p'>
              {title}
            </Text>
            {isRegularExpenditure && <SC.Label>매월</SC.Label>}
          </SC.Info>
        </div>
        <Text className='price' variant='body3' color={isIncomeType ? 'red500' : 'gray700'} as='p'>
          {displayAmount.toLocaleString('ko-KR')}원
        </Text>
      </SC.Item>
    </Link>
  );
};

const SC = {
  Item: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

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
    justify-content: center;
    align-items: center;
    height: 2.1rem;

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

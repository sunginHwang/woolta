'use client';

import { useIsDashboardHost } from '@common';
import { Text } from '@wds';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { memo, ReactNode } from 'react';
import { styled } from 'styled-components';
import { AccountBook } from '../_shared/hooks/useAccountBookListQuery';
import { useWoolbankRoutes } from '../_shared/routes/context';
import { selectedAccountBookIdAtom } from '../_shared/stores/selectedAccountBook';

interface Props {
  accountBook: AccountBook;
}

/**
 * 가계부 리스트 아이템
 * - 원본 woolbank 앱: 클릭 시 작성 화면으로 라우트 이동 (기존 동작)
 * - 대시보드(woolta): 클릭 시 우측 패널에서 상세가 열리도록 선택 상태만 변경
 * @component
 */
const Item = ({ accountBook }: Props) => {
  const routes = useWoolbankRoutes();
  const isDashboardHost = useIsDashboardHost();
  const [selectedId, setSelectedId] = useAtom(selectedAccountBookIdAtom);
  const { category, title, amount, isRegularExpenditure, type, id } = accountBook;

  const isIncomeType = type === 'income';
  const displayAmount = isIncomeType ? amount : -amount;
  const iconImage = category.accountBookCategoryImage.imageUrl;

  const content: ReactNode = (
    <>
      <SC.Left>
        <SC.IconWrapper>
          <img src={iconImage} alt='' />
        </SC.IconWrapper>
        <div>
          <Text className='title' variant='small1Regular' color='grayPrimary' as='p'>
            {title}
          </Text>
          <SC.Info>
            <Text className='category' variant='small3Regular' color='textTertiary' as='p'>
              {category.name} {isRegularExpenditure && ' | 매월'}
            </Text>
          </SC.Info>
        </div>
      </SC.Left>
      <Text className='price' variant='body3' color={isIncomeType ? 'statusError' : 'textTertiary'} as='p'>
        {displayAmount.toLocaleString('ko-KR')}원
      </Text>
    </>
  );

  if (isDashboardHost) {
    return (
      <SC.Item as='button' type='button' $isActive={selectedId === id} onClick={() => setSelectedId(id)}>
        {content}
      </SC.Item>
    );
  }

  return (
    <Link href={`${routes.save}?id=${id}`}>
      <SC.Item>{content}</SC.Item>
    </Link>
  );
};

export default memo(Item);

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
  Item: styled.div<{ $isActive?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.8rem;
    text-align: left;
    border-radius: 0.8rem;
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : 'transparent')};

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
};

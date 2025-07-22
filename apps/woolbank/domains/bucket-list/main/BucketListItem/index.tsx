import { Text } from '@wds';
import Link from 'next/link';
import React, { InvalidEvent } from 'react';
import styled, { useTheme } from 'styled-components';
import { IconCircleCheck } from '../../../atom/Icon';
import { CardItem } from '../../../common/CardItem';
import { getRemainDays } from '../../../../utils/date';
import { BucketList } from '../hooks/useBucketList';
import ItemSkeleton from './ItemSkeleton';

interface Props {
  bucketList: BucketList;
  useSideMargin?: boolean;
}

/**
 * 버킷리스트 아이템
 * @component
 */
export const BucketListItem = Object.assign(
  ({ bucketList, useSideMargin = false }: Props) => {
    const { colors } = useTheme();
    const remainDate = getRemainDays(new Date(), bucketList.completeDate);
    const remainTodoCount = bucketList.todoCount - bucketList.completeTodoCount;
    const remainTodoCountMsg =
      remainTodoCount === 0 ? '모든 할일을 마치셨습니다.' : `${remainTodoCount}개의 할 일이 남았어요.`;

    const isExpireDday = remainDate === 0;

    const handleImageFallback = (e: InvalidEvent<HTMLImageElement>) => {
      e.target.style.backgroundColor = 'https://miro.medium.com/max/500/1*V9haN1irZjXH3uRae3a7Ew.jpeg';
    };

    return (
      <Link href={`/bucket-list/${bucketList.id}`}>
        <CardItem useSideMargin={useSideMargin}>
          <SC.BucketListItem data-cy='bucketItem'>
            <div>
              {bucketList.thumbImageUrl ? (
                <img src={bucketList.thumbImageUrl} alt='버킷리스트 썸네일 이미지' onError={handleImageFallback} />
              ) : (
                <SC.Circle />
              )}
              <SC.Content>
                <Text variant='body4Bold' color='gray900' as='p'>
                  {bucketList.title}
                </Text>
                <Text variant='small1Medium' color='gray400' mt={3}>
                  {remainTodoCountMsg}
                </Text>
              </SC.Content>
            </div>
            <div>
              {isExpireDday && <IconCircleCheck fill={colors.red500} width={24} height={24} />}
              {!isExpireDday && (
                <Text variant='title4Bold' color='red500'>
                  D-{remainDate}
                </Text>
              )}
            </div>
          </SC.BucketListItem>
        </CardItem>
      </Link>
    );
  },
  { Skeleton: ItemSkeleton },
);

const SC = {
  BucketListItem: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      display: flex;
      align-items: center;

      &:first-child {
        justify-content: flex-start;
      }

      &:last-child {
        justify-content: flex-end;
        min-width: 6rem;
      }
    }

    img {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      border: 0.1rem solid ${({ theme }) => theme.colors.gray600};
    }
  `,
  Content: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 1.4rem;
  `,
  Circle: styled.div`
    width: 5.2rem;
    height: 5.2rem;
    min-width: 5.2rem;
    min-height: 5.2rem;
    background-color: #e6a3a2;
    border-radius: 50%;
  `,
};

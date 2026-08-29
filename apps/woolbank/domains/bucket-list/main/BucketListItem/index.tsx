import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import React, { type InvalidEvent } from 'react';
import { IconCircleCheck } from '../../../../components/atom/Icon';
import { CardItem } from '../../../../components/card-item/CardItem';
import { getRemainDays } from '../../../../utils/date';
import type { BucketList } from '../hooks/useBucketList';
import ItemSkeleton from './ItemSkeleton';

interface Props {
  bucketList: BucketList;
  useSideMargin?: boolean;
}

const styles = stylex.create({
  bucketListItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  firstDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  lastDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: '6rem',
  },
  thumbImage: {
    width: '5rem',
    height: '5rem',
    borderRadius: '50%',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-gray600'],
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1.4rem',
  },
  circle: {
    width: '5.2rem',
    height: '5.2rem',
    minWidth: '5.2rem',
    minHeight: '5.2rem',
    backgroundColor: '#e6a3a2',
    borderRadius: '50%',
  },
});

/**
 * 버킷리스트 아이템
 * @component
 */
export const BucketListItem = Object.assign(
  ({ bucketList, useSideMargin = false }: Props) => {
    const remainDate = getRemainDays(new Date(), bucketList.completeDate);
    const remainTodoCount = bucketList.todoCount - bucketList.completeTodoCount;
    const remainTodoCountMsg =
      remainTodoCount === 0 ? '모든 할일을 마치셨습니다.' : `${remainTodoCount}개의 할 일이 남았어요.`;

    const isExpireDday = remainDate === 0;

    const handleImageFallback = (e: InvalidEvent<HTMLImageElement>) => {
      e.currentTarget.style.backgroundColor = 'https://miro.medium.com/max/500/1*V9haN1irZjXH3uRae3a7Ew.jpeg';
    };

    return (
      <Link href={`/bucket-list/${bucketList.id}`}>
        <CardItem useSideMargin={useSideMargin}>
          <div {...stylex.props(styles.bucketListItem)} data-cy='bucketItem'>
            <div {...stylex.props(styles.firstDiv)}>
              {bucketList.thumbImageUrl ? (
                <img
                  {...stylex.props(styles.thumbImage)}
                  src={bucketList.thumbImageUrl}
                  alt='버킷리스트 썸네일 이미지'
                  onError={handleImageFallback}
                />
              ) : (
                <div {...stylex.props(styles.circle)} />
              )}
              <div {...stylex.props(styles.content)}>
                <Text variant='body4Bold' color='gray900' as='p'>
                  {bucketList.title}
                </Text>
                <Text variant='small1Medium' color='gray400' mt={3}>
                  {remainTodoCountMsg}
                </Text>
              </div>
            </div>
            <div {...stylex.props(styles.lastDiv)}>
              {isExpireDday && <IconCircleCheck fill='#f03e3e' width={24} height={24} />}
              {!isExpireDday && (
                <Text variant='title4Bold' color='red500'>
                  D-{remainDate}
                </Text>
              )}
            </div>
          </div>
        </CardItem>
      </Link>
    );
  },
  { Skeleton: ItemSkeleton },
);

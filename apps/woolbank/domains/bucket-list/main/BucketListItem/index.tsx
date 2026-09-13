import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import React, { useState } from 'react';
import { IconCircleCheck } from '../../../../components/atom/Icon';
import { CardItem } from '../../../../components/card-item/CardItem';
import { getRemainDays, toKstDateString } from '../../../../utils/date';
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
    // KST 날짜로 고정한다 — 렌더 중 new Date() 를 쓰면 서버와 브라우저가 다른 '오늘' 을 만들어
    // 하이드레이션이 어긋난다(사용자 타임존이 호스트와 다를 때 재현된다).
    const remainDate = getRemainDays(toKstDateString(), toKstDateString(bucketList.completeDate));
    const remainTodoCount = bucketList.todoCount - bucketList.completeTodoCount;
    const remainTodoCountMsg =
      remainTodoCount === 0 ? '모든 할일을 마치셨습니다.' : `${remainTodoCount}개의 할 일이 남았어요.`;

    const isExpireDday = remainDate === 0;

    /**
     * 썸네일 로드 실패 처리.
     *
     * 원래는 이미지 URL 을 `style.backgroundColor` 에 대입하고 있었다 — 유효하지 않은 CSS 값이라
     * 아무 일도 일어나지 않았고, 깨진 이미지 아이콘이 그대로 남았다.
     * 썸네일이 없을 때와 같은 자리표시자를 보여준다.
     */
    const [isThumbBroken, setIsThumbBroken] = useState(false);
    const hasThumb = !!bucketList.thumbImageUrl && !isThumbBroken;

    return (
      <Link href={`/bucket-list/${bucketList.id}`}>
        <CardItem useSideMargin={useSideMargin}>
          <div {...stylex.props(styles.bucketListItem)} data-cy='bucketItem'>
            <div {...stylex.props(styles.firstDiv)}>
              {hasThumb ? (
                <img
                  {...stylex.props(styles.thumbImage)}
                  src={bucketList.thumbImageUrl}
                  alt='버킷리스트 썸네일 이미지'
                  onError={() => setIsThumbBroken(true)}
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

import { SkeletonBar, Text } from '@wds';
import dayjs from 'dayjs';
import styled, { useTheme } from 'styled-components';
import { IconCalendarMonthOutline } from '../../../../components/atom/Icon';
import { useBucket } from '../hooks/useBucket';
import { Skeleton } from './Skeleton';

/**
 * 버킷리스트 상세 -  컨텐츠 정보
 * @component
 */
export const ContentInfo = () => {
  const {
    isFetching,
    bucket: { description, completeDate },
  } = useBucket();
  const { colors } = useTheme();
  const completedDateFormat = dayjs(completeDate).format('YYYY-MM-DD');

  if (isFetching) {
    <SC.BucketListContentInfo>
      <Skeleton />
      <SC.ContentItem>
        <i>
          <IconCalendarMonthOutline width={24} height={24} fill={colors.black} />
        </i>
        <div>
          <Text variant='title6Bold' color='gray900' as='p'>
            목표 달성일
          </Text>
          <SkeletonBar width='10rem' height='1.4rem' />
        </div>
      </SC.ContentItem>
    </SC.BucketListContentInfo>;
  }

  return (
    <SC.BucketListContentInfo>
      <SC.ContentItem>
        <Text variant='body3' color='gray800' data-cy='description'>
          {description}
        </Text>
      </SC.ContentItem>
      <SC.ContentItem>
        <i>
          <IconCalendarMonthOutline fill={colors.black} />
        </i>
        <div>
          <Text variant='title6Bold' color='gray900' as='p'>
            목표 달성일
          </Text>
          <Text variant='small1Regular' color='gray600'>
            {completedDateFormat}
          </Text>
        </div>
      </SC.ContentItem>
    </SC.BucketListContentInfo>
  );
};

const SC = {
  BucketListContentInfo: styled.div`
    background-color: ${({ theme }) => theme.colors.white};
    padding: 2rem 2rem 0 2rem;
  `,
  ContentItem: styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 1rem;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray150};
    padding: 2rem 0;
    white-space: pre-wrap;

    > i {
      margin-right: 1rem;
      line-height: 0;
    }

    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  `,
};

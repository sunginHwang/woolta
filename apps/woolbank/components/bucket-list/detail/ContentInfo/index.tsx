import { SkeletonBar } from '@wds';
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
  const completedDateFormat = dayjs(completeDate).format('YYYY_MM_DD');

  if (isFetching) {
    <SC.BucketListContentInfo>
      <Skeleton />
      <SC.ContentItem>
        <i>
          <IconCalendarMonthOutline width={24} height={24} fill={colors.black} />
        </i>
        <div>
          <SC.Title>목표 달성일</SC.Title>
          <SkeletonBar width='10rem' height='1.4rem' />
        </div>
      </SC.ContentItem>
    </SC.BucketListContentInfo>;
  }

  return (
    <SC.BucketListContentInfo>
      <SC.ContentItem>
        <SC.Message data-cy='description'>{description}</SC.Message>
      </SC.ContentItem>
      <SC.ContentItem>
        <i>
          <IconCalendarMonthOutline fill={colors.black} />
        </i>
        <div>
          <SC.Title>목표 달성일</SC.Title>
          <span>{completedDateFormat}</span>
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
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray400};
    padding: 2rem 0;
    white-space: pre-wrap;

    > i {
      margin-right: 1rem;
      line-height: 0;
    }

    span {
      font-size: 1.2rem;
      line-height: 1.8rem;
      color: ${({ theme }) => theme.colors.gray800};
    }

    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  `,
  Message: styled.p`
    line-height: 2rem;
    color: ${({ theme }) => theme.colors.gray900};
  `,
  Title: styled.p`
    line-height: 2rem;
    color: ${({ theme }) => theme.colors.gray900};
    font-weight: bold;
  `,
};

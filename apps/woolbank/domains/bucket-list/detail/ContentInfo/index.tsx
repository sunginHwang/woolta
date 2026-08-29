import * as stylex from '@stylexjs/stylex';
import { SkeletonBar, Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import dayjs from 'dayjs';
import { IconCalendarMonthOutline } from '../../../../components/atom/Icon';
import { useBucket } from '../hooks/useBucket';
import { Skeleton } from './Skeleton';

const styles = stylex.create({
  container: {
    backgroundColor: colorVars['--color-white'],
    paddingTop: '2rem',
    paddingRight: '2rem',
    paddingBottom: 0,
    paddingLeft: '2rem',
  },
  contentItem: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-gray150'],
    paddingBlock: '2rem',
    paddingInline: 0,
    whiteSpace: 'pre-wrap',
  },
  contentItemFirst: {
    paddingTop: 0,
  },
  contentItemLast: {
    marginBottom: 0,
  },
  iconSlot: {
    marginRight: '1rem',
    lineHeight: 0,
  },
});

/**
 * 버킷리스트 상세 -  컨텐츠 정보
 * @component
 */
export const ContentInfo = () => {
  const {
    isFetching,
    bucket: { description, completeDate },
  } = useBucket();
  const completedDateFormat = dayjs(completeDate).format('YYYY-MM-DD');

  if (isFetching) {
    <div {...stylex.props(styles.container)}>
      <Skeleton />
      <div {...stylex.props(styles.contentItem)}>
        <i {...stylex.props(styles.iconSlot)}>
          <IconCalendarMonthOutline width={24} height={24} fill='#000000' />
        </i>
        <div>
          <Text variant='title6Bold' color='gray900' as='p'>
            목표 달성일
          </Text>
          <SkeletonBar width='10rem' height='1.4rem' />
        </div>
      </div>
    </div>;
  }

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.contentItem, styles.contentItemFirst)}>
        <Text variant='body3' color='gray800' data-cy='description'>
          {description}
        </Text>
      </div>
      <div {...stylex.props(styles.contentItem, styles.contentItemLast)}>
        <i {...stylex.props(styles.iconSlot)}>
          <IconCalendarMonthOutline fill='#000000' />
        </i>
        <div>
          <Text variant='title6Bold' color='gray900' as='p'>
            목표 달성일
          </Text>
          <Text variant='small1Regular' color='gray600'>
            {completedDateFormat}
          </Text>
        </div>
      </div>
    </div>
  );
};

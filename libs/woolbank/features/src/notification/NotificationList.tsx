'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar, Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import {
  type Notification,
  useMarkAllNotificationReadMutation,
  useNotificationListQuery,
  useUnreadNotificationCountQuery,
} from '../_shared/hooks/notificationApi';
import { formatNotificationTime } from './formatNotificationTime';

const styles = stylex.create({
  container: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBlock: '1.2rem',
    paddingInline: 0,
  },
  markAllButton: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingBlock: '0.4rem',
    paddingInline: '0.4rem',
    cursor: {
      default: 'pointer',
      ':disabled': 'default',
    },
    opacity: {
      default: 1,
      ':disabled': 0.4,
    },
  },
  list: {
    listStyle: 'none',
    margin: 0,
    paddingBlock: 0,
    paddingInline: 0,
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-border3'],
    borderRadius: '0.8rem',
    boxShadow: '0 0.1rem 0.3rem 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  row: {
    borderTopWidth: {
      default: '0.1rem',
      ':first-child': 0,
    },
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-border4'],
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    paddingBlock: '1.2rem',
    paddingInline: '1.6rem',
    textDecoration: 'none',
    backgroundColor: {
      default: colorVars['--color-white'],
      ':active': colorVars['--color-bgSecondary'],
    },
  },
  linkUnread: {
    backgroundColor: {
      default: colorVars['--color-pink030'],
      ':active': colorVars['--color-pink050'],
    },
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.8rem',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    minWidth: 0,
  },
  unreadDot: {
    flexShrink: 0,
    width: '0.6rem',
    height: '0.6rem',
    borderRadius: '50%',
    backgroundColor: colorVars['--color-pinkPrimary'],
  },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  time: {
    flexShrink: 0,
  },
  summary: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.5,
  },
  empty: {
    paddingBlock: '4rem',
    paddingInline: '1.6rem',
  },
  skeletonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
});

export interface NotificationListViewProps {
  items: Notification[];
  /** 서버가 센 미읽음 수. 목록은 최근 50건뿐이라 여기서 세면 틀린다. null 이면 아직 모른다 */
  unreadCount: number | null;
  isLoading: boolean;
  isError: boolean;
  isMarkingAll: boolean;
  onMarkAllRead: () => void;
  /** 상세 링크. 푸시가 여는 경로와 같아야 한다(기본 `/notifications/{id}`) */
  detailHref?: (id: string) => string;
}

const defaultDetailHref = (id: string) => `/notifications/${id}`;

/**
 * 알림 목록 화면. 데이터는 props 로 받는다(스토리에서 상태를 고정하기 위해).
 * 최신순 정렬은 서버가 보장하고, 미읽음은 배경과 점으로 구분한다.
 */
export const NotificationListView = ({
  items,
  unreadCount,
  isLoading,
  isError,
  isMarkingAll,
  onMarkAllRead,
  detailHref = defaultDetailHref,
}: NotificationListViewProps) => {
  if (isLoading) {
    return (
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.toolbar)}>
          <SkeletonBar width='30%' height='1.8rem' radius={6} />
        </div>
        <div {...stylex.props(styles.skeletonList)}>
          <SkeletonBar width='100%' height='7.2rem' radius={8} />
          <SkeletonBar width='100%' height='7.2rem' radius={8} />
          <SkeletonBar width='100%' height='7.2rem' radius={8} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div {...stylex.props(styles.container)}>
        <Text xstyle={styles.empty} variant='body3' color='textSecondary' as='p' alignment='center'>
          알림을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </Text>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div {...stylex.props(styles.container)}>
        <Text xstyle={styles.empty} variant='body3' color='textSecondary' as='p' alignment='center'>
          받은 알림이 없어요.
        </Text>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.toolbar)}>
        <Text variant='body4Regular' color='textSecondary'>
          {unreadCount === null ? '' : unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}건` : '모두 읽었어요'}
        </Text>
        <button
          type='button'
          {...stylex.props(styles.markAllButton)}
          disabled={unreadCount === null || unreadCount === 0 || isMarkingAll}
          onClick={onMarkAllRead}
        >
          <Text variant='body4Medium' color='brandPrimary'>
            모두 읽음
          </Text>
        </button>
      </div>
      <ul {...stylex.props(styles.list)}>
        {items.map((item) => {
          const isUnread = item.readAt === null;

          return (
            <li key={item.id} {...stylex.props(styles.row)}>
              <Link href={detailHref(item.id)} {...stylex.props(styles.link, isUnread && styles.linkUnread)}>
                <div {...stylex.props(styles.head)}>
                  <div {...stylex.props(styles.titleGroup)}>
                    {isUnread && <span {...stylex.props(styles.unreadDot)} role='img' aria-label='읽지 않음' />}
                    <Text
                      xstyle={styles.title}
                      variant={isUnread ? 'title6Bold' : 'title6Medium'}
                      color={isUnread ? 'textPrimary' : 'textSecondary'}
                      as='p'
                    >
                      {item.title}
                    </Text>
                  </div>
                  <Text xstyle={styles.time} variant='small2Regular' color='textTertiary'>
                    {formatNotificationTime(item.createdAt)}
                  </Text>
                </div>
                <Text xstyle={styles.summary} variant='small1Regular' color='textSecondary' as='p'>
                  {item.summary}
                </Text>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/** 알림함 목록 — 서버 데이터와 읽음 처리를 묶은 컨테이너 */
export const NotificationList = ({ detailHref }: Pick<NotificationListViewProps, 'detailHref'>) => {
  const listQuery = useNotificationListQuery();
  const unreadQuery = useUnreadNotificationCountQuery();
  const markAllMutation = useMarkAllNotificationReadMutation();

  return (
    <NotificationListView
      items={listQuery.data?.woolBankNotificationList.itemList ?? []}
      unreadCount={unreadQuery.data?.getWoolBankUnreadNotificationCount ?? null}
      isLoading={listQuery.isPending}
      isError={listQuery.isError}
      isMarkingAll={markAllMutation.isPending}
      onMarkAllRead={() => markAllMutation.mutate({})}
      detailHref={detailHref}
    />
  );
};

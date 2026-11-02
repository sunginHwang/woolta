'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import { useUnreadNotificationCountQuery } from '../_shared/hooks/notificationApi';

const styles = stylex.create({
  container: {
    paddingBlock: 0,
    paddingInline: 0,
    marginTop: '2.4rem',
  },
  title: {
    paddingBlock: '1rem',
    paddingInline: 0,
  },
  cardWrapper: {
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-border3'],
    borderRadius: '0.8rem',
    boxShadow: '0 0.1rem 0.3rem 0 rgba(0, 0, 0, 0.1)',
  },
  link: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '4.8rem',
    paddingBlock: 0,
    paddingInline: '2rem',
    textDecoration: 'none',
  },
  labelGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '1.8rem',
    height: '1.8rem',
    paddingBlock: 0,
    paddingInline: '0.6rem',
    borderRadius: '0.9rem',
    backgroundColor: colorVars['--color-pinkPrimary'],
  },
});

export interface NotificationInboxEntryViewProps {
  unreadCount: number;
  href?: string;
}

/** 마이페이지의 알림함 진입 행. 미읽음이 있으면 배지로 보여준다. */
export const NotificationInboxEntryView = ({
  unreadCount,
  href = '/notifications',
}: NotificationInboxEntryViewProps) => (
  <section {...stylex.props(styles.container)}>
    <Text xstyle={styles.title} variant='body3' color='graySecondary' as='h3'>
      알림함
    </Text>
    <div {...stylex.props(styles.cardWrapper)}>
      <Link
        href={href}
        {...stylex.props(styles.link)}
        aria-label={unreadCount > 0 ? `받은 알림, 읽지 않은 알림 ${unreadCount}건` : '받은 알림'}
      >
        <span {...stylex.props(styles.labelGroup)} aria-hidden='true'>
          <Text variant='body4Regular' color='grayPrimary'>
            받은 알림
          </Text>
          {unreadCount > 0 && (
            <span {...stylex.props(styles.badge)}>
              <Text variant='small2Bold' color='white'>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </span>
          )}
        </span>
        <Text variant='body4Regular' color='grayPrimary' aria-hidden='true'>
          &gt;
        </Text>
      </Link>
    </div>
  </section>
);

export const NotificationInboxEntry = ({ href }: Pick<NotificationInboxEntryViewProps, 'href'>) => {
  const unreadQuery = useUnreadNotificationCountQuery();

  return (
    <NotificationInboxEntryView unreadCount={unreadQuery.data?.getWoolBankUnreadNotificationCount ?? 0} href={href} />
  );
};

'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar, Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { useEffect, useRef } from 'react';
import {
  type Notification,
  useMarkNotificationReadMutation,
  useNotificationDetailQuery,
} from '../_shared/hooks/notificationApi';
import { formatNotificationTime } from './formatNotificationTime';

const styles = stylex.create({
  container: {
    paddingBlock: '1.6rem',
    paddingInline: '1.6rem',
  },
  card: {
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-border3'],
    borderRadius: '0.8rem',
    boxShadow: '0 0.1rem 0.3rem 0 rgba(0, 0, 0, 0.1)',
    paddingBlock: '1.6rem',
    paddingInline: '1.6rem',
    backgroundColor: colorVars['--color-white'],
  },
  meta: {
    marginTop: '0.6rem',
  },
  divider: {
    marginBlock: '1.2rem',
    marginInline: 0,
    borderWidth: 0,
    borderTopWidth: '0.1rem',
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-border4'],
  },
  // 서버가 주는 본문은 줄바꿈이 있는 plain text 다. 마크다운을 렌더하지 않는다.
  content: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: 1.6,
  },
  empty: {
    paddingBlock: '4rem',
    paddingInline: '1.6rem',
  },
  skeleton: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
});

export interface NotificationDetailViewProps {
  notification: Notification | null;
  isLoading: boolean;
  isError: boolean;
}

/** 알림 상세 화면. 데이터는 props 로 받는다(스토리에서 상태를 고정하기 위해). */
export const NotificationDetailView = ({ notification, isLoading, isError }: NotificationDetailViewProps) => {
  if (isLoading) {
    return (
      <div {...stylex.props(styles.container, styles.skeleton)}>
        <SkeletonBar width='60%' height='2.2rem' radius={6} />
        <SkeletonBar width='30%' height='1.4rem' radius={6} />
        <SkeletonBar width='100%' height='16rem' radius={8} />
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

  if (notification === null) {
    return (
      <div {...stylex.props(styles.container)}>
        <Text xstyle={styles.empty} variant='body3' color='textSecondary' as='p' alignment='center'>
          삭제됐거나 없는 알림이에요.
        </Text>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.container)}>
      <article {...stylex.props(styles.card)}>
        <Text variant='title4Bold' color='textPrimary' as='h2'>
          {notification.title}
        </Text>
        <Text xstyle={styles.meta} variant='small1Regular' color='textTertiary' as='p'>
          {formatNotificationTime(notification.createdAt)}
        </Text>
        <hr {...stylex.props(styles.divider)} />
        <Text xstyle={styles.content} variant='body3' color='textPrimary' as='p'>
          {notification.content}
        </Text>
      </article>
    </div>
  );
};

/** 읽음 처리 시도 상한. 실패하면 한 번만 더 해 보고 그 뒤는 다음 방문에 맡긴다 */
const MARK_READ_MAX_ATTEMPTS = 2;

/**
 * 알림 상세 — 열면 읽음 처리한다.
 * 뮤테이션 성공 시 목록·미읽음 수가 무효화되므로 뒤로 가면 목록이 바로 갱신돼 있다.
 * 실패하면 진행 플래그를 풀어 재시도하되, 계속 실패해도 무한 반복하지 않게 횟수를 제한한다.
 */
export const NotificationDetail = ({ id }: { id: string }) => {
  const detailQuery = useNotificationDetailQuery(id);
  const markReadMutation = useMarkNotificationReadMutation();
  const notification = detailQuery.data?.woolBankNotification ?? null;
  const isMarking = useRef(false);
  const markAttempts = useRef(0);

  useEffect(() => {
    if (
      isMarking.current ||
      markAttempts.current >= MARK_READ_MAX_ATTEMPTS ||
      notification === null ||
      notification.readAt !== null
    ) {
      return;
    }

    isMarking.current = true;
    markAttempts.current += 1;
    markReadMutation.mutate(
      { input: { id: notification.id } },
      {
        onSettled: () => {
          isMarking.current = false;
        },
      },
    );
  }, [notification, markReadMutation]);

  return (
    <NotificationDetailView
      notification={notification}
      isLoading={detailQuery.isPending}
      isError={detailQuery.isError}
    />
  );
};

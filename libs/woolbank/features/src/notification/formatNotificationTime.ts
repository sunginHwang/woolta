import dayjs from 'dayjs';

/**
 * 알림 시각 표기. 하루 안이면 "HH:mm", 그 밖에는 "M월 D일 HH:mm".
 * 서버가 UTC ISO 를 주고 dayjs 가 브라우저 타임존으로 바꾼다.
 * 클라이언트 컴포넌트도 SSR 되지만 알림 쿼리는 프리페치가 없어 서버에서는 돌지 않고, 시각 문자열은 브라우저에서만 만들어져 하이드레이션 불일치가 없다.
 */
export const formatNotificationTime = (iso: string, now: dayjs.Dayjs = dayjs()): string => {
  const at = dayjs(iso);

  if (!at.isValid()) {
    return '';
  }

  return at.isSame(now, 'day') ? at.format('HH:mm') : at.format('M월 D일 HH:mm');
};

'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import dayjs from 'dayjs';
import { Suspense, useEffect, useState } from 'react';
import { useCalendarStore } from '../_shared/stores/useCalendarStore';
import { CalendarEventEditor } from '../event-editor/CalendarEventEditor';
import { CalendarSharePanel } from '../share-panel/CalendarSharePanel';
import { CalendarBoardHeader } from './components/CalendarBoardHeader';
import { CalendarBoardView } from './components/CalendarBoardView';

const styles = stylex.create({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  body: {
    flex: 1,
    minHeight: 0,
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

/**
 * 캘린더 본체 — 헤더(기간·뷰·등록·공유) + FullCalendar + 일정 편집/공유 오버레이.
 *
 * 기준 날짜를 마운트 후에 채운다. '오늘' 을 서버에서 정하면 서버·클라이언트 시간대가
 * 갈려 하이드레이션이 깨지고, FullCalendar 도 DOM 없이는 렌더할 수 없다.
 */
export const CalendarBoard = () => {
  const baseDateIso = useCalendarStore((state) => state.baseDateIso);
  const setBaseDate = useCalendarStore((state) => state.setBaseDate);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (baseDateIso === '') {
      setBaseDate(dayjs().toISOString());
    }
  }, [baseDateIso, setBaseDate]);

  if (baseDateIso === '') {
    return (
      <div {...stylex.props(styles.loading)}>
        <Text as='p' variant='body2' color='textTertiary'>
          캘린더를 준비하는 중이에요
        </Text>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.container)}>
      <CalendarBoardHeader onShareClick={() => setIsShareOpen(true)} />
      <div {...stylex.props(styles.body)}>
        {/* 기간을 옮기면 그 범위를 새로 받는다 — 캐시가 비어 있는 구간에서만 fallback 이 보인다 */}
        <Suspense
          fallback={
            <div {...stylex.props(styles.loading)}>
              <Text as='p' variant='body2' color='textTertiary'>
                일정을 불러오는 중이에요
              </Text>
            </div>
          }
        >
          <CalendarBoardView />
        </Suspense>
      </div>
      {/*
        편집창도 일정 캐시에서 대상을 찾으므로(suspense) 자기 경계를 가진다.
        보드 경계 안에 두면 편집 중 보드가 사라지고, 경계가 없으면 기간 이동 중
        열려 있을 때 라우트 상위 경계까지 튄다.
      */}
      <Suspense fallback={null}>
        <CalendarEventEditor />
      </Suspense>
      {isShareOpen && <CalendarSharePanel onClose={() => setIsShareOpen(false)} />}
    </div>
  );
};

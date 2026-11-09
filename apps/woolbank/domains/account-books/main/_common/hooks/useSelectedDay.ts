'use client';

import { useEffect, useState } from 'react';

const firstDayOf = (month: string, today: string) => (today.startsWith(`${month}-`) ? today : `${month}-01`);

/**
 * 달력에서 선택한 날('YYYY-MM-DD').
 * 보는 달이 바뀌면 그 달의 오늘(있으면) 또는 1일로 되돌린다 — 지난달 날짜가 선택된 채 남지 않게.
 */
export const useSelectedDay = (month: string, today: string) => {
  const [selectedDay, setSelectedDay] = useState(() => firstDayOf(month, today));

  // biome-ignore lint/correctness/useExhaustiveDependencies: month 가 바뀔 때만 리셋한다
  useEffect(() => {
    setSelectedDay(firstDayOf(month, today));
  }, [month]);

  return { selectedDay, setSelectedDay };
};

'use client';

import { useMemo } from 'react';
import { WEEKLY_CURATION_LIMIT } from '../constants';
import { useArticleStore } from '../stores/useArticleStore';
import { getWeekKey } from '../utils/getWeekKey';

/** 이번 주 큐레이션 상태(주차 키/선정 목록/정원 여부)를 반환한다. */
export const useWeeklyCuration = () => {
  const curationList = useArticleStore((state) => state.curationList);

  return useMemo(() => {
    const weekKey = getWeekKey(new Date());
    const curatedArticleIds = curationList.find((curation) => curation.weekKey === weekKey)?.articleIds ?? [];

    return {
      weekKey,
      curatedArticleIds,
      isFull: curatedArticleIds.length >= WEEKLY_CURATION_LIMIT,
    };
  }, [curationList]);
};

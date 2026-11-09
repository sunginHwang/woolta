'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Header, IconPlus } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RegularExpenditure, RegularExpenditureListItem } from './hooks/useRegularExtentureListQuery';
import { ALL_CATEGORY, ScheduleCard } from './ScheduleCard';
import { SummaryCard } from './SummaryCard';
import { getCategoryShares } from './utils/categoryShares';
import { isWithinWeek } from './utils/isWithinWeek';

export interface RegularExpenditureViewProps {
  /** 서버가 카테고리별로 묶어준 그룹 */
  groups: RegularExpenditureListItem[];
  /** 공유코드 세션 — 추가·삭제 UI 를 숨긴다 */
  isShareUser: boolean;
  onAddClick: () => void;
  onDelete: (item: RegularExpenditure) => void;
  /** 기준 시각 — 스토리에서 고정하려고 받는다. 기본은 지금 */
  now?: dayjs.Dayjs;
}

/** 7일 이내 행 강조를 유지하는 시간 */
const ACTIVE_HIGHLIGHT_MS = 1600;

const styles = stylex.create({
  page: {
    minHeight: '100dvh',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    paddingTop: '0.4rem',
    paddingInline: '1.6rem',
    paddingBottom: '2.4rem',
  },
});

/**
 * 정기지출 화면 — 요약 카드 + 이체 일정 카드. 데이터는 props 로 받고 필터·강조 상태만 안에서 든다.
 * @component
 */
export const RegularExpenditureView = ({
  groups,
  isShareUser,
  onAddClick,
  onDelete,
  now,
}: RegularExpenditureViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = useMemo(() => groups.flatMap((group) => group.list), [groups]);
  const categories = useMemo(() => groups.map((group) => group.name), [groups]);
  const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);
  const shares = useMemo(() => getCategoryShares(groups), [groups]);
  const upcoming = items.filter((item) => isWithinWeek(item.regularExpenditureDay, now));
  const upcomingAmount = upcoming.reduce((acc, item) => acc + item.amount, 0);
  const monthLabel = `${(now ?? dayjs()).month() + 1}월`;

  useEffect(
    () => () => {
      if (highlightTimer.current) {
        clearTimeout(highlightTimer.current);
      }
    },
    [],
  );

  const handleUpcomingClick = () => {
    const ids = upcoming.map((item) => item.id);

    setSelectedCategory(ALL_CATEGORY);
    setActiveIds(ids);

    // 필터가 풀린 뒤 그려진 행으로 스크롤한다
    requestAnimationFrame(() => {
      contentRef.current
        ?.querySelector(`[data-key="${ids[0]}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    if (highlightTimer.current) {
      clearTimeout(highlightTimer.current);
    }
    highlightTimer.current = setTimeout(() => setActiveIds([]), ACTIVE_HIGHLIGHT_MS);
  };

  return (
    <div {...stylex.props(styles.page)}>
      <Header
        title='정기지출'
        right={
          isShareUser ? undefined : (
            <Button variant='text' size='small' startIcon={<IconPlus size={18} />} onClick={onAddClick}>
              추가
            </Button>
          )
        }
      />
      <div ref={contentRef} {...stylex.props(styles.content)}>
        <SummaryCard
          monthLabel={monthLabel}
          totalAmount={totalAmount}
          shares={shares}
          upcomingCount={upcoming.length}
          upcomingAmount={upcomingAmount}
          onUpcomingClick={handleUpcomingClick}
        />
        <ScheduleCard
          items={items}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          activeIds={activeIds}
          onDelete={isShareUser ? undefined : onDelete}
        />
      </div>
    </div>
  );
};

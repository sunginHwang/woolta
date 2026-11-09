'use client';

import * as stylex from '@stylexjs/stylex';
import { Card, Chip, ChipGroup, EmptyState, Text, Timeline, type TimelineItem } from '@wds';
import { shadowVars } from '@wds/tokens.stylex';
import { formatWon } from '@woolta/woolbank-features';
import dayjs from 'dayjs';
import type { RegularExpenditure } from './hooks/useRegularExtentureListQuery';

/** 카테고리 칩의 "전체" 값 */
export const ALL_CATEGORY = '전체';

export interface ScheduleCardProps {
  /** 날짜순으로 보여줄 항목(필터 적용 전) */
  items: RegularExpenditure[];
  /** 칩 목록 — 카테고리 이름들 */
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  /** 강조할 항목 id — 7일 안에 빠져나가는 건으로 이동했을 때 잠깐 켠다 */
  activeIds: string[];
  /** 롱프레스 삭제. 없으면(공유 유저) 롱프레스가 없다 */
  onDelete?: (item: RegularExpenditure) => void;
}

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '2rem',
    paddingInline: '2rem',
    paddingBottom: '0.8rem',
    borderRadius: '1.6rem',
    boxShadow: shadowVars['--shadow-card'],
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '1.6rem',
  },
  chips: {
    paddingBottom: '1.6rem',
    // 카드 패딩 밖까지 스크롤되게 음수 마진으로 뺐다가 같은 만큼 안쪽 여백을 준다
    marginInline: '-2rem',
    paddingInline: '2rem',
  },
  empty: {
    paddingBlock: '2.4rem',
  },
});

const toTimelineItem = (item: RegularExpenditure, onDelete?: (item: RegularExpenditure) => void): TimelineItem => {
  const day = dayjs(item.regularExpenditureDay);

  return {
    key: item.id,
    dateLabel: { top: `${day.month() + 1}월`, bottom: String(day.date()) },
    title: item.title,
    description: item.isAutoExpenditure ? `${item.accountBookCategory.name} · 정기이체` : item.accountBookCategory.name,
    value: formatWon(item.amount),
    onLongPress: onDelete ? () => onDelete(item) : undefined,
  };
};

/**
 * 이체 일정 카드 — 카테고리 칩으로 거르고 날짜순 타임라인으로 보여준다. 7일 이내/이후를 나누지 않는다.
 * @component
 */
export const ScheduleCard = ({
  items,
  categories,
  selectedCategory,
  onCategoryChange,
  activeIds,
  onDelete,
}: ScheduleCardProps) => {
  const filtered = [
    ...(selectedCategory === ALL_CATEGORY
      ? items
      : items.filter((item) => item.accountBookCategory.name === selectedCategory)),
  ].sort((a, b) => dayjs(a.regularExpenditureDay).valueOf() - dayjs(b.regularExpenditureDay).valueOf());

  return (
    <Card as='section' padding='none' aria-label='이체 일정' xstyle={styles.card}>
      <div {...stylex.props(styles.head)}>
        <Text variant='title3Bold' as='h2'>
          이체 일정
        </Text>
        <Text variant='body4Regular' color='textSecondary'>
          {filtered.length}건
        </Text>
      </div>
      <ChipGroup layout='scroll' aria-label='카테고리 필터' xstyle={styles.chips}>
        {[ALL_CATEGORY, ...categories].map((category) => (
          <Chip
            key={category}
            label={category}
            variant='solid'
            size='small'
            selected={category === selectedCategory}
            onClick={() => onCategoryChange(category)}
          />
        ))}
      </ChipGroup>
      <Timeline
        aria-label='이체 일정 목록'
        items={filtered.map((item) => toTimelineItem(item, onDelete))}
        activeKeys={activeIds}
        empty={<EmptyState size='small' message='등록된 정기지출이 없어요' xstyle={styles.empty} />}
      />
    </Card>
  );
};

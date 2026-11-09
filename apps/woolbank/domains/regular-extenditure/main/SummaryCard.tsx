'use client';

import * as stylex from '@stylexjs/stylex';
import { Card, IconChevronRight, IconClockOutline, Text } from '@wds';
import { colorVars, shadowVars } from '@wds/tokens.stylex';
import { formatWon } from '@woolta/woolbank-features';
import type { CategoryShare, ShareTone } from './utils/categoryShares';

export interface SummaryCardProps {
  /** "11월" 처럼 보여줄 달 라벨 */
  monthLabel: string;
  /** 이달 정기지출 총액 */
  totalAmount: number;
  shares: CategoryShare[];
  /** 7일 안에 빠져나가는 건수·합계 */
  upcomingCount: number;
  upcomingAmount: number;
  onUpcomingClick: () => void;
}

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.6rem',
    padding: '2rem',
    borderRadius: '1.6rem',
    boxShadow: shadowVars['--shadow-card'],
  },
  head: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  total: {
    fontSize: '2.8rem',
    lineHeight: '3.6rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    fontVariantNumeric: 'tabular-nums',
    color: colorVars['--color-textPrimary'],
  },
  unit: {
    fontSize: '1.8rem',
    fontWeight: 600,
    marginLeft: '0.2rem',
    color: colorVars['--color-textSecondary'],
  },
  bar: {
    display: 'flex',
    gap: '0.2rem',
    height: '1rem',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  segment: {
    minWidth: '0.4rem',
  },
  legend: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    rowGap: '0.8rem',
    columnGap: '1.2rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    minWidth: 0,
  },
  swatch: {
    width: '0.8rem',
    height: '0.8rem',
    borderRadius: '0.2rem',
    flexShrink: 0,
  },
  legendText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  toneStrong: { backgroundColor: colorVars['--color-fillStrong'] },
  toneInfo: { backgroundColor: colorVars['--color-statusInfo'] },
  toneWarning: { backgroundColor: colorVars['--color-statusWarning'] },
  toneMuted: { backgroundColor: colorVars['--color-fillMuted'] },
  upcoming: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '0.4rem',
    marginInline: '-0.8rem',
    marginBottom: '-0.8rem',
    paddingBlock: '1.2rem',
    paddingInline: '0.8rem',
    borderWidth: 0,
    borderTopWidth: '0.1rem',
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-borderSubtle'],
    borderBottomLeftRadius: '1.2rem',
    borderBottomRightRadius: '1.2rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-fillSubtle'],
      ':active': colorVars['--color-fillSubtle'],
    },
    color: colorVars['--color-textPrimary'],
    fontFamily: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
  },
  upcomingDisabled: {
    cursor: 'default',
    backgroundColor: 'transparent',
  },
  clock: {
    width: '2.8rem',
    height: '2.8rem',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: colorVars['--color-interactivePrimarySubtle'],
    color: colorVars['--color-interactivePrimaryText'],
  },
  clockMuted: {
    backgroundColor: colorVars['--color-fillSubtle'],
    color: colorVars['--color-textTertiary'],
  },
  upcomingText: {
    flex: 1,
    minWidth: 0,
    fontWeight: 500,
  },
  upcomingAmount: {
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  chevron: {
    flexShrink: 0,
    marginLeft: '-0.2rem',
    color: colorVars['--color-textTertiary'],
  },
});

const TONE_STYLE: Record<ShareTone, (typeof styles)[keyof typeof styles]> = {
  strong: styles.toneStrong,
  info: styles.toneInfo,
  warning: styles.toneWarning,
  muted: styles.toneMuted,
};

/**
 * 정기지출 요약 카드 — 이달 총액, 카테고리 비중 바·범례, 7일 안에 빠져나가는 건수 행.
 * @component
 */
export const SummaryCard = ({
  monthLabel,
  totalAmount,
  shares,
  upcomingCount,
  upcomingAmount,
  onUpcomingClick,
}: SummaryCardProps) => {
  const hasUpcoming = upcomingCount > 0;
  const barLabel = shares.map((share) => `${share.name} ${share.percent}%`).join(', ');

  return (
    <Card padding='none' xstyle={styles.card}>
      <div {...stylex.props(styles.head)}>
        <Text variant='body3' color='textSecondary' as='p'>
          {monthLabel} 정기지출
        </Text>
        <p {...stylex.props(styles.total)}>
          {totalAmount.toLocaleString('ko-KR')}
          <span {...stylex.props(styles.unit)}>원</span>
        </p>
      </div>

      {shares.length > 0 && (
        <>
          <div role='img' aria-label={`카테고리 비중: ${barLabel}`} {...stylex.props(styles.bar)}>
            {shares.map((share) => (
              <span
                key={share.name}
                {...stylex.props(styles.segment, TONE_STYLE[share.tone])}
                style={{ flexGrow: Math.max(share.percent, 1) }}
              />
            ))}
          </div>
          <ul {...stylex.props(styles.legend)}>
            {shares.map((share) => (
              <li key={share.name} {...stylex.props(styles.legendItem)}>
                <span {...stylex.props(styles.swatch, TONE_STYLE[share.tone])} />
                <Text variant='small1Regular' color='textSecondary' xstyle={styles.legendText}>
                  {share.name} {share.percent}%
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}

      <button
        type='button'
        disabled={!hasUpcoming}
        aria-label={hasUpcoming ? `7일 안에 빠져나가는 내역 ${upcomingCount}건 보기` : undefined}
        onClick={onUpcomingClick}
        {...stylex.props(styles.upcoming, !hasUpcoming && styles.upcomingDisabled)}
      >
        <span {...stylex.props(styles.clock, !hasUpcoming && styles.clockMuted)}>
          <IconClockOutline size={16} />
        </span>
        {hasUpcoming ? (
          <>
            <Text variant='body3' xstyle={styles.upcomingText}>
              7일 안에{' '}
              <Text variant='body3' color='interactivePrimaryText' xstyle={styles.upcomingAmount}>
                {upcomingCount}건
              </Text>{' '}
              빠져나가요
            </Text>
            <Text variant='body2' xstyle={styles.upcomingAmount}>
              {formatWon(upcomingAmount)}
            </Text>
            <IconChevronRight size={20} xstyle={styles.chevron} />
          </>
        ) : (
          <Text variant='body3' color='textSecondary' xstyle={styles.upcomingText}>
            이번 주 예정된 이체가 없어요
          </Text>
        )}
      </button>
    </Card>
  );
};

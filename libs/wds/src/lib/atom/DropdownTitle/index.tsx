'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/** 제목 글꼴 medium title4Bold / large title2Bold */
export type DropdownTitleSize = 'medium' | 'large';

export interface DropdownTitleProps {
  /** 제목 (예: '2026년 11월') */
  title: string;
  /** 제목을 누르면 선택 시트·피커를 연다 */
  onClick: () => void;
  /** 주면 왼쪽에 이전 버튼을 그린다 */
  onPrev?: () => void;
  /** 주면 오른쪽에 다음 버튼을 그린다 */
  onNext?: () => void;
  /** 이전 버튼 비활성 (범위 시작) */
  prevDisabled?: boolean;
  /** 다음 버튼 비활성 (범위 끝) */
  nextDisabled?: boolean;
  /**
   * 제목 크기
   * @default 'medium'
   */
  size?: DropdownTitleSize;
  /**
   * 제목 옆 ∨ 표시. 양옆 화살표만으로 충분한 상단바(가계부 홈)에서는 끈다
   * @default true
   */
  showChevron?: boolean;
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  iconButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3.2rem',
    height: '3.2rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '50%',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    color: colorVars['--color-textSecondary'],
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    opacity: {
      default: 1,
      ':disabled': 0.3,
    },
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
  },
  titleButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    paddingBlock: '0.4rem',
    paddingInline: '0.8rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    color: colorVars['--color-textPrimary'],
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
  chevronDown: { color: colorVars['--color-textTertiary'], flexShrink: 0 },
});

const Chevron = ({ direction }: { direction: 'left' | 'right' | 'down' }) => {
  const d = direction === 'left' ? 'M12 4l-6 6 6 6' : direction === 'right' ? 'M8 4l6 6-6 6' : 'M5 8l5 5 5-5';
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' aria-hidden='true'>
      <path d={d} stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
};

/**
 * 누르면 선택지를 여는 제목. 양옆 화살표로 이전/다음 항목(주로 달)을 넘긴다.
 * (woolbank DropdownTitle 을 공용화한 것 — ◀ ▶ 문자 대신 접근성 이름을 가진 버튼)
 * @component
 */
export const DropdownTitle = ({
  title,
  onClick,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  size = 'medium',
  showChevron = true,
  xstyle,
}: DropdownTitleProps) => (
  <div {...stylex.props(styles.root, xstyle)}>
    {onPrev && (
      <button
        type='button'
        aria-label='이전'
        disabled={prevDisabled}
        onClick={onPrev}
        {...stylex.props(styles.iconButton)}
      >
        <Chevron direction='left' />
      </button>
    )}
    <button
      type='button'
      aria-haspopup='dialog'
      onClick={onClick}
      {...stylex.props(
        size === 'large' ? typographyStyles.title2Bold : typographyStyles.title4Bold,
        styles.titleButton,
      )}
    >
      {title}
      {showChevron && (
        <span {...stylex.props(styles.chevronDown)}>
          <Chevron direction='down' />
        </span>
      )}
    </button>
    {onNext && (
      <button
        type='button'
        aria-label='다음'
        disabled={nextDisabled}
        onClick={onNext}
        {...stylex.props(styles.iconButton)}
      >
        <Chevron direction='right' />
      </button>
    )}
  </div>
);

'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { Text } from '../Text';

/** medium = 화면 전체 빈 상태(일러스트 120px), small = 목록 섹션 안(일러스트 80px) */
export type EmptyStateSize = 'medium' | 'small';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** 무엇이 없는지 한 줄 ("아직 등록된 가계부가 없어요") */
  message: ReactNode;
  /** 다음 행동을 안내하는 보조 문장 */
  description?: ReactNode;
  /** 일러스트. 없으면 기본 '자료 없음' 클립보드 그림 */
  illustration?: ReactNode;
  /** 행동 유도 요소(보통 Button). 메시지 아래에 놓인다 */
  action?: ReactNode;
  /**
   * 크기
   * @default 'medium'
   */
  size?: EmptyStateSize;
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  illustration: {
    display: 'flex',
    justifyContent: 'center',
    color: colorVars['--color-borderSubtle'],
  },
  illustrationMedium: { width: '12rem', marginBlock: '4rem 0.8rem' },
  illustrationSmall: { width: '8rem', marginBlock: '2.4rem 0.4rem' },
  svg: { width: '100%', height: 'auto' },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingInline: '2.4rem',
    paddingBottom: '4rem',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  message: { marginTop: '0.8rem' },
  description: { marginTop: '0.4rem' },
  action: { marginTop: '1.6rem' },
});

/** woolbank EmptyInfo 의 클립보드 일러스트를 토큰 색으로 단순화한 것 */
const NoDataIllustration = () => (
  <svg viewBox='0 0 160 150' aria-hidden='true' {...stylex.props(styles.svg)}>
    {/* 뒤에 기울어진 종이 */}
    <path
      d='M22 42 L88 22 L112 98 L46 118 Z'
      fill={colorVars['--color-bgSurfaceSecondary']}
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    {/* 앞의 클립보드 */}
    <rect
      x='56'
      y='36'
      width='84'
      height='106'
      rx='8'
      fill={colorVars['--color-bgSurface']}
      stroke='currentColor'
      strokeWidth='2'
    />
    <rect x='78' y='28' width='40' height='16' rx='6' fill={colorVars['--color-brandPrimary']} />
    <circle cx='98' cy='36' r='4' fill={colorVars['--color-bgSurface']} />
    {/* 비어 있는 줄 */}
    <rect x='70' y='64' width='56' height='6' rx='3' fill='currentColor' />
    <rect x='70' y='82' width='40' height='6' rx='3' fill='currentColor' />
    <rect x='70' y='100' width='48' height='6' rx='3' fill='currentColor' />
  </svg>
);

/**
 * 데이터가 없을 때 보여 주는 영역 — 그림 + 메시지 + (선택) 행동 버튼.
 * 목록이 비었을 때 빈 화면을 남기지 말고, 다음 행동을 알려 준다.
 * @component
 */
export const EmptyState = ({
  message,
  description,
  illustration,
  action,
  size = 'medium',
  xstyle,
  ...rest
}: EmptyStateProps) => (
  <div {...rest} {...stylex.props(styles.root, xstyle)}>
    <div
      {...stylex.props(styles.illustration, size === 'medium' ? styles.illustrationMedium : styles.illustrationSmall)}
    >
      {illustration ?? <NoDataIllustration />}
    </div>
    <Text
      variant={size === 'medium' ? 'title4Bold' : 'title5Bold'}
      color='textPrimary'
      as='p'
      alignment='center'
      xstyle={styles.message}
    >
      {message}
    </Text>
    {description && (
      <Text variant='body3' color='textSecondary' as='p' alignment='center' xstyle={styles.description}>
        {description}
      </Text>
    )}
    {action && <div {...stylex.props(styles.action)}>{action}</div>}
  </div>
);

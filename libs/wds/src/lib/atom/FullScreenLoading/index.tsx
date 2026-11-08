'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import { colorVars, zIndexConsts } from '../../style/tokens.stylex';
import { Spinner } from '../Spinner';
import { Text } from '../Text';

export interface FullScreenLoadingProps {
  /** true 면 화면 전체를 덮고 스피너를 보인다 */
  open: boolean;
  /** 스피너 아래 안내 문구 ("저장하는 중이에요") */
  message?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 오버레이에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const styles = stylex.create({
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorVars['--color-bgOverlay'],
    zIndex: zIndexConsts.fullDeem,
    animationName: fadeIn,
    animationDuration: '0.2s',
    animationTimingFunction: 'ease',
  },
  message: {
    marginTop: '2rem',
    opacity: 0.7,
  },
});

/**
 * 전체 화면 로딩 — 저장·삭제처럼 끝날 때까지 아무것도 못 누르게 해야 하는 처리에만 쓴다.
 * 열려 있는 동안 본문 스크롤을 잠근다. 목록 로딩 같은 부분 로딩은 Spinner/SkeletonBar 를 쓴다.
 * @component
 */
export const FullScreenLoading = ({ open, message, xstyle }: FullScreenLoadingProps) => {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div role='alert' aria-busy='true' aria-live='assertive' {...stylex.props(styles.overlay, xstyle)}>
      <Spinner size='large' color='primary' label={message ?? '처리 중'} />
      {message && (
        <Text variant='small1Regular' color='textInverse' as='p' alignment='center' xstyle={styles.message}>
          {message}
        </Text>
      )}
    </div>
  );
};

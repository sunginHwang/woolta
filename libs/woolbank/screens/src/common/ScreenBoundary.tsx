'use client';

import * as stylex from '@stylexjs/stylex';
import { Suspense as MountGate, Text } from '@wds';
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ScreenErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div {...stylex.props(styles.fallback)}>
          <Text as='p' variant='title5Bold' color='textPrimary'>
            데이터를 불러오지 못했어요
          </Text>
          <Text as='p' variant='body3' color='textSecondary' mt={8}>
            로그인이 필요할 수 있어요. bank.woolta.com에서 로그인한 뒤 다시 시도해 주세요.
          </Text>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ScreenBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** true면 클라이언트 마운트 이후에만 children을 렌더링한다 (SSR 데이터 페칭 회피) */
  mountGate?: boolean;
}

export const ScreenBoundary = ({ children, fallback = null, mountGate = false }: ScreenBoundaryProps) => {
  const content = <ScreenErrorBoundary>{children}</ScreenErrorBoundary>;

  if (mountGate) {
    return <MountGate fallback={fallback}>{content}</MountGate>;
  }

  return content;
};

const styles = stylex.create({
  fallback: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40rem',
    padding: '2rem',
  },
});

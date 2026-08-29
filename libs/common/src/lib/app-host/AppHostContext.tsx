'use client';

import { createContext, type ReactNode, useContext } from 'react';

/**
 * 컴포넌트가 렌더되는 호스트 앱 타입.
 * - standalone: provider 미주입 기본값 (각 앱의 기존 단독 동작)
 * - woolta: 대시보드 앱에서 렌더 중
 * - woolbank / blog: 각 원본 앱에서 렌더 중
 */
export type AppHostType = 'standalone' | 'woolta' | 'woolbank' | 'blog';

const AppHostContext = createContext<AppHostType>('standalone');

interface Props {
  /** 현재 앱의 호스트 타입 */
  appHost: AppHostType;
  children: ReactNode;
}

/**
 * 공유 컴포넌트가 어느 앱에서 렌더 중인지 알려주는 provider.
 * 각 앱의 root provider에서 자신의 타입으로 주입한다.
 */
export const AppHostProvider = ({ appHost, children }: Props) => {
  return <AppHostContext.Provider value={appHost}>{children}</AppHostContext.Provider>;
};

export const useAppHost = () => useContext(AppHostContext);

/**
 * 대시보드(woolta)에서 렌더 중인지 여부.
 */
export const useIsDashboardHost = () => useAppHost() === 'woolta';

'use client';

import { createContext, type ReactNode, useContext } from 'react';

/** provider 미주입 시 사용하는 전역 포털 대상 (각 앱 root layout의 <div id='modalDeem' />) */
const GLOBAL_OVERLAY_TARGET_ID = 'modalDeem';

const OverlayPortalContext = createContext<string>(GLOBAL_OVERLAY_TARGET_ID);

interface Props {
  /** 딤/바텀싯을 포털할 대상 요소의 id (호스트가 패널 내부에 렌더해 둔 요소) */
  targetId: string;
  children: ReactNode;
}

/**
 * 딤/바텀싯 등 오버레이의 포털 대상을 바꾸는 provider.
 * 대시보드처럼 화면 일부(패널) 안에서만 오버레이를 노출해야 하는 호스트가
 * 패널 내부 요소의 id를 주입한다. 미주입 시 전역 #modalDeem(전체 화면 노출)으로 동작한다.
 */
export const OverlayPortalProvider = ({ targetId, children }: Props) => {
  return <OverlayPortalContext.Provider value={targetId}>{children}</OverlayPortalContext.Provider>;
};

export const useOverlayPortalTargetId = () => useContext(OverlayPortalContext);

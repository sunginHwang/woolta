'use client';

import { useIsMounted } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { Toast as FeatureToast, useRegisterPushServiceWorker } from '@woolta/woolbank-features';
import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { FullScreenLoading } from '../../components/full-screen-loading/FullScreenLoading';
import { LoadingAtom } from '../../store/layout';
import { Alert } from './alert/Alert';
import { NavigationBar } from './navigation-bar/NavigationBar';
import { Toast } from './toast/Toast';

const NAVIGATION_PATH_LIST = [
  '/',
  '/regular-extenditure',
  '/account-book-statistic',
  '/account-books',
  '/bucket-list',
  '/my-page',
];

interface Props extends PropsWithChildren {
  useNavBar?: boolean;
}

const styles = stylex.create({
  body: {
    height: '100%',
    backgroundColor: colorVars['--color-white'],
  },
  container: {
    width: '100%',
    minWidth: '320px',
    maxWidth: '600px',
    marginBlock: 0,
    marginInline: 'auto',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 0px)',
    backgroundColor: colorVars['--color-white'],
  },
});

/**
 * 레이아웃 영역
 * @component
 */
export const Layout = ({ children }: Props) => {
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const { isLoading, message } = useAtomValue(LoadingAtom);
  // 푸시 서비스워커는 등록만 한다 — 권한 요청은 마이페이지 알림 토글에서 사용자 제스처와 함께.
  useRegisterPushServiceWorker();

  const useNavBar = NAVIGATION_PATH_LIST.find((path) => pathname === path);
  return (
    <div {...stylex.props(styles.body)}>
      <div {...stylex.props(styles.container)}>
        {children}
        {useNavBar && <NavigationBar />}
        {isMounted && (
          <>
            <FullScreenLoading loading={isLoading} message={message} />
            <Alert />
            <Toast />
            {/* lib(woolbank-features) 컴포넌트가 띄우는 토스트는 별도 atom 을 쓴다 */}
            <FeatureToast />
          </>
        )}
      </div>
    </div>
  );
};

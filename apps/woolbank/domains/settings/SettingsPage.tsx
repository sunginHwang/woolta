'use client';

import { withSuspense } from '@common';
import { Skeleton } from '@wds';
import { usePushSetting, useWeeklyBudget } from '@woolta/woolbank-features';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '../../hooks/queries/useUserInfo';
import { useThemeType } from '../../store/theme';
import { SettingsView } from './SettingsView';

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '-';

/**
 * 설정 — 데이터·상태 훅을 모아 SettingsView 에 넘긴다.
 * @component
 */
const SettingsPage = () => {
  const router = useRouter();
  const { amount } = useWeeklyBudget();
  const push = usePushSetting();
  const { isShareUser } = useUserInfo();
  const { themeType, setThemeType } = useThemeType();

  return (
    <SettingsView
      weeklyBudgetAmount={amount}
      push={push}
      isShareUser={isShareUser}
      themeType={themeType}
      onThemeChange={setThemeType}
      appVersion={APP_VERSION}
      onBackClick={router.back}
    />
  );
};

export default withSuspense(SettingsPage, <Skeleton.List rows={6} />);

'use client';

import * as stylex from '@stylexjs/stylex';
import {
  BottomSheet,
  Header,
  IconBellOutline,
  IconCalendar,
  IconThemeOutline,
  IconWalletOutline,
  ListRow,
  ListSectionHeader,
  type ThemeType,
  Toggle,
} from '@wds';
import { formatWon, PUSH_SETTING_HELPER_TEXT, type PushSettingModel } from '@woolta/woolbank-features';
import Link from 'next/link';
import { useState } from 'react';

export interface SettingsViewProps {
  /** 설정된 주간 예산(원). 0 이면 미설정 */
  weeklyBudgetAmount: number;
  /** 푸시 설정 상태 머신 — 스토리에서 각 상태를 고정하려고 props 로 받는다 */
  push: Pick<PushSettingModel, 'state' | 'setting' | 'isBusy' | 'enable' | 'disable' | 'setRegularExpenditure'>;
  /** 공유코드 세션 — 알림 종류 설정은 주인만 바꿀 수 있어 숨긴다 */
  isShareUser: boolean;
  themeType: ThemeType;
  onThemeChange: (themeType: ThemeType) => void;
  /** 앱 버전 문자열. 빌드에 없으면 '-' */
  appVersion: string;
  onBackClick: () => void;
}

const THEME_LABEL: Record<ThemeType, string> = { light: '라이트', dark: '다크' };
const THEME_ITEMS = (Object.keys(THEME_LABEL) as ThemeType[]).map((value) => ({ value, label: THEME_LABEL[value] }));

const styles = stylex.create({
  main: {
    paddingBottom: '4rem',
  },
  firstHeader: {
    paddingTop: '2rem',
  },
});

/**
 * 설정 화면 — 예산 · 알림 · 화면 · 정보 네 섹션. 상태는 전부 props 로 받는다.
 * @component
 */
export const SettingsView = ({
  weeklyBudgetAmount,
  push,
  isShareUser,
  themeType,
  onThemeChange,
  appVersion,
  onBackClick,
}: SettingsViewProps) => {
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);

  const isPushOn = push.state === 'on';
  const canTogglePush = push.state === 'on' || push.state === 'off';
  const pushHelper = PUSH_SETTING_HELPER_TEXT[push.state];
  // VAPID 키가 없는 빌드에서는 알림 섹션을 통째로 숨긴다 — 사용자가 고칠 수 있는 문제가 아니다
  const showPushSection = push.state !== 'unconfigured';

  const handlePushChange = (checked: boolean) => {
    // 권한 요청은 클릭 핸들러에서 바로 시작돼야 한다(iOS 제스처 규칙)
    void (checked ? push.enable() : push.disable());
  };

  const handleThemeSelect = (value: string) => {
    onThemeChange(value === 'dark' ? 'dark' : 'light');
    setIsThemeSheetOpen(false);
  };

  return (
    <>
      <Header.Sub title='설정' onBackClick={onBackClick} />
      <main {...stylex.props(styles.main)}>
        <ListSectionHeader xstyle={styles.firstHeader}>예산</ListSectionHeader>
        <ListRow
          leading={<IconWalletOutline size={20} />}
          title='주간 예산'
          subtitle='매주 월요일에 새로 시작해요'
          value={weeklyBudgetAmount > 0 ? formatWon(weeklyBudgetAmount) : '미설정'}
          valueTone='secondary'
          chevron
          href='/settings/weekly-budget'
          linkComponent={Link}
        />

        {showPushSection && (
          <>
            <ListSectionHeader>알림</ListSectionHeader>
            <ListRow
              leading={<IconBellOutline size={20} />}
              title='푸시 알림'
              subtitle={pushHelper}
              trailing={
                <Toggle
                  aria-label='푸시 알림'
                  checked={isPushOn}
                  disabled={!canTogglePush || push.isBusy}
                  onChange={handlePushChange}
                />
              }
            />
            {!isShareUser && (
              <ListRow
                leading={<IconCalendar size={20} />}
                title='정기지출 결제 전날 알림'
                subtitle='이체 하루 전에 알려드려요'
                trailing={
                  <Toggle
                    aria-label='정기지출 결제 전날 알림'
                    checked={push.setting.regularExpenditure}
                    disabled={!isPushOn || push.isBusy}
                    onChange={(checked) => void push.setRegularExpenditure(checked)}
                  />
                }
              />
            )}
          </>
        )}

        <ListSectionHeader>화면</ListSectionHeader>
        <ListRow
          leading={<IconThemeOutline size={20} />}
          title='테마'
          value={THEME_LABEL[themeType]}
          valueTone='secondary'
          chevron
          onClick={() => setIsThemeSheetOpen(true)}
        />

        <ListSectionHeader>정보</ListSectionHeader>
        <ListRow title='앱 버전' value={appVersion} valueTone='secondary' />
      </main>

      <BottomSheet.Menu
        open={isThemeSheetOpen}
        onClose={() => setIsThemeSheetOpen(false)}
        title='테마'
        items={THEME_ITEMS}
        value={themeType}
        onSelect={handleThemeSelect}
      />
    </>
  );
};

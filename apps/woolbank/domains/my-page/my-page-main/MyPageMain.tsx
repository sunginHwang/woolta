'use client';

import * as stylex from '@stylexjs/stylex';
import { IconSettingsOutline, ListRow } from '@wds';
import { NotificationInboxEntry, PushSettingSection } from '@woolta/woolbank-features';
import Link from 'next/link';
import { Header } from '../../../components/Header/Header';
import { UserInfoCard } from './user-info-card/UserInfoCard';

const styles = stylex.create({
  container: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
  settingsEntry: {
    marginTop: '1.6rem',
    marginInline: '-1.6rem',
  },
});

export const MyPageMain = () => {
  return (
    <>
      <Header title='나의 뱅킷리스트' />
      <main {...stylex.props(styles.container)}>
        <UserInfoCard />
        <ListRow
          leading={<IconSettingsOutline size={20} />}
          title='설정'
          subtitle='주간 예산 · 알림 · 테마'
          chevron
          href='/settings'
          linkComponent={Link}
          xstyle={styles.settingsEntry}
        />
        <NotificationInboxEntry />
        <PushSettingSection />
      </main>
    </>
  );
};

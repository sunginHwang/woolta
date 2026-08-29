'use client';

import * as stylex from '@stylexjs/stylex';
import { Header } from '../../../components/Header/Header';
import { UserInfoCard } from './user-info-card/UserInfoCard';

const styles = stylex.create({
  container: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
});

export const MyPageMain = () => {
  return (
    <>
      <Header title='나의 뱅킷리스트' />
      <main {...stylex.props(styles.container)}>
        <UserInfoCard />
      </main>
    </>
  );
};

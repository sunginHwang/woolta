'use client';

import { useToggle } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Badge, BottomSheet, DropdownTitle, IconBellOutline, IconSettingsOutline } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { useUnreadNotificationCountQuery } from '@woolta/woolbank-features';
import dayjs, { type Dayjs } from 'dayjs';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useMemo } from 'react';
import { selectedAccountBookDateAtom } from '../_common/stores/accountbookDate';

/** 월 선택 시트에 보여줄 범위 — 최근 5년 */
const MONTH_FOR_5_YEAR = 60;

const styles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '5.6rem',
    paddingInline: '0.8rem',
  },
  // 왼쪽 빈 칸은 오른쪽 아이콘 두 개와 같은 폭이라 제목이 정확히 가운데 온다
  side: {
    display: 'flex',
    alignItems: 'center',
    width: '8rem',
    flexShrink: 0,
  },
  sideRight: {
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: 0,
  },
  iconLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    color: colorVars['--color-textPrimary'],
    textDecoration: 'none',
    backgroundColor: {
      default: 'transparent',
      ':active': colorVars['--color-fillSubtle'],
    },
  },
});

const toMonthMenu = (month: Dayjs) => ({ value: month.format('YYYY-MM'), label: month.format('YYYY년 M월') });

const getTitle = (selectedDate: string) =>
  dayjs().isSame(dayjs(selectedDate), 'year')
    ? dayjs(selectedDate).format('M월')
    : dayjs(selectedDate).format('YYYY년 M월');

/**
 * 가계부 홈 상단바 — 가운데 월 이동, 오른쪽 알림(미읽음 점)·설정.
 * @component
 */
export const HomeTopbar = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedAccountBookDateAtom);
  const [isMonthPickerOpen, toggleMonthPicker] = useToggle(false);
  // 알림 수는 부가 정보 — 실패해도 홈을 막지 않도록 suspense 없이 읽는다
  const { data } = useUnreadNotificationCountQuery();
  const unreadCount = data?.getWoolBankUnreadNotificationCount ?? 0;

  const monthItems = useMemo(
    () => Array.from({ length: MONTH_FOR_5_YEAR }, (_, index) => toMonthMenu(dayjs().subtract(index, 'month'))),
    [],
  );

  const moveMonth = (diff: number) => setSelectedDate(dayjs(selectedDate).add(diff, 'month').format('YYYY-MM'));

  const handleMonthSelect = (month: string) => {
    setSelectedDate(month);
    toggleMonthPicker(false);
  };

  return (
    <>
      <header {...stylex.props(styles.header)}>
        <span aria-hidden='true' {...stylex.props(styles.side)} />
        <div {...stylex.props(styles.center)}>
          <DropdownTitle
            title={getTitle(selectedDate)}
            onClick={() => toggleMonthPicker(true)}
            onPrev={() => moveMonth(-1)}
            onNext={() => moveMonth(1)}
          />
        </div>
        <div {...stylex.props(styles.side, styles.sideRight)}>
          <Link
            href='/notifications'
            aria-label={unreadCount > 0 ? `알림, 읽지 않은 알림 ${unreadCount}개` : '알림'}
            {...stylex.props(styles.iconLink)}
          >
            <Badge dot={unreadCount > 0} offset={2}>
              <IconBellOutline />
            </Badge>
          </Link>
          <Link href='/settings' aria-label='설정' {...stylex.props(styles.iconLink)}>
            <IconSettingsOutline />
          </Link>
        </div>
      </header>
      <BottomSheet.Menu
        title='월 선택하기'
        items={monthItems}
        value={selectedDate}
        open={isMonthPickerOpen}
        onClose={() => toggleMonthPicker(false)}
        onSelect={handleMonthSelect}
      />
    </>
  );
};

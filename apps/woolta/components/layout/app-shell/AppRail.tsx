'use client';

import * as stylex from '@stylexjs/stylex';
import { useConfirm } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { CalendarShareNotification } from '@woolta/calendar-features';
import { useLogout } from '@woolta/user-features';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiChevronsLeft, FiChevronsRight, FiGrid, FiLogOut, FiSettings } from 'react-icons/fi';
import { layoutConsts } from '../../../style/layouts.stylex';
import { railExpandedAtom } from '../store';
import { APP_LIST } from './apps';
import SettingsPopover from './SettingsPopover';

const styles = stylex.create({
  rail: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '0.8rem',
    width: layoutConsts.railWidth,
    flexShrink: 0,
    paddingBlock: '1.2rem',
    paddingInline: '0.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    borderRightWidth: '0.1rem',
    borderRightStyle: 'solid',
    borderRightColor: colorVars['--color-borderSubtle'],
    transitionProperty: 'width',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    overflow: 'hidden',
  },
  railExpanded: {
    width: layoutConsts.railExpandedWidth,
  },
  // RailLink/RailButton 공통 (원본 itemBaseCss)
  item: {
    display: 'flex',
    alignItems: 'center',
    height: layoutConsts.railItemSize,
    borderRadius: '1.2rem',
    justifyContent: 'center',
    padding: 0,
    gap: '1rem',
    color: colorVars['--color-textInactive'],
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
  },
  itemExpanded: {
    justifyContent: 'flex-start',
    paddingBlock: 0,
    paddingInline: '1rem',
  },
  itemActive: {
    color: colorVars['--color-interactivePrimary'],
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  iconSlot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '2rem',
  },
  label: {
    fontSize: '1.3rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  divider: {
    height: '0.1rem',
    marginBlock: 0,
    marginInline: '0.8rem',
    backgroundColor: colorVars['--color-borderSubtle'],
  },
  spacer: {
    flex: 1,
  },
  // 알림 팝오버 — SettingsPopover 와 같은 기준(레일 오른쪽, 하단)에 띄운다
  notificationPopover: {
    left: `calc(${layoutConsts.railWidth} + 0.8rem)`,
    bottom: '1.2rem',
  },
  notificationPopoverRailExpanded: {
    left: `calc(${layoutConsts.railExpandedWidth} + 0.8rem)`,
  },
});

const AppRail = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { openConfirm } = useConfirm();
  const { logout, isLoggingOut } = useLogout();
  const [isExpanded, setIsExpanded] = useAtom(railExpandedAtom);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    const isConfirmed = await openConfirm({ message: '정말 로그아웃 하시겠습니까?' });

    if (!isConfirmed) {
      return;
    }

    // 서버 폐기가 실패해도 로그인 화면으로 보낸다 — 클라이언트 세션은 버리는 게 안전하다.
    try {
      await logout();
    } finally {
      router.replace('/login');
    }
  };

  const itemProps = (isActive: boolean) =>
    stylex.props(styles.item, isExpanded && styles.itemExpanded, isActive && styles.itemActive);

  return (
    <aside {...stylex.props(styles.rail, isExpanded && styles.railExpanded)}>
      <Link href='/' title='홈' {...itemProps(pathname === '/')}>
        <span {...stylex.props(styles.iconSlot)}>
          <FiGrid size={20} />
        </span>
        {isExpanded && <span {...stylex.props(styles.label)}>홈</span>}
      </Link>
      <div {...stylex.props(styles.divider)} />
      {APP_LIST.map(({ key, name, href, icon: Icon }) => (
        <Link key={key} href={href} title={name} {...itemProps(pathname.startsWith(href))}>
          <span {...stylex.props(styles.iconSlot)}>
            <Icon size={20} />
          </span>
          {isExpanded && <span {...stylex.props(styles.label)}>{name}</span>}
        </Link>
      ))}
      <div {...stylex.props(styles.spacer)} />
      <CalendarShareNotification
        isExpanded={isExpanded}
        itemStyle={[styles.item, isExpanded && styles.itemExpanded]}
        popoverStyle={[styles.notificationPopover, isExpanded && styles.notificationPopoverRailExpanded]}
      />
      <button
        type='button'
        title={isExpanded ? '접기' : '펼치기'}
        onClick={() => setIsExpanded((prev) => !prev)}
        {...itemProps(false)}
      >
        <span {...stylex.props(styles.iconSlot)}>
          {isExpanded ? <FiChevronsLeft size={20} /> : <FiChevronsRight size={20} />}
        </span>
        {isExpanded && <span {...stylex.props(styles.label)}>접기</span>}
      </button>
      <button
        type='button'
        title='설정'
        onClick={() => setIsSettingsOpen((prev) => !prev)}
        {...itemProps(isSettingsOpen)}
      >
        <span {...stylex.props(styles.iconSlot)}>
          <FiSettings size={20} />
        </span>
        {isExpanded && <span {...stylex.props(styles.label)}>설정</span>}
      </button>
      <button type='button' title='로그아웃' disabled={isLoggingOut} onClick={handleLogout} {...itemProps(false)}>
        <span {...stylex.props(styles.iconSlot)}>
          <FiLogOut size={20} />
        </span>
        {isExpanded && <span {...stylex.props(styles.label)}>로그아웃</span>}
      </button>
      {isSettingsOpen && <SettingsPopover onClose={() => setIsSettingsOpen(false)} />}
    </aside>
  );
};

export default AppRail;

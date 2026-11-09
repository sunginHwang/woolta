'use client';

import { useScrollDirection } from '@common';
import {
  BottomNavigation,
  type BottomNavigationItem,
  IconAccountFill,
  IconAccountOutline,
  IconChartFill,
  IconChartOutline,
  IconPigFill,
  IconPigOutline,
  IconPlus,
  IconWalletFill,
  IconWalletOutline,
} from '@wds';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserInfo } from '../../../hooks/queries/useUserInfo';

const NAVIGATION_ITEMS: (BottomNavigationItem & { href: string })[] = [
  { value: 'home', label: '가계부', href: '/', icon: <IconPigOutline />, selectedIcon: <IconPigFill /> },
  {
    value: 'regular-expenditure',
    label: '정기지출',
    href: '/regular-extenditure',
    icon: <IconWalletOutline />,
    selectedIcon: <IconWalletFill />,
  },
  {
    value: 'statistic',
    label: '통계',
    href: '/account-book-statistic',
    icon: <IconChartOutline />,
    selectedIcon: <IconChartFill />,
  },
  { value: 'me', label: '내 정보', href: '/my-page', icon: <IconAccountOutline />, selectedIcon: <IconAccountFill /> },
];

const ACCOUNT_BOOK_SAVE_PATH = '/account-books/save';

/**
 * 하단 네비게이션바 — wds BottomNavigation 에 라우터·스크롤 방향·공유 유저 여부를 연결한다.
 * @component
 */
export const NavigationBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const scrollDirection = useScrollDirection();
  const { isShareUser } = useUserInfo();
  // 클릭 즉시 활성 색상을 바꾸기 위한 낙관적 경로. 실제 pathname 커밋을 기다리지 않는다.
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // 실제 pathname 이 커밋되면 낙관적 값 해제
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname 변화에만 반응하는 리셋 효과
  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  const activePath = pendingPath ?? pathname;
  const activeValue = NAVIGATION_ITEMS.find((item) => item.href === activePath)?.value ?? '';

  const handleChange = (value: string) => {
    setPendingPath(NAVIGATION_ITEMS.find((item) => item.value === value)?.href ?? null);
  };

  return (
    <BottomNavigation
      items={NAVIGATION_ITEMS}
      value={activeValue}
      onChange={handleChange}
      linkComponent={Link}
      hidden={scrollDirection === 'down'}
      // 공유코드 세션은 읽기 전용이라 내역 추가 버튼을 두지 않는다
      centerAction={
        isShareUser
          ? undefined
          : {
              icon: <IconPlus size={22} />,
              label: '내역 추가',
              onClick: () => router.push(ACCOUNT_BOOK_SAVE_PATH),
            }
      }
    />
  );
};

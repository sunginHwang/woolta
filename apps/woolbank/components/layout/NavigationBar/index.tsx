import styled from '@emotion/styled';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { isIOS } from 'libs/common/src/lib/utils/device';
import {
  IconAccountOutline,
  IconBucketOutline,
  IconHomeOutline,
  IconPigOutline,
  IconWalletOutline,
} from '../../common/Icon';

const navigations: { name: string; value: string; link: string; icon: ReactNode }[] = [
  {
    name: '홈',
    value: 'home',
    link: '/',
    icon: <IconHomeOutline />,
  },
  {
    name: '자산관리',
    value: 'accounts',
    link: '/accounts',
    icon: <IconWalletOutline />,
  },
  {
    name: '버킷리스트',
    value: 'bucketList',
    link: '/bucket-list',
    icon: <IconBucketOutline />,
  },
  {
    name: '가계부',
    value: 'accountBooks',
    link: '/account-books',
    icon: <IconPigOutline />,
  },
  {
    name: '내 정보',
    value: 'me',
    link: '/mypage',
    icon: <IconAccountOutline />,
  },
];

/**
 * 하단 네이게이션바
 * @component
 */
const NavigationBar = () => {
  const pathname = usePathname();

  return (
    <SC.NavigationBar isExtend={isIOS} data-cy='navigationBar'>
      {navigations.map((navigation) => {
        return (
          <SC.NavigationBarTag key={navigation.name} data-cy={navigation.name} active={navigation.link === pathname}>
            <Link href={navigation.link}>
              {navigation.icon}
              <span>{navigation.name}</span>
            </Link>
          </SC.NavigationBarTag>
        );
      })}
    </SC.NavigationBar>
  );
};

export default NavigationBar;

const SC = {
  NavigationBar: styled.div<{ isExtend: boolean }>`
    display: flex;
    align-items: ${({ isExtend }) => (isExtend ? 'flex-start' : 'center')};
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 5.5rem;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray300};
    background-color: ${({ theme }) => theme.colors.white};
    z-index: 100;
  `,
  NavigationBarTag: styled.div<{ active: boolean }>`
    letter-spacing: 0;
    text-align: center;
    width: 100%;
    height: 56px;
    line-height: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: ${({ active, theme }) => (active ? theme.colors.red500 : theme.colors.grayPrimary)};

    a {
      width: 100%;
      line-height: 1.2rem;
      padding: 0 4px;
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: ${({ active, theme }) => (active ? theme.colors.red500 : theme.colors.graySecondary)};

      span {
        margin-top: 0.4rem;
        font-size: 1.2rem;
        color: ${({ active, theme }) => (active ? theme.colors.red500 : theme.colors.graySecondary)};
      }
    }
  `,
};

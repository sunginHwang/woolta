import { useScrollDirection } from '@common';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { styled } from 'styled-components';

import { IconAccountOutline, IconPigOutline, IconWalletOutline } from '../../atom/Icon';
import { AddButton } from './AddIcon';

const LINK_VARIANT = {
  initial: { scale: 1 },
  tap: { scale: 0.85 },
  release: {
    scale: [1.05, 1],
    transition: {
      duration: 0.3,
      times: [0, 1],
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};
const NAVIGATION_LIST: { name?: string; value: string; link?: string; icon: ReactNode }[] = [
  {
    name: '가계부',
    value: 'home',
    link: '/',
    icon: <IconPigOutline />,
  },
  {
    name: '정기지출',
    value: 'regular-extenditure',
    link: '/regular-extenditure',
    icon: <IconWalletOutline />,
  },
  {
    value: 'addAccountBook',
    icon: <AddButton />,
  },
  {
    name: '가계부 통계',
    value: 'account-book-statistic',
    link: '/account-book-statistic',
    icon: <IconAccountOutline />,
  },
  {
    name: '내 정보',
    value: 'me',
    link: '/my-page',
    icon: <IconAccountOutline />,
  },
];

/**
 * 하단 네이게이션바
 * @component
 */
export const NavigationBar = () => {
  const pathname = usePathname();
  const [isShowNavigationBar, setIsShowNavigationBar] = useState(true);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    setIsShowNavigationBar(scrollDirection === 'down' ? false : true);
  }, [scrollDirection]);

  return (
    <SC.Container
      initial={{ y: 0 }}
      animate={{
        y: isShowNavigationBar ? 0 : 100,
      }}
      transition={{
        duration: 0.25,
        ease: 'easeInOut',
      }}
    >
      <SC.NavigationBar>
        {NAVIGATION_LIST.map((navigation, index) => {
          const isActive = navigation.link === pathname;
          const is_menu_icon = !!navigation.name;

          return (
            <SC.NavigationBarTag
              key={`${index}-${navigation.name}`}
              data-cy={navigation.name}
              className={isActive ? 'active' : ''}
            >
              {is_menu_icon && (
                <Link href={navigation.link ?? ''} passHref>
                  <SC.Link
                    $isActive={isActive}
                    variants={LINK_VARIANT}
                    initial='initial'
                    whileTap='tap'
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 17,
                    }}
                  >
                    {navigation.icon}
                    <span>{navigation.name}</span>
                  </SC.Link>
                </Link>
              )}
              {!is_menu_icon && navigation.icon}
            </SC.NavigationBarTag>
          );
        })}
      </SC.NavigationBar>
    </SC.Container>
  );
};

const SC = {
  Container: styled(motion.nav)`
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 5.5rem;
    position: fixed;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray300};
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 16px 16px 0 0;
    z-index: 100;
  `,
  NavigationBar: styled(motion.div)`
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;

    .active {
      color: ${({ theme }) => theme.colors.grayPrimary};

      a {
        color: ${({ theme }) => theme.colors.red500};
      }
      span {
        color: ${({ theme }) => theme.colors.red500};
      }
    }
  `,
  NavigationBarTag: styled.div`
    letter-spacing: 0;
    text-align: center;
    width: 100%;
    height: 56px;
    line-height: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: ${({ theme }) => theme.colors.grayPrimary};
  `,
  Link: styled(motion.div)<{ $isActive: boolean }>`
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
    gap: 0.1rem;

    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.red500 : theme.colors.graySecondary)};

    span {
      margin-top: 0.4rem;
      font-size: 1.1rem;
      color: ${({ theme }) => theme.colors.graySecondary};
    }
  `,
};

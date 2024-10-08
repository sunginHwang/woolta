import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { styled } from 'styled-components';

import { IconAccountOutline, IconBucketOutline, IconPigOutline, IconWalletOutline } from '../../atom/Icon';

const navigations: { name: string; value: string; link: string; icon: ReactNode }[] = [
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
    name: '가계부 통계',
    value: 'account-book-statistic',
    link: '/account-book-statistic',
    icon: <IconAccountOutline />,
  },
  {
    name: '버킷리스트',
    value: 'bucketList',
    link: '/bucket-list',
    icon: <IconBucketOutline />,
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
const NavigationBar = () => {
  const pathname = usePathname();

  return (
    <SC.Container>
      <SC.NavigationBar>
        {navigations.map((navigation) => {
          return (
            <SC.NavigationBarTag
              key={navigation.name}
              data-cy={navigation.name}
              className={navigation.link === pathname ? 'active' : ''}
            >
              <Link href={navigation.link}>
                {navigation.icon}
                <span>{navigation.name}</span>
              </Link>
            </SC.NavigationBarTag>
          );
        })}
      </SC.NavigationBar>
    </SC.Container>
  );
};

export default NavigationBar;

const SC = {
  Container: styled.nav`
    position: relative;
    z-index: 100;
  `,
  NavigationBar: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 5.5rem;
    padding-bottom: 34px;
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray300};
    background-color: ${({ theme }) => theme.colors.white};

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
      color: ${({ theme }) => theme.colors.graySecondary};

      span {
        margin-top: 0.4rem;
        font-size: 1.2rem;
        color: ${({ theme }) => theme.colors.graySecondary};
      }
    }
  `,
};

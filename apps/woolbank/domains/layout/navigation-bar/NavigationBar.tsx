import { useScrollDirection } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { motion, type Variants } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

import { IconAccountOutline, IconPigOutline, IconWalletOutline } from '../../../components/atom/Icon';
import { AddButton } from './AddIcon';

const LINK_VARIANT: Variants = {
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

const styles = stylex.create({
  container: {
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '5.5rem',
    position: 'fixed',
    paddingBottom: 'env(safe-area-inset-bottom)',
    borderTopWidth: '0.1rem',
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-gray300'],
    backgroundColor: colorVars['--color-white'],
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: zIndexConsts.navigationBar,
  },
  navigationBarInner: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
  },
  navTag: {
    letterSpacing: 0,
    textAlign: 'center',
    width: '100%',
    height: '56px',
    lineHeight: '1.2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    color: colorVars['--color-grayPrimary'],
  },
  link: {
    width: '100%',
    lineHeight: '1.2rem',
    paddingBlock: 0,
    paddingInline: '4px',
    flexBasis: 0,
    flexGrow: 1,
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.1rem',
    color: colorVars['--color-graySecondary'],
  },
  linkActive: {
    color: colorVars['--color-red500'],
  },
  linkSpan: {
    marginTop: '0.4rem',
    fontSize: '1.1rem',
    color: colorVars['--color-graySecondary'],
  },
  linkSpanActive: {
    color: colorVars['--color-red500'],
  },
});

/**
 * 하단 네이게이션바
 * @component
 */
export const NavigationBar = () => {
  const pathname = usePathname();
  const [isShowNavigationBar, setIsShowNavigationBar] = useState(true);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const scrollDirection = useScrollDirection();

  // 클릭 즉시 활성 색상을 바꾸기 위한 낙관적 경로. 실제 pathname 커밋을 기다리지 않는다.
  const activePath = pendingPath ?? pathname;

  useEffect(() => {
    setIsShowNavigationBar(scrollDirection === 'down' ? false : true);
  }, [scrollDirection]);

  useEffect(() => {
    setPendingPath(null); // 실제 pathname이 커밋되면 낙관적 값 해제
  }, [pathname]);

  return (
    <motion.nav
      {...stylex.props(styles.container)}
      initial={{ y: 0 }}
      animate={{
        y: isShowNavigationBar ? 0 : 100,
      }}
      transition={{
        duration: 0.25,
        ease: 'easeInOut',
      }}
    >
      <motion.div {...stylex.props(styles.navigationBarInner)}>
        {NAVIGATION_LIST.map((navigation, index) => {
          const isActive = navigation.link === activePath;
          const is_menu_icon = !!navigation.name;

          return (
            <div key={`${index}-${navigation.name}`} {...stylex.props(styles.navTag)} data-cy={navigation.name}>
              {is_menu_icon && (
                <Link href={navigation.link ?? ''} passHref onClick={() => setPendingPath(navigation.link ?? null)}>
                  <motion.div
                    {...stylex.props(styles.link, isActive && styles.linkActive)}
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
                    <span {...stylex.props(styles.linkSpan, isActive && styles.linkSpanActive)}>{navigation.name}</span>
                  </motion.div>
                </Link>
              )}
              {!is_menu_icon && navigation.icon}
            </div>
          );
        })}
      </motion.div>
    </motion.nav>
  );
};

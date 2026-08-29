'use client';

import { useScrollDirection } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccountBookListRouterQuery } from '../_shared/hooks/useAccountBookListRouterQuery';
import { useWoolbankRoutes } from '../_shared/routes/context';

export const AccountBookTabs = () => {
  const routes = useWoolbankRoutes();
  const TAB_LIST = [
    { label: '내역', value: 'list', link: `${routes.main}?type=list` },
    { label: '달력', value: 'calendar', link: `${routes.main}?type=calendar` },
  ];

  const { activeTab } = useAccountBookListRouterQuery();
  const [isShowNavigationBar, setIsShowNavigationBar] = useState(true);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    setIsShowNavigationBar(scrollDirection !== 'down');
  }, [scrollDirection]);

  const selectedIndex = TAB_LIST.findIndex((tab) => tab.value === activeTab);

  return (
    <motion.div
      {...stylex.props(styles.stickyWrapper)}
      initial={{ y: 0 }}
      animate={{ y: isShowNavigationBar ? 0 : 56 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <div {...stylex.props(styles.container)}>
        <ul {...stylex.props(styles.tabList)}>
          {TAB_LIST.map(({ link, value, label }) => {
            const isActive = activeTab === value;
            return (
              <li key={label} {...stylex.props(styles.item)}>
                <Link replace href={link} {...stylex.props(styles.itemLink)}>
                  <Text variant='title6Bold' color={isActive ? 'textPrimary' : 'textTertiary'} as='p'>
                    {label}
                  </Text>
                </Link>
              </li>
            );
          })}
          <motion.div
            {...stylex.props(styles.animate)}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            initial={{ left: 0 }}
            animate={{
              left: selectedIndex === 0 ? '1px' : `calc(${50 * selectedIndex}% - 1px)`,
            }}
          />
        </ul>
      </div>
    </motion.div>
  );
};

const styles = stylex.create({
  // sticky keeps the tab bar at the bottom of the dashboard scroll container, not the viewport
  stickyWrapper: {
    position: 'sticky',
    bottom: '1rem',
    left: 0,
    right: 0,
    paddingBottom: 'env(safe-area-inset-bottom)',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  container: {
    marginTop: '1rem',
    paddingBlock: '8px',
    paddingInline: '12px',
    pointerEvents: 'auto',
  },
  tabList: {
    display: 'flex',
    width: '120px',
    paddingBlock: '2px',
    paddingInline: '2px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '32px',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    position: 'relative',
    zIndex: 1,
  },
  item: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingBlock: '8px',
    paddingInline: '16px',
    justifyContent: 'center',
  },
  itemLink: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animate: {
    position: 'absolute',
    height: 'calc(100% - 12px)',
    width: 'calc(50% - 16px)',
    backgroundColor: colorVars['--color-bgSurface'],
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderDefault'],
    borderRadius: '32px',
    zIndex: -1,
    margin: '8px',
  },
});

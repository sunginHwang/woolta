'use client';

import { useScrollDirection } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccountBookListRouterQuery } from '../_common/hooks/useAccountBookListRouterQuery';

const TAB_LIST = [
  { label: '내역', value: 'list', link: '/?type=list' },
  { label: '달력', value: 'calendar', link: '/?type=calendar' },
];

const styles = stylex.create({
  fixedWrapper: {
    position: 'fixed',
    bottom: '80px',
    left: 0,
    right: 0,
    paddingBottom: 'env(safe-area-inset-bottom)',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    marginTop: '1rem',
    paddingBlock: '8px',
    paddingInline: '12px',
  },
  tabList: {
    display: 'flex',
    width: '120px',
    padding: '2px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '32px',
    backgroundColor: colorVars['--color-gray100'],
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
    backgroundColor: colorVars['--color-white'],
    borderRadius: '32px',
    zIndex: -1,
    margin: '8px',
  },
});

export const AccountBookTabs = () => {
  const { activeTab } = useAccountBookListRouterQuery();
  const [isShowNavigationBar, setIsShowNavigationBar] = useState(true);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    setIsShowNavigationBar(scrollDirection === 'down' ? false : true);
  }, [scrollDirection]);

  const selectedIndex = TAB_LIST.findIndex((tab) => tab.value === activeTab);

  return (
    <motion.div
      {...stylex.props(styles.fixedWrapper)}
      initial={{ y: 0 }}
      animate={{
        y: isShowNavigationBar ? 0 : 56,
      }}
      transition={{
        duration: 0.25,
        ease: 'easeInOut',
      }}
    >
      <div {...stylex.props(styles.container)}>
        <ul {...stylex.props(styles.tabList)}>
          {TAB_LIST.map(({ link, value, label }) => {
            const isActive = activeTab === value;
            return (
              <li {...stylex.props(styles.item)} key={label}>
                <Link replace href={link} {...stylex.props(styles.itemLink)}>
                  <Text variant='title6Bold' color={isActive ? 'gray900' : 'gray500'} as='p'>
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

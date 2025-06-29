'use client';

import { Text } from '@wds';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { styled } from 'styled-components';
import { useAccountBookListRouterQuery } from '../hooks/useAccountBookListRouterQuery';
import { useEffect, useState } from 'react';
import { useScrollDirection } from '@common';

const TAB_LIST = [
  { label: '내역', value: 'list', link: '/?type=list' },
  { label: '달력', value: 'calendar', link: '/?type=calendar' },
];

export const AccountBookTabs = () => {
  const { activeTab } = useAccountBookListRouterQuery();
  const [isShowNavigationBar, setIsShowNavigationBar] = useState(true);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    setIsShowNavigationBar(scrollDirection === 'down' ? false : true);
  }, [scrollDirection]);

  const selectedIndex = TAB_LIST.findIndex((tab) => tab.value === activeTab);

  return (
    <SC.FixedWrapper
      initial={{ y: 0 }}
      animate={{
        y: isShowNavigationBar ? 0 : 56,
      }}
      transition={{
        duration: 0.25,
        ease: 'easeInOut',
      }}
    >
      <SC.Container>
        <ul>
          {TAB_LIST.map(({ link, value, label }) => {
            const isActive = activeTab === value;
            return (
              <SC.Item key={label}>
                <Link replace href={link}>
                  <Text variant='title6Bold' color={isActive ? 'gray900' : 'gray500'} as='p'>
                    {label}
                  </Text>
                </Link>
              </SC.Item>
            );
          })}
          <SC.Animate
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            initial={{ left: 0 }}
            animate={{
              left: selectedIndex === 0 ? '1px' : `calc(${50 * selectedIndex}% - 1px)`,
            }}
          />
        </ul>
      </SC.Container>
    </SC.FixedWrapper>
  );
};

const SC = {
  FixedWrapper: styled(motion.div)`
    position: fixed;
    bottom: 80px;
    left: 0;
    right: 0;
    padding-bottom: env(safe-area-inset-bottom);
    padding-bottom: constant(safe-area-inset-bottom);
    display: flex;
    justify-content: center;
  `,
  Container: styled.div`
    margin-top: 1rem;
    padding: 8px 12px;

    ul {
      display: flex;
      width: 120px;
      padding: 2px;
      justify-content: center;
      align-items: center;
      border-radius: 32px;
      background-color: ${({ theme }) => theme.colors.gray100};
      position: relative;
      z-index: 1;
    }
  `,
  Item: styled.li`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 8px 16px;
    justify-content: center;

    a {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  Animate: styled(motion.div)`
    position: absolute;
    height: calc(100% - 12px);
    width: calc(50% - 16px);
    background-color: white;
    border-radius: 32px;
    z-index: -1;
    margin: 8px;
  `,
};

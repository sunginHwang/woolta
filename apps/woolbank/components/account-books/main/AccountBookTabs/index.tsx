'use client';

import { Text } from '@wds';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { styled } from 'styled-components';
import { useAccountBookListRouterQuery } from '../hooks/useAccountBookListRouterQuery';

const TAB_LIST = [
  { label: '리스트', value: 'list', link: '/?type=list' },
  { label: '캘린더', value: 'calendar', link: '/?type=calendar' },
];

export const AccountBookTabs = () => {
  const { activeTab } = useAccountBookListRouterQuery();
  const selectedIndex = TAB_LIST.findIndex((tab) => tab.value === activeTab);

  return (
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
          transition={{ bounce: 0 }}
          initial={{ left: 0 }}
          animate={{
            left: selectedIndex === 0 ? 0 : `calc(${50 * selectedIndex}% - 5px)`,
          }}
        />
      </ul>
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    margin-top: 1rem;
    padding: 8px 16px;

    ul {
      display: flex;
      padding: 2px;
      justify-content: center;
      align-items: center;
      flex: 1 0 0;
      border-radius: 6px;
      background-color: ${({ theme }) => theme.colors.gray100};
      position: relative;
      z-index: 1;
    }
  `,
  Item: styled.li`
    flex: 1;
    display: flex;
    align-items: center;
    padding: 12px 16px 11px 16px;
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
    height: calc(100% - 4px);
    width: 50%;
    background-color: white;
    border-radius: 6px;
    z-index: -1;
    margin: 2px;
  `,
};

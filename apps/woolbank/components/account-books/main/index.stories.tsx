import type { Meta, StoryObj } from '@storybook/react';
import AccountBooks from './index';

const meta: Meta<typeof AccountBooks> = { component: AccountBooks };
export default meta;

type Story = StoryObj<typeof AccountBooks>;

export const 가계부_리스트: Story = {
  args: {},
  parameters: {
    nextjs: {
      router: {
        pathname: '/account-books',
        query: {
          tab: 'account-list',
        },
      },
    },
  },
};

export const 정기지출: Story = {
  args: {},
  parameters: {
    nextjs: {
      router: {
        pathname: '/account-books',
        query: {
          tab: 'regular-expenditure',
        },
      },
    },
  },
};

export const 탭: Story = {
  args: {},
  parameters: {
    nextjs: {
      router: {
        pathname: '/account-books',
        query: {
          tab: 'statistic',
        },
      },
    },
  },
};

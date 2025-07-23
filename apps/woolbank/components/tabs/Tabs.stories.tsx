import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = { component: Tabs };
export default meta;

type Story = StoryObj<typeof Tabs>;

export const 탭리스트_3개: Story = {
  args: {
    tabs: [
      {
        label: '리스트',
        value: '1',
        link: '',
      },
      {
        label: '정기지출',
        value: '2',
        link: '',
      },
      {
        label: '통계',
        value: '3',
        link: '',
      },
    ],
    value: '3',
  },
  parameters: {},
};

export const 탭리스트_2개: Story = {
  args: {
    tabs: [
      {
        label: '리스트',
        value: '1',
        link: '',
      },
      {
        label: '정기지출',
        value: '2',
        link: '',
      },
    ],
    value: '2',
  },
  parameters: {},
};

import type { Meta, StoryObj } from '@storybook/react';
import Header from './index';

const meta: Meta<typeof Header> = { component: Header };
export default meta;

type Story = StoryObj<typeof Header>;

export const 헤더_기본: Story = {
  args: {},
  parameters: {
    title: '헤더',
  },
};

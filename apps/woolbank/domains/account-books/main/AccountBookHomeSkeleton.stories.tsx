import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { AccountBookHomeSkeleton } from './AccountBookHomeSkeleton';

const meta: Meta<typeof AccountBookHomeSkeleton> = {
  title: 'domains/account-books/AccountBookHomeSkeleton',
  component: AccountBookHomeSkeleton,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { pathname: '/' } },
  },
};

export default meta;

type Story = StoryObj<typeof AccountBookHomeSkeleton>;

export const 기본: Story = {
  play: async ({ canvasElement }) => {
    // 스켈레톤은 보조기기에 읽히지 않아야 한다
    const hidden = canvasElement.querySelectorAll('[aria-hidden="true"]');
    await expect(hidden.length).toBeGreaterThanOrEqual(3);
  },
};

export const 다크: Story = {
  globals: { theme: 'dark' },
};

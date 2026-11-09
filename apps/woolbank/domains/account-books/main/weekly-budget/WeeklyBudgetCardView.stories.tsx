import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { WeeklyBudgetCardView } from './WeeklyBudgetCardView';

const meta: Meta<typeof WeeklyBudgetCardView> = {
  title: 'domains/account-books/WeeklyBudgetCardView',
  component: WeeklyBudgetCardView,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { pathname: '/' } },
  },
  args: { budget: 450_000, spent: 117_707, remaining: 332_293, percentage: 26 },
};

export default meta;

type Story = StoryObj<typeof WeeklyBudgetCardView>;

export const 예산_있음: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('26%')).toBeInTheDocument();
    await expect(canvas.getByText('117,707원')).toBeInTheDocument();
    await expect(canvas.getByText(/남았어요/)).toBeInTheDocument();
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '26');
  },
};

export const 예산_초과: Story = {
  args: { spent: 512_000, remaining: -62_000, percentage: 114 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('114%')).toBeInTheDocument();
    await expect(canvas.getByText(/초과했어요/)).toBeInTheDocument();
    // 막대는 100 에서 멈춘다
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  },
};

export const 예산_미설정: Story = {
  args: { budget: 0, spent: 0, remaining: 0, percentage: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { name: '예산 설정하기' })).toHaveAttribute(
      'href',
      '/settings/weekly-budget',
    );
    await expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
  },
};

export const 다크: Story = {
  globals: { theme: 'dark' },
};

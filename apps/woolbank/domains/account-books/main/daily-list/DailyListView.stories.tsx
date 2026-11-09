import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { ACCOUNT_BOOK_FIXTURES } from '../_common/fixtures/accountBooks';
import { type DailyListGroup, DailyListView } from './DailyListView';

const groupByDay = (): DailyListGroup[] => {
  const map = new Map<string, DailyListGroup>();

  for (const item of ACCOUNT_BOOK_FIXTURES) {
    const days = String(Number(item.registerDateTime.slice(8, 10)));
    const group = map.get(days) ?? { days, totalAmount: 0, accountBookList: [] };
    group.accountBookList.push(item);
    group.totalAmount += item.type === 'INCOME' ? item.amount : -item.amount;
    map.set(days, group);
  }

  return [...map.values()].sort((a, b) => Number(b.days) - Number(a.days));
};

const meta: Meta<typeof DailyListView> = {
  title: 'domains/account-books/DailyList',
  component: DailyListView,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { pathname: '/' } },
  },
  args: { month: '2026-11', groups: groupByDay() },
};

export default meta;

type Story = StoryObj<typeof DailyListView>;

export const 기본: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 최신 날짜가 먼저
    const headers = canvas.getAllByRole('heading', { level: 3 });
    await expect(headers[0]).toHaveTextContent('11월 14일 토요일');
    // 정기지출은 "· 매월", 수입은 "+", 지출은 U+2212
    await expect(canvas.getByText('보험 · 매월')).toBeInTheDocument();
    await expect(canvas.getByText('+264,000원')).toBeInTheDocument();
    await expect(canvas.getByText('−44,650원')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /타코배달/ })).toHaveAttribute('href', '/account-books/save?id=1');
  },
};

export const 비어있음: Story = {
  args: { groups: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('이달 내역이 없어요')).toBeInTheDocument();
  },
};

export const 다크: Story = {
  globals: { theme: 'dark' },
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ACCOUNT_BOOK_FIXTURES } from '../_common/fixtures/accountBooks';
import { DaySheet } from './DaySheet';

const DAY = '2026-11-04';
const ITEMS = ACCOUNT_BOOK_FIXTURES.filter((item) => item.registerDateTime.startsWith(DAY));

const meta: Meta<typeof DaySheet> = {
  title: 'domains/account-books/DaySheet',
  component: DaySheet,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { pathname: '/' } },
  },
  args: { open: true, onClose: fn(), date: DAY, items: ITEMS, canAdd: true, onAddClick: fn() },
};

export default meta;

type Story = StoryObj<typeof DaySheet>;

export const 항목_있음: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);

    await expect(await body.findByRole('dialog')).toBeInTheDocument();
    await expect(body.getByText('11월 4일 수요일')).toBeInTheDocument();
    await expect(body.getByText('지출 4건')).toBeInTheDocument();
    await expect(body.getByText('−96,250원')).toBeInTheDocument();

    await userEvent.click(body.getByRole('button', { name: '이날 내역 추가' }));
    await expect(args.onAddClick).toHaveBeenCalledTimes(1);
  },
};

export const 빈_날: Story = {
  args: { date: '2026-11-20', items: [] },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await expect(await body.findByText('이날은 기록이 없어요')).toBeInTheDocument();
    await expect(body.getByText('기록 없음')).toBeInTheDocument();
  },
};

export const 공유_유저: Story = {
  args: { canAdd: false },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await body.findByRole('dialog');
    await expect(body.queryByRole('button', { name: '이날 내역 추가' })).not.toBeInTheDocument();
  },
};

export const 다크: Story = {
  globals: { theme: 'dark' },
};

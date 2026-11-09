import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ISODate } from '@wds';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { type DayAmountMap, HomeCalendarView, type HomeCalendarViewProps } from './HomeCalendarView';

const DAY_AMOUNTS: DayAmountMap = {
  '2026-11-01': { expense: 4_703_505, income: 0 },
  '2026-11-02': { expense: 59_400, income: 0 },
  '2026-11-03': { expense: 54_000, income: 0 },
  '2026-11-04': { expense: 96_250, income: 0 },
  '2026-11-05': { expense: 34_749, income: 0 },
  '2026-11-06': { expense: 12_000, income: 264_000 },
  '2026-11-14': { expense: 54_000, income: 0 },
};

type DemoProps = Pick<HomeCalendarViewProps, 'month' | 'today' | 'dayAmounts'> & {
  initialExpanded?: boolean;
  initialSelected?: ISODate;
};

const Demo = ({ initialExpanded = false, initialSelected = '2026-11-06', ...rest }: DemoProps) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [selectedDate, setSelectedDate] = useState<ISODate>(initialSelected);

  return (
    <HomeCalendarView
      {...rest}
      selectedDate={selectedDate}
      expanded={expanded}
      onExpandedChange={setExpanded}
      onSelectDate={setSelectedDate}
    />
  );
};

const meta: Meta<typeof Demo> = {
  title: 'domains/account-books/HomeCalendar',
  component: Demo,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { pathname: '/' } },
  },
  args: { month: '2026-11', today: '2026-11-07', dayAmounts: DAY_AMOUNTS },
};

export default meta;

type Story = StoryObj<typeof Demo>;

export const 접힘: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 선택한 주 한 줄만
    await expect(canvas.getAllByRole('gridcell')).toHaveLength(7);
    await expect(canvas.getByText('−1.2만')).toBeInTheDocument();
    await expect(canvas.getByText('+26.4만')).toBeInTheDocument();
    // 접힌 상태에는 주차 합계가 없다
    await expect(canvas.queryByText('1주차')).not.toBeInTheDocument();
  },
};

export const 펼침: Story = {
  args: { initialExpanded: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('gridcell').length).toBeGreaterThan(7);
    await expect(canvas.getByText('1주차')).toBeInTheDocument();
    // 수입이 있는 주는 "수입 · 지출" 라벨이 함께, 없는 주는 금액만
    await expect(canvas.getByText('+264,000원')).toBeInTheDocument();
    await expect(canvas.getByText('−54,000원')).toBeInTheDocument();
  },
};

export const 펼치기_토글: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: '한 달 전체 보기' });

    await userEvent.click(toggle);
    await expect(canvas.getByRole('button', { name: '이번 주만 보기' })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('2주차')).toBeInTheDocument();
  },
};

export const 다크: Story = {
  args: { initialExpanded: true },
  globals: { theme: 'dark' },
};

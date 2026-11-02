import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NotificationDetailView, type NotificationDetailViewProps } from './NotificationDetail';

const base: NotificationDetailViewProps = {
  notification: {
    id: '2',
    kind: 'DAILY_DIGEST',
    title: '☀️ 오늘 일정 2건 · 예산 30만원 남음',
    summary: '• 10:00 치과\n• 15:00 미용실',
    content:
      '☀️ 오늘 일정 2건\n• 10:00 치과\n• 15:00 미용실\n\n💸 이번 주 지출 150,000원\n• 예산 450,000원 중 300,000원 남았어요\n• 남은 4일 하루 75,000원까지',
    readAt: null,
    createdAt: '2026-11-02T23:00:00.000Z',
  },
  isLoading: false,
  isError: false,
};

const meta: Meta<typeof NotificationDetailView> = {
  component: NotificationDetailView,
  args: base,
};
export default meta;

type Story = StoryObj<typeof NotificationDetailView>;

export const 기본: Story = {};

export const 로딩중: Story = {
  args: { notification: null, isLoading: true },
};

export const 없는_알림: Story = {
  args: { notification: null },
};

export const 오류: Story = {
  args: { notification: null, isError: true },
};

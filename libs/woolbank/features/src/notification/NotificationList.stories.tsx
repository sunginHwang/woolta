import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Notification } from '../_shared/hooks/notificationApi';
import { NotificationListView, type NotificationListViewProps } from './NotificationList';

const items: Notification[] = [
  {
    id: '3',
    kind: 'EVENING_REMINDER',
    title: '🌙 오늘 지출 기록 0건',
    summary: '쓴 게 있으면 알려주세요. 깜빡한 일정도 지금 넣어두면 좋아요.',
    content: '🌙 오늘 기록된 지출이 없어요.\n쓴 게 있으면 알려주세요.',
    readAt: null,
    createdAt: '2026-11-03T12:00:00.000Z',
  },
  {
    id: '2',
    kind: 'DAILY_DIGEST',
    title: '☀️ 오늘 일정 2건 · 예산 30만원 남음',
    summary: '• 10:00 치과\n• 15:00 미용실',
    content:
      '☀️ 오늘 일정 2건\n• 10:00 치과\n• 15:00 미용실\n\n💸 이번 주 지출 150,000원\n• 예산 450,000원 중 300,000원 남았어요',
    readAt: null,
    createdAt: '2026-11-02T23:00:00.000Z',
  },
  {
    id: '1',
    kind: 'REGULAR_EXPENDITURE',
    title: '내일 정기지출 결제 예정',
    summary: '넷플릭스 외 2건 · 32,000원',
    content: '• 넷플릭스 17,000원\n• 유튜브 10,000원\n• 멜론 5,000원',
    readAt: '2026-11-01T01:00:00.000Z',
    createdAt: '2026-11-01T00:00:00.000Z',
  },
];

const base: NotificationListViewProps = {
  items,
  unreadCount: 2,
  isLoading: false,
  isError: false,
  isMarkingAll: false,
  onMarkAllRead: () => undefined,
  detailHref: (id) => `#${id}`,
};

const meta: Meta<typeof NotificationListView> = {
  component: NotificationListView,
  args: base,
};
export default meta;

type Story = StoryObj<typeof NotificationListView>;

export const 읽음_안읽음_섞임: Story = {};

export const 모두_읽음: Story = {
  args: { items: items.map((item) => ({ ...item, readAt: item.createdAt })), unreadCount: 0 },
};

export const 미읽음_수_확인중: Story = {
  args: { unreadCount: null },
};

export const 비어있음: Story = {
  args: { items: [], unreadCount: 0 },
};

export const 로딩중: Story = {
  args: { items: [], isLoading: true },
};

export const 오류: Story = {
  args: { items: [], isError: true },
};

export const 모두_읽음_처리중: Story = {
  args: { isMarkingAll: true },
};

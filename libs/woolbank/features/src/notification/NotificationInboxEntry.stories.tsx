import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NotificationInboxEntryView } from './NotificationInboxEntry';

const meta: Meta<typeof NotificationInboxEntryView> = {
  component: NotificationInboxEntryView,
  args: { unreadCount: 0, href: '#' },
};
export default meta;

type Story = StoryObj<typeof NotificationInboxEntryView>;

export const 미읽음_없음: Story = {};

export const 미읽음_3건: Story = {
  args: { unreadCount: 3 },
};

export const 미읽음_100건_이상: Story = {
  args: { unreadCount: 120 },
};

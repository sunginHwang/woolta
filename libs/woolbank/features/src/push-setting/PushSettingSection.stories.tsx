import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PushSettingView, type PushSettingViewProps } from './PushSettingSection';

const noop = async () => undefined;

const base: PushSettingViewProps = {
  state: 'off',
  isShareUser: false,
  setting: { regularExpenditure: true },
  subscriptionCount: 0,
  isBusy: false,
  enable: noop,
  disable: noop,
  setRegularExpenditure: noop,
  sendTest: noop,
};

const meta: Meta<typeof PushSettingView> = {
  component: PushSettingView,
  args: base,
};
export default meta;

type Story = StoryObj<typeof PushSettingView>;

export const 꺼짐: Story = {};

export const 켜짐: Story = {
  args: { state: 'on', subscriptionCount: 2 },
};

export const 켜짐_공유코드_세션: Story = {
  args: { state: 'on', subscriptionCount: 1, isShareUser: true },
};

export const 켜짐_정기지출_알림_끔: Story = {
  args: { state: 'on', subscriptionCount: 1, setting: { regularExpenditure: false } },
};

export const 확인중: Story = {
  args: { state: 'pending' },
};

export const 요청중: Story = {
  args: { state: 'off', isBusy: true },
};

export const 권한_거부됨: Story = {
  args: { state: 'denied' },
};

export const iOS_설치_필요: Story = {
  args: { state: 'needs-install' },
};

export const 미지원_브라우저: Story = {
  args: { state: 'unsupported' },
};

export const 서비스워커_준비_실패: Story = {
  args: { state: 'unavailable' },
};

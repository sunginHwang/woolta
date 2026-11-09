import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { PushSettingModel } from '@woolta/woolbank-features';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SettingsView } from './SettingsView';

const pushOn: SettingsViewStoryPush = {
  state: 'on',
  setting: { regularExpenditure: true },
  isBusy: false,
  enable: fn(async () => {}),
  disable: fn(async () => {}),
  setRegularExpenditure: fn(async () => {}),
};

type SettingsViewStoryPush = Pick<
  PushSettingModel,
  'state' | 'setting' | 'isBusy' | 'enable' | 'disable' | 'setRegularExpenditure'
>;

const meta: Meta<typeof SettingsView> = {
  title: 'domains/settings/SettingsView',
  component: SettingsView,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { pathname: '/settings' } },
  },
  args: {
    weeklyBudgetAmount: 450_000,
    push: pushOn,
    isShareUser: false,
    themeType: 'light',
    onThemeChange: fn(),
    appVersion: '2.0.1',
    onBackClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof SettingsView>;

export const 기본: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { name: /주간 예산/ })).toHaveAttribute('href', '/settings/weekly-budget');
    await expect(canvas.getByText('450,000원')).toBeInTheDocument();
    await expect(canvas.getByRole('switch', { name: '푸시 알림' })).toBeChecked();
    await expect(canvas.getByRole('switch', { name: '정기지출 결제 전날 알림' })).toBeChecked();
    await expect(canvas.getByText('2.0.1')).toBeInTheDocument();
  },
};

export const 테마_변경: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: /테마/ }));
    await userEvent.click(await body.findByRole('option', { name: '다크' }));
    await expect(args.onThemeChange).toHaveBeenCalledWith('dark');
  },
};

export const 예산_미설정_푸시_꺼짐: Story = {
  args: {
    weeklyBudgetAmount: 0,
    push: { ...pushOn, state: 'off', setting: { regularExpenditure: false } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('미설정')).toBeInTheDocument();
    await expect(canvas.getByRole('switch', { name: '푸시 알림' })).not.toBeChecked();
    // 푸시가 꺼져 있으면 종류 설정은 잠근다
    await expect(canvas.getByRole('switch', { name: '정기지출 결제 전날 알림' })).toBeDisabled();
  },
};

export const 권한_거부됨: Story = {
  args: { push: { ...pushOn, state: 'denied' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('switch', { name: '푸시 알림' })).toBeDisabled();
    await expect(canvas.getByText(/알림 권한이 차단되어 있어요/)).toBeInTheDocument();
  },
};

export const 공유_유저: Story = {
  args: { isShareUser: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole('switch', { name: '정기지출 결제 전날 알림' })).not.toBeInTheDocument();
  },
};

export const 다크: Story = {
  args: { themeType: 'dark' },
  globals: { theme: 'dark' },
};

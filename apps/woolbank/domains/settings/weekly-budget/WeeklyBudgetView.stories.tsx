import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { WeeklyBudgetView } from './WeeklyBudgetView';

const meta: Meta<typeof WeeklyBudgetView> = {
  title: 'domains/settings/WeeklyBudgetView',
  component: WeeklyBudgetView,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { pathname: '/settings/weekly-budget' } },
  },
  args: {
    initialAmount: 450_000,
    isSaving: false,
    isShareUser: false,
    onSave: fn(),
    onBackClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof WeeklyBudgetView>;

export const 기본: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('일주일 예산')).toHaveValue('450,000');
    await expect(canvas.getByText('하루 약 64,286원씩 쓸 수 있어요')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '45만원' })).toHaveAttribute('aria-pressed', 'true');
    // 바뀐 게 없으면 저장할 수 없다
    await expect(canvas.getByRole('button', { name: '저장하기' })).toBeDisabled();
  },
};

export const 프리셋_선택_후_저장: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: '70만원' }));
    await expect(canvas.getByLabelText('일주일 예산')).toHaveValue('700,000');
    await expect(canvas.getByText('하루 약 100,000원씩 쓸 수 있어요')).toBeInTheDocument();

    const save = canvas.getByRole('button', { name: '저장하기' });
    await expect(save).toBeEnabled();
    await userEvent.click(save);
    await expect(args.onSave).toHaveBeenCalledWith(700_000);
  },
};

export const 직접_입력: Story = {
  args: { initialAmount: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('일주일 예산');

    await expect(canvas.getByText('금액을 입력해 주세요')).toBeInTheDocument();
    await userEvent.type(input, '350000');
    await expect(input).toHaveValue('350,000');
    await expect(canvas.getByText('하루 약 50,000원씩 쓸 수 있어요')).toBeInTheDocument();
  },
};

export const 저장_중: Story = {
  args: { isSaving: true },
};

export const 공유_유저: Story = {
  args: { isShareUser: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('일주일 예산')).toBeDisabled();
    await expect(canvas.getByText('공유 계정은 예산을 바꿀 수 없어요')).toBeInTheDocument();
  },
};

export const 다크: Story = {
  globals: { theme: 'dark' },
};

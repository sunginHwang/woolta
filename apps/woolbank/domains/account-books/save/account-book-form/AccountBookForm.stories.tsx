import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AccountBookForm } from './AccountBookForm';

const meta: Meta<typeof AccountBookForm> = { component: AccountBookForm };
export default meta;

type Story = StoryObj<typeof AccountBookForm>;

export const 가계부_입력_폼: Story = {
  args: {},
  parameters: {},
};

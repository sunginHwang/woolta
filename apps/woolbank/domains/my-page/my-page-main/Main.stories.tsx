import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MyPageMain } from './MyPageMain';

const meta: Meta<typeof MyPageMain> = { component: MyPageMain };
export default meta;

type Story = StoryObj<typeof MyPageMain>;

export const 마이페이지_기본: Story = {
  args: {},
  parameters: {},
};

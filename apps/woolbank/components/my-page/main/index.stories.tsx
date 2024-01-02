import type { Meta, StoryObj } from '@storybook/react';
import MypageMain from './index';

const meta: Meta<typeof MypageMain> = { component: MypageMain };
export default meta;

type Story = StoryObj<typeof MypageMain>;

export const 마이페이지_기본: Story = {
  args: {},
  parameters: {},
};

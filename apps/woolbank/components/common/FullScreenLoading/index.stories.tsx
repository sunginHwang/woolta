import type { Meta, StoryObj } from '@storybook/react';
import FullScreenLoading from './index';

const meta: Meta<typeof FullScreenLoading> = { component: FullScreenLoading };
export default meta;

type Story = StoryObj<typeof FullScreenLoading>;

export const 전체화면_로딩: Story = {
  args: {},
  parameters: {},
};

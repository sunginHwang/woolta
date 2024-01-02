import type { Meta, StoryObj } from '@storybook/react';
import Test from './index';

const meta: Meta<typeof Test> = { component: Test };
export default meta;
type Story = StoryObj<typeof Test>;

export const 기본타입: Story = {
  args: {},
  parameters: {},
};

import type { Meta, StoryObj } from '@storybook/react';
import AccountBooks from './index';

const meta: Meta<typeof AccountBooks> = { component: AccountBooks };
export default meta;

type Story = StoryObj<typeof AccountBooks>;

export const 가계부_리스트: Story = {
  args: {},
  parameters: {},
};

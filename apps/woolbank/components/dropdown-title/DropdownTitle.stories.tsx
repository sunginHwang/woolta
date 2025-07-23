import type { Meta, StoryObj } from '@storybook/react';
import DropdownTitle from './DropdownTitle';

const meta: Meta<typeof DropdownTitle> = { component: DropdownTitle };
export default meta;

type Story = StoryObj<typeof DropdownTitle>;

export const 드롭다운_타이틀: Story = {
  args: {
    title: '드랍다운 헤더',
  },
  parameters: {},
};

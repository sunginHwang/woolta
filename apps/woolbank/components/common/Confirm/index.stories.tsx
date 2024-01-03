import type { Meta, StoryObj } from '@storybook/react';
import Confirm from './index';

const meta: Meta<typeof Confirm> = { component: Confirm };
export default meta;

type Story = StoryObj<typeof Confirm>;

export const 컨펌_기본: Story = {
  args: {
    isOpen: true,
    message: 'Confirm 창 입니다.',
  },
  parameters: {},
};

export const 컨펌_버튼_네이밍: Story = {
  args: {
    isOpen: true,
    message: 'Confirm 창 입니다.',
    confirmMsg: '확인메세지',
    cancelMsg: '취소메세지',
  },
  parameters: {},
};

import type { Meta, StoryObj } from '@storybook/react';
import { EmptyInfo } from './EmptyInfo';

const meta: Meta<typeof EmptyInfo> = { component: EmptyInfo };
export default meta;

type Story = StoryObj<typeof EmptyInfo>;

export const 빈_정보_안내: Story = {
  args: {
    msg: '정보가 없습니다.',
  },
  parameters: {},
};

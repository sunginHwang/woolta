import type { Meta, StoryObj } from '@storybook/react';
import BaseInput from './index';

const meta: Meta<typeof BaseInput> = { component: BaseInput };
export default meta;

type Story = StoryObj<typeof BaseInput>;

export const 컨펌_기본: Story = {
  args: {
    placeholder: '제목을 입력해 주세요.',
    dataType: 'text',
    maxLength: 30,
    label: '안녕하세요',
    useLengthInfo: true,
    name: 'title',
    value: '제목입력',
  },
  parameters: {},
};

export const Label_없음: Story = {
  args: {
    placeholder: '제목을 입력해 주세요.',
    dataType: 'text',
    maxLength: 30,
    useLengthInfo: true,
    name: 'title',
    value: '제목입력',
  },
  parameters: {},
};

export const 길이설명_없음: Story = {
  args: {
    placeholder: '제목을 입력해 주세요.',
    dataType: 'text',
    label: '안녕하세요',
    maxLength: 30,
    name: 'title',
    value: '제목입력',
  },
  parameters: {},
};

export const Label_길이설명_둘다_없음: Story = {
  args: {
    placeholder: '제목을 입력해 주세요.',
    dataType: 'text',
    maxLength: 30,
    name: 'title',
    value: '제목입력',
  },
  parameters: {},
};

import type { Meta, StoryObj } from '@storybook/react';
import { IconCloseCircle } from '../Icon';
import { Button } from '.';

const meta: Meta<typeof Button> = { component: Button };
export default meta;

type Story = StoryObj<typeof Button>;

export const 기본버튼: Story = {
  args: {
    variant: 'primary',
    children: '버튼',
    loading: false,
    disabled: false,
    fill: false,
    size: 'medium',
  },
  parameters: {},
};

export const 전체영역버튼: Story = {
  args: {
    variant: 'primary',
    children: '꽉찬 버튼',
    fill: true,
    size: 'medium',
  },
  parameters: {},
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled 버튼',
    disabled: true,
  },
  parameters: {},
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'loading.....',
    loading: true,
    startIcon: <IconCloseCircle />,
    endIcon: <IconCloseCircle />,
  },
  parameters: {},
};

export const 아이콘: Story = {
  args: {
    variant: 'primary',
    children: '좌우 아이콘 존재',
    startIcon: <IconCloseCircle />,
    endIcon: <IconCloseCircle />,
  },
  parameters: {},
};

export const Variant: Story = {
  args: {},
  parameters: {},
  render: () => (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <Button variant='primary'>Primary12</Button>
      <Button variant='tertiaryColor'>tertiary_color</Button>
      <Button variant='tertiaryGray'>tertiary_gray</Button>
    </div>
  ),
};

export const Size: Story = {
  args: {},
  parameters: {},
  render: () => (
    <div style={{ padding: '20px' }}>
      <Button size='small'>small</Button>
      <Button size='medium'>tertiary_color</Button>
      <Button size='large'>tertiary_gray</Button>
    </div>
  ),
};

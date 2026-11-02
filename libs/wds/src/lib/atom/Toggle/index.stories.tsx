import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from '.';

const meta: Meta<typeof Toggle> = {
  title: 'Component/Base/Toggle',
  component: Toggle,
};

export default meta;

type Story = StoryObj<typeof Toggle>;

const Controlled = (props: Omit<React.ComponentProps<typeof Toggle>, 'onChange'>) => {
  const [checked, setChecked] = useState(props.checked);

  return <Toggle {...props} checked={checked} onChange={setChecked} />;
};

export const Basic: Story = {
  args: { checked: false, label: '알림 받기' },
  render: (args) => <Controlled {...args} />,
};

export const Checked: Story = {
  args: { checked: true, label: '알림 받기' },
  render: (args) => <Controlled {...args} />,
};

export const Disabled: Story = {
  args: { checked: true, disabled: true, label: '알림 받기' },
  render: (args) => <Controlled {...args} />,
};

export const WithoutLabel: Story = {
  args: { checked: false, 'aria-label': '알림 받기' },
  render: (args) => <Controlled {...args} />,
};

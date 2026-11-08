import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Radio, RadioGroup, type RadioGroupProps } from './index';

const ControlledGroup = ({ value: initial = '', onChange, children, ...props }: RadioGroupProps) => {
  const [value, setValue] = useState(initial);
  return (
    <RadioGroup
      {...props}
      value={value}
      onChange={(next, event) => {
        setValue(next);
        onChange?.(next, event);
      }}
    >
      {children}
    </RadioGroup>
  );
};

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  subcomponents: { Radio },
  argTypes: {
    direction: { control: 'radio', options: ['column', 'row'] },
    size: { control: 'radio', options: ['small', 'medium'] },
    xstyle: { control: false },
    children: { control: false },
  },
  args: { label: '지출 유형', value: 'expense', onChange: fn() },
  render: (args) => (
    <ControlledGroup {...args}>
      <Radio value='expense' label='지출' />
      <Radio value='income' label='수입' />
      <Radio value='transfer' label='이체' />
    </ControlledGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '여러 항목 중 하나만 고를 때 쓴다. `RadioGroup` 이 `<fieldset>`/`<legend>` 로 묶고 같은 `name` 을 나눠 주므로 방향키 이동은 네이티브 그대로다. 두세 개의 짧은 선택지에는 Tabs 나 SegmentedControl 이 더 어울릴 수 있다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const income = canvas.getByLabelText('수입') as HTMLInputElement;
    await expect(income.checked).toBe(false);
    await userEvent.click(income);
    await waitFor(() => expect(income.checked).toBe(true));
    await expect(args.onChange).toHaveBeenCalledWith('income', expect.anything());
    await expect((canvas.getByLabelText('지출') as HTMLInputElement).checked).toBe(false);
  },
};

export const Row: Story = {
  args: { direction: 'row', label: '정렬' },
  render: (args) => (
    <ControlledGroup {...args} value='latest'>
      <Radio value='latest' label='최신순' />
      <Radio value='amount' label='금액순' />
    </ControlledGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`direction="row"` 는 선택지를 가로로 늘어놓는다. 라벨이 짧고 2–3개일 때만 쓰고, 넘치면 자동으로 줄바꿈된다.',
      },
    },
  },
};

export const WithDescriptions: Story = {
  render: () => (
    <ControlledGroup label='반복 주기' description='정기지출이 자동으로 기록되는 주기예요.' value='monthly'>
      <Radio value='monthly' label='매월' description='매달 같은 날짜에 기록' />
      <Radio value='weekly' label='매주' description='매주 같은 요일에 기록' />
      <Radio value='daily' label='매일' description='하루에 한 번 기록' />
    </ControlledGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 정기지출 반복 주기. 항목별 `description` 으로 선택의 결과를 미리 알려 준다. 그룹 `description` 은 legend 아래에 놓인다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const weekly = canvas.getByLabelText(/매주/) as HTMLInputElement;
    await expect(weekly.getAttribute('aria-describedby')).toContain('description');
    await userEvent.click(weekly);
    await waitFor(() => expect(weekly.checked).toBe(true));
  },
};

export const Disabled: Story = {
  render: () => (
    <Stack direction='column' gap={24}>
      <ControlledGroup label='그룹 전체 비활성' value='a' disabled>
        <Radio value='a' label='선택됨' />
        <Radio value='b' label='선택 안 됨' />
      </ControlledGroup>
      <ControlledGroup label='항목 하나만 비활성' value='card'>
        <Radio value='card' label='카드' />
        <Radio value='cash' label='현금' />
        <Radio value='point' label='포인트' description='잔액이 없어 선택할 수 없어요' disabled />
      </ControlledGroup>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '`RadioGroup` 의 `disabled` 는 fieldset 으로 전체를 막고, `Radio` 의 `disabled` 는 그 항목만 막는다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect((canvas.getByLabelText('선택 안 됨') as HTMLInputElement).disabled).toBe(true);
    await expect((canvas.getByLabelText(/포인트/) as HTMLInputElement).disabled).toBe(true);
    await expect((canvas.getByLabelText('현금') as HTMLInputElement).disabled).toBe(false);
  },
};

const InvalidDemo = () => {
  const [value, setValue] = useState('');
  return (
    <RadioGroup
      label='결제 수단'
      value={value}
      onChange={setValue}
      errorMessage={value ? undefined : '결제 수단을 골라 주세요.'}
    >
      <Radio value='card' label='카드' />
      <Radio value='cash' label='현금' />
    </RadioGroup>
  );
};

export const Invalid: Story = {
  render: () => <InvalidDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '`errorMessage` 를 주면 legend 와 모든 원이 오류색이 되고 문구가 `role="alert"` 로 읽힌다. 하나를 고르면 해제되는 "필수 선택" 패턴이다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    await expect([...inputs].every((i) => i.getAttribute('aria-invalid') === 'true')).toBe(true);
    await expect(canvas.getByRole('alert')).toBeTruthy();
    await userEvent.click(canvas.getByLabelText('카드'));
    await waitFor(() => expect(canvas.queryByRole('alert')).toBeNull());
    await expect(inputs[0].getAttribute('aria-invalid')).toBeNull();
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction='column' gap={16}>
      <ControlledGroup label='small' size='small' value='a' direction='row'>
        <Radio value='a' label='16px 원' />
        <Radio value='b' label='small1 라벨' />
      </ControlledGroup>
      <ControlledGroup label='medium (기본)' size='medium' value='a' direction='row'>
        <Radio value='a' label='20px 원' />
        <Radio value='b' label='body3 라벨' />
      </ControlledGroup>
      <Text variant='small1Regular' color='textTertiary'>
        크기는 그룹에서 정하고 항목 단위로 덮어쓸 수 있다.
      </Text>
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'Checkbox 와 같은 두 단계. 그룹 `size` 가 모든 항목에 적용된다.' } },
  },
};

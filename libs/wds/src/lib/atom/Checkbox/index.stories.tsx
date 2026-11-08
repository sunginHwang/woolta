import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Checkbox, type CheckboxProps } from './index';

const Controlled = ({ checked: initial = false, onChange, ...props }: CheckboxProps) => {
  const [checked, setChecked] = useState(initial);
  return (
    <Checkbox
      {...props}
      checked={checked}
      onChange={(next, event) => {
        setChecked(next);
        onChange?.(next, event);
      }}
    />
  );
};

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium'] },
    xstyle: { control: false },
    label: { control: 'text' },
  },
  args: { label: '알림 받기' },
  render: (args) => <Controlled {...args} />,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '여러 항목을 독립적으로 켜고 끌 때 쓴다. 하나만 고르는 선택은 Radio, 설정 on/off 는 Toggle 이 맞다. 네이티브 체크박스를 감싸 Space 키·스크린리더 동작은 그대로 두고 박스만 직접 그린다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await expect(input.checked).toBe(false);
    await userEvent.click(input);
    await waitFor(() => expect(input.checked).toBe(true));
    await expect(input.getAttribute('aria-checked')).toBe('true');
    await userEvent.click(input);
    await waitFor(() => expect(input.checked).toBe(false));
  },
};

const BulkSelectDemo = () => {
  const rows = ['커피 4,500원', '점심 12,000원', '택시 8,900원'];
  const [selected, setSelected] = useState<boolean[]>([true, false, false]);
  const allChecked = selected.every(Boolean);
  const someChecked = selected.some(Boolean) && !allChecked;

  return (
    <Stack direction='column' gap={12}>
      <Checkbox
        label={`전체 선택 (${selected.filter(Boolean).length}/${rows.length})`}
        checked={allChecked}
        indeterminate={someChecked}
        onChange={(next) => setSelected(rows.map(() => next))}
      />
      <Stack direction='column' gap={8} ml={28}>
        {rows.map((row, index) => (
          <Checkbox
            key={row}
            label={row}
            checked={selected[index]}
            onChange={(next) => setSelected((prev) => prev.map((v, i) => (i === index ? next : v)))}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export const Indeterminate: Story = {
  render: () => <BulkSelectDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 대량 업로드의 전체 선택. 하위 항목 일부만 선택되면 `indeterminate` 로 대시를 보이고(`aria-checked="mixed"`), 전체 선택을 누르면 모두 켜거나 끈다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    const all = inputs[0];
    await expect(all.getAttribute('aria-checked')).toBe('mixed');
    await expect(all.indeterminate).toBe(true);
    await userEvent.click(all);
    await waitFor(() => expect([...inputs].slice(1).every((i) => i.checked)).toBe(true));
    await expect(all.getAttribute('aria-checked')).toBe('true');
  },
};

export const Disabled: Story = {
  render: () => (
    <Stack direction='column' gap={12}>
      <Checkbox label='비활성 · 해제' disabled />
      <Checkbox label='비활성 · 선택됨' disabled checked />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '`disabled` 는 전체를 흐리게 하고 클릭·포커스를 막는다. 선택된 상태도 그대로 유지해 보여 준다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    await expect(inputs[0].disabled).toBe(true);
    await expect(inputs[1].checked).toBe(true);
  },
};

const TermsDemo = () => {
  const [agreed, setAgreed] = useState(false);
  return (
    <Stack direction='column' gap={8}>
      <Checkbox
        label='[필수] 이용약관에 동의합니다'
        description='동의해야 가계부를 만들 수 있어요.'
        checked={agreed}
        invalid={!agreed}
        onChange={setAgreed}
      />
      {!agreed && (
        <span role='alert'>
          <Text variant='small1Regular' color='statusError'>
            필수 약관에 동의해 주세요.
          </Text>
        </span>
      )}
    </Stack>
  );
};

export const Invalid: Story = {
  render: () => <TermsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '`invalid` 는 박스 테두리를 오류색으로 바꾼다. 선택하면 해제된다. 필수 약관처럼 "선택하지 않은 것" 이 오류인 경우에 쓴다. 오류 문구는 호출부가 그린다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await expect(input.getAttribute('aria-invalid')).toBe('true');
    await expect(within(canvasElement).getByRole('alert')).toBeTruthy();
    await userEvent.click(input);
    await waitFor(() => expect(input.getAttribute('aria-invalid')).toBeNull());
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction='column' gap={12}>
      <Controlled size='small' label='small — 16px 박스, small1 라벨' checked />
      <Controlled size='medium' label='medium — 20px 박스, body3 라벨 (기본)' checked />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '표 행이나 촘촘한 목록에는 `small`, 폼에는 기본 `medium`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const boxes = [...canvasElement.querySelectorAll('input[type="checkbox"]')].map(
      (input) => getComputedStyle(input.nextElementSibling as Element).width,
    );
    await expect(boxes).toEqual(['16px', '20px']);
  },
};

const GroupDemo = () => {
  const [picked, setPicked] = useState<string[]>(['food']);
  const items = [
    { value: 'food', label: '식비' },
    { value: 'transport', label: '교통' },
    { value: 'housing', label: '주거', description: '월세·관리비·공과금' },
    { value: 'leisure', label: '여가' },
  ];
  return (
    <Stack direction='column' gap={12}>
      {items.map((item) => (
        <Checkbox
          key={item.value}
          label={item.label}
          description={item.description}
          checked={picked.includes(item.value)}
          onChange={(next) =>
            setPicked((prev) => (next ? [...prev, item.value] : prev.filter((v) => v !== item.value)))
          }
        />
      ))}
      <Text variant='small1Regular' color='textTertiary'>
        선택: {picked.join(', ') || '없음'}
      </Text>
    </Stack>
  );
};

export const Group: Story = {
  render: () => <GroupDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '여러 체크박스를 세로 Stack 으로 묶는다. `description` 은 라벨 아래에 작은 글씨로 붙고 `aria-describedby` 로 연결된다. 통계 필터의 카테고리 다중 선택이 이런 형태다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText(/교통/));
    await waitFor(() => expect(canvas.getByText('선택: food, transport')).toBeTruthy());
  },
};

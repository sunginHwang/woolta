import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Select, type SelectProps } from './index';

const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'amount', label: '금액 큰 순' },
  { value: 'category', label: '카테고리순' },
];

const Controlled = ({ value: initial = '', onChange, ...props }: SelectProps) => {
  const [value, setValue] = useState(initial);
  return (
    <Select
      {...props}
      value={value}
      onChange={(next, event) => {
        setValue(next);
        onChange?.(next, event);
      }}
    />
  );
};

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    size: { control: 'radio', options: ['medium', 'large'] },
    xstyle: { control: false },
    options: { control: false },
    children: { control: false },
    prefix: { control: false },
  },
  args: { label: '정렬', options: SORT_OPTIONS, value: 'latest', onChange: fn() },
  render: (args) => <Controlled {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '네이티브 `<select>` 를 TextInput 과 같은 껍데기로 감싼 것이라 모바일에서는 OS 피커가 뜨고 키보드 동작도 그대로다. 당근 SEED 의 Select Box 처럼 바텀시트로 고르는 형태는 wds `BottomSheet.Menu` 위에 별도 변형으로 만들 예정이다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const select = canvasElement.querySelector('select') as HTMLSelectElement;
    await userEvent.selectOptions(select, 'amount');
    await waitFor(() => expect(select.value).toBe('amount'));
    await expect(args.onChange).toHaveBeenCalledWith('amount', expect.anything());
  },
};

export const WithPlaceholder: Story = {
  args: { label: '카테고리', placeholder: '카테고리를 골라 주세요', value: '', description: '나중에 바꿀 수 있어요.' },
  parameters: {
    docs: {
      description: {
        story:
          '`placeholder` 는 선택 불가한 첫 option 으로 렌더링되어 값이 비어 있을 때만 보인다. 값을 고르면 목록에서도 사라진다. 플레이스홀더를 보이려면 `value=""` 를 준다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector('select') as HTMLSelectElement;
    await expect(select.value).toBe('');
    await expect(select.options[0].disabled).toBe(true);
    await userEvent.selectOptions(select, 'category');
    await waitFor(() => expect(select.value).toBe('category'));
    await expect(select.options[0].hidden).toBe(true);
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction='column' gap={16}>
      <Controlled label='medium — 40px (기본)' size='medium' options={SORT_OPTIONS} value='latest' />
      <Controlled label='large — 52px' size='large' options={SORT_OPTIONS} value='latest' />
    </Stack>
  ),
  parameters: {
    docs: { description: { story: 'TextInput 과 같은 두 단계. 같은 폼 안에서는 하나의 size 로 통일한다.' } },
  },
  play: async ({ canvasElement }) => {
    const heights = [...canvasElement.querySelectorAll('select')].map(
      (select) => getComputedStyle(select.parentElement as Element).height,
    );
    await expect(heights).toEqual(['40px', '52px']);
  },
};

export const Invalid: Story = {
  args: {
    label: '카테고리',
    placeholder: '카테고리를 골라 주세요',
    value: '',
    errorMessage: '카테고리는 꼭 골라야 해요.',
  },
  parameters: {
    docs: {
      description: {
        story: '`errorMessage` 를 주면 테두리·라벨이 오류색이 되고 문구가 `role="alert"` 로 읽힌다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector('select') as HTMLSelectElement;
    await expect(select.getAttribute('aria-invalid')).toBe('true');
    await expect(within(canvasElement).getByRole('alert').textContent).toContain('꼭 골라야');
  },
};

export const Disabled: Story = {
  args: { label: '정렬', disabled: true, description: '통계 보기에서는 정렬을 바꿀 수 없어요.' },
  parameters: {
    docs: { description: { story: '`disabled` 는 흐리게 표시하고 피커를 열지 않는다. 화살표도 함께 흐려진다.' } },
  },
  play: async ({ canvasElement }) => {
    await expect((canvasElement.querySelector('select') as HTMLSelectElement).disabled).toBe(true);
  },
};

const CATEGORIES = [
  { value: 'food', label: '🍚 식비' },
  { value: 'transport', label: '🚌 교통' },
  { value: 'housing', label: '🏠 주거' },
  { value: 'shopping', label: '🛍️ 쇼핑' },
  { value: 'leisure', label: '🎮 여가' },
  { value: 'etc', label: '기타', disabled: true },
];

const CategoryDemo = () => {
  const [category, setCategory] = useState('');
  return (
    <Stack direction='column' gap={12}>
      <Select
        label='카테고리'
        placeholder='카테고리를 골라 주세요'
        options={CATEGORIES}
        value={category}
        onChange={setCategory}
        size='large'
        prefix={
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
            <path d='M2 4h12M2 8h12M2 12h8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          </svg>
        }
      />
      <Text variant='small1Regular' color='textTertiary'>
        선택: {CATEGORIES.find((c) => c.value === category)?.label ?? '없음'}
      </Text>
    </Stack>
  );
};

export const CategorySelect: Story = {
  render: () => <CategoryDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 가계부 카테고리 선택. `prefix` 아이콘, 플레이스홀더, 비활성 option(기타)을 조합한다. `options` 대신 `children` 으로 `<optgroup>` 을 직접 넘길 수도 있다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvasElement.querySelector('select') as HTMLSelectElement;
    await userEvent.selectOptions(select, 'housing');
    await waitFor(() => expect(canvas.getByText('선택: 🏠 주거')).toBeTruthy());
    await expect([...select.options].find((o) => o.value === 'etc')?.disabled).toBe(true);
  },
};

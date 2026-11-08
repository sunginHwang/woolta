import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { SegmentedControl, type SegmentedControlProps } from './index';

const VIEW_ITEMS = [
  { value: 'list', label: '내역' },
  { value: 'calendar', label: '달력' },
];

const TYPE_ITEMS = [
  { value: 'expenditure', label: '지출' },
  { value: 'income', label: '수입' },
];

const Controlled = (props: Omit<SegmentedControlProps, 'value' | 'onChange'> & { initial?: string }) => {
  const [value, setValue] = useState(props.initial ?? props.items[0]?.value ?? '');
  return <SegmentedControl {...props} value={value} onChange={setValue} />;
};

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  argTypes: {
    variant: { control: 'radio', options: ['thumb', 'outline'] },
    size: { control: 'radio', options: ['small', 'medium'] },
    xstyle: { control: false },
    value: { control: false },
  },
  args: { items: VIEW_ITEMS, 'aria-label': '보기 방식' },
  render: (args) => <Controlled {...args} />,
};

export default meta;

type Story = StoryObj<typeof SegmentedControl>;

const thumbTransform = (root: HTMLElement) =>
  getComputedStyle(root.querySelector('[data-testid="segmented-thumb"]') as Element).transform;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '기본은 `thumb` — 회색 트랙 위로 흰 썸이 미끄러진다. 2~5개의 상호 배타적 보기를 한 줄에서 전환할 때 쓴다. ' +
          '패널 전환이 아니라 "같은 데이터의 보기 방식"을 바꾸는 경우에만 쓰고, 콘텐츠가 달라지면 Tabs 를 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const before = thumbTransform(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: '달력' }));
    await waitFor(() => expect(canvas.getByRole('radio', { name: '달력' }).getAttribute('aria-checked')).toBe('true'));
    await expect(canvas.getByRole('radio', { name: '내역' }).getAttribute('aria-checked')).toBe('false');
    await waitFor(() => expect(thumbTransform(canvasElement)).not.toBe(before));
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction='column' align='flex-start' gap={12}>
      <Controlled items={VIEW_ITEMS} size='small' aria-label='small' />
      <Controlled items={VIEW_ITEMS} size='medium' aria-label='medium' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '높이 small 32 / medium 40px. 카드 안·헤더 옆처럼 좁은 곳은 `small`, 본문 상단은 `medium`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const heights = [...canvasElement.querySelectorAll('[role="radiogroup"]')].map((el) => getComputedStyle(el).height);
    await expect(heights).toEqual(['32px', '40px']);
  },
};

export const Outline: Story = {
  args: { items: TYPE_ITEMS, variant: 'outline', 'aria-label': '거래 종류' },
  parameters: {
    docs: {
      description: {
        story:
          '`outline` — 테두리로 구획을 나누고 선택 구획을 강조색으로 채운다. woolbank 가계부 저장 폼의 지출/수입 전환이 이 형태다. ' +
          '폼 값(둘 중 하나)을 고르는 자리에 어울리고, 보기 전환에는 `thumb` 가 낫다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: '수입' }));
    await waitFor(() => expect(canvas.getByRole('radio', { name: '수입' }).getAttribute('aria-checked')).toBe('true'));
  },
};

export const Fill: Story = {
  args: { fill: true, items: [...VIEW_ITEMS, { value: 'stat', label: '통계' }] },
  parameters: {
    docs: {
      description: {
        story: '`fill` — 부모 폭을 꽉 채우고 구획을 균등 분할한다. 폼 필드 폭에 맞출 때 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[role="radiogroup"]') as HTMLElement;
    await expect(root.getBoundingClientRect().width).toBe(
      (root.parentElement as HTMLElement).getBoundingClientRect().width,
    );
  },
};

export const Disabled: Story = {
  args: {
    items: [
      { value: 'list', label: '내역' },
      { value: 'calendar', label: '달력', disabled: true },
      { value: 'stat', label: '통계' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '`disabled` 구획은 흐리게 보이고 클릭·키보드 이동 모두에서 건너뛴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('radio', { name: '내역' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: '통계' }).getAttribute('aria-checked')).toBe('true'));
  },
};

export const Keyboard: Story = {
  args: { items: [...VIEW_ITEMS, { value: 'stat', label: '통계' }] },
  parameters: {
    docs: {
      description: {
        story:
          '`role=radiogroup` 패턴. 선택된 구획만 Tab 순서에 들어가고(roving tabIndex), ←/→ 로 선택을 옮기며 끝에서는 반대편으로 순환한다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('radio', { name: '내역' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: '달력' }).getAttribute('aria-checked')).toBe('true'));
    await expect(document.activeElement).toBe(canvas.getByRole('radio', { name: '달력' }));
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: '통계' }).getAttribute('aria-checked')).toBe('true'));
    await expect(canvas.getByRole('radio', { name: '통계' }).tabIndex).toBe(0);
    await expect(canvas.getByRole('radio', { name: '내역' }).tabIndex).toBe(-1);
  },
};

const AccountBookDemo = () => {
  const [view, setView] = useState('list');
  return (
    <Stack direction='column' align='center' gap={16} width={320}>
      <Text variant='body3' color='textSecondary'>
        {view === 'list' ? '11월 내역 32건' : '11월 달력'}
      </Text>
      <SegmentedControl items={VIEW_ITEMS} value={view} onChange={setView} size='small' aria-label='가계부 보기' />
    </Stack>
  );
};

export const AccountBookExample: Story = {
  render: () => <AccountBookDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 가계부 메인 하단의 내역/달력 알약. 같은 달 데이터를 목록으로 볼지 달력으로 볼지만 바꾼다.',
      },
    },
  },
};

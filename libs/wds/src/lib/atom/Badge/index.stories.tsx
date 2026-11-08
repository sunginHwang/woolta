import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Badge } from './index';

const BellIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path
      d='M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 20a2 2 0 0 0 4 0'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    tone: { control: 'radio', options: ['error', 'brand', 'neutral'] },
    size: { control: 'radio', options: ['small', 'medium'] },
    children: { control: false },
    xstyle: { control: false },
  },
  args: { count: 3 },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: '숫자 알약. 1–99 는 그대로, 0 이면 그리지 않는다. 단독으로 쓰면 인라인 요소로 흐름 안에 놓인다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('[role="status"]') as HTMLElement;
    await expect(badge.textContent).toBe('3');
    await expect(badge.getAttribute('aria-label')).toBe('새 알림 3개');
  },
};

export const Dot: Story = {
  args: { dot: true, count: undefined },
  parameters: {
    docs: {
      description: {
        story: '`dot` — 숫자 없는 6px 점. "새 알림이 있다" 는 사실만 중요할 때 쓴다 (SEED Small 배지).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('[role="status"]') as HTMLElement;
    await expect(badge.textContent).toBe('');
    await expect(badge.getAttribute('aria-label')).toBe('새 알림 있음');
    await expect(getComputedStyle(badge).width).toBe('6px');
  },
};

export const Max: Story = {
  args: { count: 120 },
  parameters: {
    docs: {
      description: {
        story: '`max`(기본 99)를 넘으면 `99+` 로 줄인다. 세 자리 숫자는 알약을 늘려 레이아웃을 흔들기 때문이다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('[role="status"]') as HTMLElement;
    await expect(badge.textContent).toBe('99+');
    await expect(badge.getAttribute('aria-label')).toBe('새 알림 99+개');
  },
};

export const Tones: Story = {
  render: () => (
    <Stack gap={16} align='center'>
      <Badge count={5} tone='error' />
      <Badge count={5} tone='brand' />
      <Badge count={5} tone='neutral' />
      <Badge count={5} size='small' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`error`(기본)는 알림, `brand` 는 브랜드 강조, `neutral` 은 단순 개수(장바구니 수 등). `size="small"` 은 16px 로 작은 아이콘 옆에 쓴다.',
      },
    },
  },
};

export const OnIcon: Story = {
  render: () => (
    <Stack gap={24} align='center'>
      <Badge count={7}>
        <BellIcon />
      </Badge>
      <Badge dot>
        <BellIcon />
      </Badge>
      <Badge count={7} offset={3}>
        <BellIcon />
      </Badge>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'children 을 주면 그 요소를 감싸 우상단에 겹친다. `offset` 으로 안쪽으로 밀어 넣을 수 있다. 실전 예: 헤더의 알림함 아이콘.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('[role="status"]') as HTMLElement;
    await expect(getComputedStyle(badge).position).toBe('absolute');
  },
};

export const Zero: Story = {
  render: () => (
    <Stack gap={8} align='center'>
      <Badge count={0}>
        <BellIcon />
      </Badge>
      <Text variant='body3' color='textSecondary'>
        count=0 이면 아이콘만 남는다
      </Text>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '0 이거나 count 가 없으면 배지를 그리지 않는다. 호출부에서 조건 분기할 필요가 없다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[role="status"]')).toBeNull();
    await expect(canvasElement.querySelector('svg')).not.toBeNull();
  },
};

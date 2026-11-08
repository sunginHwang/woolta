import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Progress } from './index';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    tone: { control: 'select', options: ['primary', 'brand', 'success', 'warning', 'error'] },
    size: { control: 'radio', options: ['small', 'medium'] },
    xstyle: { control: false },
  },
  args: { value: 62 },
  decorators: [
    (Story) => (
      <div style={{ width: 320, paddingTop: 8 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'woolbank Progress 의 후속. 막대 위 오른쪽에 값을, 왼쪽에 `title` 을 둔다. `label` 을 생략하면 `{value}%` 를 보인다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('[role="progressbar"]') as HTMLElement;
    await expect(bar.getAttribute('aria-valuenow')).toBe('62');
    await expect(canvasElement.textContent).toContain('62%');
  },
};

export const Tones: Story = {
  render: () => (
    <Stack direction='column' gap={20}>
      <Progress value={30} tone='primary' showLabel={false} />
      <Progress value={45} tone='brand' showLabel={false} />
      <Progress value={60} tone='success' showLabel={false} />
      <Progress value={80} tone='warning' showLabel={false} />
      <Progress value={95} tone='error' showLabel={false} />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '막대 색은 역할로 고른다. 예산 사용률처럼 "넘치면 나쁜" 값은 구간에 따라 success → warning → error 로 바꿔 쓴다.',
      },
    },
  },
};

export const WithMessages: Story = {
  args: { value: 62, title: '이번 달 예산', label: '310,000 / 500,000원', startMessage: '0원', endMessage: '50만원' },
  parameters: {
    docs: {
      description: {
        story: '실전 예 — 이번 달 예산. 위 행에 제목과 값, 아래 양 끝 문구로 축의 시작/끝 값을 알려 준다.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction='column' gap={20}>
      <Stack direction='column' gap={4}>
        <Text variant='small1Regular' color='textTertiary'>
          small 4px
        </Text>
        <Progress value={40} size='small' showLabel={false} />
      </Stack>
      <Stack direction='column' gap={4}>
        <Text variant='small1Regular' color='textTertiary'>
          medium 8px
        </Text>
        <Progress value={40} size='medium' showLabel={false} />
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '트랙 높이 4 / 8px. 목록 항목 안의 보조 막대는 `small`, 카드의 주 정보는 `medium`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const heights = [...canvasElement.querySelectorAll('[role="progressbar"]')].map(
      (el) => getComputedStyle(el).height,
    );
    await expect(heights).toEqual(['4px', '8px']);
  },
};

const AnimatedDemo = () => {
  const [value, setValue] = useState(20);
  return (
    <Stack direction='column' gap={16}>
      <Progress value={value} startMessage='0' endMessage='100' />
      <Stack gap={8}>
        <Button type='button' size='small' variant='outline' onClick={() => setValue((v) => Math.max(0, v - 20))}>
          -20
        </Button>
        <Button type='button' size='small' onClick={() => setValue((v) => Math.min(100, v + 20))}>
          +20
        </Button>
      </Stack>
    </Stack>
  );
};

export const Animated: Story = {
  render: () => <AnimatedDemo />,
  parameters: {
    docs: {
      description: { story: '값이 바뀌면 막대 폭이 300ms 로 따라간다.' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvasElement.querySelector('[role="progressbar"]') as HTMLElement;
    await expect(bar.getAttribute('aria-valuenow')).toBe('20');
    await userEvent.click(canvas.getByRole('button', { name: '+20' }));
    await waitFor(() => expect(bar.getAttribute('aria-valuenow')).toBe('40'));
  },
};

export const Edges: Story = {
  render: () => (
    <Stack direction='column' gap={20}>
      <Progress value={0} title='시작 전' startMessage='0%' />
      <Progress value={100} tone='success' title='달성' endMessage='100%' />
      <Progress value={250} tone='error' title='범위 초과' label='범위 초과' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '0% 와 100% 양 끝. 범위를 벗어난 값(250)은 100 으로 잘리고 막대가 트랙을 넘지 않는다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const bars = [...canvasElement.querySelectorAll('[role="progressbar"]')];
    await expect(bars.map((el) => el.getAttribute('aria-valuenow'))).toEqual(['0', '100', '100']);
    for (const bar of bars) {
      const fill = bar.firstElementChild as HTMLElement;
      await expect(fill.getBoundingClientRect().right).toBeLessThanOrEqual(bar.getBoundingClientRect().right + 0.5);
    }
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { lazy } from 'react';
import { expect, waitFor, within } from 'storybook/test';
import { Suspense } from '../../common/Suspense';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Skeleton } from './index';

const meta: Meta<typeof Skeleton.Text> = {
  title: 'Components/Skeleton',
  component: Skeleton.Text,
  argTypes: { xstyle: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Skeleton.Text>;

export const Text_: Story = {
  name: 'Text',
  args: { lines: 3 },
  parameters: {
    docs: {
      description: {
        story:
          '`Skeleton.Text` — 문단 자리. 마지막 줄만 60% 로 짧아 실제 글처럼 보인다. 모든 프리셋은 `role="status"` + `aria-busy` 로 로딩을 알린다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status', { name: '불러오는 중' });
    await expect(status.getAttribute('aria-busy')).toBe('true');
  },
};

export const Circle: Story = {
  render: () => (
    <Stack align='center' gap={16}>
      <Skeleton.Circle size={24} />
      <Skeleton.Circle size={40} />
      <Skeleton.Circle size={64} />
    </Stack>
  ),
  parameters: {
    docs: { description: { story: '`Skeleton.Circle` — 아바타·아이콘 자리. `size` 는 지름(px).' } },
  },
};

export const Card: Story = {
  render: () => (
    <Stack direction='column' gap={16}>
      <Skeleton.Card />
      <Skeleton.Card withThumbnail />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '`Skeleton.Card` — 카드 자리. 제목 한 줄 + 본문 두 줄이고 `withThumbnail` 로 왼쪽 썸네일 자리를 더한다.',
      },
    },
  },
};

export const List: Story = {
  render: () => (
    <Stack direction='column' gap={32}>
      <Skeleton.List rows={3} />
      <Skeleton.List rows={3} withAvatar />
    </Stack>
  ),
  parameters: {
    docs: { description: { story: '`Skeleton.List` — 행마다 두 줄(+아바타). `rows` 로 개수를 맞춘다.' } },
  },
};

export const AccountBookList: Story = {
  render: () => <Skeleton.AccountBookList />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 가계부 목록 스켈레톤(`AccountBookListSkeleton`)을 프리셋으로 옮긴 것. 날짜 그룹 헤더(날짜 + 합계) 아래 내역 3줄, 5개 그룹.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-day-group]').length).toBe(5);
  },
};

const SlowList = lazy(
  () =>
    new Promise<{ default: () => React.JSX.Element }>((resolve) => {
      setTimeout(() => {
        resolve({
          default: () => (
            <Stack direction='column' gap={8}>
              {['점심 12,000원', '커피 4,500원', '교통 1,400원'].map((row) => (
                <Text key={row} variant='body2' color='textPrimary' as='p'>
                  {row}
                </Text>
              ))}
            </Stack>
          ),
        });
      }, 1500);
    }),
);

export const WithSuspense: Story = {
  render: () => (
    <Suspense fallback={<Skeleton.List rows={3} />}>
      <SlowList />
    </Suspense>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — `Suspense` 의 fallback 으로 프리셋을 넣는다. 데이터가 오면(1.5초 뒤) 같은 높이의 실제 목록으로 바뀌어 레이아웃이 덜 흔들린다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeTruthy();
    await waitFor(() => expect(canvas.getByText('점심 12,000원')).toBeTruthy(), { timeout: 4000 });
  },
};

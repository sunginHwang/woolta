import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Timeline, type TimelineItem } from './index';

const ITEMS: TimelineItem[] = [
  { key: '1', dateLabel: { top: '11월', bottom: '10' }, title: '삼성화재', description: '보험', value: '14,000원' },
  { key: '2', dateLabel: { top: '11월', bottom: '12' }, title: '삼성화재', description: '보험', value: '12,000원' },
  {
    key: '3',
    dateLabel: { top: '11월', bottom: '30' },
    title: '성인아이폰',
    description: '가전/가구',
    value: '89,587원',
  },
  {
    key: '4',
    dateLabel: { top: '12월', bottom: '1' },
    title: '자유적금',
    description: '대출/투자',
    value: '300,000원',
  },
  {
    key: '5',
    dateLabel: { top: '12월', bottom: '3' },
    title: '넷플릭스',
    description: '구독서비스',
    value: '22,000원',
  },
  { key: '6', dateLabel: { top: '12월', bottom: '5' }, title: '쿠팡구독', description: '구독서비스', value: '4,990원' },
  {
    key: '7',
    dateLabel: { top: '12월', bottom: '25' },
    title: '정기적금',
    description: '대출/투자',
    value: '2,200,000원',
  },
];

const meta: Meta<typeof Timeline> = {
  title: 'Components/Timeline',
  component: Timeline,
  argTypes: {
    items: { control: false },
    empty: { control: false },
    xstyle: { control: false },
  },
  args: { items: ITEMS, 'aria-label': '이체 일정' },
  decorators: [
    (Story) => (
      <div style={{ width: 358 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Timeline>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '정기지출 "이체 일정" 카드의 본문. 날짜순 한 목록이며 첫 행의 점만 primary 로 칠해 다음에 빠져나갈 이체를 알린다. ' +
          '왼쪽 4rem 은 월·일, 가운데 1.6rem 은 점과 선, 행 높이는 6.4rem, 행 사이 1px 구분선.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(7);
    const dots = canvasElement.querySelectorAll('[data-tone]');
    await expect(dots[0].getAttribute('data-tone')).toBe('primary');
    await expect(dots[1].getAttribute('data-tone')).toBe('default');
    await expect(canvasElement.querySelector('[data-key="4"]')).toBeTruthy();
  },
};

export const WithActiveKeys: Story = {
  args: { activeKeys: ['1', '2'] },
  parameters: {
    docs: {
      description: {
        story:
          '`activeKeys` 에 든 행은 fillSubtle 배경으로 강조된다. 요약 카드의 "7일 안에 N건 빠져나가요" 를 탭했을 때 해당 행들로 스크롤하며 잠깐 비추는 용도다.',
      },
    },
  },
};

export const Clickable: Story = {
  args: {
    items: ITEMS.slice(0, 3).map((item) => ({ ...item, onClick: fn() })),
  },
  parameters: {
    docs: {
      description: {
        story:
          '`onClick` 이 있는 행은 `<button>` 으로 그려 키보드로도 누를 수 있다. `onLongPress` 를 주면 700ms 길게 눌러 삭제 같은 보조 액션을 띄울 수 있다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const rows = canvas.getAllByRole('button');
    await expect(rows).toHaveLength(3);
    await userEvent.click(rows[1]);
    await expect(args.items[1].onClick).toHaveBeenCalledTimes(1);
    await expect(args.items[0].onClick).not.toHaveBeenCalled();
  },
};

export const Empty: Story = {
  args: {
    items: [],
    empty: (
      <EmptyState size='small' message='등록된 정기지출이 없어요' description='＋ 추가로 첫 이체를 등록해 보세요' />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '항목이 없으면 `empty` 노드를 대신 그린다. 보통 EmptyState 를 넣는다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('ol')).toBeNull();
    await expect(canvasElement.textContent).toContain('등록된 정기지출이 없어요');
  },
};

const ScrollToDemo = () => {
  const [active, setActive] = useState<string[]>([]);
  const soon = ['1', '2'];

  const handleJump = () => {
    setActive(soon);
    document.querySelector(`[data-key="${soon[0]}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => setActive([]), 1500);
  };

  return (
    <Stack direction='column' gap={12}>
      <Button type='button' variant='secondary' size='small' onClick={handleJump}>
        7일 안에 2건 빠져나가요 ›
      </Button>
      <Text variant='small1Regular' color='textTertiary' as='p'>
        누르면 해당 행이 1.5초 동안 강조된다
      </Text>
      <Timeline items={ITEMS} activeKeys={active} aria-label='이체 일정' />
    </Stack>
  );
};

export const JumpToSoon: Story = {
  render: () => <ScrollToDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — 요약 카드의 "7일 안에 N건" 행을 탭하면 `data-key` 로 첫 항목을 찾아 스크롤하고 `activeKeys` 로 잠깐 비춘다.',
      },
    },
  },
};

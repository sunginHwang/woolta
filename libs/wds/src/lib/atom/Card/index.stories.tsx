import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Card } from './index';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    padding: { control: 'radio', options: ['none', 'small', 'medium'] },
    xstyle: { control: false },
    as: { control: 'text' },
  },
  args: {
    children: (
      <Text variant='body2' color='textPrimary'>
        카드 내용
      </Text>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: '흰 표면 + 12px 모서리 + popover 그림자. 기본 여백 20px. 목록의 한 항목이나 요약 패널을 감싼다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('section') as HTMLElement;
    await expect(getComputedStyle(card).padding).toBe('20px');
    await expect(getComputedStyle(card).borderRadius).toBe('12px');
  },
};

export const Inset: Story = {
  args: { inset: true },
  render: (args) => (
    <div style={{ width: 360, border: '1px dashed currentColor' }}>
      <Card {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`inset` — 좌우 20px 바깥 여백. 화면 가장자리까지 닿는 목록 안에서 카드만 띄울 때 쓴다 (woolbank `useSideMargin`).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('section') as HTMLElement;
    await expect(getComputedStyle(card).marginLeft).toBe('20px');
  },
};

export const Interactive: Story = {
  args: { onClick: fn(), padding: 'small' },
  parameters: {
    docs: {
      description: {
        story: '`onClick` 을 주면 카드 전체가 `<button>` 이 되어 hover·active 피드백과 키보드 포커스 링이 붙는다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button');
    await expect(card.tagName).toBe('BUTTON');
    await userEvent.click(card);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Composition: Story = {
  render: () => (
    <Card>
      <Stack direction='column' gap={8}>
        <Stack justify='space-between' align='center'>
          <Text variant='title5Bold' color='textPrimary'>
            11월 지출
          </Text>
          <Text variant='small2Medium' color='statusError'>
            예산 초과
          </Text>
        </Stack>
        <Text as='p' variant='title2Bold' color='textActive'>
          1,254,300원
        </Text>
        <Text variant='body4Regular' color='textTertiary'>
          예산 1,200,000원 중 104% 사용
        </Text>
      </Stack>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: '실전 예 — woolbank 월 요약 카드. Card 는 표면만 담당하고 안쪽 배치는 Stack·Text 로 조립한다.',
      },
    },
  },
};

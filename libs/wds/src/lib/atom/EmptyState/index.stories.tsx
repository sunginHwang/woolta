import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from '../Button';
import { EmptyState } from './index';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  argTypes: {
    size: { control: 'radio', options: ['medium', 'small'] },
    illustration: { control: false },
    action: { control: false },
    xstyle: { control: false },
  },
  args: { message: '아직 등록된 가계부가 없어요' },
  decorators: [
    (Story) => (
      <div style={{ width: 360, minHeight: 320, display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'woolbank EmptyInfo 의 후속. 일러스트(120px) + 굵은 제목. 목록이 비었을 때 빈 화면을 남기지 말고 무엇이 없는지 말해 준다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('svg')).not.toBeNull();
    await expect(canvasElement.textContent).toContain('아직 등록된 가계부가 없어요');
  },
};

export const WithAction: Story = {
  args: {
    message: '이번 달 내역이 없어요',
    description: '첫 지출을 기록하면 월 통계가 시작돼요.',
    action: (
      <Button type='button' variant='secondary' size='medium'>
        가계부 추가
      </Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — 가계부 내역 없음. `description` 으로 다음 행동을 설명하고 `action` 에 secondary Button 을 둔다. 1차 CTA 는 하단 FixedBottomCTA 의 몫이라 여기서는 보조 버튼만.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('button')?.textContent).toBe('가계부 추가');
  },
};

export const CustomIllustration: Story = {
  args: {
    message: '검색 결과가 없어요',
    description: '다른 검색어로 다시 시도해 보세요.',
    illustration: (
      <svg viewBox='0 0 120 120' width='100%' aria-hidden='true'>
        <circle cx='52' cy='52' r='30' fill='none' stroke='currentColor' strokeWidth='6' />
        <path d='M75 75l26 26' stroke='currentColor' strokeWidth='8' strokeLinecap='round' />
      </svg>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          '`illustration` 으로 상황에 맞는 그림을 바꾼다. 색은 `currentColor`(borderSubtle)를 쓰면 다크 테마에서도 맞는다.',
      },
    },
  },
};

export const Small: Story = {
  args: { size: 'small', message: '정기지출이 없어요' },
  decorators: [
    (Story) => (
      <div style={{ width: 360, border: '1px dashed currentColor', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '`size="small"` — 목록 섹션 하나가 비었을 때. 일러스트 80px, 제목은 title5Bold 로 줄어든다.',
      },
    },
  },
};

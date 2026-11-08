import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Spinner } from './index';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    color: { control: 'radio', options: ['current', 'primary', 'inverse'] },
    xstyle: { control: false },
  },
  args: { color: 'primary' },
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '회전하는 링. react-spinners 의 ClipLoader 를 대체한다. `role="status"` 와 라벨("로딩 중")을 가져 스크린리더가 상태를 읽는다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const spinner = canvasElement.querySelector('[role="status"]') as HTMLElement;
    await expect(spinner.getAttribute('aria-label')).toBe('로딩 중');
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap={16} align='center'>
      <Spinner size='small' color='primary' />
      <Spinner size='medium' color='primary' />
      <Spinner size='large' color='primary' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '지름 16 / 24 / 40px. 버튼 안은 `small`, 목록 끝·카드 안은 `medium`, 전체 화면은 `large`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const sizes = [...canvasElement.querySelectorAll('[role="status"]')].map((el) => getComputedStyle(el).width);
    await expect(sizes).toEqual(['16px', '24px', '40px']);
  },
};

export const Colors: Story = {
  render: () => (
    <Stack gap={16} align='center'>
      <Stack p={12} align='center' style={{ color: '#6D6D6D' }}>
        <Spinner color='current' />
      </Stack>
      <Stack p={12} align='center'>
        <Spinner color='primary' />
      </Stack>
      <Stack p={12} align='center' style={{ backgroundColor: '#242424', borderRadius: 8 }}>
        <Spinner color='inverse' />
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`current`(기본)는 부모 글자색을 따라 버튼 변형마다 알아서 맞는다. `primary` 는 흰 배경 위 단독, `inverse` 는 딤이나 어두운 표면 위.',
      },
    },
  },
};

export const InButton: Story = {
  render: () => (
    <Stack gap={8}>
      <Button type='button' startIcon={<Spinner size='small' />}>
        불러오는 중
      </Button>
      <Button type='button' variant='outline' startIcon={<Spinner size='small' />}>
        동기화 중
      </Button>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '버튼의 `startIcon` 에 `size="small"` 로 넣으면 글자와 정렬된다. 버튼 자체가 처리 중이라 눌리면 안 되는 상황은 Button 의 `loading` 을 쓴다.',
      },
    },
  },
};

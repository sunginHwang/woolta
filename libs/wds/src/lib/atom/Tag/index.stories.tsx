import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Tag } from './index';

const CheckIcon = () => (
  <svg width='12' height='12' viewBox='0 0 12 12' fill='none' aria-hidden='true'>
    <path
      d='M2.5 6.5l2.5 2.5 4.5-5'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'brand', 'success', 'warning', 'error', 'info'] },
    variant: { control: 'radio', options: ['subtle', 'solid', 'outline'] },
    size: { control: 'radio', options: ['small', 'medium'] },
    as: { control: 'radio', options: ['span', 'li'] },
    icon: { control: false },
    xstyle: { control: false },
  },
  args: { children: '정기이체', tone: 'error' },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'woolbank 정기지출 목록의 "정기이체" 라벨. 누를 수 없는 정적 표시다 — 누르는 것(필터·선택)은 Chip 을 쓴다.',
      },
    },
  },
};

export const Tones: Story = {
  render: () => (
    <Stack gap={8} wrap='wrap'>
      <Tag tone='neutral'>neutral</Tag>
      <Tag tone='brand'>brand</Tag>
      <Tag tone='success'>success</Tag>
      <Tag tone='warning'>warning</Tag>
      <Tag tone='error'>error</Tag>
      <Tag tone='info'>info</Tag>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '여섯 가지 역할. 상태 네 가지는 `status*` 토큰, brand 는 브랜드 핑크, neutral 은 회색이다. 의미 없이 색만 고르지 말고 역할로 고른다.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Stack direction='column' gap={12}>
      <Stack gap={8}>
        <Tag tone='error' variant='subtle'>
          subtle
        </Tag>
        <Tag tone='error' variant='solid'>
          solid
        </Tag>
        <Tag tone='error' variant='outline'>
          outline
        </Tag>
      </Stack>
      <Stack gap={8}>
        <Tag tone='success' variant='subtle'>
          subtle
        </Tag>
        <Tag tone='success' variant='solid'>
          solid
        </Tag>
        <Tag tone='success' variant='outline'>
          outline
        </Tag>
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`subtle`(기본)은 12% 틴트 배경으로 가장 조용하다. `solid` 는 강하게 눈에 띄어야 할 때, `outline` 은 배경이 이미 채워진 카드 위에 쓴다.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap={8} align='center'>
      <Tag size='small'>small 18</Tag>
      <Tag size='medium'>medium 22</Tag>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '높이 18 / 22px. 제목 옆에 붙는 라벨은 `small`, 카드 상단에 단독으로 놓이는 상태 표시는 `medium`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const heights = [...canvasElement.querySelectorAll('span')]
      .filter((el) => el.textContent?.startsWith('small') || el.textContent?.startsWith('medium'))
      .map((el) => getComputedStyle(el).height);
    await expect(heights).toEqual(['18px', '22px']);
  },
};

export const WithIcon: Story = {
  args: { tone: 'success', icon: <CheckIcon />, children: '정산 완료', size: 'medium' },
  parameters: {
    docs: {
      description: {
        story: '`icon` 은 글자 앞 12px 슬롯. `currentColor` 를 쓰면 tone 의 글자색을 그대로 따른다.',
      },
    },
  },
};

export const InList: Story = {
  render: () => (
    <Stack direction='column' gap={16} width={320}>
      <Stack direction='column' gap={4}>
        <Stack align='center' gap={6}>
          <Text variant='title5Bold' color='textPrimary'>
            주담대대출
          </Text>
          <Tag tone='error'>정기이체</Tag>
        </Stack>
        <Text variant='body3' color='textSecondary'>
          1,504,375원
        </Text>
      </Stack>
      <Stack gap={8} wrap='wrap'>
        <Tag tone='neutral' size='medium'>
          총 24건
        </Tag>
        <Tag tone='warning' variant='outline' size='medium'>
          중복 의심 3건 — 기본 해제됨
        </Tag>
        <Tag tone='warning' variant='outline' size='medium'>
          카테고리 미지정 2건
        </Tag>
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — 정기지출 항목 제목 옆의 "정기이체", 대량 업로드 결과 요약의 상태 라벨. 두 화면이 각자 만들던 스타일을 하나로 합쳤다.',
      },
    },
  },
};

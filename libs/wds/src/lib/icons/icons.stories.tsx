import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '../atom/Stack';
import { Text } from '../atom/Text';
import { colorVars } from '../style/tokens.stylex';
import {
  IconAccountOutline,
  IconChevronLeft,
  IconCircleCheck,
  IconPigOutline,
  IconPlus,
  NAVIGATION_ICON_PAIRS,
} from './index';

const meta: Meta<typeof IconPigOutline> = {
  title: 'Components/Icon',
  component: IconPigOutline,
  argTypes: {
    size: { control: { type: 'number', min: 12, max: 64 } },
    color: { control: 'color' },
    title: { control: 'text' },
    xstyle: { control: false },
  },
  args: { size: 24 },
};

export default meta;

type Story = StoryObj<typeof IconPigOutline>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '모든 아이콘은 `createIcon` 으로 만들어져 `size` · `color` · `title` 을 똑같이 받는다. 전체 목록은 Foundations/Icons 문서에 있다.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack align='center' gap={24}>
      {[16, 20, 24, 32].map((size) => (
        <Stack key={size} direction='column' align='center' gap={4}>
          <IconPigOutline size={size} />
          <Text variant='small1Regular' color='textTertiary'>
            {size}
          </Text>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '`size` 는 width 와 height 를 함께 정한다. 버튼 안은 16–20, 본문 옆은 24, 강조는 32.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const widths = [...canvasElement.querySelectorAll('svg')].map((svg) => svg.getAttribute('width'));
    await expect(widths).toEqual(['16', '20', '24', '32']);
  },
};

export const Colors: Story = {
  render: () => (
    <Stack align='center' gap={24}>
      <Text variant='body2' color='textPrimary'>
        글자색 따라감 <IconCircleCheck size={20} />
      </Text>
      <Text variant='body2' color='brandPrimary'>
        글자색 따라감 <IconCircleCheck size={20} />
      </Text>
      <IconCircleCheck size={24} color={colorVars['--color-statusSuccess']} />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '기본 `currentColor` 라 부모 `Text` 의 색을 그대로 따른다. 직접 줄 때는 Semantic 토큰 값을 `color` 로 넘긴다.',
      },
    },
  },
};

export const WithTitle: Story = {
  render: () => (
    <Stack align='center' gap={16}>
      <IconPlus title='추가' />
      <IconChevronLeft />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`title` 을 주면 `role="img"` 과 `<title>` 이 생겨 스크린리더가 읽는다. 없으면 `aria-hidden` 장식용이므로, 아이콘만 있는 버튼은 버튼에 `aria-label` 을 준다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const named = canvas.getByRole('img', { name: '추가' });
    await expect(named.querySelector('title')?.textContent).toBe('추가');
    const [, decorative] = canvasElement.querySelectorAll('svg');
    await expect(decorative.getAttribute('aria-hidden')).toBe('true');
  },
};

export const BottomNavPairs: Story = {
  render: () => (
    <Stack gap={32}>
      {NAVIGATION_ICON_PAIRS.map(({ label, outline: Outline, fill: Fill }) => (
        <Stack key={label} direction='column' align='center' gap={8}>
          <Stack gap={12}>
            <Outline size={28} color={colorVars['--color-textSecondary']} />
            <Fill size={28} color={colorVars['--color-interactivePrimary']} />
          </Stack>
          <Text variant='small1Regular' color='textTertiary'>
            {label}
          </Text>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '하단 내비게이션용 Outline/Fill 짝. SEED 규칙대로 활성 탭은 Fill + 강조색, 비활성은 보조색으로 톤만 바꾼다. 한 바에 두 스타일을 섞지 않는다. ' +
          '(woolbank 는 통계·내 정보에 같은 `IconAccountOutline` 을 쓰고 있어 `IconChartFill` 을 새로 그렸다)',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('svg').length).toBe(8);
  },
};

export const InButton: Story = {
  render: () => (
    <button type='button' aria-label='내 정보' style={{ display: 'inline-flex', padding: 8 }}>
      <IconAccountOutline size={20} />
    </button>
  ),
  parameters: {
    docs: {
      description: {
        story: '아이콘만 있는 버튼 — 아이콘은 장식(aria-hidden)이고 접근성 이름은 버튼의 `aria-label` 이 담당한다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: '내 정보' })).toBeTruthy();
  },
};

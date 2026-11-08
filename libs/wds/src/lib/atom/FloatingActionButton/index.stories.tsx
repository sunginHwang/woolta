import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconEditRegular } from '../../icons';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { FloatingActionButton } from './index';

const meta: Meta<typeof FloatingActionButton> = {
  title: 'Components/FloatingActionButton',
  component: FloatingActionButton,
  argTypes: {
    size: { control: 'radio', options: ['medium', 'large'] },
    position: { control: 'radio', options: ['fixed', 'static'] },
    icon: { control: false },
    xstyle: { control: false },
  },
  args: { label: '가계부 추가', position: 'static', onClick: fn() },
};

export default meta;

type Story = StoryObj<typeof FloatingActionButton>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '기본은 56px 원형(SEED FAB 기본 크기) + `IconPlus`. `label` 은 필수이며 `aria-label` 로 들어간다. 실제 앱에서는 `position="fixed"` 로 우하단에 고정된다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: '가계부 추가' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Extended: Story = {
  args: { extended: true, icon: <IconEditRegular size={20} /> },
  parameters: {
    docs: {
      description: {
        story: '`extended` 는 아이콘 옆에 라벨을 보이는 알약 형태. 액션이 무엇인지 아이콘만으로 전달되지 않을 때 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('가계부 추가')).toBeTruthy();
  },
};

const FakeLink = ({ href, children, ...rest }: ComponentProps<'a'>) => (
  <a href={href} data-link {...rest}>
    {children}
  </a>
);

export const AsLink: Story = {
  args: { href: '/account-books/save', linkComponent: FakeLink },
  parameters: {
    docs: {
      description: {
        story:
          'woolbank 의 AddButton 처럼 페이지 이동이면 `href` 를 준다. Next 에서는 `linkComponent={Link}` 를 넘기면 wds 가 Next 에 의존하지 않고도 링크로 렌더된다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('a[data-link]');
    await expect(link?.getAttribute('href')).toBe('/account-books/save');
    await expect(link?.getAttribute('aria-label')).toBe('가계부 추가');
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack align='center' gap={24}>
      <FloatingActionButton {...args} size='medium' />
      <FloatingActionButton {...args} size='large' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'medium 48px / large 56px. 하단 바 위에 뜨는 주 액션은 large, 카드 안 보조 액션은 medium.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const sizes = [...canvasElement.querySelectorAll('button')].map((b) => getComputedStyle(b).width);
    await expect(sizes).toEqual(['48px', '56px']);
  },
};

export const InScreen: Story = {
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: 390,
        height: 420,
        overflow: 'hidden',
        border: '1px dashed currentColor',
        borderRadius: 12,
      }}
    >
      <Stack direction='column' gap={12} p={16}>
        {['점심 12,000원', '커피 4,500원', '교통 1,400원', '장보기 38,200원', '구독 9,900원'].map((row) => (
          <Text key={row} variant='body2' color='textPrimary' as='p'>
            {row}
          </Text>
        ))}
      </Stack>
      <div style={{ position: 'absolute', right: 20, bottom: 20 }}>
        <FloatingActionButton {...args} position='static' />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 가계부 목록 위의 추가 버튼. 실제로는 `position="fixed"` 가 우하단(`bottom: safe-area + 8rem`)에 고정해 BottomNavigation 과 겹치지 않는다.',
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Text } from '@wds';
import { expect, within } from 'storybook/test';
import { NavigationBar } from './NavigationBar';

/**
 * 프리뷰 데코레이터의 Layout 이 `/` 경로에서 NavigationBar 를 이미 그린다.
 * 이 스토리는 본문만 채워 하단 내비가 콘텐츠 위에 어떻게 얹히는지 보여준다.
 */
const PLACEHOLDER_ROWS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];

const Placeholder = () => (
  <div style={{ padding: '2rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
    <Text variant='title3Bold' as='h1'>
      하단 내비게이션
    </Text>
    <Text variant='body3' color='textSecondary' as='p'>
      가계부 · 정기지출 · [+] · 통계 · 내 정보. 가운데 추가 버튼은 탭과 같은 높이에 놓이고, 스크롤을 내리면 숨는다.
    </Text>
    {PLACEHOLDER_ROWS.map((id) => (
      <div key={id} style={{ height: '4.8rem', borderRadius: '0.8rem', backgroundColor: 'var(--color-fillSubtle)' }} />
    ))}
  </div>
);

const meta: Meta<typeof NavigationBar> = {
  title: 'domains/layout/NavigationBar',
  component: NavigationBar,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { pathname: '/' } },
  },
  render: () => <Placeholder />,
};

export default meta;

type Story = StoryObj<typeof NavigationBar>;

export const 가계부_선택: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const nav = await canvas.findByRole('navigation');
    const tabs = within(nav).getAllByRole('link');

    await expect(tabs).toHaveLength(4);
    await expect(within(nav).getByRole('link', { name: /가계부/ })).toHaveAttribute('aria-current', 'page');
    await expect(within(nav).getByRole('button', { name: '내역 추가' })).toBeInTheDocument();
  },
};

export const 정기지출_선택: Story = {
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: '/regular-extenditure' } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const nav = await canvas.findByRole('navigation');

    await expect(within(nav).getByRole('link', { name: /정기지출/ })).toHaveAttribute('aria-current', 'page');
  },
};

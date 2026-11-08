import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Text } from '../Text';
import { HEADER_HEIGHT, Header } from './index';

const BellIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path
      d='M6 16V11a6 6 0 1112 0v5l2 2H4l2-2zm4 4h4'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const IconButton = ({ label, onClick }: { label: string; onClick?: () => void }) => (
  <button
    type='button'
    aria-label={label}
    onClick={onClick}
    style={{ background: 'none', border: 0, padding: 4, color: 'inherit', cursor: 'pointer', display: 'inline-flex' }}
  >
    <BellIcon />
  </button>
);

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: { title: '가계부' },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '메인 화면 제목 바. 높이는 `HEADER_HEIGHT`(56px) 로 export 되어 아래 sticky 요소의 top 계산에 쓴다. 뒤로 가기가 필요한 상세 화면은 `Header.Sub` 를 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: '가계부' })).toBeTruthy();
    await expect(getComputedStyle(canvasElement.querySelector('header > div') as Element).height).toBe('56px');
  },
};

export const WithRight: Story = {
  args: { title: '가계부', right: <IconButton label='알림' /> },
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 가계부 메인. 오른쪽 `right` 슬롯에 알림·설정 같은 아이콘 버튼을 둔다. 버튼은 `aria-label` 을 가져야 한다.',
      },
    },
  },
};

export const Sub: Story = {
  args: { title: '가계부 작성', onBackClick: fn() },
  render: (args) => (
    <Header.Sub title={args.title as string} onBackClick={(args as { onBackClick: () => void }).onBackClick} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`Header.Sub` — 뒤로 가기 + 가운데 제목 + 오른쪽 액션. wds 는 라우터를 모르므로 `onBackClick` 에 `router.back()` 을 호출부가 연결한다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '뒤로 가기' }));
    await expect((args as { onBackClick: ReturnType<typeof fn> }).onBackClick).toHaveBeenCalledTimes(1);
  },
};

export const SubWithoutBack: Story = {
  render: () => <Header.Sub title='내 정보' right={<IconButton label='알림' />} />,
  parameters: {
    docs: {
      description: {
        story:
          '`onBackClick` 을 주지 않으면 뒤로 가기 버튼이 빠지고 제목은 여전히 가운데에 남는다 (양쪽 슬롯이 같은 폭).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button', { name: '뒤로 가기' })).toBeNull();
  },
};

export const SubTransparent: Story = {
  render: () => (
    <div style={{ background: 'linear-gradient(135deg, #ffb8d2, #536dfe)', height: 160 }}>
      <Header.Sub title='통계' transparent onBackClick={() => undefined} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`transparent` — 배경과 구분선을 지워 이미지·스켈레톤 위에 얹는다. woolbank 의 `useSkeleton` 옵션에 해당한다.',
      },
    },
  },
};

export const StickyInScroll: Story = {
  render: () => (
    <div style={{ height: 240, overflowY: 'auto', border: '1px dashed currentColor' }}>
      <Header.Sub title='긴 목록' onBackClick={() => undefined} />
      {Array.from({ length: 20 }, (_, i) => (
        <Text key={String(i)} as='p' variant='body2' color='textSecondary' mt={12} ml={16}>
          항목 {i + 1}
        </Text>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `기본 \`position='sticky'\` 는 스크롤 컨테이너 상단에 붙는다. 뷰포트 기준으로 고정하려면 \`fixed\` 를 쓰고 본문에 \`HEADER_HEIGHT\`(${HEADER_HEIGHT}) 만큼 여백을 준다.`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const scroller = canvasElement.firstElementChild as HTMLElement;
    scroller.scrollTop = 200;
    await new Promise((resolve) => setTimeout(resolve, 50));
    const header = scroller.querySelector('header') as HTMLElement;
    await expect(header.getBoundingClientRect().top).toBeCloseTo(scroller.getBoundingClientRect().top + 1, 0);
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { BottomNavigation, type BottomNavigationItem } from './index';

/* 스토리 전용 아이콘 — SEED 권장대로 Outline/Fill 쌍을 두고 선택 시 Fill 로 바꾼다 */
const svgProps = { width: 24, height: 24, viewBox: '0 0 24 24', 'aria-hidden': true } as const;

const PigOutline = () => (
  <svg {...svgProps} fill='none' stroke='currentColor' strokeWidth='1.8'>
    <path d='M4 12a8 6 0 0 1 16 0v3a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-3Z' />
    <circle cx='15' cy='12' r='1' fill='currentColor' />
  </svg>
);
const PigFill = () => (
  <svg {...svgProps} fill='currentColor'>
    <path d='M4 12a8 6 0 0 1 16 0v3a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-3Z' />
  </svg>
);
const WalletOutline = () => (
  <svg {...svgProps} fill='none' stroke='currentColor' strokeWidth='1.8'>
    <rect x='3' y='6' width='18' height='13' rx='2' />
    <path d='M15 12h4' />
  </svg>
);
const WalletFill = () => (
  <svg {...svgProps} fill='currentColor'>
    <rect x='3' y='6' width='18' height='13' rx='2' />
  </svg>
);
const ChartOutline = () => (
  <svg {...svgProps} fill='none' stroke='currentColor' strokeWidth='1.8'>
    <path d='M5 19V10M12 19V5M19 19v-7' strokeLinecap='round' />
  </svg>
);
const ChartFill = () => (
  <svg {...svgProps} fill='currentColor'>
    <rect x='4' y='10' width='3' height='10' rx='1' />
    <rect x='10.5' y='4' width='3' height='16' rx='1' />
    <rect x='17' y='12' width='3' height='8' rx='1' />
  </svg>
);
const UserOutline = () => (
  <svg {...svgProps} fill='none' stroke='currentColor' strokeWidth='1.8'>
    <circle cx='12' cy='8' r='4' />
    <path d='M4 20a8 8 0 0 1 16 0' />
  </svg>
);
const UserFill = () => (
  <svg {...svgProps} fill='currentColor'>
    <circle cx='12' cy='8' r='4' />
    <path d='M4 20a8 8 0 0 1 16 0Z' />
  </svg>
);
const PlusIcon = () => (
  <svg {...svgProps} fill='none' stroke='currentColor' strokeWidth='2.4'>
    <path d='M12 5v14M5 12h14' strokeLinecap='round' />
  </svg>
);

const ITEMS: BottomNavigationItem[] = [
  { value: 'home', label: '가계부', icon: <PigOutline />, selectedIcon: <PigFill /> },
  { value: 'regular', label: '정기지출', icon: <WalletOutline />, selectedIcon: <WalletFill /> },
  { value: 'statistic', label: '가계부 통계', icon: <ChartOutline />, selectedIcon: <ChartFill /> },
  { value: 'me', label: '내 정보', icon: <UserOutline />, selectedIcon: <UserFill /> },
];

/** 390px 폰 프레임 — 스토리에서는 `position='static'` 으로 흐름 안에 둔다 */
const Phone = ({ children, body }: { children: React.ReactNode; body?: React.ReactNode }) => (
  <div
    style={{
      width: 390,
      height: 220,
      border: '1px dashed currentColor',
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      position: 'relative',
    }}
  >
    <div style={{ flex: 1, padding: 16 }}>{body}</div>
    {children}
  </div>
);

const Controlled = (props: Partial<React.ComponentProps<typeof BottomNavigation>>) => {
  const [value, setValue] = useState(props.value ?? 'home');
  return (
    <Phone
      body={
        <Text variant='body3' color='textTertiary'>
          선택: {value}
        </Text>
      }
    >
      <BottomNavigation items={ITEMS} {...props} position='static' value={value} onChange={setValue} />
    </Phone>
  );
};

const meta: Meta<typeof BottomNavigation> = {
  title: 'Components/BottomNavigation',
  component: BottomNavigation,
  argTypes: {
    position: { control: 'radio', options: ['fixed', 'static'] },
    items: { control: false },
    centerAction: { control: false },
    linkComponent: { control: false },
    xstyle: { control: false },
  },
  args: { items: ITEMS, value: 'home', position: 'static' },
  render: (args) => <Controlled {...args} />,
};

export default meta;

type Story = StoryObj<typeof BottomNavigation>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '탭 4개. 선택된 탭은 `aria-current="page"` 와 강조색, Fill 아이콘으로 표시한다. 라벨은 한글 5자 이내로 짧게 둔다(SEED). ' +
          '스토리는 `position="static"` 으로 프레임 안에 넣었고, 앱에서는 기본값 `fixed` 로 화면 하단에 붙는다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: '가계부' }).getAttribute('aria-current')).toBe('page');
    await userEvent.click(canvas.getByRole('button', { name: '정기지출' }));
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: '정기지출' }).getAttribute('aria-current')).toBe('page'),
    );
    await expect(canvas.getByRole('button', { name: '가계부' }).getAttribute('aria-current')).toBeNull();
  },
};

const CenterActionDemo = () => {
  const [value, setValue] = useState('regular');
  const [added, setAdded] = useState(0);
  return (
    <Phone
      body={
        <Stack direction='column' gap={4}>
          <Text variant='body3' color='textTertiary'>
            선택: {value}
          </Text>
          <Text variant='body3' color='textTertiary'>
            <span data-testid='added'>추가 버튼 클릭: {added}회</span>
          </Text>
        </Stack>
      }
    >
      <BottomNavigation
        items={ITEMS}
        value={value}
        onChange={setValue}
        position='static'
        centerAction={{ icon: <PlusIcon />, label: '가계부 추가', onClick: () => setAdded((n) => n + 1) }}
      />
    </Phone>
  );
};

export const WithCenterAction: Story = {
  render: () => <CenterActionDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 하단 바: 가계부 · 정기지출 · [+] · 가계부 통계 · 내 정보. ' +
          '가운데 원형 버튼은 **탭이 아니라 액션**이라 눌러도 선택이 바뀌지 않고 `aria-label` 로 이름만 준다 (SEED 의 글쓰기 버튼과 같은 위치·역할).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const add = canvas.getByRole('button', { name: '가계부 추가' });
    await expect(add.getAttribute('aria-current')).toBeNull();
    await userEvent.click(add);
    await waitFor(() => expect(canvas.getByTestId('added').textContent).toContain('1회'));
    // 액션 클릭 후에도 선택 탭은 그대로다
    await expect(canvas.getByRole('button', { name: '정기지출' }).getAttribute('aria-current')).toBe('page');
  },
};

export const Badges: Story = {
  args: {
    items: [
      { ...ITEMS[0], badge: 'dot' },
      { ...ITEMS[1], badge: 3 },
      { ...ITEMS[2], badge: 120 },
      { ...ITEMS[3], badge: 0 },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          '배지 두 종류. `\'dot\'` 은 알림 유무만, 숫자는 개수(1~99, 100 이상은 "99+", 0 은 숨김). ' +
          'SEED 지침대로 **세 개 이상의 탭에 동시에 배지를 달지 않는다** — 한 번에 하나가 눈에 들어오도록.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('새 알림 있음')).toBeTruthy();
    await expect(canvas.getByLabelText('새 알림 3개').textContent).toBe('3');
    await expect(canvas.getByLabelText('새 알림 120개').textContent).toBe('99+');
    await expect(canvas.queryByLabelText('새 알림 0개')).toBeNull();
  },
};

export const Disabled: Story = {
  args: { items: ITEMS.map((item, i) => (i === 2 ? { ...item, disabled: true } : item)) },
  parameters: {
    docs: {
      description: {
        story: '`disabled` 탭은 흐린 색으로 두고 클릭·포커스 모두 막는다. 권한이 없거나 아직 열리지 않은 메뉴에 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disabled = canvas.getByRole('button', { name: '가계부 통계' }) as HTMLButtonElement;
    await expect(disabled.disabled).toBe(true);
  },
};

/** 앱에서는 Next `Link` 를 넘긴다. 여기서는 어디로 렌더됐는지 보이도록 data-link 를 찍는 a 태그다 */
const DemoLink = ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a href={href} data-link {...rest}>
    {children}
  </a>
);

export const AsLinks: Story = {
  args: {
    items: ITEMS.map((item) => ({ ...item, href: `#/${item.value}` })),
    linkComponent: DemoLink,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`href` 가 있는 탭은 `linkComponent` 로 그린다(기본 `a`). Next 앱은 `Link` 를 넘기면 라우팅이 연결되고, 클릭 시 `onChange` 도 호출되므로 pathname 커밋 전에 낙관적으로 활성 표시를 옮길 수 있다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const anchors = canvasElement.querySelectorAll('nav a[data-link]');
    await expect(anchors.length).toBe(4);
    await expect(canvasElement.querySelector('nav a[aria-current="page"]')?.textContent).toContain('가계부');
  },
};

const HiddenDemo = () => {
  const [hidden, setHidden] = useState(false);
  return (
    <Phone
      body={
        <button type='button' onClick={() => setHidden((h) => !h)}>
          {hidden ? '보이기' : '숨기기'}
        </button>
      }
    >
      <BottomNavigation items={ITEMS} value='home' position='static' hidden={hidden} />
    </Phone>
  );
};

export const Hidden: Story = {
  render: () => <HiddenDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '`hidden` 이면 아래로 밀려 사라진다(CSS transform 0.25s). woolbank 는 스크롤 방향이 아래일 때 이 값을 켠다 — 스크롤 감지는 호출하는 쪽이 한다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvasElement.querySelector('nav') as HTMLElement;
    await userEvent.click(canvas.getByRole('button', { name: '숨기기' }));
    await waitFor(() => expect(getComputedStyle(nav).transform).not.toBe('none'));
  },
};

export const FiveItemsLimit: Story = {
  args: {
    items: [
      ...ITEMS,
      { value: 'extra1', label: '설정', icon: <UserOutline /> },
      { value: 'extra2', label: '더보기', icon: <UserOutline /> },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          '탭은 **최대 5개**다(SEED). 6개를 넘기면 개발 모드 경고를 띄우고 앞 5개만 그린다. 메뉴가 더 필요하면 화면 상단의 Tabs 나 "더보기" 화면으로 나눈다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('nav li').length).toBe(5);
  },
};

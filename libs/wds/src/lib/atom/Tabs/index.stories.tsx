import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { getTabId, getTabPanelId, type TabItem, Tabs } from './index';

const THREE: TabItem[] = [
  { value: 'list', label: '내역' },
  { value: 'calendar', label: '달력' },
  { value: 'statistic', label: '통계' },
];

const MANY: TabItem[] = [
  { value: 'all', label: '전체 카테고리' },
  { value: 'food', label: '식비·외식' },
  { value: 'transport', label: '교통·차량' },
  { value: 'housing', label: '주거·통신' },
  { value: 'shopping', label: '쇼핑·생활용품' },
  { value: 'culture', label: '문화·여가' },
  { value: 'health', label: '의료·건강' },
  { value: 'etc', label: '기타 지출' },
];

type ControlledProps = Omit<ComponentProps<typeof Tabs>, 'value' | 'onChange'> & { initial?: string };

/** 스토리용 제어 래퍼 — 선택값을 상태로 들고 Tabs 에 내려준다 */
const Controlled = ({ initial, items, ...props }: ControlledProps) => {
  const [value, setValue] = useState(initial ?? items[0]?.value ?? '');
  return <Tabs {...props} items={items} value={value} onChange={setValue} />;
};

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  argTypes: {
    variant: { control: 'radio', options: ['line', 'chip'] },
    layout: { control: 'radio', options: ['fill', 'hug'] },
    chipStyle: { control: 'radio', options: ['solid', 'outline'] },
    size: { control: 'radio', options: ['medium', 'small'] },
    items: { control: false },
    value: { control: false },
    onChange: { control: false },
    linkComponent: { control: false },
    xstyle: { control: false },
  },
  args: { items: THREE, 'aria-label': '가계부 보기' },
  render: (args) => <Controlled {...args} />,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '기본은 `line` + `fill`. 탭을 균등 분할하고 선택된 탭 아래로 2px 인디케이터가 미끄러진다. 선택 탭은 `textPrimary`, 나머지는 `textSecondary`. 5개 이하일 때만 `fill` 을 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const indicator = canvasElement.querySelector('[data-testid="tabs-indicator"]') as HTMLElement;
    await waitFor(() => expect(getComputedStyle(indicator).opacity).toBe('1'));
    const before = getComputedStyle(indicator).transform;

    await userEvent.click(canvas.getByRole('tab', { name: '달력' }));
    await waitFor(() => expect(canvas.getByRole('tab', { name: '달력' }).getAttribute('aria-selected')).toBe('true'));
    await expect(canvas.getByRole('tab', { name: '내역' }).getAttribute('aria-selected')).toBe('false');
    await waitFor(() => expect(getComputedStyle(indicator).transform).not.toBe(before));
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction='column' gap={24}>
      <Controlled items={THREE} size='medium' aria-label='medium' />
      <Controlled items={THREE} size='small' aria-label='small' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`medium` 은 높이 44px(title6Bold), `small` 은 40px(body4Bold). 화면 1차 전환은 medium, 카드 안이나 스크롤 중간 영역은 small.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const heights = [...canvasElement.querySelectorAll('[role="tablist"]')].map((el) => getComputedStyle(el).height);
    await expect(heights).toEqual(['44px', '40px']);
  },
};

export const HugScrollable: Story = {
  render: () => (
    <div style={{ width: 360, border: '1px dashed currentColor' }}>
      <Controlled items={MANY} layout='hug' initial='housing' aria-label='카테고리' />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`layout="hug"` — 탭이 6개 이상이거나 라벨이 길면 라벨 길이대로 두고 가로 스크롤한다. 선택된 탭은 자동으로 보이는 위치로 스크롤되고, 양 끝 16px 여백(scroll margin) 덕분에 가장자리에 붙지 않는다. 점선은 360px 프레임이다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('[role="tablist"]') as HTMLElement;
    await expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
  },
};

export const Chip: Story = {
  render: () => (
    <Stack direction='column' gap={16}>
      <Text variant='small1Medium' color='textTertiary'>
        solid — 화면 전체 전환
      </Text>
      <Controlled items={THREE} variant='chip' chipStyle='solid' aria-label='solid' />
      <Text variant='small1Medium' color='textTertiary'>
        outline — 일부 콘텐츠 전환
      </Text>
      <Controlled items={THREE} variant='chip' chipStyle='outline' aria-label='outline' />
      <Text variant='small1Medium' color='textTertiary'>
        small
      </Text>
      <Controlled items={THREE} variant='chip' size='small' aria-label='small chip' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`variant="chip"` 은 알약 모양. SEED 기준으로 `solid` 는 화면 전체가 바뀌는 전환, `outline` 은 영역 일부만 바뀌는 전환에 쓴다. 선택 상태는 인디케이터가 아니라 채움/테두리 색으로 드러낸다. 높이 medium 40 / small 36, 간격 8px.',
      },
    },
  },
};

export const WithBadge: Story = {
  args: {
    items: [
      { value: 'list', label: '내역' },
      { value: 'notice', label: '알림', badge: true },
      { value: 'me', label: '내 정보' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '`badge` 는 새 콘텐츠가 있다는 점(dot). 확인하면 사라져야 하고, 여러 탭에 동시에 띄우지 않는다.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    items: [
      { value: 'list', label: '내역' },
      { value: 'calendar', label: '달력', disabled: true },
      { value: 'statistic', label: '통계' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '`disabled` 탭은 `textDisabled` 로 흐려지고 클릭·키보드 이동 모두에서 건너뛴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('tab', { name: '내역' });
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: '통계' }).getAttribute('aria-selected')).toBe('true'));
    await expect(canvas.getByRole('tab', { name: '달력' }).getAttribute('aria-selected')).toBe('false');
  },
};

export const Keyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '키보드: ←/→ 로 이웃 탭(끝에서 순환), Home/End 로 양 끝. 선택된 탭만 `tabIndex=0` 이라 Tab 키 한 번에 탭 목록을 빠져나간다(roving tabindex).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tab = (name: string) => canvas.getByRole('tab', { name });
    tab('내역').focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(tab('달력').getAttribute('aria-selected')).toBe('true'));
    await expect(document.activeElement).toBe(tab('달력'));
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(tab('통계').getAttribute('aria-selected')).toBe('true'));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(tab('내역').getAttribute('aria-selected')).toBe('true'));
    await expect(tab('내역').tabIndex).toBe(0);
    await expect(tab('통계').tabIndex).toBe(-1);
  },
};

/** 스토리용 링크 — 앱에서는 Next 의 Link 를 넘긴다 */
const StoryLink = ({ href, children, ...rest }: ComponentProps<'a'>) => (
  <a href={href} data-link {...rest} onClick={(event) => event.preventDefault()}>
    {children}
  </a>
);

export const AsLinks: Story = {
  args: {
    items: [
      { value: 'list', label: '내역', href: '/?type=list' },
      { value: 'calendar', label: '달력', href: '/?type=calendar' },
    ],
    linkComponent: StoryLink,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`href` 가 있는 탭은 `<button>` 대신 `linkComponent` 로 렌더링된다. woolbank 는 `next/link` 의 Link(`replace`) 를 넘겨 URL 쿼리와 탭을 동기화한다. 역할은 여전히 `tab` 이다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const links = canvasElement.querySelectorAll('a[data-link][role="tab"]');
    await expect(links.length).toBe(2);
  },
};

const TwoDepthDemo = () => {
  const [first, setFirst] = useState('list');
  const [second, setSecond] = useState('all');
  return (
    <Stack direction='column' gap={8}>
      <Tabs items={THREE} value={first} onChange={setFirst} aria-label='1차' />
      <Tabs
        variant='chip'
        chipStyle='outline'
        size='small'
        items={[
          { value: 'all', label: '전체' },
          { value: 'income', label: '수입' },
          { value: 'expense', label: '지출' },
        ]}
        value={second}
        onChange={setSecond}
        aria-label='2차'
      />
      <Text variant='body3' color='textSecondary' ml={16}>
        {THREE.find((t) => t.value === first)?.label} · {second}
      </Text>
    </Stack>
  );
};

export const TwoDepth: Story = {
  render: () => <TwoDepthDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — SEED 의 2-depth 규칙. 1차는 `line`, 그 아래 2차는 `chip outline`. 두 단계를 같은 모양으로 겹치면 어느 쪽이 상위인지 읽히지 않는다.',
      },
    },
  },
};

const TYPE_TABS: TabItem[] = [
  { value: 'expense', label: '지출' },
  { value: 'income', label: '수입' },
];

const AccountBookDemo = () => {
  const [type, setType] = useState('expense');
  const id = 'account-book-type';
  return (
    <div style={{ width: 360 }}>
      <Tabs id={id} items={TYPE_TABS} value={type} onChange={setType} aria-label='가계부 종류' />
      {TYPE_TABS.map((tab) => (
        <div
          key={tab.value}
          id={getTabPanelId(id, tab.value)}
          role='tabpanel'
          aria-labelledby={getTabId(id, tab.value)}
          hidden={tab.value !== type}
          style={{ padding: 16 }}
        >
          <Text variant='body2' color='textPrimary' as='p'>
            {tab.value === 'expense' ? '지출 금액과 카테고리를 입력하세요.' : '수입 금액과 출처를 입력하세요.'}
          </Text>
        </div>
      ))}
    </div>
  );
};

export const AccountBookExample: Story = {
  render: () => <AccountBookDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 가계부 저장 폼의 지출/수입 전환. `id` 를 주고 패널에 `getTabPanelId` / `getTabId` 로 `role="tabpanel"` 과 `aria-labelledby` 를 연결하면 스크린리더가 탭과 내용을 짝지어 읽는다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: '수입' }));
    await waitFor(() => expect(canvas.getByRole('tabpanel').textContent).toContain('수입 금액'));
    const tab = canvas.getByRole('tab', { name: '수입' });
    await expect(canvas.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe(tab.id);
  },
};

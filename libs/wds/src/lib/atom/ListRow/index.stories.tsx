import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconBellOutline, IconPigOutline, IconSettingsOutline, IconThemeOutline, IconWalletOutline } from '../../icons';
import { Toggle } from '../Toggle';
import { ListRow, ListSectionHeader } from './index';

const Phone = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 390, border: '1px dashed currentColor', borderRadius: 12, overflow: 'hidden' }}>{children}</div>
);

const meta: Meta<typeof ListRow> = {
  title: 'Components/ListRow',
  component: ListRow,
  argTypes: {
    leadingTone: { control: 'radio', options: ['neutral', 'primary', 'income'] },
    valueTone: { control: 'radio', options: ['default', 'income', 'expense', 'secondary'] },
    leading: { control: false },
    trailing: { control: false },
    linkComponent: { control: false },
    xstyle: { control: false },
  },
  args: {
    leading: <IconPigOutline size={18} />,
    leadingTone: 'primary',
    title: '타코배달',
    subtitle: '외식/배달',
    value: '−44,650원',
  },
  render: (args) => (
    <Phone>
      <ListRow {...args} />
    </Phone>
  ),
};

export default meta;

type Story = StoryObj<typeof ListRow>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '앞 36px 원 아이콘 · 제목(15/400) · 부제(13, 회색) · 값(15/600, tabular). 가계부 내역 한 줄이 이 모양이다. ' +
          '`href` 도 `onClick` 도 없으면 정적 `div` 로 그려 눌림 피드백이 없다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const title = within(canvasElement).getByText('타코배달');
    const row = title.closest('div') as HTMLElement;
    await expect(row.tagName).toBe('DIV');
    await expect(within(canvasElement).queryByRole('button')).toBeNull();
    await expect(within(canvasElement).queryByRole('link')).toBeNull();
  },
};

export const ValueTones: Story = {
  render: () => (
    <Phone>
      <ListRow
        leading={<IconPigOutline size={18} />}
        title='월급'
        subtitle='급여'
        value='+2,640,000원'
        valueTone='income'
      />
      <ListRow
        leading={<IconPigOutline size={18} />}
        title='타코배달'
        subtitle='외식/배달'
        value='−44,650원'
        valueTone='expense'
      />
      <ListRow
        title='주간 예산'
        subtitle='매주 월요일에 새로 시작해요'
        value='450,000원'
        valueTone='secondary'
        chevron
      />
    </Phone>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`valueTone` — 수입은 `income`(파랑, 앞에 +), 지출은 `expense`(잉크, 앞에 −), 현재 설정값처럼 정보성 숫자는 `secondary`. ' +
          '부호는 호출부가 문자열에 붙인다. 지출 부호는 하이픈이 아니라 U+2212 "−" 를 쓴다.',
      },
    },
  },
};

const ToggleRowDemo = () => {
  const [push, setPush] = useState(true);
  const [due, setDue] = useState(false);
  return (
    <Phone>
      <ListSectionHeader>알림</ListSectionHeader>
      <ListRow
        leading={<IconBellOutline size={20} />}
        title='푸시 알림'
        trailing={<Toggle aria-label='푸시 알림' checked={push} onChange={setPush} />}
      />
      <ListRow
        leading={<IconWalletOutline size={20} />}
        title='정기지출 결제 전날 알림'
        subtitle='이체 하루 전에 알려드려요'
        trailing={<Toggle aria-label='정기지출 결제 전날 알림' checked={due} onChange={setDue} disabled={!push} />}
      />
    </Phone>
  );
};

export const WithToggle: Story = {
  render: () => <ToggleRowDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '`trailing` 에 Toggle 을 두는 설정 행. 이때 행 자체에는 `onClick`/`href` 를 주지 않는다 — 토글이 유일한 인터랙션이어야 한다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const push = canvas.getByRole('switch', { name: '푸시 알림' }) as HTMLInputElement;
    await expect(push.checked).toBe(true);
    await userEvent.click(push);
    await expect(push.checked).toBe(false);
  },
};

/** 앱에서는 Next `Link` 를 넘긴다 */
const DemoLink = ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a href={href} data-link {...rest}>
    {children}
  </a>
);

export const AsLink: Story = {
  args: {
    leading: <IconWalletOutline size={20} />,
    leadingTone: 'neutral',
    title: '주간 예산',
    subtitle: '매주 월요일에 새로 시작해요',
    value: '450,000원',
    valueTone: 'secondary',
    chevron: true,
    href: '#/settings/weekly-budget',
    linkComponent: DemoLink,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`href` 가 있으면 `linkComponent` 로 그린다(기본 `a`). 다른 화면으로 가는 행이므로 `chevron` 을 함께 켠다. hover·active 에 fillSubtle 배경이 깔린다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('a[data-link]') as HTMLAnchorElement;
    await expect(link).toBeTruthy();
    await expect(link.getAttribute('href')).toBe('#/settings/weekly-budget');
    await expect(link.textContent).toContain('주간 예산');
  },
};

export const AsButton: Story = {
  args: {
    leading: <IconThemeOutline size={20} />,
    leadingTone: 'neutral',
    title: '테마',
    value: '라이트',
    valueTone: 'secondary',
    chevron: true,
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '`onClick` 만 있으면 `<button>` 이 된다. 시트를 열거나 화면 안에서 값을 고르는 행에 쓴다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByRole('button');
    await expect(row.tagName).toBe('BUTTON');
    await userEvent.click(row);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Disabled: Story = {
  args: { ...AsButton.args, disabled: true, onClick: fn() },
  parameters: {
    docs: {
      description: {
        story: '`disabled` 는 흐리게 두고 클릭·포커스를 막는다. 링크 행은 비활성이면 정적 `div` 로 떨어진다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const row = within(canvasElement).getByRole('button') as HTMLButtonElement;
    await expect(row.disabled).toBe(true);
    await userEvent.click(row, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const SettingsSections: Story = {
  render: () => (
    <Phone>
      <ListSectionHeader>예산</ListSectionHeader>
      <ListRow
        leading={<IconWalletOutline size={20} />}
        title='주간 예산'
        subtitle='매주 월요일에 새로 시작해요'
        value='450,000원'
        valueTone='secondary'
        chevron
        href='#budget'
      />
      <ListSectionHeader>화면</ListSectionHeader>
      <ListRow
        leading={<IconThemeOutline size={20} />}
        title='테마'
        value='라이트'
        valueTone='secondary'
        chevron
        href='#theme'
      />
      <ListSectionHeader>정보</ListSectionHeader>
      <ListRow leading={<IconSettingsOutline size={20} />} title='앱 버전' value='2.0.1' valueTone='secondary' />
    </Phone>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`ListSectionHeader` 로 묶음을 나눈 설정 화면. 헤더의 위 여백 28px 이 묶음 사이 간격이 된다. 첫 헤더만 `xstyle` 로 위 여백을 줄인다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const headers = canvasElement.querySelectorAll('h3');
    await expect(headers.length).toBe(3);
    await expect(getComputedStyle(headers[1]).paddingTop).toBe('28px');
  },
};

export const WithDivider: Story = {
  render: () => (
    <Phone>
      <ListRow title='첫 번째 행' value='1' divider />
      <ListRow title='두 번째 행' value='2' divider />
      <ListRow title='마지막 행' value='3' />
    </Phone>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`divider` 는 행 아래 1px 구분선. 카드 안처럼 행이 붙어 보여야 할 때만 켜고, 가계부 일별 목록처럼 그룹 간격이 있으면 끈다.',
      },
    },
  },
};

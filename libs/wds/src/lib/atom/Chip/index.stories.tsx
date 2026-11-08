import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Chip, ChipGroup } from './index';

/** 스토리 전용 아이콘 — wds 는 아이콘 세트를 갖지 않으므로 인라인 SVG 로 둔다 */
const CalendarIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
    <rect x='2' y='3' width='12' height='11' rx='2' stroke='currentColor' strokeWidth='1.5' />
    <path d='M2 7h12M5 1.5v3M11 1.5v3' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
    <path d='M4 6l4 4 4-4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  argTypes: {
    variant: { control: 'radio', options: ['solid', 'outlineStrong', 'outlineWeak'] },
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    selected: { control: 'boolean' },
    prefixIcon: { control: false },
    suffixIcon: { control: false },
    onRemove: { control: false },
    xstyle: { control: false },
  },
  args: { label: '지출' },
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '기본은 `solid` · `medium` — 회색 채움 알약. woolbank 통계 화면 필터 행의 모양이다. ' +
          '사용자가 고르거나 입력한 **값**을 보여줄 때 쓰고, 화면을 전환하는 탭 용도로는 쓰지 않는다.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Stack gap={8} wrap='wrap'>
      <Chip label='solid' variant='solid' />
      <Chip label='outlineStrong' variant='outlineStrong' />
      <Chip label='outlineWeak' variant='outlineWeak' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'SEED 와 같은 세 변형. `solid` 가 기본, `outlineStrong` 은 주변과 뚜렷이 구분해야 할 때, ' +
          '`outlineWeak` 은 주목도가 낮아 여러 개 중 고르는 선택(selection) 용도에 권장된다.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap={8} align='center' wrap='wrap'>
      <Chip label='small 32' size='small' />
      <Chip label='medium 36' size='medium' />
      <Chip label='large 40' size='large' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '높이 32 / 36 / 40px (SEED 와 동일). 좌우 여백은 12 / 16 / 20px, 최소 폭 44px 로 한 글자 라벨도 알약 모양을 유지한다. ' +
          '필터 행은 `medium`, 바텀시트 안의 촘촘한 선택지는 `small`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const heights = [...canvasElement.querySelectorAll('button')].map((b) => getComputedStyle(b).height);
    await expect(heights).toEqual(['32px', '36px', '40px']);
  },
};

const CATEGORIES = ['식비', '교통', '주거', '문화', '의료'];

const SelectedDemo = ({ variant }: { variant: 'solid' | 'outlineWeak' }) => {
  const [picked, setPicked] = useState<string[]>(['식비']);
  const toggle = (name: string) =>
    setPicked((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]));

  return (
    <Stack direction='column' gap={8} align='flex-start'>
      <ChipGroup layout='wrap' aria-label={`카테고리 (${variant})`}>
        {CATEGORIES.map((name) => (
          <Chip
            key={name}
            label={name}
            variant={variant}
            selected={picked.includes(name)}
            onClick={() => toggle(name)}
          />
        ))}
      </ChipGroup>
      <Text variant='small1Regular' color='textTertiary'>
        선택: {picked.join(', ') || '없음'}
      </Text>
    </Stack>
  );
};

export const Selected: Story = {
  render: () => (
    <Stack direction='column' gap={20}>
      <SelectedDemo variant='outlineWeak' />
      <SelectedDemo variant='solid' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`selected` 를 주면 토글 버튼(`aria-pressed`)이 된다. `outlineWeak` 은 테두리가 진해지고 옅은 배경이 깔리며, ' +
          '`solid` 는 배경이 반전된다. 다중 선택은 `outlineWeak`, 상태를 강하게 드러내야 하면 `solid` 를 쓴다. ' +
          '`selected` 를 주지 않은 칩은 토글이 아니라 일반 버튼이다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: '카테고리 (outlineWeak)' });
    const traffic = within(group).getByRole('button', { name: '교통' });
    await expect(traffic.getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(traffic);
    await waitFor(() => expect(traffic.getAttribute('aria-pressed')).toBe('true'));
    await userEvent.click(traffic);
    await waitFor(() => expect(traffic.getAttribute('aria-pressed')).toBe('false'));
  },
};

export const WithIcons: Story = {
  render: () => (
    <Stack gap={8} wrap='wrap'>
      <Chip label='2026년 11월' prefixIcon={<CalendarIcon />} />
      <Chip label='지출' suffixIcon={<ChevronDownIcon />} />
      <Chip label='기간 선택' variant='outlineStrong' prefixIcon={<CalendarIcon />} suffixIcon={<ChevronDownIcon />} />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`prefixIcon` / `suffixIcon` 은 16px 슬롯이다. 아이콘은 `currentColor` 를 쓰면 변형·선택 상태의 글자색을 그대로 따른다. ' +
          '눌러서 시트가 열리는 칩에는 `suffixIcon` 에 ▾ 를 두어 더 고를 수 있음을 알린다.',
      },
    },
  },
};

const RemovableDemo = ({ onRemove, onChipClick }: { onRemove: (label: string) => void; onChipClick: () => void }) => {
  const [tags, setTags] = useState(['커피', '점심', '택시']);

  return (
    <Stack direction='column' gap={8} align='flex-start'>
      <ChipGroup layout='wrap' aria-label='입력한 태그'>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            variant='outlineWeak'
            onClick={onChipClick}
            onRemove={() => {
              onRemove(tag);
              setTags((prev) => prev.filter((item) => item !== tag));
            }}
          />
        ))}
      </ChipGroup>
      <Text variant='small1Regular' color='textTertiary'>
        {tags.length === 0 ? '태그 없음' : `${tags.length}개`}
      </Text>
    </Stack>
  );
};

export const Removable: Story = {
  args: { onRemove: fn(), onClick: fn() },
  render: (args) => (
    <RemovableDemo onRemove={args.onRemove as (label: string) => void} onChipClick={args.onClick as () => void} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`onRemove` 를 주면 오른쪽에 ✕ 가 붙는다 — 사용자가 입력한 값을 칩으로 쌓는 **input chip** 용도(SEED: Suffix 에 Remove 버튼). ' +
          '✕ 는 `"{label} 삭제"` 라는 접근성 이름을 가지며, 클릭해도 칩 자체의 `onClick` 은 실행되지 않는다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '점심 삭제' }));
    await waitFor(() => expect(args.onRemove).toHaveBeenCalledWith('점심'));
    await expect(args.onClick).not.toHaveBeenCalled();
    await waitFor(() => expect(canvas.queryByRole('button', { name: '점심' })).toBeNull());
  },
};

export const Disabled: Story = {
  render: () => (
    <Stack gap={8} wrap='wrap'>
      <Chip label='solid' disabled />
      <Chip label='outlineStrong' variant='outlineStrong' disabled />
      <Chip label='outlineWeak' variant='outlineWeak' disabled />
      <Chip label='선택됨' selected disabled />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '비활성은 색을 바꾸지 않고 투명도 0.5 로 낮춘다 (SEED 와 동일). 선택 상태와 함께 쓰여도 선택 표시는 유지된다.',
      },
    },
  },
};

export const FilterRow: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <ChipGroup aria-label='통계 필터'>
        <Chip label='2026년 11월' suffixIcon={<ChevronDownIcon />} />
        <Chip label='지출' suffixIcon={<ChevronDownIcon />} />
        <Chip label='카테고리 통계 필터 적용' suffixIcon={<ChevronDownIcon />} />
        <Chip label='결제수단 전체' suffixIcon={<ChevronDownIcon />} />
      </ChipGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 가계부 통계 화면의 필터 행. 각 칩은 현재 적용된 조건을 보여주고 누르면 바텀시트가 열린다. ' +
          'SEED 는 이런 "조건을 적용·해제하는 행"을 Chip 단독이 아니라 **Filter Bar** 템플릿으로 분류한다 — ' +
          '여기서는 `ChipGroup` 의 기본 `scroll` 레이아웃이 그 역할을 하며, 폭을 넘치면 한 줄로 가로 스크롤된다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="group"]') as HTMLElement;
    await expect(group.scrollWidth).toBeGreaterThan(group.clientWidth);
    await expect(getComputedStyle(group).flexWrap).toBe('nowrap');
  },
};

export const WrapGroup: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <ChipGroup layout='wrap' aria-label='카테고리 선택'>
        {['식비', '교통', '주거', '통신', '문화', '의료', '교육', '경조사', '쇼핑', '여행'].map((name, index) => (
          <Chip key={name} label={name} variant='outlineWeak' selected={index % 3 === 0} />
        ))}
      </ChipGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`layout="wrap"` 은 줄바꿈해 전부 보여준다 (SEED Chip Group 의 Overflow 레이아웃). ' +
          '카테고리 다중 선택처럼 전체 선택지를 한눈에 봐야 할 때 쓰고, 스크롤로 숨겨도 되는 필터 행에는 `scroll` 을 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="group"]') as HTMLElement;
    await expect(getComputedStyle(group).flexWrap).toBe('wrap');
    await expect(group.scrollWidth).toBe(group.clientWidth);
  },
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import dayjs from 'dayjs';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import type { RegularExpenditure, RegularExpenditureListItem } from './hooks/useRegularExtentureListQuery';
import { RegularExpenditureView } from './RegularExpenditureView';

const NOW = dayjs('2026-11-09T12:00:00');

const category = (id: number, name: string) =>
  ({
    id: String(id),
    name,
    type: 'EXPENDITURE',
    useStatistic: true,
    accountBookCategoryImageId: id,
    accountBookCategoryImage: { id: String(id), name, imageUrl: '' },
  }) as RegularExpenditure['accountBookCategory'];

const item = (
  id: number,
  title: string,
  amount: number,
  daysFromNow: number,
  cat: RegularExpenditure['accountBookCategory'],
  isAutoExpenditure = false,
): RegularExpenditure => {
  const day = NOW.add(daysFromNow, 'day');

  return {
    id: String(id),
    title,
    amount,
    regularDate: day.date(),
    regularExpenditureDay: day.toISOString(),
    isAutoExpenditure,
    accountBookCategoryId: Number(cat.id),
    accountBookCategory: cat,
  };
};

const 보험 = category(1, '보험');
const 가전가구 = category(2, '가전/가구');
const 대출투자 = category(3, '대출/투자');
const 구독서비스 = category(4, '구독서비스');

const GROUPS: RegularExpenditureListItem[] = [
  {
    name: '대출/투자',
    type: 'EXPENDITURE',
    imageUrl: '',
    list: [item(1, '자유적금', 300_000, 22, 대출투자, true), item(2, '정기적금', 2_200_000, 26, 대출투자, true)],
  },
  { name: '가전/가구', type: 'EXPENDITURE', imageUrl: '', list: [item(3, '성인아이폰', 89_587, 21, 가전가구)] },
  {
    name: '구독서비스',
    type: 'EXPENDITURE',
    imageUrl: '',
    list: [item(4, '넷플릭스', 22_000, 24, 구독서비스), item(5, '쿠팡구독', 4_990, 26, 구독서비스)],
  },
  {
    name: '보험',
    type: 'EXPENDITURE',
    imageUrl: '',
    list: [item(6, '삼성화재', 14_000, 3, 보험, true), item(7, '삼성화재 운전자', 12_000, 6, 보험)],
  },
];

const meta: Meta<typeof RegularExpenditureView> = {
  title: 'domains/regular-extenditure/RegularExpenditureView',
  component: RegularExpenditureView,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true, navigation: { pathname: '/regular-extenditure' } },
  },
  args: {
    groups: GROUPS,
    isShareUser: false,
    onAddClick: fn(),
    onDelete: fn(),
    now: NOW,
  },
};

export default meta;

type Story = StoryObj<typeof RegularExpenditureView>;

export const 기본: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('2,642,577')).toBeInTheDocument();
    await expect(canvas.getByRole('list', { name: '이체 일정 목록' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('listitem').filter((li) => li.hasAttribute('data-key'))).toHaveLength(7);
    await expect(canvas.getByRole('button', { name: /7일 안에 빠져나가는 내역 2건 보기/ })).toBeInTheDocument();
    await expect(canvas.getByText('26,000원')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '추가' })).toBeInTheDocument();
  },
};

export const 필터: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const schedule = within(canvas.getByRole('region', { name: '이체 일정' }));

    await userEvent.click(schedule.getByRole('button', { name: '보험' }));
    // 요약 카드의 "2건" 과 겹치지 않게 이체 일정 카드 안에서만 찾는다
    await expect(schedule.getByText('2건')).toBeInTheDocument();
    await expect(schedule.getAllByRole('listitem').filter((li) => li.hasAttribute('data-key'))).toHaveLength(2);
  },
};

export const 칠일_이내_이동: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: '보험' }));
    await userEvent.click(canvas.getByRole('button', { name: /7일 안에 빠져나가는 내역/ }));

    // 필터가 전체로 풀리고, 7일 안에 빠져나가는 두 행만 강조 배경을 받는다
    await waitFor(async () => {
      const rows = canvas.getAllByRole('listitem').filter((li) => li.hasAttribute('data-key'));
      await expect(rows).toHaveLength(7);
      const bgOf = (li: HTMLElement) => getComputedStyle(li.firstElementChild as HTMLElement).backgroundColor;
      const highlighted = rows.filter((li) => bgOf(li) !== 'rgba(0, 0, 0, 0)');
      await expect(highlighted.map((li) => li.dataset.key)).toEqual(['6', '7']);
    });
  },
};

export const 빈_목록: Story = {
  args: { groups: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('등록된 정기지출이 없어요')).toBeInTheDocument();
    await expect(canvas.getByText('이번 주 예정된 이체가 없어요')).toBeInTheDocument();
  },
};

export const 공유_유저: Story = {
  args: { isShareUser: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole('button', { name: '추가' })).not.toBeInTheDocument();
  },
};

export const 다크: Story = {
  globals: { theme: 'dark' },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { colorVars } from '../../style/tokens.stylex';
import { Text } from '../Text';
import { type ISODate, WeekCalendar, type WeekCalendarProps, type WeekCalendarWeek } from './index';

const MINUS = '−';

/** 스토리용 축약 — 1만 원 이상은 "만" 단위 소수 1자리 (앱은 woolbank-features 의 abbreviateWon 을 쓴다) */
const abbreviate = (n: number) => (n >= 10_000 ? `${Math.round(n / 1_000) / 10}만` : n.toLocaleString('ko-KR'));

const SAMPLE: Record<ISODate, { expense: number; income?: number }> = {
  '2026-11-01': { expense: 4703505 },
  '2026-11-02': { expense: 59400 },
  '2026-11-04': { expense: 96250 },
  '2026-11-06': { expense: 1200, income: 264000 },
  '2026-11-14': { expense: 32000 },
};

const demoStyles = stylex.create({
  frame: { width: 390, backgroundColor: colorVars['--color-bgSurface'] },
  meta: { minHeight: '1.4rem', whiteSpace: 'nowrap', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' },
  summary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.2rem',
    marginBottom: '0.6rem',
    marginInline: '0.4rem',
    paddingBlock: '0.4rem',
    paddingInline: '0.8rem',
    borderRadius: '0.6rem',
    backgroundColor: colorVars['--color-fillSubtle'],
  },
  summaryRight: { display: 'inline-flex', alignItems: 'baseline', gap: '1rem' },
});

const renderDayMeta: WeekCalendarProps['renderDayMeta'] = (date, { isOutsideMonth }) => {
  const data = SAMPLE[date];

  if (isOutsideMonth || !data) {
    return <span {...stylex.props(demoStyles.meta)} />;
  }

  return (
    <>
      <Text variant='small3Medium' color='textSecondary' xstyle={demoStyles.meta}>
        {MINUS}
        {abbreviate(data.expense)}
      </Text>
      {data.income ? (
        <Text variant='small3Medium' color='finIncome' xstyle={demoStyles.meta}>
          +{abbreviate(data.income)}
        </Text>
      ) : null}
    </>
  );
};

const renderWeekSummary = (week: WeekCalendarWeek) => {
  const expense = week.dates.reduce((acc, d) => acc + (SAMPLE[d]?.expense ?? 0), 0);
  const income = week.dates.reduce((acc, d) => acc + (SAMPLE[d]?.income ?? 0), 0);

  if (expense === 0) {
    return null;
  }

  return (
    <div {...stylex.props(demoStyles.summary)}>
      <Text variant='small2Medium' color='textTertiary'>
        {week.index + 1}주차
      </Text>
      <span {...stylex.props(demoStyles.summaryRight)}>
        {income > 0 && (
          <span>
            <Text variant='small2Medium' color='textTertiary' mr={4}>
              수입
            </Text>
            <Text variant='small1Bold' color='finIncome'>
              +{income.toLocaleString('ko-KR')}원
            </Text>
          </span>
        )}
        <span>
          {income > 0 && (
            <Text variant='small2Medium' color='textTertiary' mr={4}>
              지출
            </Text>
          )}
          <Text variant='small1Bold' color='textSecondary'>
            {MINUS}
            {expense.toLocaleString('ko-KR')}원
          </Text>
        </span>
      </span>
    </div>
  );
};

type DemoProps = Partial<Pick<WeekCalendarProps, 'month' | 'today' | 'weekStartsOn' | 'allowOutsideMonth'>> & {
  initialSelected?: ISODate;
  initialExpanded?: boolean;
};

/** 선택일·펼침 상태를 들고 있는 데모 래퍼 */
const Demo = ({
  month = '2026-11',
  today = '2026-11-07',
  initialSelected = '2026-11-06',
  initialExpanded = false,
  weekStartsOn,
  allowOutsideMonth,
}: DemoProps) => {
  const [selectedDate, setSelectedDate] = useState<ISODate>(initialSelected);
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <div {...stylex.props(demoStyles.frame)}>
      <WeekCalendar
        month={month}
        today={today}
        selectedDate={selectedDate}
        expanded={expanded}
        onExpandedChange={setExpanded}
        onSelectDate={setSelectedDate}
        weekStartsOn={weekStartsOn}
        allowOutsideMonth={allowOutsideMonth}
        renderDayMeta={renderDayMeta}
        renderWeekSummary={renderWeekSummary}
      />
    </div>
  );
};

const meta: Meta<typeof Demo> = {
  title: 'Components/WeekCalendar',
  component: Demo,
  argTypes: {
    weekStartsOn: { control: 'radio', options: [0, 1] },
  },
};

export default meta;

type Story = StoryObj<typeof Demo>;

const getToggle = (root: HTMLElement) => within(root).getByRole('button', { name: /보기$/ });

export const Collapsed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '기본은 선택한 날이 속한 주 한 줄. 아래 ∨ 를 누르면 한 달을 펼친다(∧). 선택일은 fillStrong 원, 오늘은 borderStrong 테두리 원. 금액 줄은 `renderDayMeta` 로 호출부가 그린다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('gridcell')).toHaveLength(7);
    await expect(canvas.getByRole('gridcell', { name: '11월 6일' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('gridcell', { name: '11월 7일' })).toHaveAttribute('aria-current', 'date');

    const toggle = getToggle(canvasElement);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    await waitFor(() => expect(getToggle(canvasElement)).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getAllByRole('gridcell').length).toBeGreaterThan(7);
  },
};

export const Expanded: Story = {
  args: { initialExpanded: true },
  parameters: {
    docs: {
      description: {
        story:
          '펼친 상태에서만 각 주 아래에 `renderWeekSummary` 결과(주차 합계 행)가 붙는다. 지출이 없는 주는 null 을 돌려줘 행을 숨긴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('gridcell')).toHaveLength(35);
    await expect(canvas.getByText('1주차')).toBeInTheDocument();
    await expect(canvas.getByText('2주차')).toBeInTheDocument();
    await expect(canvas.queryByText('4주차')).not.toBeInTheDocument();
  },
};

export const WithIncomeWeek: Story = {
  args: { initialExpanded: true },
  parameters: {
    docs: {
      description: {
        story:
          '수입이 있는 주는 합계 행에 "수입 +금액" 이 먼저 오고 "지출" 라벨이 붙는다. 수입이 없으면 지출 금액만 보인다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('+264,000원')).toBeInTheDocument();
    await expect(canvas.getByText('지출')).toBeInTheDocument();
  },
};

export const Keyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '로빙 tabIndex — 선택된 날만 Tab 으로 닿는다. ←→ 하루, ↑↓ 일주일, Home/End 는 그 주의 처음/끝. 접힌 상태에서 다른 주로 가면 자동으로 펼친다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selected = canvas.getByRole('gridcell', { name: '11월 6일' });
    await expect(selected).toHaveAttribute('tabindex', '0');

    selected.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(canvas.getByRole('gridcell', { name: '11월 7일' })).toHaveAttribute('aria-selected', 'true'),
    );
    await expect(canvas.getByRole('gridcell', { name: '11월 7일' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(getToggle(canvasElement)).toHaveAttribute('aria-expanded', 'true'));
    await waitFor(() =>
      expect(canvas.getByRole('gridcell', { name: '11월 14일' })).toHaveAttribute('aria-selected', 'true'),
    );
  },
};

export const ClickToSelect: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('gridcell', { name: '11월 4일' }));
    await waitFor(() =>
      expect(canvas.getByRole('gridcell', { name: '11월 4일' })).toHaveAttribute('aria-selected', 'true'),
    );
    await expect(canvas.getByRole('gridcell', { name: '11월 6일' })).toHaveAttribute('aria-selected', 'false');
  },
};

export const MonthBoundary: Story = {
  args: { month: '2026-08', today: '2026-08-15', initialSelected: '2026-08-01', initialExpanded: true },
  parameters: {
    docs: {
      description: {
        story:
          '2026년 8월은 1일이 토요일이라 6행. 앞뒤 달 날짜는 textDisabled 로 흐리게 그리고 누를 수 없다(`allowOutsideMonth` 로 허용 가능).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('gridcell')).toHaveLength(42);
    await expect(canvas.getByRole('gridcell', { name: '7월 26일' })).toBeDisabled();
    await expect(canvas.getByRole('gridcell', { name: '8월 1일' })).toBeEnabled();
  },
};

export const MondayStart: Story = {
  args: { weekStartsOn: 1, initialExpanded: true },
  parameters: {
    docs: {
      description: {
        story: '`weekStartsOn={1}` 이면 월요일부터. 요일 머리글도 함께 돈다. 예산 주차(월~일)와 맞추고 싶을 때 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const headers = within(canvasElement).getAllByRole('columnheader');

    await expect(headers[0]).toHaveTextContent('월');
    await expect(headers[6]).toHaveTextContent('일');
  },
};

export const Dark: Story = {
  args: { initialExpanded: true },
  globals: { theme: 'dark' },
  parameters: {
    docs: { description: { story: '다크 테마. 선택 원은 fillStrong(밝은 회색), 글자는 textInverse 로 뒤집힌다.' } },
  },
};

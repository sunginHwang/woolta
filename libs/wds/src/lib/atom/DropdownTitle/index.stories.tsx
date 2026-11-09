import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { DropdownTitle } from './index';

const meta: Meta<typeof DropdownTitle> = {
  title: 'Components/DropdownTitle',
  component: DropdownTitle,
  argTypes: {
    size: { control: 'radio', options: ['medium', 'large'] },
    showChevron: { control: 'boolean' },
    xstyle: { control: false },
  },
  args: { title: '2026년 11월', onClick: fn(), onPrev: fn(), onNext: fn() },
};

export default meta;

type Story = StoryObj<typeof DropdownTitle>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '제목을 누르면 선택 시트가 열리고(`aria-haspopup=dialog`), 양옆 화살표는 이전/다음 항목으로 넘긴다. ' +
          'woolbank 의 ◀ ▶ 문자를 접근성 이름(이전/다음)을 가진 32px 버튼으로 바꿨다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '이전' }));
    await userEvent.click(canvas.getByRole('button', { name: '다음' }));
    await userEvent.click(canvas.getByRole('button', { name: '2026년 11월' }));
    await expect(args.onPrev).toHaveBeenCalledTimes(1);
    await expect(args.onNext).toHaveBeenCalledTimes(1);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const WithoutArrows: Story = {
  args: { onPrev: undefined, onNext: undefined },
  parameters: {
    docs: {
      description: {
        story:
          '`onPrev`/`onNext` 를 주지 않으면 화살표가 빠지고 제목 드롭다운만 남는다. 순서가 없는 선택(카테고리 등)에 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button', { name: '이전' })).toBeNull();
    await expect(canvas.getAllByRole('button')).toHaveLength(1);
  },
};

export const WithoutChevron: Story = {
  args: { title: '11월', showChevron: false },
  parameters: {
    docs: {
      description: {
        story:
          '`showChevron={false}` — 양옆 화살표가 이미 "넘길 수 있다"를 말해 주는 상단바(가계부 홈)에서는 제목 옆 ∨ 를 뺀다. 제목 탭으로 피커를 여는 동작은 그대로다.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole('button', { name: '11월' });

    await expect(title.querySelector('svg')).toBeNull();
    await userEvent.click(title);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Large: Story = {
  args: { size: 'large' },
  parameters: {
    docs: {
      description: {
        story: '`large` 는 title2Bold. 화면 제목을 겸할 때 쓰고, 카드·섹션 안에서는 `medium`.',
      },
    },
  },
};

const MONTHS = ['2026년 9월', '2026년 10월', '2026년 11월', '2026년 12월'];

const MonthPickerDemo = () => {
  const [index, setIndex] = useState(2);
  const [open, setOpen] = useState(false);
  return (
    <Stack direction='column' align='flex-start' gap={12}>
      <DropdownTitle
        title={MONTHS[index]}
        onClick={() => setOpen((prev) => !prev)}
        onPrev={() => setIndex((i) => i - 1)}
        onNext={() => setIndex((i) => i + 1)}
        prevDisabled={index === 0}
        nextDisabled={index === MONTHS.length - 1}
      />
      <Text variant='body4Regular' color='textTertiary'>
        {open ? '월 선택 시트 열림' : '제목을 누르면 월 선택 시트가 열립니다'}
      </Text>
    </Stack>
  );
};

export const MonthPicker: Story = {
  render: () => <MonthPickerDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 가계부 메인의 월 이동. 범위 끝에서는 `prevDisabled`/`nextDisabled` 로 화살표를 막는다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '다음' }));
    await expect(canvas.getByRole('button', { name: '2026년 12월' })).toBeTruthy();
    await expect((canvas.getByRole('button', { name: '다음' }) as HTMLButtonElement).disabled).toBe(true);
  },
};

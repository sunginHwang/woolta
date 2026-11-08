import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { colorVars } from '../../style/tokens.stylex';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { BottomSheet } from './index';

const styles = stylex.create({
  frame: { minHeight: '60vh', padding: '1.6rem' },
  row: {
    paddingBlock: '1.2rem',
    paddingInline: '2rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderFaint'],
    textAlign: 'left',
  },
});

const meta: Meta<typeof BottomSheet> = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  parameters: { layout: 'fullscreen' },
  argTypes: { children: { control: false }, xstyle: { control: false } },
};

export default meta;

type Story = StoryObj<typeof BottomSheet>;

const Demo = ({ title, items = 3, contentHeight }: { title?: string; items?: number; contentHeight?: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <div {...stylex.props(styles.frame)}>
      <Button type='button' onClick={() => setOpen(true)}>
        시트 열기
      </Button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title={title} contentHeight={contentHeight}>
        {Array.from({ length: items }, (_, i) => (
          <div key={String(i)} {...stylex.props(styles.row)}>
            <Text variant='body2' color='textPrimary'>
              항목 {i + 1}
            </Text>
          </div>
        ))}
      </BottomSheet>
    </div>
  );
};

export const Basic: Story = {
  render: () => <Demo title='기간 선택' />,
  parameters: {
    docs: {
      description: {
        story:
          '아래에서 올라오는 시트. 열리면 `role="dialog"` 패널로 포커스가 이동하고, ✕·딤 클릭·Escape 로 닫히며 포커스는 열기 전 버튼으로 돌아간다. ' +
          '화면 전환 없이 선택지나 짧은 폼을 보여줄 때 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '시트 열기' });
    await userEvent.click(trigger);
    const dialog = await canvas.findByRole('dialog');
    await expect(dialog.getAttribute('aria-modal')).toBe('true');
    await waitFor(() => expect(document.activeElement).toBe(dialog));
    await userEvent.click(canvas.getByRole('button', { name: '닫기' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  },
};

export const LongContent: Story = {
  render: () => <Demo title='월 선택' items={60} />,
  parameters: {
    docs: {
      description: {
        story:
          '시트는 `maxHeight`(기본 85dvh)까지만 자라고 넘치는 목록은 시트 안에서 스크롤한다. 월 선택처럼 항목이 많은 메뉴에 필요하다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '시트 열기' }));
    const dialog = await canvas.findByRole('dialog');
    const content = dialog.lastElementChild as HTMLElement;
    await waitFor(() => expect(content.scrollHeight).toBeGreaterThan(content.clientHeight));
  },
};

const FILTER_ITEMS = [
  { value: 'filter', label: '카테고리 통계 필터 적용' },
  { value: 'allView', label: '모든 카테고리 통계 보기' },
];

const MenuDemo = ({ onSelect }: { onSelect: (value: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('filter');
  const label = FILTER_ITEMS.find((item) => item.value === value)?.label ?? '';

  return (
    <div {...stylex.props(styles.frame)}>
      <Stack gap={8}>
        <Chip label={label} onClick={() => setOpen(true)} />
      </Stack>
      <BottomSheet.Menu
        open={open}
        onClose={() => setOpen(false)}
        title='카테고리의 통계포함 사용유무를 선택해주세요.'
        items={FILTER_ITEMS}
        value={value}
        onSelect={(next) => {
          onSelect(next);
          setValue(next);
          setOpen(false);
        }}
      />
    </div>
  );
};

export const Menu: Story = {
  args: { onClose: fn() },
  render: () => <MenuDemo onSelect={menuSelectSpy} />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 통계 화면의 필터 칩을 누르면 뜨는 단일 선택 메뉴. `BottomSheet.Menu` 는 `role="listbox"` 로 선택지를 나열하고 고르면 `onSelect` 를 부른다. ' +
          '닫기는 호출하는 쪽에서 `onClose` 로 처리해 "고르고 바로 닫기"와 "확인 후 닫기"를 둘 다 지원한다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    menuSelectSpy.mockClear();
    await userEvent.click(canvas.getByRole('button', { name: '카테고리 통계 필터 적용' }));
    const listbox = await canvas.findByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    await expect(options[0].getAttribute('aria-selected')).toBe('true');
    await userEvent.click(options[1]);
    await expect(menuSelectSpy).toHaveBeenCalledWith('allView');
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: '모든 카테고리 통계 보기' })).toBeTruthy();
  },
};

const menuSelectSpy = fn();

export const WithoutTitle: Story = {
  render: () => <Demo contentHeight={160} />,
  parameters: {
    docs: {
      description: {
        story: '제목이 없으면 헤더 없이 내용만 올라온다. `contentHeight` 로 스크롤 영역만 따로 제한할 수 있다.',
      },
    },
  },
};

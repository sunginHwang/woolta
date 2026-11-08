import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Textarea, type TextareaProps } from './index';

const Controlled = ({ value: initial = '', ...props }: TextareaProps) => {
  const [value, setValue] = useState(initial);
  return <Textarea {...props} value={value} onChange={(event) => setValue(event.target.value)} />;
};

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  argTypes: {
    variant: { control: 'radio', options: ['outline', 'underline'] },
    size: { control: 'radio', options: ['medium', 'large'] },
    resize: { control: 'radio', options: ['none', 'vertical'] },
    xstyle: { control: false },
  },
  args: { label: '메모', placeholder: '내용을 입력하세요' },
  render: (args) => <Controlled {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '기본은 `outline` · `medium` · `autoSize`. TextInput 과 같은 껍데기(라벨·도움말·오류·글자 수)를 써서 폼 안에서 모양이 맞는다. 당근 SEED 는 autoSize 일 때 최소 3줄을 유지한다.',
      },
    },
  },
};

export const AutoSize: Story = {
  args: { maxRows: 6, description: '내용에 따라 6줄까지 자라고 그 뒤로는 안에서 스크롤합니다.' },
  parameters: {
    docs: {
      description: {
        story:
          '`autoSize`(기본) 는 `minRows`(3) 부터 내용에 맞춰 높이가 자란다. `maxRows` 를 주면 그 줄 수에서 멈추고 안에서 스크롤한다. 모바일에서 긴 메모를 쓸 때 화면이 밀리지 않도록 상한을 두는 것을 권한다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    const before = textarea.getBoundingClientRect().height;
    await userEvent.type(textarea, '첫째 줄{enter}둘째 줄{enter}셋째 줄{enter}넷째 줄{enter}다섯째 줄{enter}여섯째 줄');
    await waitFor(() => expect(textarea.getBoundingClientRect().height).toBeGreaterThan(before));
  },
};

export const FixedRows: Story = {
  args: { autoSize: false, rows: 2, description: '2줄 고정. 넘치는 내용은 안에서 스크롤합니다.' },
  parameters: {
    docs: {
      description: {
        story:
          '`autoSize={false}` 면 `rows`(기본 2줄, SEED 최소값) 로 높이가 고정되고 넘치는 내용은 안에서 스크롤한다. 목록 안에 끼워 넣어 높이가 변하면 안 되는 곳에 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.type(textarea, '1{enter}2{enter}3{enter}4{enter}5{enter}6');
    await waitFor(() => expect(textarea.scrollHeight).toBeGreaterThan(textarea.clientHeight));
  },
};

export const WithCount: Story = {
  args: { maxLength: 50, showCount: true, value: '점심 약속' },
  parameters: {
    docs: {
      description: {
        story:
          '`maxLength` + `showCount` 로 "n/max" 글자 수를 오른쪽 아래에 보인다. 한도에 가까워지면 사용자가 미리 줄일 수 있다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('5/50')).toBeTruthy();
    await userEvent.type(canvasElement.querySelector('textarea') as HTMLTextAreaElement, ' 장소');
    await waitFor(() => expect(canvas.getByText('8/50')).toBeTruthy());
  },
};

export const Invalid: Story = {
  args: { errorMessage: '메모는 비워 둘 수 없어요.', value: '' },
  parameters: {
    docs: {
      description: {
        story:
          '`errorMessage` 를 주면 테두리·라벨이 오류색이 되고 문구가 `role="alert"` 로 읽힌다. 도움말 대신 오류 문구가 자리를 차지한다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await expect(textarea.getAttribute('aria-invalid')).toBe('true');
    await expect(within(canvasElement).getByRole('alert').textContent).toContain('비워 둘 수 없어요');
  },
};

export const DisabledAndReadOnly: Story = {
  render: () => (
    <Stack direction='column' gap={16}>
      <Textarea label='비활성' value='수정할 수 없는 내용' disabled autoSize={false} />
      <Textarea label='읽기 전용' value='복사는 할 수 있는 내용' readOnly autoSize={false} />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`disabled` 는 흐리게 표시하고 포커스를 막는다. `readOnly` 는 회색 배경이지만 글자는 또렷해 복사할 수 있다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const [disabled, readOnly] = canvasElement.querySelectorAll('textarea');
    await expect(disabled.disabled).toBe(true);
    await expect(readOnly.readOnly).toBe(true);
  },
};

const MemoFieldDemo = () => {
  const [memo, setMemo] = useState('');
  const [saved, setSaved] = useState(false);
  return (
    <Stack direction='column' gap={12}>
      <Textarea
        label='메모'
        placeholder='같이 먹은 사람, 장소…'
        description='비워 둘 수 있어요.'
        maxLength={200}
        showCount
        maxRows={6}
        value={memo}
        onChange={(event) => {
          setMemo(event.target.value);
          setSaved(false);
        }}
      />
      <Button type='button' fill onClick={() => setSaved(true)}>
        {saved ? '저장됨' : '저장'}
      </Button>
    </Stack>
  );
};

export const MemoField: Story = {
  render: () => <MemoFieldDemo />,
  parameters: {
    docs: {
      description: {
        story: '실전 예 — woolbank 가계부 메모 입력. 200자 제한과 글자 수, 6줄 상한의 autoSize 를 조합한다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvasElement.querySelector('textarea') as HTMLTextAreaElement, '동료와 점심');
    await waitFor(() => expect(canvas.getByText('6/200')).toBeTruthy());
    await userEvent.click(canvas.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: '저장됨' })).toBeTruthy());
  },
};

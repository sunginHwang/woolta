import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import type { TextInputProps } from './index';
import { TextInput } from './index';

/** 스토리용 제어 래퍼 — value/onChange/onClear 를 내부 상태로 묶는다 */
const Controlled = ({ value: initial = '', ...props }: TextInputProps) => {
  const [value, setValue] = useState(String(initial));

  return (
    <TextInput
      {...props}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue('')}
    />
  );
};

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  argTypes: {
    variant: { control: 'radio', options: ['outline', 'underline'] },
    size: { control: 'radio', options: ['medium', 'large'] },
    type: { control: 'select', options: ['text', 'number', 'password', 'email', 'tel', 'search'] },
    prefix: { control: false },
    suffix: { control: false },
    xstyle: { control: false },
    onClear: { control: false },
    onEnter: { control: false },
  },
  args: { placeholder: '입력하세요', fill: true },
  render: (args) => <Controlled {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const Basic: Story = {
  args: { label: '가계부 이름' },
  parameters: {
    docs: {
      description: {
        story:
          '기본은 `outline` · `medium`(40px). 평소엔 회색 채움, 포커스하면 흰 배경에 진한 테두리로 바뀐다 (woolbank BaseInput 의 동작). ' +
          '포커스 테두리는 box-shadow 로 그려 두께가 변해도 내용이 밀리지 않는다.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Stack direction='column' gap={20}>
      <Controlled variant='outline' label='outline' placeholder='폼에 입력이 여러 개일 때' />
      <Controlled variant='underline' label='underline' placeholder='화면에 입력이 하나뿐일 때' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`outline` 은 폼처럼 입력이 여러 개 놓일 때, `underline` 은 화면에 입력이 **하나뿐일 때** 권장한다 (당근 SEED). ' +
          'underline 은 좌우 패딩이 없어 주변 텍스트와 왼쪽 선이 맞는다.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction='column' gap={16}>
      <Controlled size='medium' label='medium — 40px' placeholder='폼 안의 일반 입력' />
      <Controlled size='large' label='large — 52px' placeholder='화면의 주요 입력 하나' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '높이 40 / 52px. SEED 와 반대로 wds 는 woolbank 폼 기준인 `medium` 이 기본값이고, 검색창이나 금액 입력처럼 화면의 주요 입력 하나를 크게 보일 때 `large` 를 쓴다. 글꼴도 body2 / body1 로 함께 바뀐다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const heights = [...canvasElement.querySelectorAll('input')].map(
      (input) => getComputedStyle(input.parentElement as Element).height,
    );
    await expect(heights).toEqual(['40px', '52px']);
  },
};

export const WithLabelAndDescription: Story = {
  args: { label: '메모', description: '내역에 함께 표시됩니다. 비워 둘 수 있어요.' },
  parameters: {
    docs: {
      description: {
        story:
          '`label` 은 포커스 시 강조색으로, `description` 은 필드 아래 도움말로 들어간다. 둘 다 `htmlFor` / `aria-describedby` 로 입력에 연결된다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    const label = canvasElement.querySelector('label') as HTMLLabelElement;
    await expect(label.htmlFor).toBe(input.id);
    await expect(document.getElementById(input.getAttribute('aria-describedby') as string)?.textContent).toContain(
      '내역에 함께',
    );
  },
};

export const Clearable: Story = {
  args: { label: '검색어', value: '식비' },
  parameters: {
    docs: {
      description: {
        story:
          '값이 있으면 ✕ 지우기 버튼이 나타난다. 누르면 `onClear` 가 호출되고 포커스는 입력에 남아 바로 다시 입력할 수 있다. ' +
          '`clearable={false}` 로 끄거나, disabled·readOnly 에서는 자동으로 숨긴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input.value).toBe('식비');
    const clear = canvas.getByRole('button', { name: '입력 지우기' });
    await userEvent.click(clear);
    await waitFor(() => expect(input.value).toBe(''));
    await expect(document.activeElement).toBe(input);
    await expect(canvas.queryByRole('button', { name: '입력 지우기' })).toBeNull();
    await userEvent.type(input, '교통');
    await waitFor(() => expect(canvas.queryByRole('button', { name: '입력 지우기' })).not.toBeNull());
  },
};

export const WithCount: Story = {
  args: { label: '가계부 이름', maxLength: 20, showCount: true, value: '이번 달 생활비' },
  parameters: {
    docs: {
      description: {
        story:
          '`showCount` + `maxLength` 로 "n/max" 글자 수를 보인다 (woolbank 의 `useLengthInfo`). 네이티브 `maxLength` 가 입력을 막으므로 초과 색은 외부에서 값을 주입했을 때만 보인다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    const count = document.getElementById(`${input.id}-count`) as HTMLElement;
    await expect(count.textContent).toBe('8/20');
    await userEvent.type(input, ' 기록');
    await waitFor(() => expect(count.textContent).toBe('11/20'));
  },
};

export const Invalid: Story = {
  args: { label: '금액', value: '-1000', errorMessage: '0원 이상의 금액을 입력하세요.' },
  parameters: {
    docs: {
      description: {
        story:
          '`errorMessage` 를 주면 테두리·라벨이 오류색으로 바뀌고 문구가 `role="alert"` 로 읽힌다. 문구 없이 테두리만 바꾸려면 `invalid` 를 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input.getAttribute('aria-invalid')).toBe('true');
    await expect(canvas.getByRole('alert').textContent).toContain('0원 이상');
  },
};

export const DisabledAndReadOnly: Story = {
  render: () => (
    <Stack direction='column' gap={16}>
      <Controlled label='disabled' value='수정할 수 없음' disabled />
      <Controlled label='readOnly' value='읽기 전용 — 복사는 가능' readOnly />
      <Controlled variant='underline' label='underline disabled' value='수정할 수 없음' disabled />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`disabled` 는 글자까지 흐리고 커서를 막는다. `readOnly` 는 배경만 회색이고 글자는 읽을 수 있는 색으로 둔다 — 값을 선택·복사해야 하는 경우라서다. 둘 다 지우기 버튼을 숨긴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button', { name: '입력 지우기' })).toBeNull();
  },
};

export const PrefixSuffix: Story = {
  args: { label: '금액', type: 'number', prefix: '₩', suffix: '원', value: '55759', size: 'large' },
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — 가계부 금액 입력. `prefix` 에 통화 기호, `suffix` 에 단위를 둔다. 지우기 버튼은 항상 suffix 앞에 놓여 단위와 겹치지 않는다.',
      },
    },
  },
};

export const Numeric: Story = {
  args: { label: '금액', type: 'number', placeholder: '0', suffix: '원' },
  parameters: {
    docs: {
      description: {
        story:
          '`type="number"` 는 스피너와 휠 변경을 피하려고 `type="text"` + `inputMode="numeric"` + `pattern="[0-9]*"` 로 렌더링한다 (woolbank 관례). 모바일에서 숫자 키패드만 뜬다. 전화번호처럼 형식이 있는 값은 Input 을 나누지 말고 하나에서 포맷을 적용한다 (SEED).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input.type).toBe('text');
    await expect(input.getAttribute('inputmode')).toBe('numeric');
    await expect(input.getAttribute('pattern')).toBe('[0-9]*');
  },
};

const AccountBookFormDemo = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [saved, setSaved] = useState(false);

  const amountNumber = Number(amount);
  const amountError =
    amount !== '' && (Number.isNaN(amountNumber) || amountNumber <= 0) ? '0원 이상 숫자만 입력하세요.' : undefined;
  const isValid = name.trim() !== '' && amount !== '' && !amountError;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <Stack direction='column' gap={16}>
        <TextInput
          label='가계부 이름'
          placeholder='예: 점심'
          value={name}
          maxLength={20}
          showCount
          onChange={(event) => setName(event.target.value)}
          onClear={() => setName('')}
        />
        <TextInput
          label='금액'
          type='number'
          prefix='₩'
          suffix='원'
          placeholder='0'
          value={amount}
          errorMessage={amountError}
          onChange={(event) => setAmount(event.target.value)}
          onClear={() => setAmount('')}
        />
        <TextInput
          label='메모'
          description='비워 둘 수 있어요.'
          placeholder='같이 먹은 사람, 장소…'
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          onClear={() => setMemo('')}
        />
        <Button type='submit' fill disabled={!isValid}>
          {saved ? '저장됨' : '저장'}
        </Button>
        {saved && (
          <Text variant='small1Regular' color='textTertiary'>
            {name} · {Number(amount).toLocaleString()}원
          </Text>
        )}
      </Stack>
    </form>
  );
};

export const AccountBookForm: Story = {
  render: () => <AccountBookFormDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 가계부 등록 폼. 이름(글자 수 표시) · 금액(숫자 키패드, 유효성 오류) · 메모(도움말) 세 입력을 Stack 으로 쌓고, 전부 유효할 때만 제출 버튼이 열린다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole('button', { name: '저장' }) as HTMLButtonElement;
    await expect(submit.disabled).toBe(true);
    await userEvent.type(canvas.getByPlaceholderText('예: 점심'), '점심');
    await userEvent.type(canvas.getByPlaceholderText('0'), '-5');
    await waitFor(() => expect(canvas.getByRole('alert')).toBeTruthy());
    await expect(submit.disabled).toBe(true);
    await userEvent.clear(canvas.getByPlaceholderText('0'));
    await userEvent.type(canvas.getByPlaceholderText('0'), '12000');
    await waitFor(() => expect(submit.disabled).toBe(false));
    await userEvent.click(submit);
    await waitFor(() => expect(canvas.getByRole('button', { name: '저장됨' })).toBeTruthy());
  },
};

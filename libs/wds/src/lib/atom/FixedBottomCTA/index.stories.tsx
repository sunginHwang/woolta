import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { TextInput } from '../TextInput';
import { FIXED_BOTTOM_CTA_HEIGHT, FixedBottomCTA } from './index';

const meta: Meta<typeof FixedBottomCTA> = {
  title: 'Components/FixedBottomCTA',
  component: FixedBottomCTA,
  argTypes: {
    position: { control: 'radio', options: ['fixed', 'static'] },
    xstyle: { control: false },
  },
  args: { children: '저장하기', position: 'static', onClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FixedBottomCTA>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '서브 화면의 1차 액션. 앱에서는 `position="fixed"`(기본) 로 화면 하단에 붙고, 콘텐츠 끝에 `FIXED_BOTTOM_CTA_HEIGHT` 만큼 여백을 둔다. ' +
          '한 화면에 하나만 두고, 라벨은 "저장하기"·"다음"처럼 동사형 명사로.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '저장하기' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const WithNote: Story = {
  args: { note: '저장하면 이달 지출에 바로 반영돼요' },
  parameters: {
    docs: {
      description: { story: '`note` 는 버튼 위 한 줄 안내. 결과를 미리 알려 줄 때만 쓰고, 경고에는 쓰지 않는다.' },
    },
  },
};

export const TwoSteps: Story = {
  args: { children: '다음', secondaryLabel: '이전', onSecondaryClick: fn() },
  parameters: {
    docs: {
      description: {
        story: '`secondaryLabel` 을 주면 왼쪽에 보조 버튼이 붙는다. 온보딩·다단계 폼의 "이전 / 다음" 쌍.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '이전' }));
    await expect(args.onSecondaryClick).toHaveBeenCalledTimes(1);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { children: '금액을 입력해 주세요', disabled: true },
  parameters: {
    docs: {
      description: { story: '필수 입력 전에는 비활성으로 두고, 라벨로 이유를 말한다.' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: '금액을 입력해 주세요' })).toBeDisabled();
  },
};

export const Loading: Story = {
  args: { loading: true },
  parameters: {
    docs: {
      description: { story: '처리 중에는 스피너를 보이고 클릭을 막는다. 버튼 폭은 그대로다.' },
    },
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button[aria-busy="true"]');
    await expect(button).not.toBeNull();
    await expect(button).toBeDisabled();
  },
};

const FormDemo = () => {
  const [amount, setAmount] = useState('');
  const [saved, setSaved] = useState(false);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <Stack direction='column' gap={20} p={16} style={{ paddingBottom: FIXED_BOTTOM_CTA_HEIGHT }}>
        <Text variant='title2Bold' as='h2'>
          가계부 작성
        </Text>
        <TextInput
          label='금액'
          type='number'
          value={amount}
          onChange={(event) => setAmount(event.target.value.replace(/[^0-9]/g, ''))}
          onClear={() => setAmount('')}
          suffix='원'
          placeholder='0'
        />
        {saved && (
          <Text variant='body3' color='statusSuccess' as='p'>
            저장했어요
          </Text>
        )}
      </Stack>
      <FixedBottomCTA position='static' type='submit' disabled={amount === ''}>
        {amount === '' ? '금액을 입력해 주세요' : '저장하기'}
      </FixedBottomCTA>
    </form>
  );
};

export const InForm: Story = {
  render: () => <FormDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — 폼 제출. `type="submit"` 으로 폼과 묶고, 입력이 비면 비활성 + 이유 라벨, 채워지면 "저장하기"로 바뀐다. ' +
          '콘텐츠의 아래 여백이 `FIXED_BOTTOM_CTA_HEIGHT` 다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: '금액을 입력해 주세요' })).toBeDisabled();
    await userEvent.type(canvas.getByLabelText('금액'), '12000');
    const submit = await canvas.findByRole('button', { name: '저장하기' });
    await userEvent.click(submit);
    await waitFor(() => expect(canvas.getByText('저장했어요')).toBeInTheDocument());
  },
};

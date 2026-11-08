import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Stack } from '../Stack';
import { Toggle } from '.';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    xstyle: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

const Controlled = (props: Omit<React.ComponentProps<typeof Toggle>, 'onChange'>) => {
  const [checked, setChecked] = useState(props.checked);

  return <Toggle {...props} checked={checked} onChange={setChecked} />;
};

export const Basic: Story = {
  args: { checked: false, label: '알림 받기' },
  render: (args) => <Controlled {...args} />,
};

export const Checked: Story = {
  args: { checked: true, label: '알림 받기' },
  render: (args) => <Controlled {...args} />,
};

export const Disabled: Story = {
  args: { checked: true, disabled: true, label: '알림 받기' },
  render: (args) => <Controlled {...args} />,
};

export const WithoutLabel: Story = {
  args: { checked: false, 'aria-label': '알림 받기' },
  render: (args) => <Controlled {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <Stack direction='column' align='flex-start' gap={16}>
      <Controlled size='small' checked label='small — 16px' />
      <Controlled size='medium' checked label='medium — 24px (기본)' />
      <Controlled size='large' checked label='large — 32px' />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`size` 는 트랙 높이 기준 세 단계다. 당근 SEED Switch 의 16/24/32 체계를 따랐고, 라벨 글꼴(small1 / body3 / body1)과 간격도 함께 바뀐다. ' +
          '설정 목록은 `medium`, 표 행·칩 안은 `small`, 화면의 주요 on/off 하나를 강조할 때는 `large` 를 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const tracks = canvasElement.querySelectorAll('input[role="switch"]');
    const heights = [...tracks].map((input) => getComputedStyle(input.parentElement as Element).height);
    await expect(heights).toEqual(['16px', '24px', '32px']);
  },
};

export const FocusRing: Story = {
  args: { checked: false, label: '알림 받기' },
  render: (args) => <Controlled {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          '포커스 링은 **키보드로 포커스했을 때만** 그린다. 마우스·터치로 토글할 때는 input 이 포커스를 받아도 링이 보이지 않는다. ' +
          '(`:focus-visible` 판정을 숨겨진 input 에서 읽어 트랙에 적용)',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('input[role="switch"]') as HTMLInputElement;
    const track = input.parentElement as HTMLElement;
    const ringVisible = () => getComputedStyle(track).outlineStyle === 'solid';

    // 클릭: 토글된다. 링은 브라우저의 :focus-visible 판정과 항상 일치해야 한다
    // (실제 마우스 클릭은 false 라 링이 없고, 테스트의 합성 클릭은 환경에 따라 true 일 수 있다)
    await userEvent.click(input);
    await expect(input.checked).toBe(true);
    await waitFor(() => expect(ringVisible()).toBe(input.matches(':focus-visible')));

    // 키보드 포커스: 링이 보인다 (링은 React 상태라 리렌더를 기다린다)
    input.blur();
    await waitFor(() => expect(ringVisible()).toBe(false));
    await userEvent.tab();
    await expect(document.activeElement).toBe(input);
    await waitFor(() => expect(ringVisible()).toBe(true));
  },
};

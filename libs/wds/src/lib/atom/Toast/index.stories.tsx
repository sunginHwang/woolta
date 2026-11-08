import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Toast, ToastProvider, useToast } from './index';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: { layout: 'fullscreen' },
  argTypes: { xstyle: { control: false } },
};

export default meta;

type Story = StoryObj<typeof Toast>;

const Trigger = ({
  label,
  message,
  tone,
  duration,
}: {
  label: string;
  message: string;
  tone?: 'neutral' | 'success' | 'error';
  duration?: number;
}) => {
  const { show } = useToast();
  return (
    <Button type='button' variant='outline' size='small' onClick={() => show(message, { tone, duration })}>
      {label}
    </Button>
  );
};

export const Basic: Story = {
  render: () => (
    <ToastProvider duration={600}>
      <Stack p={16} gap={8}>
        <Trigger label='저장 알림' message='가계부가 저장됐어요' />
      </Stack>
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '앱 루트에 `ToastProvider` 를 한 번 두고 `useToast().show(message)` 로 띄운다. 기본 2.5초 뒤 사라지고(이 예시는 0.6초) 클릭을 막지 않는다. ' +
          '"저장됨"처럼 사용자가 확인만 하면 되는 결과에 쓰고, 조치가 필요한 오류는 Confirm 이나 인라인 메시지를 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '저장 알림' }));
    const status = canvas.getByRole('status');
    await waitFor(() => expect(status.textContent).toContain('가계부가 저장됐어요'));
    await waitFor(() => expect(status.textContent).toBe(''), { timeout: 3000 });
  },
};

export const Tones: Story = {
  render: () => (
    <ToastProvider duration={1500}>
      <Stack p={16} gap={8} wrap='wrap'>
        <Trigger label='neutral' message='내역 3건을 불러왔어요' />
        <Trigger label='success' message='저장했어요' tone='success' />
        <Trigger label='error' message='저장에 실패했어요' tone='error' />
      </Stack>
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`tone` 은 메시지 앞에 아이콘을 붙인다(색 점이 아니라 모양으로도 구분). success/error 두 가지만 두어 "확인 결과"와 "실패"만 구분한다.',
      },
    },
  },
};

export const CenterPosition: Story = {
  render: () => (
    <ToastProvider position='center' duration={1500}>
      <Stack p={16} gap={8}>
        <Trigger label='가운데 토스트' message='복사됐어요' />
      </Stack>
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`position="center"` 는 woolbank 기존 토스트처럼 화면 정중앙에 띄운다. 기본값 `bottom` 은 하단 내비게이션 위에 뜬다.',
      },
    },
  },
};

const ActionTrigger = () => {
  const { show } = useToast();
  const [opened, setOpened] = useState(false);
  return (
    <Stack gap={8} align='center'>
      <Button
        type='button'
        variant='outline'
        size='small'
        onClick={() =>
          show('버킷리스트를 달성했어요', { tone: 'success', actionLabel: '보기', onAction: () => setOpened(true) })
        }
      >
        액션 토스트
      </Button>
      {opened && <span data-testid='opened'>열었어요</span>}
    </Stack>
  );
};

export const WithAction: Story = {
  render: () => (
    <ToastProvider duration={4000}>
      <Stack p={16}>
        <ActionTrigger />
      </Stack>
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`actionLabel`/`onAction` 으로 오른쪽에 한 단어 액션("보기", "실행 취소")을 붙인다. 누르면 토스트는 바로 닫힌다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '액션 토스트' }));
    await userEvent.click(await canvas.findByRole('button', { name: '보기' }));
    await waitFor(() => expect(canvas.getByTestId('opened')).toBeInTheDocument());
  },
};

const QueueTrigger = () => {
  const { show } = useToast();
  return (
    <Button
      type='button'
      variant='outline'
      size='small'
      onClick={() => {
        show('첫 번째 메시지', { duration: 500 });
        show('두 번째 메시지', { duration: 500 });
      }}
    >
      두 번 연속
    </Button>
  );
};

export const Queue: Story = {
  render: () => (
    <ToastProvider>
      <Stack p={16}>
        <QueueTrigger />
      </Stack>
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '연달아 `show` 하면 한 번에 하나만 보이고 나머지는 대기열에서 순서대로 이어진다. 먼저 뜬 메시지가 가려지지 않는다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '두 번 연속' }));
    const status = canvas.getByRole('status');
    await waitFor(() => expect(status.textContent).toContain('첫 번째 메시지'));
    await waitFor(() => expect(status.textContent).toContain('두 번째 메시지'), { timeout: 3000 });
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { FullScreenLoading } from './index';

const meta: Meta<typeof FullScreenLoading> = {
  title: 'Components/FullScreenLoading',
  component: FullScreenLoading,
  parameters: { layout: 'fullscreen' },
  argTypes: { xstyle: { control: false } },
};

export default meta;

type Story = StoryObj<typeof FullScreenLoading>;

const Demo = ({ message }: { message?: string }) => {
  const [open, setOpen] = useState(false);

  const start = () => {
    setOpen(true);
    setTimeout(() => setOpen(false), 1500);
  };

  return (
    <div style={{ padding: 24 }}>
      <Button type='button' onClick={start}>
        1.5초 저장 시작
      </Button>
      <FullScreenLoading open={open} message={message} />
    </div>
  );
};

export const Basic: Story = {
  render: () => <Demo />,
  parameters: {
    docs: {
      description: {
        story:
          '저장·삭제처럼 끝날 때까지 아무것도 못 누르게 해야 하는 처리에만 쓴다. 열려 있는 동안 본문 스크롤을 잠그고 `role="alert" aria-busy` 로 알린다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '1.5초 저장 시작' }));
    await waitFor(() => expect(canvasElement.querySelector('[role="alert"]')).not.toBeNull());
    await expect(document.body.style.overflow).toBe('hidden');
    await waitFor(() => expect(canvasElement.querySelector('[role="alert"]')).toBeNull(), { timeout: 3000 });
    // 스크롤 잠금 해제는 effect cleanup 이라 DOM 제거보다 한 틱 늦을 수 있다
    await waitFor(() => expect(document.body.style.overflow).toBe(''));
  },
};

export const WithMessage: Story = {
  render: () => <Demo message='가계부를 저장하는 중이에요' />,
  parameters: {
    docs: {
      description: {
        story: '`message` 로 무엇을 기다리는지 알려 준다. 1초 이상 걸릴 수 있는 처리에는 항상 문구를 넣는다.',
      },
    },
  },
};

export const Open: Story = {
  args: { open: true, message: '불러오는 중' },
  parameters: {
    docs: {
      description: { story: '열린 상태 고정. 딤(bgOverlay) 위에 primary 스피너와 흰 문구.' },
    },
  },
};

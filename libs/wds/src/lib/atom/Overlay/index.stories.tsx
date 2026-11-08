import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { colorVars } from '../../style/tokens.stylex';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Overlay } from './index';

const styles = stylex.create({
  card: {
    width: '28rem',
    padding: '2.4rem',
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-bgSurface'],
  },
  tall: { height: '160vh', padding: '1.6rem' },
});

const meta: Meta<typeof Overlay> = {
  title: 'Components/Overlay',
  component: Overlay,
  parameters: { layout: 'fullscreen' },
  argTypes: { children: { control: false }, xstyle: { control: false } },
};

export default meta;

type Story = StoryObj<typeof Overlay>;

const Demo = ({
  align = 'center',
  lockScroll = true,
}: {
  align?: 'center' | 'bottom' | 'none';
  lockScroll?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div {...stylex.props(styles.tall)}>
      <Button type='button' onClick={() => setOpen(true)}>
        열기
      </Button>
      <Overlay
        open={open}
        align={align}
        lockScroll={lockScroll}
        onClick={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <div {...stylex.props(styles.card)}>
          <Stack direction='column' gap={12}>
            <Text variant='title5Bold' color='textPrimary'>
              딤 위의 콘텐츠
            </Text>
            <Text variant='body3' color='textSecondary'>
              바깥(어두운 부분)을 클릭하거나 Escape 를 누르면 닫힙니다. 이 카드를 클릭해도 닫히지 않습니다.
            </Text>
            <Button type='button' variant='outline' size='small' onClick={() => setOpen(false)}>
              닫기
            </Button>
          </Stack>
        </div>
      </Overlay>
    </div>
  );
};

export const Basic: Story = {
  render: () => <Demo />,
  parameters: {
    docs: {
      description: {
        story:
          '`open` 으로 열고 닫는다. 딤 자체를 클릭했을 때만 `onClick`, Escape 에 `onClose` 가 호출되고 안쪽 콘텐츠 클릭은 무시된다. ' +
          '열려 있는 동안 body 스크롤을 잠근다. 모달·시트·전체 화면 로딩의 바닥으로 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '열기' }));
    await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
    const dim = canvasElement.querySelector('[data-overlay-dim]') as HTMLElement;
    await expect(dim).not.toBeNull();
    // 콘텐츠 클릭은 닫지 않는다
    await userEvent.click(canvas.getByText('딤 위의 콘텐츠'));
    await expect(canvasElement.querySelector('[data-overlay-dim]')).not.toBeNull();
    // 딤 클릭은 닫는다 (전환이 끝난 뒤 언마운트)
    await userEvent.click(dim);
    await waitFor(() => expect(canvasElement.querySelector('[data-overlay-root]')).toBeNull());
    await expect(document.body.style.overflow).toBe('');
  },
};

export const WithContent: Story = {
  render: () => <Demo align='bottom' />,
  parameters: {
    docs: {
      description: {
        story:
          '`align="bottom"` 은 콘텐츠를 하단에 붙인다. BottomSheet 가 이 배치를 쓴다. `align="none"` 은 콘텐츠가 스스로 위치를 잡을 때 쓴다.',
      },
    },
  },
};

export const NoScrollLock: Story = {
  render: () => <Demo lockScroll={false} />,
  parameters: {
    docs: {
      description: {
        story:
          '`lockScroll={false}` 면 뒤 화면을 계속 스크롤할 수 있다. 가벼운 하이라이트 딤처럼 뒤 내용과 함께 봐야 할 때만 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '열기' }));
    await waitFor(() => expect(canvasElement.querySelector('[data-overlay-root]')).not.toBeNull());
    await expect(document.body.style.overflow).toBe('');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvasElement.querySelector('[data-overlay-root]')).toBeNull());
  },
};

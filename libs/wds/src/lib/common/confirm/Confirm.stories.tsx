import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Text } from '../../atom/Text';
import { Confirm } from './Confirm';
import { ConfirmProvider, useConfirm } from './ConfirmContext';

const meta: Meta<typeof Confirm> = {
  title: 'Components/Confirm',
  component: Confirm,
  parameters: {
    // 화면 전체를 덮는 오버레이라 캔버스 패딩을 없앤다
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Confirm>;

export const Basic: Story = {
  args: { isOpen: true, message: '정말 삭제할까요?' },
};

export const CustomLabels: Story = {
  args: { isOpen: true, message: '작성 중인 내용이 사라집니다.', confirmMsg: '나가기', cancelMsg: '계속 작성' },
};

export const Loading: Story = {
  args: { isOpen: true, message: '삭제 중입니다.', loading: true },
};

const ProviderDemo = () => {
  const { openConfirm } = useConfirm();
  const [result, setResult] = useState('아직 선택하지 않음');

  const onClick = async () => {
    const ok = await openConfirm({ message: '정말 삭제할까요?' });
    setResult(ok ? '확인을 눌렀습니다' : '취소를 눌렀습니다');
  };

  return (
    <div
      style={{ padding: '2.4rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' }}
    >
      <button type='button' onClick={onClick}>
        삭제
      </button>
      <Text variant='body3' color='textSecondary'>
        {result}
      </Text>
    </div>
  );
};

/** 실제 사용 형태 — `ConfirmProvider` 아래에서 `useConfirm().openConfirm` 이 Promise<boolean> 을 돌려준다 */
export const WithProvider: Story = {
  render: () => (
    <ConfirmProvider>
      <ProviderDemo />
    </ConfirmProvider>
  ),
};

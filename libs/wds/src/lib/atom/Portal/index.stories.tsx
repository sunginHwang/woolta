import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../Text';
import { Portal } from './index';

const meta: Meta<typeof Portal> = {
  title: 'Utilities/Portal',
  component: Portal,
};

export default meta;

type Story = StoryObj<typeof Portal>;

/** children 을 `targetId` 요소 안으로 옮겨 렌더링한다. 마운트 전(SSR)에는 아무것도 그리지 않는다 */
export const Basic: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <Text variant='body3' color='textSecondary'>
        아래 점선 상자가 targetId 요소입니다. Portal 의 children 은 DOM 상 그 안에 들어갑니다.
      </Text>
      <div id='wds-portal-target' style={{ padding: '1.6rem', border: '1px dashed currentColor', minHeight: '4rem' }} />
      <Portal targetId='wds-portal-target'>
        <Text variant='body2' color='brandPrimary'>
          Portal 로 옮겨진 내용
        </Text>
      </Portal>
    </div>
  ),
};

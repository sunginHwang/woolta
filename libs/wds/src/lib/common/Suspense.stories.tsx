import type { Meta, StoryObj } from '@storybook/react-vite';
import { lazy } from 'react';
import { SkeletonBar } from '../atom/SkeletonBar';
import { Text } from '../atom/Text';
import { Suspense } from './Suspense';

const meta: Meta<typeof Suspense> = {
  title: 'Utilities/Suspense',
  component: Suspense,
};

export default meta;

type Story = StoryObj<typeof Suspense>;

const SlowContent = lazy(
  () =>
    new Promise<{ default: () => React.JSX.Element }>((resolve) => {
      setTimeout(() => {
        resolve({
          default: () => (
            <Text variant='body2' color='textPrimary'>
              1.5초 뒤에 도착한 콘텐츠
            </Text>
          ),
        });
      }, 1500);
    }),
);

/** 마운트 전(SSR)에는 fallback 만 그리고, 마운트 후에만 React Suspense 로 동작한다 */
export const Basic: Story = {
  render: () => (
    <Suspense fallback={<SkeletonBar width='24rem' height='2.4rem' />}>
      <SlowContent />
    </Suspense>
  ),
};

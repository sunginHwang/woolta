import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkeletonBar } from './index';

const meta: Meta<typeof SkeletonBar> = {
  title: 'Components/SkeletonBar',
  component: SkeletonBar,
  argTypes: {
    width: { control: 'text', description: 'CSS 길이. 기본 20rem' },
    height: { control: 'text', description: 'CSS 길이. 기본 3.2rem' },
    radius: { control: { type: 'number', min: 0, max: 24 }, description: 'px 단위 모서리 반지름' },
  },
};

export default meta;

type Story = StoryObj<typeof SkeletonBar>;

export const Basic: Story = { args: { width: '20rem', height: '3.2rem', radius: 3 } };

export const Wide: Story = { args: { width: '32rem', height: '5rem' } };

export const Circle: Story = { args: { width: '4.8rem', height: '4.8rem', radius: 24 } };

/** 목록 로딩 플레이스홀더처럼 여러 개를 겹쳐 쓰는 예 */
export const ListPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <SkeletonBar width='60%' height='2.4rem' />
      <SkeletonBar width='100%' height='1.6rem' />
      <SkeletonBar width='80%' height='1.6rem' />
    </div>
  ),
};

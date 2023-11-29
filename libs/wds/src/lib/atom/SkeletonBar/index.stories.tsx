import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonBar } from './index';

const meta: Meta<typeof SkeletonBar> = { component: SkeletonBar };
export default meta;

type Story = StoryObj<typeof SkeletonBar>;

export const Primary: Story = { args: { width: '10rem', height: '5rem' } };

export const 가로_길게: Story = { args: { width: '30rem', height: '5rem' } };

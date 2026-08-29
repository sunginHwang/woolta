import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Login } from './Main';

const meta: Meta<typeof Login> = { component: Login };
export default meta;

type Story = StoryObj<typeof Login>;

export const 로그인_화면: Story = { args: {} };

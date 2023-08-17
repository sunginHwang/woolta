import type { Meta, StoryObj } from '@storybook/react';

import Text from '.';
import { FontVarient } from 'apps/blog/style/font';
import { ColorType } from 'apps/blog/style/colors';

const fontType: FontVarient[] = [
  'title1_bold',
  'title1_medium',
  'title2_bold',
  'title2_medium',
  'title3_bold',
  'title3_medium',
  'title4_bold',
  'title4_medium',
  'title5_bold',
  'title5_medium',
  'title6_bold',
  'body1',
  'body2',
  'body3',
  'body4_bold',
  'body4_medium',
  'body4_regular',
  'small1_bold',
  'small1_medium',
  'small1_regular',
  'small2_bold',
  'small2_medium',
  'small2_regular',
  'small3_bold',
  'small3_medium',
  'small3_regular',
  'small4_medium',
  'small4_regular',
];

const colorType: ColorType[] = [
  'gray050',
  'gray100',
  'gray150',
  'gray200',
  'gray300',
  'gray400',
  'gray500',
  'gray600',
  'gray650',
  'gray700',
  'gray800',
  'gray900',
  'gray950',
  'pink030',
  'pink050',
  'pink100',
  'pink150',
  'pink200',
  'pink300',
  'pink400',
  'pink500',
  'pink600',
  'pink700',
  'pink800',
  'pink900',
  'blue050',
  'blue100',
  'blue150',
  'blue200',
  'blue300',
  'blue400',
  'blue500',
  'blue550',
  'blue600',
  'blue700',
  'blue800',
  'blue900',
  'red050',
  'red100',
  'red150',
];

const meta: Meta<typeof Text> = {
  title: 'Component/Base/Text',
  component: Text,
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Basic: Story = {
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [...fontType],
    },
    color: {
      control: { type: 'select' },
      options: [...colorType],
    },
    alignment: {
      control: { type: 'radio' },
      options: ['left', 'center', 'right'],
    },
  },
  args: {
    variant: 'body1',
    color: 'gray900',
    as: 'p',
    children: '공통 Text 컴포넌트',
    alignment: 'left',
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
};

export const Alignment: Story = {
  argTypes: { ...Basic.argTypes },
  args: {
    as: 'div',
    alignment: 'center',
    variant: 'body2',
    ml: 10,
    mt: 10,
    mb: 10,
    mr: 10,
    children: '공통 Text 컴포넌트 (정렬)',
  },
};

export const Variant: Story = {
  argTypes: { ...Basic.argTypes },
  args: {
    variant: 'body3',
    children: '공통 Text 컴포넌트 (variant)',
    color: 'pink600',
  },
};

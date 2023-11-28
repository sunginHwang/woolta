import type { Meta, StoryObj } from '@storybook/react';

import { Text } from '.';
import { ColorType, FontVarient } from '../../style';

const fontType: FontVarient[] = [
  'title1Bold',
  'title1Medium',
  'title2Bold',
  'title2Medium',
  'title3Bold',
  'title3Medium',
  'title4Bold',
  'title4Medium',
  'title5Bold',
  'title5Medium',
  'title6Bold',
  'body1',
  'body2',
  'body3',
  'body4Bold',
  'body4Medium',
  'body4Regular',
  'small1Bold',
  'small1Medium',
  'small1Regular',
  'small2Bold',
  'small2Medium',
  'small2Regular',
  'small3Bold',
  'small3Medium',
  'small3Regular',
  'small4Medium',
  'small4Regular',
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

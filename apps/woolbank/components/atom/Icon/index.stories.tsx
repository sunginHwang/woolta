import styled from '@emotion/styled';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '@wds';
import AccountOutline from './AccountOutline';
import BucketOutline from './BucketOutline';
import ChevronDown from './ChevronDown';
import ChevronLeft from './ChevronLeft';
import Close from './Close';
import HomeOutline from './HomeOutline';
import PigOutline from './PigOutline';
import TrashCan from './TrashCan';
import WalletOutline from './WalletOutline';
import { IconProps } from '.';

const ICON_COMPONENT_LIST = [
  AccountOutline,
  BucketOutline,
  ChevronDown,
  ChevronLeft,
  Close,
  HomeOutline,
  PigOutline,
  TrashCan,
  WalletOutline,
];

const meta: Meta<IconProps> = { component: AccountOutline };
export default meta;

type Story = StoryObj<typeof AccountOutline>;

export const 아이콘_정보: Story = {
  render: () => (
    <main>
      <SC.Wrapper>
        {ICON_COMPONENT_LIST.map((Icon) => (
          <SC.IconCard key={Icon.name}>
            <SC.Thumbnail>
              <Icon />
            </SC.Thumbnail>
            <Text variant='body2' color='gray700'>
              {Icon.name}
            </Text>
          </SC.IconCard>
        ))}
      </SC.Wrapper>
    </main>
  ),
};

const SC = {
  Wrapper: styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin: 8px 0;
    margin-bottom: 10px;

    @media screen and (max-width: 450px) {
      grid-template-columns: repeat(3, 1fr);
    }
  `,
  IconCard: styled.div`
    min-width: 14%;
    padding: 8px;
    flex-shrink: 0;
    min-height: 80px;
    border: 1px solid gray;
    margin: 0 0 -1px -1px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    &:hover {
      background: ${({ theme }) => theme.colors.gray150};
      cursor: pointer;
    }
  `,
  Thumbnail: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

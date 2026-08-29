import type { Meta, StoryObj } from '@storybook/react';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import AccountOutline from './AccountOutline';
import BucketOutline from './BucketOutline';
import ChevronDown from './ChevronDown';
import ChevronLeft from './ChevronLeft';
import Close from './Close';
import CloseCircle from './CloseCircle';
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
  CloseCircle,
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
      <div {...stylex.props(styles.wrapper)}>
        {ICON_COMPONENT_LIST.map((Icon) => (
          <div key={Icon.name} {...stylex.props(styles.iconCard)}>
            <div {...stylex.props(styles.thumbnail)}>
              <Icon />
            </div>
            <Text variant='body2' color='gray700'>
              {Icon.name}
            </Text>
          </div>
        ))}
      </div>
    </main>
  ),
};

const styles = stylex.create({
  wrapper: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(4, 1fr)',
      '@media screen and (max-width: 450px)': 'repeat(3, 1fr)',
    },
    marginTop: '8px',
    marginBottom: '10px',
    marginInline: 0,
  },
  iconCard: {
    minWidth: '14%',
    paddingBlock: '8px',
    paddingInline: '8px',
    flexShrink: 0,
    minHeight: '80px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'gray',
    marginTop: 0,
    marginBottom: '-1px',
    marginLeft: '-1px',
    marginRight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-gray150'],
    },
    cursor: {
      default: 'default',
      ':hover': 'pointer',
    },
  },
  thumbnail: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

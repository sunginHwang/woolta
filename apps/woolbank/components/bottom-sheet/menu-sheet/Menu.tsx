import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { BottomMenu } from './MenuSheet';

interface Props {
  menu: BottomMenu;
  isActive: boolean;
  onMenuSelect: (menuType: string) => void;
}

/**
 * 하단 모달 메뉴
 * @component
 */

export const Menu = ({ menu, isActive, onMenuSelect }: Props) => {
  const onClick = () => {
    onMenuSelect(menu.type);
  };

  return (
    <li key={menu.type} onClick={onClick} {...stylex.props(styles.menu, isActive && styles.menuActive)}>
      <Text variant='title4Medium' color='gray700' alignment='left'>
        {menu.value}
      </Text>
    </li>
  );
};

const styles = stylex.create({
  menu: {
    paddingBlock: '1.4rem',
    paddingInline: '1.4rem',
    backgroundColor: colorVars['--color-white'],
    borderRadius: '0.8rem',
    marginBottom: {
      default: 0,
      ':last-child': 'calc(env(safe-area-inset-bottom, 0px) + 2.5rem)',
    },
  },
  menuActive: {
    backgroundColor: colorVars['--color-gray200'],
  },
});

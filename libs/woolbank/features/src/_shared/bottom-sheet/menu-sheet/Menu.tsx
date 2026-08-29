'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { BottomMenu } from './MenuSheet';

interface Props {
  menu: BottomMenu;
  isActive: boolean;
  isLast?: boolean;
  onMenuSelect: (menuType: string) => void;
}

/**
 * 하단 모달 메뉴
 * @component
 */
export const Menu = ({ menu, isActive, isLast = false, onMenuSelect }: Props) => {
  const onClick = () => {
    onMenuSelect(menu.type);
  };

  return (
    <li
      key={menu.type}
      {...stylex.props(styles.menu, isActive ? styles.menuActive : styles.menuInactive, isLast && styles.menuLast)}
      onClick={onClick}
    >
      <Text variant='title4Medium' color='textSecondary' alignment='left'>
        {menu.value}
      </Text>
    </li>
  );
};

const styles = stylex.create({
  menu: {
    paddingBlock: '1.4rem',
    paddingInline: '1.4rem',
    borderRadius: '0.8rem',
  },
  menuActive: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  menuInactive: {
    backgroundColor: colorVars['--color-bgSurface'],
  },
  menuLast: {
    marginBottom: 'calc(env(safe-area-inset-bottom) + 2.5rem)',
  },
});

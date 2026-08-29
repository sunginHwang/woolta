'use client';

import * as stylex from '@stylexjs/stylex';
import { DefaultBottomSheet } from '../DefaultBottomSheet';
import { Menu } from './Menu';

export interface BottomMenu<T = string> {
  type: T;
  value: string;
}

interface Props {
  menus: BottomMenu[];
  activeMenuType?: string;
  title: string;
  visible: boolean;
  oncloseModal: () => void;
  onEditClick: (menuType: string) => void;
}

/**
 * 하단 메뉴 모달
 * @component
 */
export const MenuSheet = ({ menus, title, activeMenuType = '', visible, oncloseModal, onEditClick }: Props) => {
  return (
    <DefaultBottomSheet title={title} visible={visible} oncloseModal={oncloseModal}>
      <ul {...stylex.props(styles.list)}>
        {menus.map((menu) => {
          const isActive = activeMenuType === menu.type;
          return <Menu key={menu.type} menu={menu} isActive={isActive} onMenuSelect={onEditClick} />;
        })}
      </ul>
    </DefaultBottomSheet>
  );
};

const styles = stylex.create({
  list: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
    marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2.5rem)',
  },
});

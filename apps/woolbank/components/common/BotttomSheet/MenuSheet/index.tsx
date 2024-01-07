import styled from '@emotion/styled';
import { safeAreaInsetMarginBottom } from '@wds';
import { FC } from 'react';
import DefaultBottomSheet from '../DefaultBottomSheet';
import Menu from './Menu';

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
const MenuSheet: FC<Props> = ({ menus, title, activeMenuType = '', visible, oncloseModal, onEditClick }) => {
  return (
    <DefaultBottomSheet title={title} visible={visible} oncloseModal={oncloseModal}>
      <SC.List>
        {menus.map((menu) => {
          const isActive = activeMenuType === menu.type;
          return <Menu key={menu.type} menu={menu} isActive={isActive} onMenuSelect={onEditClick} />;
        })}
      </SC.List>
    </DefaultBottomSheet>
  );
};

export default MenuSheet;

const SC = {
  List: styled.ul`
    padding: 0 1.6rem;
    ${safeAreaInsetMarginBottom('2.5rem')}
  `,
};

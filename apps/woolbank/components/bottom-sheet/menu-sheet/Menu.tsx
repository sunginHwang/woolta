import { Text, safeAreaInsetMarginBottom } from '@wds';
import { styled } from 'styled-components';
import { BottomMenu } from './MenuSheet';

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
    <SC.Menu key={menu.type} onClick={onClick} $isActive={isActive}>
      <Text variant='title4Medium' color='gray700' alignment='left'>
        {menu.value}
      </Text>
    </SC.Menu>
  );
};

const SC = {
  Menu: styled.li<{ $isActive: boolean }>`
    padding: 1.4rem;
    background-color: ${({ $isActive, theme }) => ($isActive ? theme.colors.gray200 : theme.colors.white)};
    border-radius: 0.8rem;

    &:last-child {
      ${safeAreaInsetMarginBottom('2.5rem')}
    }
  `,
};

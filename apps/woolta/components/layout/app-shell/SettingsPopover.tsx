'use client';

import { Text } from '@wds';
import { useAtom, useAtomValue } from 'jotai';
import { FiMoon, FiSun } from 'react-icons/fi';
import { styled } from 'styled-components';
import layouts from '../../../style/layouts';
import { railExpandedAtom, themeTypeAtom } from '../store';

interface Props {
  onClose: () => void;
}

const SettingsPopover = ({ onClose }: Props) => {
  const [themeType, setThemeType] = useAtom(themeTypeAtom);
  const isRailExpanded = useAtomValue(railExpandedAtom);

  return (
    <>
      <SC.Backdrop onClick={onClose} />
      <SC.Popover $railWidth={isRailExpanded ? layouts.railExpandedWidth : layouts.railWidth}>
        <Text as='p' variant='small1Bold' color='textSecondary'>
          테마
        </Text>
        <SC.OptionRow>
          <SC.Option type='button' $isActive={themeType === 'light'} onClick={() => setThemeType('light')}>
            <FiSun size={16} />
            라이트
          </SC.Option>
          <SC.Option type='button' $isActive={themeType === 'dark'} onClick={() => setThemeType('dark')}>
            <FiMoon size={16} />
            다크
          </SC.Option>
        </SC.OptionRow>
      </SC.Popover>
    </>
  );
};

export default SettingsPopover;

const SC = {
  Backdrop: styled.div`
    position: fixed;
    inset: 0;
    z-index: ${({ theme }) => theme.zIndex.layer};
  `,
  Popover: styled.div<{ $railWidth: string }>`
    position: fixed;
    left: calc(${({ $railWidth }) => $railWidth} + 0.8rem);
    bottom: 1.2rem;
    z-index: ${({ theme }) => theme.zIndex.layer};
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    width: 22rem;
    padding: 1.6rem;
    border-radius: 1.2rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
    border: 0.1rem solid ${({ theme }) => theme.colors.borderSubtle};
    box-shadow: 0 0.4rem 1.6rem rgba(0, 0, 0, 0.15);
  `,
  OptionRow: styled.div`
    display: flex;
    gap: 0.8rem;
  `,
  Option: styled.button<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    flex: 1;
    padding: 0.8rem 0;
    border-radius: 0.8rem;
    font-size: 1.3rem;
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.interactivePrimary : theme.colors.textSecondary)};
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : 'transparent')};
    border: 0.1rem solid
      ${({ theme, $isActive }) => ($isActive ? theme.colors.interactivePrimary : theme.colors.borderSubtle)};
  `,
};

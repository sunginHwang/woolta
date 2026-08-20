'use client';

import { useAtom } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiChevronsLeft, FiChevronsRight, FiGrid, FiSettings } from 'react-icons/fi';
import { styled } from 'styled-components';
import layouts from '../../../style/layouts';
import { railExpandedAtom } from '../store';
import { APP_LIST } from './apps';
import SettingsPopover from './SettingsPopover';

const AppRail = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useAtom(railExpandedAtom);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <SC.Rail $isExpanded={isExpanded}>
      <SC.RailLink href='/' title='홈' $isActive={pathname === '/'} $isExpanded={isExpanded}>
        <SC.IconSlot>
          <FiGrid size={20} />
        </SC.IconSlot>
        {isExpanded && <SC.Label>홈</SC.Label>}
      </SC.RailLink>
      <SC.Divider />
      {APP_LIST.map(({ key, name, href, icon: Icon }) => (
        <SC.RailLink
          key={key}
          href={href}
          title={name}
          $isActive={pathname.startsWith(href)}
          $isExpanded={isExpanded}
        >
          <SC.IconSlot>
            <Icon size={20} />
          </SC.IconSlot>
          {isExpanded && <SC.Label>{name}</SC.Label>}
        </SC.RailLink>
      ))}
      <SC.Spacer />
      <SC.RailButton
        type='button'
        title={isExpanded ? '접기' : '펼치기'}
        $isActive={false}
        $isExpanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <SC.IconSlot>{isExpanded ? <FiChevronsLeft size={20} /> : <FiChevronsRight size={20} />}</SC.IconSlot>
        {isExpanded && <SC.Label>접기</SC.Label>}
      </SC.RailButton>
      <SC.RailButton
        type='button'
        title='설정'
        $isActive={isSettingsOpen}
        $isExpanded={isExpanded}
        onClick={() => setIsSettingsOpen((prev) => !prev)}
      >
        <SC.IconSlot>
          <FiSettings size={20} />
        </SC.IconSlot>
        {isExpanded && <SC.Label>설정</SC.Label>}
      </SC.RailButton>
      {isSettingsOpen && <SettingsPopover onClose={() => setIsSettingsOpen(false)} />}
    </SC.Rail>
  );
};

export default AppRail;

const itemBaseCss = `
  display: flex;
  align-items: center;
  height: ${layouts.railItemSize};
  border-radius: 1.2rem;
`;

const SC = {
  Rail: styled.aside<{ $isExpanded: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
    width: ${({ $isExpanded }) => ($isExpanded ? layouts.railExpandedWidth : layouts.railWidth)};
    flex-shrink: 0;
    padding: 1.2rem 0.8rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
    border-right: 0.1rem solid ${({ theme }) => theme.colors.borderSubtle};
    transition: width 0.2s ease;
    overflow: hidden;
  `,
  RailLink: styled(Link)<{ $isActive: boolean; $isExpanded: boolean }>`
    ${itemBaseCss}
    justify-content: ${({ $isExpanded }) => ($isExpanded ? 'flex-start' : 'center')};
    padding: ${({ $isExpanded }) => ($isExpanded ? '0 1rem' : '0')};
    gap: 1rem;
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.interactivePrimary : theme.colors.textInactive)};
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : 'transparent')};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
  RailButton: styled.button<{ $isActive: boolean; $isExpanded: boolean }>`
    ${itemBaseCss}
    justify-content: ${({ $isExpanded }) => ($isExpanded ? 'flex-start' : 'center')};
    padding: ${({ $isExpanded }) => ($isExpanded ? '0 1rem' : '0')};
    gap: 1rem;
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.interactivePrimary : theme.colors.textInactive)};
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : 'transparent')};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
  IconSlot: styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2rem;
  `,
  Label: styled.span`
    font-size: 1.3rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  Divider: styled.div`
    height: 0.1rem;
    margin: 0 0.8rem;
    background-color: ${({ theme }) => theme.colors.borderSubtle};
  `,
  Spacer: styled.div`
    flex: 1;
  `,
};

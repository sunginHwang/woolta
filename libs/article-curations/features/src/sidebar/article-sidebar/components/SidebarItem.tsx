'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { styled } from 'styled-components';

interface Props {
  /** 이동할 경로 */
  href: string;
  /** 좌측 아이콘 */
  icon: ReactNode;
  /** 리스트 이름 */
  label: string;
  /** 우측 뱃지 개수. 0이면 숨김 */
  count?: number;
  /** 선택 여부 */
  isActive: boolean;
  /** hover 시 우측에 노출할 액션 영역 (편집/삭제 버튼 등) */
  hoverActions?: ReactNode;
}

/** 사이드바 리스트 항목 (스마트 리스트/카테고리 공용) */
export const SidebarItem = ({ href, icon, label, count = 0, isActive, hoverActions }: Props) => {
  const hasHoverActions = hoverActions !== undefined && hoverActions !== null;

  return (
    <SC.Item>
      <SC.ItemLink href={href} $isActive={isActive}>
        <SC.Icon>{icon}</SC.Icon>
        <SC.Label>{label}</SC.Label>
        {count > 0 && <SC.Count>{count}</SC.Count>}
      </SC.ItemLink>
      {hasHoverActions && <SC.HoverActions className='sidebar-item-actions'>{hoverActions}</SC.HoverActions>}
    </SC.Item>
  );
};

const SC = {
  Item: styled.li`
    position: relative;

    &:hover .sidebar-item-actions {
      opacity: 1;
    }
  `,
  ItemLink: styled(Link)<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.7rem 1rem;
    border-radius: 0.8rem;
    text-decoration: none;
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : 'transparent')};
    color: ${({ theme }) => theme.colors.textPrimary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
  Icon: styled.span`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  `,
  Label: styled.span`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.3rem;
    line-height: 1.8rem;
  `,
  Count: styled.span`
    flex-shrink: 0;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.textTertiary};
  `,
  HoverActions: styled.span`
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding-left: 0.6rem;
    background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    opacity: 0;
    transition: opacity 0.15s ease;
  `,
};

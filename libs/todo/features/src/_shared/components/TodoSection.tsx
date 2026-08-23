'use client';

import { ReactNode, useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { styled } from 'styled-components';

interface Props {
  /** 섹션 제목 */
  title: string;
  /** 섹션 내 항목 개수 */
  count: number;
  /** 초기 접힘 여부 @default false */
  defaultCollapsed?: boolean;
  /** 주의를 끌어야 하는 섹션인지 여부 (지난 섹션 등). 제목을 경고색으로 표시 @default false */
  isEmphasized?: boolean;
  /** 섹션 내용 */
  children: ReactNode;
}

/** 접을 수 있는 할 일 섹션 (지난 / 오늘 / 완료 / 날짜 그룹 공용) */
export const TodoSection = ({ title, count, defaultCollapsed = false, isEmphasized = false, children }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <SC.Section>
      <SC.Header type='button' $isEmphasized={isEmphasized} onClick={() => setIsCollapsed((prev) => !prev)}>
        {isCollapsed ? <FiChevronRight size={13} /> : <FiChevronDown size={13} />}
        {title}
        <SC.Count>{count}</SC.Count>
      </SC.Header>
      {!isCollapsed && children}
    </SC.Section>
  );
};

const SC = {
  Section: styled.section`
    margin-top: 1.2rem;

    &:first-child {
      margin-top: 0;
    }
  `,
  Header: styled.button<{ $isEmphasized: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.6rem;
    border: none;
    border-radius: 0.6rem;
    background: none;
    color: ${({ theme, $isEmphasized }) => ($isEmphasized ? theme.colors.statusError : theme.colors.textSecondary)};
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
  Count: styled.span`
    color: ${({ theme }) => theme.colors.textTertiary};
    font-weight: 400;
  `,
};

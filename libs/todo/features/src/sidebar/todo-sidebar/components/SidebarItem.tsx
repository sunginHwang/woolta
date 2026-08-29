'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import type { ReactNode } from 'react';

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
    <li {...stylex.props(styles.item)}>
      <Link href={href} {...stylex.props(styles.itemLink, isActive && styles.itemLinkActive)}>
        <span {...stylex.props(styles.icon)}>{icon}</span>
        <span {...stylex.props(styles.label)}>{label}</span>
        {count > 0 && <span {...stylex.props(styles.count)}>{count}</span>}
      </Link>
      {hasHoverActions && <span {...stylex.props(styles.hoverActions)}>{hoverActions}</span>}
    </li>
  );
};

const styles = stylex.create({
  item: {
    position: 'relative',
    // 항목 hover 시 액션 노출 — 자손 선택자 대신 상속되는 CSS 변수 토글
    '--sidebar-actions-opacity': {
      default: '0',
      ':hover': '1',
    },
  },
  itemLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    paddingBlock: '0.7rem',
    paddingInline: '1rem',
    borderRadius: '0.8rem',
    textDecoration: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    color: colorVars['--color-textPrimary'],
  },
  itemLinkActive: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    color: colorVars['--color-textSecondary'],
  },
  label: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '1.3rem',
    lineHeight: '1.8rem',
  },
  count: {
    flexShrink: 0,
    fontSize: '1.1rem',
    color: colorVars['--color-textTertiary'],
  },
  hoverActions: {
    opacity: 'var(--sidebar-actions-opacity)' as unknown as number,
    position: 'absolute',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    paddingLeft: '0.6rem',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
  },
});

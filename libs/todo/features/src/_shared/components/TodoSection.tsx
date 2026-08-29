'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { type ReactNode, useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

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
    <section {...stylex.props(styles.section)}>
      <button
        type='button'
        onClick={() => setIsCollapsed((prev) => !prev)}
        {...stylex.props(styles.header, isEmphasized && styles.headerEmphasized)}
      >
        {isCollapsed ? <FiChevronRight size={13} /> : <FiChevronDown size={13} />}
        {title}
        <span {...stylex.props(styles.count)}>{count}</span>
      </button>
      {!isCollapsed && children}
    </section>
  );
};

const styles = stylex.create({
  section: {
    marginTop: {
      default: '1.2rem',
      ':first-child': 0,
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.6rem',
    borderWidth: 0,
    borderRadius: '0.6rem',
    background: 'none',
    color: colorVars['--color-textSecondary'],
    fontSize: '1.2rem',
    fontWeight: 600,
    cursor: 'pointer',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
  },
  headerEmphasized: {
    color: colorVars['--color-statusError'],
  },
  count: {
    color: colorVars['--color-textTertiary'],
    fontWeight: 400,
  },
});

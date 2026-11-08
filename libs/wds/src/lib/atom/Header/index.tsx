'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { colorVars, zIndexConsts } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/** 헤더 높이. 아래 콘텐츠의 sticky offset 계산에 쓴다 (woolbank layoutConsts.headerHeight 대체) */
export const HEADER_HEIGHT = '5.6rem';

export interface HeaderProps {
  /** 제목. 문자열이면 title4Bold 로 그리고, 노드면 그대로 둔다 */
  title: ReactNode;
  /** 오른쪽 액션 영역 (아이콘 버튼 등) */
  right?: ReactNode;
  /**
   * 스크롤해도 상단에 붙는다
   * @default true
   */
  sticky?: boolean;
  /** 외부에서 주입하는 StyleX 스타일 — 루트(header)에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

export interface SubHeaderProps {
  /** 가운데 제목 */
  title: string;
  /** 주면 왼쪽에 뒤로 가기 버튼을 그린다. 라우터 연동은 호출부 담당 */
  onBackClick?: () => void;
  /** 오른쪽 액션 영역 */
  right?: ReactNode;
  /**
   * sticky 는 스크롤 컨테이너 상단, fixed 는 뷰포트 상단에 고정
   * @default 'sticky'
   */
  position?: 'sticky' | 'fixed';
  /**
   * 하단 1px 구분선
   * @default true
   */
  bordered?: boolean;
  /**
   * 배경·구분선 없이 투명하게 (스켈레톤·이미지 위에 얹을 때)
   * @default false
   */
  transparent?: boolean;
  /** 외부에서 주입하는 StyleX 스타일 — 루트(header)에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  header: {
    left: 0,
    top: 0,
    width: '100%',
    zIndex: zIndexConsts.header,
    backgroundColor: colorVars['--color-bgSurface'],
  },
  sticky: { position: 'sticky' },
  fixed: { position: 'fixed' },
  static: { position: 'static' },
  inner: {
    height: HEADER_HEIGHT,
    paddingInline: '1.6rem',
    display: 'flex',
    alignItems: 'center',
  },
  mainInner: { justifyContent: 'space-between' },
  title: { color: colorVars['--color-textPrimary'] },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: colorVars['--color-textSecondary'],
  },
  bordered: {
    boxShadow: `0 1px 0 0 ${colorVars['--color-borderSubtle']}`,
  },
  transparent: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  side: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    display: 'flex',
    alignItems: 'center',
  },
  sideStart: { justifyContent: 'flex-start' },
  sideEnd: { justifyContent: 'flex-end' },
  subTitle: {
    flexGrow: 2,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
    color: colorVars['--color-textPrimary'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0,
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem',
    marginLeft: '-0.8rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: colorVars['--color-textPrimary'],
    cursor: 'pointer',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
  },
});

const ChevronLeftIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M15 5l-7 7 7 7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

/**
 * 페이지 최상단 제목 바. 메인 화면처럼 뒤로 가기가 없는 화면에 쓴다.
 * 상세 화면은 `Header.Sub` 를 쓴다.
 * @component
 */
const HeaderRoot = ({ title, right, sticky = true, xstyle }: HeaderProps) => (
  <header {...stylex.props(styles.header, sticky ? styles.sticky : styles.static, xstyle)}>
    <div {...stylex.props(styles.inner, styles.mainInner)}>
      {typeof title === 'string' ? (
        <h1 {...stylex.props(typographyStyles.title4Bold, styles.title)}>{title}</h1>
      ) : (
        title
      )}
      {right && <div {...stylex.props(styles.right)}>{right}</div>}
    </div>
  </header>
);

/**
 * 상세 화면 제목 바 — 뒤로 가기 + 가운데 제목 + 오른쪽 액션.
 * 뒤로 가기의 실제 이동(router.back)은 호출부가 `onBackClick` 으로 연결한다.
 * @component
 */
export const SubHeader = ({
  title,
  onBackClick,
  right,
  position = 'sticky',
  bordered = true,
  transparent = false,
  xstyle,
}: SubHeaderProps) => (
  <header
    {...stylex.props(
      styles.header,
      position === 'fixed' ? styles.fixed : styles.sticky,
      bordered && styles.bordered,
      transparent && styles.transparent,
      xstyle,
    )}
  >
    <div {...stylex.props(styles.inner)}>
      <div {...stylex.props(styles.side, styles.sideStart)}>
        {onBackClick && (
          <button type='button' aria-label='뒤로 가기' onClick={onBackClick} {...stylex.props(styles.backButton)}>
            <ChevronLeftIcon />
          </button>
        )}
      </div>
      <h1 {...stylex.props(typographyStyles.title4Bold, styles.subTitle)}>{title}</h1>
      <div {...stylex.props(styles.side, styles.sideEnd, styles.right)}>{right}</div>
    </div>
  </header>
);

export const Header = Object.assign(HeaderRoot, { Sub: SubHeader });

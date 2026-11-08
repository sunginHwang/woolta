import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { SkeletonBar } from '../SkeletonBar';

interface BaseProps extends HTMLAttributes<HTMLDivElement> {
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지된다 */
  xstyle?: StyleXStyles;
}

export interface SkeletonTextProps extends BaseProps {
  /**
   * 줄 수. 마지막 줄은 60% 폭
   * @default 3
   */
  lines?: number;
}

export interface SkeletonCircleProps extends BaseProps {
  /**
   * 지름. 숫자는 px
   * @default 40
   */
  size?: number | string;
}

export interface SkeletonCardProps extends BaseProps {
  /**
   * 왼쪽에 썸네일 자리를 둔다
   * @default false
   */
  withThumbnail?: boolean;
}

export interface SkeletonListProps extends BaseProps {
  /**
   * 행 수
   * @default 5
   */
  rows?: number;
  /**
   * 행마다 40px 아바타 자리를 둔다
   * @default false
   */
  withAvatar?: boolean;
}

const LINE_HEIGHT = '1.6rem';
const ACCOUNT_BOOK_LINE = '2.1rem';

const styles = stylex.create({
  column: { display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' },
  row: { display: 'flex', alignItems: 'center', gap: '1.2rem', width: '100%' },
  grow: { flexGrow: 1, minWidth: 0 },
  card: {
    display: 'flex',
    gap: '1.6rem',
    width: '100%',
    padding: '1.6rem',
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-bgSurface'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderFaint'],
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1.6rem', width: '100%' },
  accountBook: { display: 'flex', flexDirection: 'column', gap: '2.4rem', width: '100%' },
  dayGroupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: '1rem',
    marginBottom: '1rem',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
  },
  dayGroupList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
});

/** 모든 프리셋 래퍼가 공유하는 접근성 속성 */
const statusProps = { role: 'status', 'aria-busy': true, 'aria-label': '불러오는 중' } as const;

const keys = (count: number) => Array.from({ length: count }, (_, i) => `k${i}`);

/** 문단 자리. 마지막 줄만 짧아 실제 글처럼 보인다 */
const SkeletonText = ({ lines = 3, xstyle, className, ...rest }: SkeletonTextProps) => {
  const sx = stylex.props(styles.column, xstyle);

  return (
    <div {...statusProps} {...rest} {...sx} className={className ? `${sx.className ?? ''} ${className}` : sx.className}>
      {keys(lines).map((key, index) => (
        <SkeletonBar key={key} width={index === lines - 1 && lines > 1 ? '60%' : '100%'} height={LINE_HEIGHT} />
      ))}
    </div>
  );
};

/** 아바타·아이콘 자리 */
const SkeletonCircle = ({ size = 40, xstyle, className, ...rest }: SkeletonCircleProps) => {
  const length = typeof size === 'number' ? `${size}px` : size;
  const sx = stylex.props(xstyle);

  return (
    <div {...statusProps} {...rest} {...sx} className={className ? `${sx.className ?? ''} ${className}` : sx.className}>
      <SkeletonBar width={length} height={length} radius={999} />
    </div>
  );
};

/** 카드 자리: 제목 한 줄 + 본문 두 줄 (+썸네일) */
const SkeletonCard = ({ withThumbnail = false, xstyle, className, ...rest }: SkeletonCardProps) => {
  const sx = stylex.props(styles.card, xstyle);

  return (
    <div {...statusProps} {...rest} {...sx} className={className ? `${sx.className ?? ''} ${className}` : sx.className}>
      {withThumbnail && <SkeletonBar width='7.2rem' height='7.2rem' radius={8} />}
      <div {...stylex.props(styles.column, styles.grow)}>
        <SkeletonBar width='50%' height='2rem' />
        <SkeletonBar width='100%' height={LINE_HEIGHT} />
        <SkeletonBar width='80%' height={LINE_HEIGHT} />
      </div>
    </div>
  );
};

/** 목록 자리: 행마다 (아바타 +) 두 줄 */
const SkeletonList = ({ rows = 5, withAvatar = false, xstyle, className, ...rest }: SkeletonListProps) => {
  const sx = stylex.props(styles.list, xstyle);

  return (
    <div {...statusProps} {...rest} {...sx} className={className ? `${sx.className ?? ''} ${className}` : sx.className}>
      {keys(rows).map((key) => (
        <div key={key} {...stylex.props(styles.row)}>
          {withAvatar && <SkeletonBar width='4rem' height='4rem' radius={999} />}
          <div {...stylex.props(styles.column, styles.grow)}>
            <SkeletonBar width='40%' height={LINE_HEIGHT} />
            <SkeletonBar width='70%' height='1.2rem' />
          </div>
        </div>
      ))}
    </div>
  );
};

/** woolbank 가계부 목록 자리: 날짜 그룹 헤더 + 내역 3줄, 5개 그룹 */
const SkeletonAccountBookList = ({ xstyle, className, ...rest }: BaseProps) => {
  const sx = stylex.props(styles.accountBook, xstyle);

  return (
    <div {...statusProps} {...rest} {...sx} className={className ? `${sx.className ?? ''} ${className}` : sx.className}>
      {keys(5).map((key) => (
        <div key={key} data-day-group>
          <div {...stylex.props(styles.dayGroupHeader)}>
            <SkeletonBar width='3rem' height={ACCOUNT_BOOK_LINE} />
            <SkeletonBar width='8rem' height={ACCOUNT_BOOK_LINE} />
          </div>
          <div {...stylex.props(styles.dayGroupList)}>
            <SkeletonBar width='100%' height={ACCOUNT_BOOK_LINE} />
            <SkeletonBar width='100%' height={ACCOUNT_BOOK_LINE} />
            <SkeletonBar width='100%' height={ACCOUNT_BOOK_LINE} />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * SkeletonBar 를 조립한 로딩 플레이스홀더 프리셋.
 * 화면마다 SkeletonBar 를 직접 쌓는 대신 Text / Circle / Card / List / AccountBookList 를 고른다.
 * 모든 프리셋은 role=status + aria-busy 로 스크린리더에 "불러오는 중"을 알린다.
 */
export const Skeleton = Object.assign(SkeletonText, {
  Text: SkeletonText,
  Circle: SkeletonCircle,
  Card: SkeletonCard,
  List: SkeletonList,
  AccountBookList: SkeletonAccountBookList,
});

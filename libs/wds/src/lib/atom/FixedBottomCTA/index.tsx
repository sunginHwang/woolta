'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { colorVars, zIndexConsts } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';
import { Button } from '../Button';

export interface FixedBottomCTAProps {
  /** 주 버튼 라벨. 동사형 명사 — "저장하기", "다음". 비활성일 때는 이유를 적는다 — "금액을 입력해 주세요" */
  children: ReactNode;
  /** 주 버튼 클릭 */
  onClick?: () => void;
  /**
   * 필수 입력 전처럼 아직 누를 수 없을 때
   * @default false
   */
  disabled?: boolean;
  /**
   * 처리 중. 스피너를 보이고 클릭을 막되 버튼 폭은 유지한다
   * @default false
   */
  loading?: boolean;
  /** 폼 안에서 제출 버튼으로 쓰려면 'submit'. 기본은 button */
  type?: 'button' | 'submit';
  /** 왼쪽 보조 버튼 라벨("이전", "취소"). 주면 두 단계 흐름이 된다 */
  secondaryLabel?: string;
  /** 보조 버튼 클릭 */
  onSecondaryClick?: () => void;
  /** 버튼 위 한 줄 안내 — "저장하면 이달 지출에 바로 반영돼요" */
  note?: ReactNode;
  /**
   * `fixed` 는 화면 하단 고정, `static` 은 흐름 안 배치(스토리북·임베드)
   * @default 'fixed'
   */
  position?: 'fixed' | 'static';
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

/** 하단 CTA 가 차지하는 높이. 콘텐츠 끝에 이만큼 여백을 두어 가려지지 않게 한다 (버튼 52 + 패딩 12/16 + 여유) */
export const FIXED_BOTTOM_CTA_HEIGHT = '9.6rem';

const styles = stylex.create({
  root: {
    left: 0,
    right: 0,
    bottom: 0,
    boxSizing: 'border-box',
    width: '100%',
    paddingTop: '1.2rem',
    paddingInline: '1.6rem',
    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.6rem)',
    // 위로 사라지는 그라데이션 — 스크롤되는 콘텐츠가 버튼 뒤에서 자연스럽게 가려진다
    backgroundImage: `linear-gradient(to bottom, transparent 0%, ${colorVars['--color-bgSurface']} 2.4rem)`,
    zIndex: zIndexConsts.floatButton,
  },
  fixed: { position: 'fixed' },
  static: { position: 'relative' },
  note: {
    marginBottom: '0.8rem',
    textAlign: 'center',
    color: colorVars['--color-textSecondary'],
  },
  row: {
    display: 'flex',
    gap: '0.8rem',
    maxWidth: '48rem',
    marginInline: 'auto',
  },
  primary: { flex: 1 },
  secondary: { flex: '0 0 auto', minWidth: '9.6rem' },
});

/**
 * 화면 하단에 고정되는 1차 액션. 작성·수정·온보딩 같은 서브 화면마다 하나만 둔다.
 *
 * - `Button size='large' fill` 을 감싸고, 안전 영역 패딩과 `z-index: floatButton` 을 책임진다.
 * - 두 단계 흐름("이전 / 다음")은 `secondaryLabel` 로 왼쪽에 보조 버튼을 붙인다.
 * - 콘텐츠 끝에는 `FIXED_BOTTOM_CTA_HEIGHT` 만큼 아래 여백을 두어 CTA 에 가리지 않게 한다.
 * - woolbank 의 BottomFloatingButton 을 공용화한 것. 표시 여부(isShow)는 호출하는 쪽에서 조건부 렌더링으로 정한다.
 * @component
 */
export const FixedBottomCTA = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  secondaryLabel,
  onSecondaryClick,
  note,
  position = 'fixed',
  xstyle,
}: FixedBottomCTAProps) => (
  <div {...stylex.props(styles.root, position === 'fixed' ? styles.fixed : styles.static, xstyle)}>
    {note && <p {...stylex.props(typographyStyles.small1Regular, styles.note)}>{note}</p>}
    <div {...stylex.props(styles.row)}>
      {secondaryLabel && (
        <Button type='button' variant='secondary' size='large' onClick={onSecondaryClick} xstyle={styles.secondary}>
          {secondaryLabel}
        </Button>
      )}
      <Button
        type={type}
        size='large'
        fill
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        xstyle={styles.primary}
      >
        {children}
      </Button>
    </div>
  </div>
);

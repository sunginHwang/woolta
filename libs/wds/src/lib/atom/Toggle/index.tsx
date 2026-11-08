'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { FC, FocusEvent } from 'react';
import { useState } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/**
 * 트랙 높이 기준 세 단계. 당근 SEED Switch 의 16/24/32 체계를 따른다.
 * - small: 테이블 행·칩처럼 좁은 곳
 * - medium: 설정 목록 기본값
 * - large: 화면의 주요 on/off 하나를 크게 보여줄 때
 */
export type ToggleSize = 'small' | 'medium' | 'large';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /**
   * 크기. 트랙 높이 small 16px / medium 24px / large 32px
   * @default 'medium'
   */
  size?: ToggleSize;
  /** 보이는 라벨. 없으면 aria-label 로 접근성 이름을 준다 */
  label?: string;
  'aria-label'?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 루트(label)에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  rootDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  // 네이티브 체크박스는 숨기고 키보드 포커스/스크린리더만 쓴다
  input: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: 0,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  track: {
    position: 'relative',
    flexShrink: 0,
    borderRadius: '9999px',
    backgroundColor: colorVars['--color-grayInactiveFilled'],
    transitionProperty: 'background-color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
  },
  trackChecked: {
    backgroundColor: colorVars['--color-brandPrimary'],
  },
  // 키보드 포커스일 때만 링을 그린다. 마우스·터치로 토글할 때는 보이지 않는다
  trackFocusVisible: {
    outlineWidth: '0.2rem',
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
  knob: {
    position: 'absolute',
    top: '0.2rem',
    left: '0.2rem',
    borderRadius: '50%',
    backgroundColor: colorVars['--color-white'],
    boxShadow: '0 0.1rem 0.3rem rgba(0, 0, 0, 0.25)',
    transitionProperty: 'transform',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    transform: 'translateX(0)',
  },
  label: {
    color: colorVars['--color-textPrimary'],
  },
});

/**
 * 사이즈별 치수. 노브는 트랙 안쪽 여백 0.2rem 을 뺀 크기이고,
 * 켜진 상태의 이동 거리는 (트랙 폭 - 노브 - 양쪽 여백 0.4rem) 이다.
 */
const sizeStyles = stylex.create({
  smallRoot: { gap: '0.6rem' },
  mediumRoot: { gap: '0.8rem' },
  largeRoot: { gap: '1rem' },
  smallTrack: { width: '2.8rem', height: '1.6rem' },
  mediumTrack: { width: '4.4rem', height: '2.4rem' },
  largeTrack: { width: '5.6rem', height: '3.2rem' },
  smallKnob: { width: '1.2rem', height: '1.2rem' },
  mediumKnob: { width: '2rem', height: '2rem' },
  largeKnob: { width: '2.8rem', height: '2.8rem' },
  smallKnobChecked: { transform: 'translateX(1.2rem)' },
  mediumKnobChecked: { transform: 'translateX(2rem)' },
  largeKnobChecked: { transform: 'translateX(2.4rem)' },
});

const SIZE = {
  small: {
    root: sizeStyles.smallRoot,
    track: sizeStyles.smallTrack,
    knob: sizeStyles.smallKnob,
    knobChecked: sizeStyles.smallKnobChecked,
    label: typographyStyles.small1Regular,
  },
  medium: {
    root: sizeStyles.mediumRoot,
    track: sizeStyles.mediumTrack,
    knob: sizeStyles.mediumKnob,
    knobChecked: sizeStyles.mediumKnobChecked,
    label: typographyStyles.body3,
  },
  large: {
    root: sizeStyles.largeRoot,
    track: sizeStyles.largeTrack,
    knob: sizeStyles.largeKnob,
    knobChecked: sizeStyles.largeKnobChecked,
    label: typographyStyles.body1,
  },
} as const satisfies Record<ToggleSize, unknown>;

/**
 * Toggle(스위치) 컴포넌트 — 설정 on/off 용.
 * 네이티브 checkbox 를 감싸 role=switch 로 노출한다.
 * @component
 */
export const Toggle: FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  label,
  'aria-label': ariaLabel,
  xstyle,
}) => {
  const sx = SIZE[size];
  // input 은 시각적으로 숨겨져 있어 CSS 만으로는 "키보드 포커스인지"를 트랙에 전달할 수 없다.
  // :focus-visible 판정을 input 에서 읽어 트랙 스타일로 올린다
  const [focusVisible, setFocusVisible] = useState(false);
  const handleFocus = (event: FocusEvent<HTMLInputElement>) => setFocusVisible(event.target.matches(':focus-visible'));

  return (
    <label {...stylex.props(styles.root, sx.root, disabled && styles.rootDisabled, xstyle)}>
      <span
        {...stylex.props(
          styles.track,
          sx.track,
          checked && styles.trackChecked,
          focusVisible && styles.trackFocusVisible,
        )}
      >
        <input
          {...stylex.props(styles.input)}
          type='checkbox'
          role='switch'
          aria-checked={checked}
          aria-label={label ? undefined : ariaLabel}
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          onFocus={handleFocus}
          onBlur={() => setFocusVisible(false)}
        />
        <span aria-hidden='true' {...stylex.props(styles.knob, sx.knob, checked && sx.knobChecked)} />
      </span>
      {label && <span {...stylex.props(sx.label, styles.label)}>{label}</span>}
    </label>
  );
};

'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { FC } from 'react';
import { colorVars } from '../../style/tokens.stylex';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** 보이는 라벨. 없으면 aria-label 로 접근성 이름을 준다 */
  label?: string;
  'aria-label'?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 루트(label)에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const TRACK_WIDTH = '4.4rem';
const TRACK_HEIGHT = '2.4rem';
const KNOB_SIZE = '2rem';

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.8rem',
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
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT,
    backgroundColor: colorVars['--color-grayInactiveFilled'],
    transitionProperty: 'background-color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    outlineWidth: {
      default: 0,
      ':focus-within': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
  trackChecked: {
    backgroundColor: colorVars['--color-brandPrimary'],
  },
  knob: {
    position: 'absolute',
    top: '0.2rem',
    left: '0.2rem',
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: '50%',
    backgroundColor: colorVars['--color-white'],
    boxShadow: '0 0.1rem 0.3rem rgba(0, 0, 0, 0.25)',
    transitionProperty: 'transform',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    transform: 'translateX(0)',
  },
  knobChecked: {
    transform: `translateX(calc(${TRACK_WIDTH} - ${KNOB_SIZE} - 0.4rem))`,
  },
  label: {
    fontSize: '1.4rem',
    color: colorVars['--color-textPrimary'],
  },
});

/**
 * Toggle(스위치) 컴포넌트 — 설정 on/off 용.
 * 네이티브 checkbox 를 감싸 role=switch 로 노출한다.
 * @component
 */
export const Toggle: FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  'aria-label': ariaLabel,
  xstyle,
}) => {
  return (
    <label {...stylex.props(styles.root, disabled && styles.rootDisabled, xstyle)}>
      <span {...stylex.props(styles.track, checked && styles.trackChecked)}>
        <input
          {...stylex.props(styles.input)}
          type='checkbox'
          role='switch'
          aria-checked={checked}
          aria-label={label ? undefined : ariaLabel}
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span aria-hidden='true' {...stylex.props(styles.knob, checked && styles.knobChecked)} />
      </span>
      {label && <span {...stylex.props(styles.label)}>{label}</span>}
    </label>
  );
};

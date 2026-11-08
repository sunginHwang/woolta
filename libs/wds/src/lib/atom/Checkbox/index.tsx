'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ChangeEvent, FocusEvent, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/** 박스 small 16 / medium 20px */
export type CheckboxSize = 'small' | 'medium';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'checked' | 'defaultChecked'> {
  /** 제어 값 */
  checked?: boolean;
  /** 비제어 초기값 */
  defaultChecked?: boolean;
  /**
   * 부분 선택(대시). 하위 항목 일부만 선택됐을 때. `checked` 보다 우선해 표시된다
   * @default false
   */
  indeterminate?: boolean;
  /** 값이 바뀔 때. 두 번째 인자로 원본 이벤트를 준다 */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** 박스 오른쪽 라벨. 없으면 `aria-label` 로 접근성 이름을 준다 */
  label?: ReactNode;
  /** 라벨 아래 보조 설명 */
  description?: string;
  /**
   * 오류 상태 (예: 필수 약관 미동의). 테두리를 오류색으로 바꾼다
   * @default false
   */
  invalid?: boolean;
  /**
   * 크기 (박스 16 / 20px, 라벨 small1 / body3)
   * @default 'medium'
   */
  size?: CheckboxSize;
  /** 외부에서 주입하는 StyleX 스타일 — 루트(label)에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'flex-start',
    gap: '0.8rem',
    cursor: 'pointer',
    userSelect: 'none',
    color: colorVars['--color-textPrimary'],
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
  // 박스는 라벨 첫 줄 높이 안에서 세로 중앙에 오도록 line-height 만큼의 래퍼로 감싼다
  control: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  box: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderDefault'],
    borderRadius: '0.4rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textInverse'],
    transitionProperty: 'background-color, border-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
  },
  boxOn: {
    backgroundColor: colorVars['--color-interactivePrimary'],
    borderColor: colorVars['--color-interactivePrimary'],
  },
  boxInvalid: {
    borderColor: colorVars['--color-statusError'],
  },
  boxFocusVisible: {
    outlineWidth: '0.2rem',
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
  texts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    minWidth: 0,
  },
  description: { color: colorVars['--color-textTertiary'] },
});

const sizeStyles = stylex.create({
  smallControl: { height: '1.68rem' },
  mediumControl: { height: '1.96rem' },
  smallBox: { width: '1.6rem', height: '1.6rem' },
  mediumBox: { width: '2rem', height: '2rem' },
});

const SIZE = {
  small: {
    control: sizeStyles.smallControl,
    box: sizeStyles.smallBox,
    label: typographyStyles.small1Regular,
    icon: 10,
  },
  medium: { control: sizeStyles.mediumControl, box: sizeStyles.mediumBox, label: typographyStyles.body3, icon: 12 },
} as const satisfies Record<CheckboxSize, unknown>;

const assignRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    (ref as { current: T | null }).current = value;
  }
};

const CheckIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox='0 0 12 12' fill='none' aria-hidden='true'>
    <path
      d='M2.5 6.5l2.5 2.5 4.5-5'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const DashIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox='0 0 12 12' fill='none' aria-hidden='true'>
    <path d='M2.5 6h7' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
);

/**
 * 체크박스. 여러 항목을 독립적으로 켜고 끌 때 쓴다 (하나만 고르는 선택은 Radio).
 * 네이티브 input 을 감싸 키보드·스크린리더 동작은 그대로 두고 박스만 직접 그린다.
 * @component
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      indeterminate = false,
      onChange,
      label,
      description,
      invalid = false,
      size = 'medium',
      xstyle,
      className,
      disabled = false,
      id: idProp,
      'aria-label': ariaLabel,
      onFocus,
      onBlur,
      ...rest
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const id = idProp ?? `wds-checkbox-${generatedId}`;
    const descriptionId = `${id}-description`;

    const inputRef = useRef<HTMLInputElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        assignRef(forwardedRef, node);
      },
      [forwardedRef],
    );

    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
    const isChecked = isControlled ? checked : internalChecked;

    // 네이티브 indeterminate 는 속성이 아니라 프로퍼티라 effect 로 동기화한다
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const [focusVisible, setFocusVisible] = useState(false);
    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      setFocusVisible(event.target.matches(':focus-visible'));
      onFocus?.(event);
    };
    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setFocusVisible(false);
      onBlur?.(event);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalChecked(event.target.checked);
      }
      onChange?.(event.target.checked, event);
    };

    const sx = SIZE[size];
    const showOn = indeterminate || isChecked;
    const rootSx = stylex.props(styles.root, disabled && styles.rootDisabled, xstyle);

    return (
      <label
        htmlFor={id}
        {...rootSx}
        className={className ? `${rootSx.className ?? ''} ${className}` : rootSx.className}
      >
        <span {...stylex.props(styles.control, sx.control)}>
          <input
            {...rest}
            ref={setRefs}
            id={id}
            type='checkbox'
            checked={isChecked}
            disabled={disabled}
            aria-checked={indeterminate ? 'mixed' : isChecked}
            aria-invalid={invalid || undefined}
            aria-label={label ? undefined : ariaLabel}
            aria-describedby={description ? descriptionId : rest['aria-describedby']}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...stylex.props(styles.input)}
          />
          <span
            aria-hidden='true'
            {...stylex.props(
              styles.box,
              sx.box,
              showOn && styles.boxOn,
              invalid && !showOn && styles.boxInvalid,
              focusVisible && styles.boxFocusVisible,
            )}
          >
            {indeterminate ? <DashIcon size={sx.icon} /> : isChecked && <CheckIcon size={sx.icon} />}
          </span>
        </span>
        {(label || description) && (
          <span {...stylex.props(styles.texts)}>
            {label && <span {...stylex.props(sx.label)}>{label}</span>}
            {description && (
              <span id={descriptionId} {...stylex.props(typographyStyles.small1Regular, styles.description)}>
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

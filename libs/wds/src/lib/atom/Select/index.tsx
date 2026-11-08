'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ChangeEvent, FocusEvent, ReactNode, SelectHTMLAttributes } from 'react';
import { forwardRef, useId, useState } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/** 높이 medium 40 / large 52 */
export type SelectSize = 'medium' | 'large';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'value' | 'onChange' | 'prefix' | 'multiple'> {
  /** 필드 위에 보이는 라벨. 포커스 시 강조색으로 바뀐다 */
  label?: string;
  /** 필드 아래 도움말. `errorMessage` 가 있으면 그쪽이 우선한다 */
  description?: string;
  /** 오류 문구. 주어지면 invalid 상태가 되고 `role='alert'` 로 읽힌다 */
  errorMessage?: string;
  /**
   * 오류 상태. 문구 없이 테두리만 바꿀 때 쓴다
   * @default false
   */
  invalid?: boolean;
  /**
   * 크기 (높이 40 / 52px)
   * @default 'medium'
   */
  size?: SelectSize;
  /** 선택지 목록. 대신 `children` 으로 `<option>` 을 직접 넘겨도 된다 */
  options?: SelectOption[];
  /** 아무것도 고르지 않았을 때 보이는 문구. 선택 불가한 첫 option 으로 렌더링된다 */
  placeholder?: string;
  /** 제어 값. placeholder 를 보이려면 `''` 을 준다 */
  value?: string;
  /** 값이 바뀔 때. 두 번째 인자로 원본 이벤트를 준다 */
  onChange?: (value: string, event: ChangeEvent<HTMLSelectElement>) => void;
  /** 선택 앞 슬롯 (예: 아이콘) */
  prefix?: ReactNode;
  /**
   * 부모 폭을 꽉 채운다
   * @default true
   */
  fill?: boolean;
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
  children?: ReactNode;
}

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '0.6rem',
    minWidth: 0,
  },
  fill: { width: '100%' },
  label: {
    color: colorVars['--color-textTertiary'],
    transitionProperty: 'color',
    transitionDuration: '0.15s',
  },
  labelFocused: { color: colorVars['--color-textPrimary'] },
  labelInvalid: { color: colorVars['--color-statusError'] },
  field: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    minWidth: 0,
    color: colorVars['--color-textPrimary'],
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    boxShadow: 'inset 0 0 0 0 transparent',
    transitionProperty: 'background-color, box-shadow, border-color',
    transitionDuration: '0.1s',
    transitionTimingFunction: 'ease',
  },
  fieldFocused: {
    backgroundColor: colorVars['--color-bgSurface'],
    borderColor: colorVars['--color-borderFocus'],
    boxShadow: `inset 0 0 0 1px ${colorVars['--color-borderFocus']}`,
  },
  fieldInvalid: {
    borderColor: colorVars['--color-statusError'],
    boxShadow: `inset 0 0 0 1px ${colorVars['--color-statusError']}`,
  },
  fieldDisabled: {
    borderColor: colorVars['--color-borderFaint'],
    color: colorVars['--color-textDisabled'],
    cursor: 'not-allowed',
  },
  // 네이티브 select 를 투명하게 깔아 모바일 피커·키보드 동작을 그대로 쓴다
  select: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    paddingBlock: 0,
    paddingLeft: 0,
    paddingRight: '2.8rem',
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    textOverflow: 'ellipsis',
    ':disabled': { cursor: 'not-allowed' },
  },
  selectPlaceholder: { color: colorVars['--color-textTertiary'] },
  slot: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    color: colorVars['--color-textSecondary'],
  },
  slotDisabled: { color: colorVars['--color-textDisabled'] },
  chevron: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'inline-flex',
    pointerEvents: 'none',
    color: colorVars['--color-textSecondary'],
  },
  chevronDisabled: { color: colorVars['--color-textDisabled'] },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.8rem',
  },
  description: { color: colorVars['--color-textTertiary'] },
  error: { color: colorVars['--color-statusError'] },
});

const sizeStyles = stylex.create({
  mediumField: { minHeight: '4rem', borderRadius: '0.8rem', paddingInline: '1.4rem', gap: '0.8rem' },
  largeField: { minHeight: '5.2rem', borderRadius: '1.2rem', paddingInline: '1.6rem', gap: '1rem' },
  mediumChevron: { right: '1.4rem' },
  largeChevron: { right: '1.6rem' },
});

const SIZE = {
  medium: { field: sizeStyles.mediumField, chevron: sizeStyles.mediumChevron, text: typographyStyles.body2 },
  large: { field: sizeStyles.largeField, chevron: sizeStyles.largeChevron, text: typographyStyles.body1 },
} as const satisfies Record<SelectSize, unknown>;

const ChevronDownIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
    <path d='M4 6l4 4 4-4' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

/**
 * 선택 상자. 네이티브 `<select>` 를 TextInput 과 같은 껍데기로 감싼다 —
 * 모바일에서는 OS 피커가 뜨고 키보드·스크린리더 동작도 그대로다.
 *
 * 당근 SEED 의 Select Box 처럼 바텀시트로 고르는 형태가 필요하면
 * 뒤에 wds `BottomSheet.Menu` 위에 별도 변형으로 만든다.
 * @component
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      description,
      errorMessage,
      invalid = false,
      size = 'medium',
      options,
      placeholder,
      value,
      onChange,
      prefix,
      fill = true,
      xstyle,
      className,
      disabled = false,
      id: idProp,
      onFocus,
      onBlur,
      children,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? `wds-select-${generatedId}`;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;

    const [focused, setFocused] = useState(false);
    const isInvalid = invalid || Boolean(errorMessage);
    const isPlaceholder = placeholder !== undefined && (value === undefined || value === '');

    const handleFocus = (event: FocusEvent<HTMLSelectElement>) => {
      setFocused(true);
      onFocus?.(event);
    };
    const handleBlur = (event: FocusEvent<HTMLSelectElement>) => {
      setFocused(false);
      onBlur?.(event);
    };
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      onChange?.(event.target.value, event);
    };

    const describedBy =
      [description && !errorMessage ? descriptionId : null, errorMessage ? errorId : null].filter(Boolean).join(' ') ||
      undefined;

    const sx = SIZE[size];
    const rootSx = stylex.props(styles.root, fill && styles.fill, xstyle);

    return (
      <div {...rootSx} className={className ? `${rootSx.className ?? ''} ${className}` : rootSx.className}>
        {label && (
          <label
            htmlFor={id}
            {...stylex.props(
              typographyStyles.small1Regular,
              styles.label,
              focused && !isInvalid && styles.labelFocused,
              isInvalid && styles.labelInvalid,
            )}
          >
            {label}
          </label>
        )}
        <div
          {...stylex.props(
            styles.field,
            sx.text,
            sx.field,
            focused && !isInvalid && styles.fieldFocused,
            isInvalid && styles.fieldInvalid,
            disabled && styles.fieldDisabled,
          )}
        >
          {prefix && <span {...stylex.props(styles.slot, disabled && styles.slotDisabled)}>{prefix}</span>}
          <select
            {...rest}
            ref={ref}
            id={id}
            value={value}
            disabled={disabled}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...stylex.props(styles.select, isPlaceholder && styles.selectPlaceholder)}
          >
            {placeholder !== undefined && (
              <option value='' disabled hidden={value !== undefined && value !== ''}>
                {placeholder}
              </option>
            )}
            {options?.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
            {children}
          </select>
          <span {...stylex.props(styles.chevron, sx.chevron, disabled && styles.chevronDisabled)}>
            <ChevronDownIcon />
          </span>
        </div>
        {(errorMessage || description) && (
          <div {...stylex.props(typographyStyles.small1Regular, styles.footer)}>
            {errorMessage ? (
              <span id={errorId} role='alert' {...stylex.props(styles.error)}>
                {errorMessage}
              </span>
            ) : (
              <span id={descriptionId} {...stylex.props(styles.description)}>
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

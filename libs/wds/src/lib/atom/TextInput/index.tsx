'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ChangeEvent, FocusEvent, InputHTMLAttributes, KeyboardEvent, ReactNode, Ref } from 'react';
import { forwardRef, useCallback, useId, useRef, useState } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/**
 * - outline: 테두리가 있는 기본형. 폼에 입력이 여러 개일 때
 * - underline: 밑줄만. 화면에 입력이 하나뿐일 때 권장 (당근 SEED)
 */
export type TextInputVariant = 'outline' | 'underline';

/** 높이 medium 40 / large 52 */
export type TextInputSize = 'medium' | 'large';

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type' | 'value'> {
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
   * 테두리 형태
   * @default 'outline'
   */
  variant?: TextInputVariant;
  /**
   * 크기 (높이 40 / 52px)
   * @default 'medium'
   */
  size?: TextInputSize;
  /**
   * 입력 타입. `number` 는 스피너 없이 숫자 키패드만 띄우기 위해 text + inputMode=numeric 으로 렌더링한다
   * @default 'text'
   */
  type?: 'text' | 'number' | 'password' | 'email' | 'tel' | 'search' | 'url' | 'date';
  /** 제어 값 */
  value?: string | number;
  /** 입력 앞 슬롯 (예: ₩) */
  prefix?: ReactNode;
  /** 입력 뒤 슬롯 (예: 원). 지우기 버튼은 항상 suffix 앞에 놓인다 */
  suffix?: ReactNode;
  /**
   * 값이 있을 때 ✕ 지우기 버튼을 보인다. disabled·readOnly 에서는 숨긴다
   * @default true
   */
  clearable?: boolean;
  /** 지우기 버튼 클릭 시. 호출 뒤 포커스는 입력에 남는다 */
  onClear?: () => void;
  /**
   * `maxLength` 기준으로 "n/max" 글자 수를 보인다
   * @default false
   */
  showCount?: boolean;
  /** Enter 키 입력 시 */
  onEnter?: () => void;
  /**
   * Enter 키 입력 시 포커스를 해제한다 (모바일 키패드 닫기)
   * @default true
   */
  blurOnEnter?: boolean;
  /**
   * 부모 폭을 꽉 채운다
   * @default true
   */
  fill?: boolean;
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
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
  // 테두리는 항상 2px 자리를 차지한다 — 포커스로 두께가 바뀌어도 내용이 밀리지 않는다
  field: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    minWidth: 0,
    cursor: 'text',
    color: colorVars['--color-textPrimary'],
    transitionProperty: 'background-color, box-shadow, border-color',
    transitionDuration: '0.1s',
    transitionTimingFunction: 'ease',
  },
  fieldOutline: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    // 2px 포커스 테두리는 box-shadow(inset) 으로 그려 레이아웃을 고정한다
    boxShadow: 'inset 0 0 0 0 transparent',
  },
  fieldOutlineFocused: {
    backgroundColor: colorVars['--color-bgSurface'],
    borderColor: colorVars['--color-borderFocus'],
    boxShadow: `inset 0 0 0 1px ${colorVars['--color-borderFocus']}`,
  },
  fieldOutlineInvalid: {
    borderColor: colorVars['--color-statusError'],
    boxShadow: `inset 0 0 0 1px ${colorVars['--color-statusError']}`,
  },
  fieldOutlineDisabled: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    borderColor: colorVars['--color-borderFaint'],
    cursor: 'not-allowed',
  },
  fieldOutlineReadOnly: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  fieldUnderline: {
    backgroundColor: 'transparent',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
    boxShadow: 'inset 0 0 0 transparent',
    borderRadius: 0,
    paddingInline: 0,
  },
  fieldUnderlineFocused: {
    borderBottomColor: colorVars['--color-borderFocus'],
    boxShadow: `inset 0 -1px 0 ${colorVars['--color-borderFocus']}`,
  },
  fieldUnderlineInvalid: {
    borderBottomColor: colorVars['--color-statusError'],
    boxShadow: `inset 0 -1px 0 ${colorVars['--color-statusError']}`,
  },
  fieldUnderlineDisabled: {
    borderBottomColor: colorVars['--color-borderFaint'],
    cursor: 'not-allowed',
  },
  fieldDisabledText: { color: colorVars['--color-textDisabled'] },
  fieldReadOnlyText: { color: colorVars['--color-textSecondary'] },
  input: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    paddingBlock: 0,
    paddingInline: 0,
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    // 네이티브 input 은 UA 의 font 를 따로 가져 wrapper 의 타이포가 상속되지 않는다
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    fontWeight: 'inherit',
    outline: 'none',
    '::placeholder': { color: colorVars['--color-textTertiary'] },
    ':disabled': { cursor: 'not-allowed' },
  },
  slot: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    color: colorVars['--color-textSecondary'],
  },
  slotDisabled: { color: colorVars['--color-textDisabled'] },
  clearButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '2rem',
    height: '2rem',
    padding: 0,
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '50%',
    backgroundColor: colorVars['--color-textTertiary'],
    color: colorVars['--color-textInverse'],
    cursor: 'pointer',
    opacity: {
      default: 0.7,
      ':hover': 1,
    },
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.8rem',
  },
  description: { color: colorVars['--color-textTertiary'] },
  error: { color: colorVars['--color-statusError'] },
  count: {
    marginLeft: 'auto',
    flexShrink: 0,
    color: colorVars['--color-textTertiary'],
    fontVariantNumeric: 'tabular-nums',
  },
  countOver: { color: colorVars['--color-statusError'] },
});

const sizeStyles = stylex.create({
  mediumField: { minHeight: '4rem', borderRadius: '0.8rem', paddingInline: '1.4rem', gap: '0.8rem' },
  largeField: { minHeight: '5.2rem', borderRadius: '1.2rem', paddingInline: '1.6rem', gap: '1rem' },
  mediumUnderlineField: { minHeight: '4rem', paddingInline: 0 },
  largeUnderlineField: { minHeight: '5.2rem', paddingInline: 0 },
});

const SIZE = {
  medium: {
    field: sizeStyles.mediumField,
    underline: sizeStyles.mediumUnderlineField,
    text: typographyStyles.body2,
    clear: '1.4rem',
  },
  large: {
    field: sizeStyles.largeField,
    underline: sizeStyles.largeUnderlineField,
    text: typographyStyles.body1,
    clear: '1.6rem',
  },
} as const satisfies Record<TextInputSize, unknown>;

/** 두 ref 를 하나의 콜백 ref 로 합친다 */
const assignRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    (ref as { current: T | null }).current = value;
  }
};

const ClearIcon = () => (
  <svg width='10' height='10' viewBox='0 0 10 10' fill='none' aria-hidden='true'>
    <path d='M2 2l6 6M8 2l-6 6' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
  </svg>
);

/**
 * 한 줄 텍스트 입력. woolbank 의 BaseInput/FormInput 을 공용화하고 당근 SEED Text Input 의 상태 체계를 따른다.
 *
 * - 라벨·도움말·오류·글자 수를 한 묶음으로 그리고 `aria-describedby` 로 연결한다.
 * - 포커스 테두리는 box-shadow 로 그려 두께가 바뀌어도 내용이 밀리지 않는다.
 * - 전화번호처럼 형식이 정해진 값은 Input 을 나누지 말고 하나에서 포맷을 적용한다 (SEED).
 * @component
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      description,
      errorMessage,
      invalid = false,
      variant = 'outline',
      size = 'medium',
      type = 'text',
      value,
      prefix,
      suffix,
      clearable = true,
      onClear,
      showCount = false,
      onEnter,
      blurOnEnter = true,
      fill = true,
      xstyle,
      className,
      disabled = false,
      readOnly = false,
      maxLength,
      id: idProp,
      onFocus,
      onBlur,
      onKeyDown,
      onChange,
      ...rest
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const id = idProp ?? `wds-input-${generatedId}`;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;
    const countId = `${id}-count`;

    const inputRef = useRef<HTMLInputElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        assignRef(forwardedRef, node);
      },
      [forwardedRef],
    );

    const [focused, setFocused] = useState(false);

    const isInvalid = invalid || Boolean(errorMessage);
    const stringValue = value === undefined || value === null ? '' : String(value);
    const hasValue = stringValue.length > 0;
    const showClear = clearable && hasValue && !disabled && !readOnly;
    const showCounter = showCount && typeof maxLength === 'number';
    const isOver = showCounter && stringValue.length > (maxLength ?? 0);

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
        onEnter?.();
        if (blurOnEnter) {
          inputRef.current?.blur();
        }
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
    };

    const handleClear = () => {
      onClear?.();
      inputRef.current?.focus();
    };

    // number 는 스피너·휠 변경을 피하고 숫자 키패드만 띄운다 (woolbank 관례)
    const numeric = type === 'number';
    const inputType = numeric ? 'text' : type;

    const describedBy =
      [description && !errorMessage ? descriptionId : null, errorMessage ? errorId : null, showCounter ? countId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    const sx = SIZE[size];
    const isOutline = variant === 'outline';

    const focusInput = () => {
      if (!disabled) {
        inputRef.current?.focus();
      }
    };

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
        {/* 필드 전체를 눌러도 입력에 포커스가 가게 한다 */}
        <div
          onClick={focusInput}
          {...stylex.props(
            styles.field,
            sx.text,
            isOutline ? sx.field : sx.underline,
            isOutline ? styles.fieldOutline : styles.fieldUnderline,
            isOutline && focused && !isInvalid && styles.fieldOutlineFocused,
            !isOutline && focused && !isInvalid && styles.fieldUnderlineFocused,
            isOutline && isInvalid && styles.fieldOutlineInvalid,
            !isOutline && isInvalid && styles.fieldUnderlineInvalid,
            isOutline && readOnly && styles.fieldOutlineReadOnly,
            isOutline && disabled && styles.fieldOutlineDisabled,
            !isOutline && disabled && styles.fieldUnderlineDisabled,
            readOnly && styles.fieldReadOnlyText,
            disabled && styles.fieldDisabledText,
          )}
        >
          {prefix && <span {...stylex.props(styles.slot, disabled && styles.slotDisabled)}>{prefix}</span>}
          <input
            {...rest}
            ref={setRefs}
            id={id}
            type={inputType}
            inputMode={numeric ? 'numeric' : rest.inputMode}
            pattern={numeric ? '[0-9]*' : rest.pattern}
            value={value}
            maxLength={maxLength}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            autoComplete={rest.autoComplete ?? 'off'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            {...stylex.props(styles.input)}
          />
          {showClear && (
            <button
              type='button'
              aria-label='입력 지우기'
              // mousedown 에서 포커스를 뺏지 않아야 blur → clear 순서가 뒤집히지 않는다
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleClear}
              {...stylex.props(styles.clearButton)}
            >
              <ClearIcon />
            </button>
          )}
          {suffix && <span {...stylex.props(styles.slot, disabled && styles.slotDisabled)}>{suffix}</span>}
        </div>
        {(errorMessage || description || showCounter) && (
          <div {...stylex.props(typographyStyles.small1Regular, styles.footer)}>
            {errorMessage ? (
              <span id={errorId} role='alert' {...stylex.props(styles.error)}>
                {errorMessage}
              </span>
            ) : (
              description && (
                <span id={descriptionId} {...stylex.props(styles.description)}>
                  {description}
                </span>
              )
            )}
            {showCounter && (
              <span id={countId} aria-live='polite' {...stylex.props(styles.count, isOver && styles.countOver)}>
                {stringValue.length}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ChangeEvent, FocusEvent, Ref, TextareaHTMLAttributes } from 'react';
import { forwardRef, useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/**
 * - outline: 테두리가 있는 기본형
 * - underline: 밑줄만. 화면에 입력이 하나뿐일 때 권장 (당근 SEED)
 */
export type TextareaVariant = 'outline' | 'underline';

/** medium: paddingY 12 · body2 · radius 8 / large: paddingY 14 · body1 · radius 12 */
export type TextareaSize = 'medium' | 'large';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'rows'> {
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
  variant?: TextareaVariant;
  /**
   * 크기
   * @default 'medium'
   */
  size?: TextareaSize;
  /** 제어 값 */
  value?: string;
  /**
   * 내용에 따라 높이가 자란다 (SEED Auto Size). `minRows` 부터 `maxRows` 까지
   * @default true
   */
  autoSize?: boolean;
  /**
   * autoSize 일 때 최소 줄 수 (SEED: 3줄)
   * @default 3
   */
  minRows?: number;
  /** autoSize 일 때 최대 줄 수. 넘으면 안에서 스크롤한다 */
  maxRows?: number;
  /**
   * autoSize 가 아닐 때 고정 줄 수 (SEED: 최소 2줄). 넘치는 내용은 안에서 스크롤한다
   * @default 2
   */
  rows?: number;
  /**
   * `maxLength` 기준으로 "n/max" 글자 수를 보인다
   * @default false
   */
  showCount?: boolean;
  /**
   * 사용자가 모서리를 끌어 높이를 바꿀 수 있는지
   * @default 'none'
   */
  resize?: 'none' | 'vertical';
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
  field: {
    display: 'flex',
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
  textarea: {
    display: 'block',
    flex: 1,
    width: '100%',
    minWidth: 0,
    paddingBlock: 0,
    paddingInline: 0,
    marginBlock: 0,
    marginInline: 0,
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    // textarea 는 UA 폰트를 가져 부모의 typography 를 상속하지 않는다 — 명시적으로 상속시켜야 줄 높이 측정이 맞는다
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    fontWeight: 'inherit',
    outline: 'none',
    overflowY: 'auto',
    '::placeholder': { color: colorVars['--color-textTertiary'] },
    ':disabled': { cursor: 'not-allowed' },
  },
  resizeNone: { resize: 'none' },
  resizeVertical: { resize: 'vertical' },
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
  mediumField: { borderRadius: '0.8rem', paddingInline: '1.4rem', paddingBlock: '1.2rem' },
  largeField: { borderRadius: '1.2rem', paddingInline: '1.6rem', paddingBlock: '1.4rem' },
  mediumUnderlineField: { paddingInline: 0, paddingBlock: '1.2rem' },
  largeUnderlineField: { paddingInline: 0, paddingBlock: '1.4rem' },
});

const dynamic = stylex.create({
  height: (height: string) => ({ height }),
  maxHeight: (maxHeight: string) => ({ maxHeight }),
});

const SIZE = {
  medium: { field: sizeStyles.mediumField, underline: sizeStyles.mediumUnderlineField, text: typographyStyles.body2 },
  large: { field: sizeStyles.largeField, underline: sizeStyles.largeUnderlineField, text: typographyStyles.body1 },
} as const satisfies Record<TextareaSize, unknown>;

const assignRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    (ref as { current: T | null }).current = value;
  }
};

/** 렌더된 line-height(px). 'normal' 이면 font-size × 1.2 로 근사한다 */
const readLineHeight = (element: HTMLTextAreaElement) => {
  const computed = getComputedStyle(element);
  const lineHeight = Number.parseFloat(computed.lineHeight);
  if (!Number.isNaN(lineHeight)) return lineHeight;
  const fontSize = Number.parseFloat(computed.fontSize);
  return Number.isNaN(fontSize) ? 0 : fontSize * 1.2;
};

/**
 * 여러 줄 텍스트 입력. TextInput 과 같은 껍데기(라벨·도움말·오류·글자 수)를 쓰고
 * 당근 SEED Textarea 의 Auto Size 규칙을 따른다.
 *
 * - `autoSize`(기본): `minRows`(3줄) 부터 내용에 맞춰 자라고 `maxRows` 를 넘으면 안에서 스크롤한다.
 * - `autoSize={false}`: `rows`(2줄) 고정. 넘치는 내용은 안에서 스크롤한다.
 * @component
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      errorMessage,
      invalid = false,
      variant = 'outline',
      size = 'medium',
      value,
      autoSize = true,
      minRows = 3,
      maxRows,
      rows = 2,
      showCount = false,
      resize = 'none',
      fill = true,
      xstyle,
      className,
      disabled = false,
      readOnly = false,
      maxLength,
      id: idProp,
      onFocus,
      onBlur,
      onChange,
      ...rest
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const id = idProp ?? `wds-textarea-${generatedId}`;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;
    const countId = `${id}-count`;

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        assignRef(forwardedRef, node);
      },
      [forwardedRef],
    );

    const [focused, setFocused] = useState(false);
    const [autoHeight, setAutoHeight] = useState<string | null>(null);

    const isInvalid = invalid || Boolean(errorMessage);
    const stringValue = value ?? '';
    const showCounter = showCount && typeof maxLength === 'number';
    const isOver = showCounter && stringValue.length > (maxLength ?? 0);

    // autoSize: 높이를 0 으로 되돌린 뒤 scrollHeight 를 읽어 minRows~maxRows 사이로 맞춘다
    // biome-ignore lint/correctness/useExhaustiveDependencies: 값·크기가 바뀔 때마다 다시 재야 한다
    useLayoutEffect(() => {
      const element = textareaRef.current;
      if (!autoSize || !element) return;

      const lineHeight = readLineHeight(element);
      if (!lineHeight) return;

      const previous = element.style.height;
      element.style.height = '0px';
      const contentHeight = element.scrollHeight;
      element.style.height = previous;

      const min = lineHeight * minRows;
      const max = maxRows ? lineHeight * maxRows : Number.POSITIVE_INFINITY;
      setAutoHeight(`${Math.min(Math.max(contentHeight, min), max)}px`);
    }, [autoSize, minRows, maxRows, stringValue, size]);

    const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
      setFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
      setFocused(false);
      onBlur?.(event);
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
    };

    const describedBy =
      [description && !errorMessage ? descriptionId : null, errorMessage ? errorId : null, showCounter ? countId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    const sx = SIZE[size];
    const isOutline = variant === 'outline';
    const rootSx = stylex.props(styles.root, fill && styles.fill, xstyle);

    const focusTextarea = () => {
      if (!disabled) {
        textareaRef.current?.focus();
      }
    };

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
          onClick={focusTextarea}
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
          <textarea
            {...rest}
            ref={setRefs}
            id={id}
            value={value}
            rows={autoSize ? minRows : rows}
            maxLength={maxLength}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...stylex.props(
              styles.textarea,
              resize === 'vertical' ? styles.resizeVertical : styles.resizeNone,
              autoSize && autoHeight !== null && dynamic.height(autoHeight),
              autoSize && maxRows !== undefined && dynamic.maxHeight(`${maxRows}lh`),
            )}
          />
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

Textarea.displayName = 'Textarea';

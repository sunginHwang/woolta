'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ChangeEvent, FocusEvent, InputHTMLAttributes, ReactNode } from 'react';
import { createContext, forwardRef, useContext, useId, useState } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/** 원 small 16 / medium 20px */
export type RadioSize = 'small' | 'medium';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  disabled: boolean;
  invalid: boolean;
  size: RadioSize;
  describedBy?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  /** 같은 그룹임을 묶는 name. 없으면 자동 생성 */
  name?: string;
  /** 선택된 값 (제어) */
  value?: string;
  /** 선택이 바뀔 때 */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** 그룹 제목. `<legend>` 로 읽힌다 */
  label?: string;
  /** 제목 아래 도움말 */
  description?: string;
  /** 오류 문구. 주어지면 모든 항목이 invalid 가 되고 `role='alert'` 로 읽힌다 */
  errorMessage?: string;
  /**
   * 항목 배치 방향
   * @default 'column'
   */
  direction?: 'column' | 'row';
  /**
   * 그룹 전체 비활성
   * @default false
   */
  disabled?: boolean;
  /**
   * 모든 항목의 크기
   * @default 'medium'
   */
  size?: RadioSize;
  /** 외부에서 주입하는 StyleX 스타일 — fieldset 에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
  children?: ReactNode;
}

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'value' | 'checked'> {
  /** 이 항목의 값. 그룹 `value` 와 같으면 선택된다 */
  value: string;
  /** 원 오른쪽 라벨 */
  label: ReactNode;
  /** 라벨 아래 보조 설명 */
  description?: string;
  /**
   * 이 항목만 비활성
   * @default false
   */
  disabled?: boolean;
  /** 크기. 그룹에서 정한 값을 덮어쓴다 */
  size?: RadioSize;
  /** 외부에서 주입하는 StyleX 스타일 — 루트(label)에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const groupStyles = stylex.create({
  fieldset: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    minWidth: 0,
    marginBlock: 0,
    marginInline: 0,
    paddingBlock: 0,
    paddingInline: 0,
    borderWidth: 0,
    borderStyle: 'none',
  },
  legend: {
    paddingInline: 0,
    marginBottom: '0.2rem',
    color: colorVars['--color-textTertiary'],
  },
  legendInvalid: { color: colorVars['--color-statusError'] },
  items: { display: 'flex', gap: '1.2rem' },
  itemsColumn: { flexDirection: 'column' },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: '2rem' },
  description: { color: colorVars['--color-textTertiary'] },
  error: { color: colorVars['--color-statusError'] },
});

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
  control: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  circle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderDefault'],
    borderRadius: '50%',
    backgroundColor: colorVars['--color-bgSurface'],
    transitionProperty: 'border-color',
    transitionDuration: '0.15s',
  },
  circleChecked: {
    borderWidth: '2px',
    borderColor: colorVars['--color-interactivePrimary'],
  },
  circleInvalid: {
    borderColor: colorVars['--color-statusError'],
  },
  circleFocusVisible: {
    outlineWidth: '0.2rem',
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
  dot: {
    borderRadius: '50%',
    backgroundColor: colorVars['--color-interactivePrimary'],
    transform: 'scale(0)',
    transitionProperty: 'transform',
    transitionDuration: '0.15s',
  },
  dotChecked: { transform: 'scale(1)' },
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
  smallCircle: { width: '1.6rem', height: '1.6rem' },
  mediumCircle: { width: '2rem', height: '2rem' },
  smallDot: { width: '0.6rem', height: '0.6rem' },
  mediumDot: { width: '0.8rem', height: '0.8rem' },
});

const SIZE = {
  small: {
    control: sizeStyles.smallControl,
    circle: sizeStyles.smallCircle,
    dot: sizeStyles.smallDot,
    label: typographyStyles.small1Regular,
  },
  medium: {
    control: sizeStyles.mediumControl,
    circle: sizeStyles.mediumCircle,
    dot: sizeStyles.mediumDot,
    label: typographyStyles.body3,
  },
} as const satisfies Record<RadioSize, unknown>;

/**
 * 라디오 그룹. 여러 항목 중 하나만 고를 때 쓴다 (독립적으로 켜고 끄는 것은 Checkbox).
 * `<fieldset>` + `<legend>` 로 묶여 스크린리더가 그룹 제목을 읽고, 같은 `name` 을 공유해
 * 방향키 이동은 네이티브 동작 그대로다.
 * @component
 */
export const RadioGroup = ({
  name: nameProp,
  value,
  onChange,
  label,
  description,
  errorMessage,
  direction = 'column',
  disabled = false,
  size = 'medium',
  xstyle,
  children,
}: RadioGroupProps) => {
  const generatedId = useId();
  const name = nameProp ?? `wds-radio-${generatedId}`;
  const descriptionId = `${name}-description`;
  const errorId = `${name}-error`;
  const invalid = Boolean(errorMessage);
  const describedBy = [description ? descriptionId : null, errorMessage ? errorId : null].filter(Boolean).join(' ');

  return (
    <RadioGroupContext.Provider
      value={{ name, value, disabled, invalid, size, onChange, describedBy: describedBy || undefined }}
    >
      <fieldset disabled={disabled} aria-invalid={invalid || undefined} {...stylex.props(groupStyles.fieldset, xstyle)}>
        {label && (
          <legend
            {...stylex.props(typographyStyles.small1Regular, groupStyles.legend, invalid && groupStyles.legendInvalid)}
          >
            {label}
          </legend>
        )}
        {description && (
          <span id={descriptionId} {...stylex.props(typographyStyles.small1Regular, groupStyles.description)}>
            {description}
          </span>
        )}
        <div
          role='presentation'
          {...stylex.props(groupStyles.items, direction === 'row' ? groupStyles.itemsRow : groupStyles.itemsColumn)}
        >
          {children}
        </div>
        {errorMessage && (
          <span id={errorId} role='alert' {...stylex.props(typographyStyles.small1Regular, groupStyles.error)}>
            {errorMessage}
          </span>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
};

/**
 * 라디오 항목. 반드시 `RadioGroup` 안에서 쓴다.
 * @component
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      label,
      description,
      disabled = false,
      size: sizeProp,
      xstyle,
      className,
      id: idProp,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const group = useContext(RadioGroupContext);
    const generatedId = useId();
    const id = idProp ?? `wds-radio-item-${generatedId}`;
    const descriptionId = `${id}-description`;

    const size = sizeProp ?? group?.size ?? 'medium';
    const isDisabled = disabled || Boolean(group?.disabled);
    const isChecked = group?.value !== undefined && group.value === value;
    const invalid = Boolean(group?.invalid);

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
      if (event.target.checked) {
        group?.onChange?.(value, event);
      }
    };

    const describedBy = [description ? descriptionId : null, group?.describedBy ?? null].filter(Boolean).join(' ');
    const sx = SIZE[size];
    const rootSx = stylex.props(styles.root, isDisabled && styles.rootDisabled, xstyle);

    return (
      <label
        htmlFor={id}
        {...rootSx}
        className={className ? `${rootSx.className ?? ''} ${className}` : rootSx.className}
      >
        <span {...stylex.props(styles.control, sx.control)}>
          <input
            {...rest}
            ref={ref}
            id={id}
            type='radio'
            name={group?.name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy || undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...stylex.props(styles.input)}
          />
          <span
            aria-hidden='true'
            {...stylex.props(
              styles.circle,
              sx.circle,
              isChecked && styles.circleChecked,
              invalid && !isChecked && styles.circleInvalid,
              focusVisible && styles.circleFocusVisible,
            )}
          >
            <span {...stylex.props(styles.dot, sx.dot, isChecked && styles.dotChecked)} />
          </span>
        </span>
        <span {...stylex.props(styles.texts)}>
          <span {...stylex.props(sx.label)}>{label}</span>
          {description && (
            <span id={descriptionId} {...stylex.props(typographyStyles.small1Regular, styles.description)}>
              {description}
            </span>
          )}
        </span>
      </label>
    );
  },
);

Radio.displayName = 'Radio';

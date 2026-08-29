'use client';

import { mergeRefs } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type MouseEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import { IconCloseCircle } from '../../icons';

interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'type' | 'name' | 'maxLength' | 'onFocus' | 'onBlur' | 'onClick' | 'onChange' | 'readOnly'
  > {
  label?: string;
  value?: string | number;
  type?: 'text' | 'number' | 'date' | 'range';
  name?: string;
  maxLength?: number;
  readOnly?: boolean;
  useLengthInfo?: boolean;
  disable?: boolean;
  dataType?: string;
  isShowCloseBtn?: boolean;
  onClear?: (e: MouseEvent<HTMLLIElement>) => void;
  onFocusIn?: () => void;
  onFocusOut?: () => void;
  onKeyPressEnter?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

/**
 * 공통 - 인풋 - 레거시
 * @component
 */
export const BaseInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      value,
      name,
      type = 'text',
      maxLength = 999,
      useLengthInfo = false,
      dataType = '',
      readOnly,
      isShowCloseBtn = true,
      disable = false,
      onClear,
      onClick,
      onChange,
      onKeyPressEnter,
      onFocusIn,
      onFocusOut,
      ...rest
    },
    parentRef,
  ) => {
    const isExistInputValue = value !== '' && isShowCloseBtn && !disable;
    const inputRef = useRef<HTMLInputElement>(null);
    const [focus, setFocus] = useState(false);
    const { onKeyUp, ...restInputProps } = rest;

    const handleFocus = useCallback(() => {
      setFocus(true);
      onFocusIn && onFocusIn();
    }, [onFocusIn]);

    const handleBlur = useCallback(() => {
      setFocus(false);
      inputRef.current && inputRef.current.blur();
      onFocusOut && onFocusOut();
    }, [onFocusOut]);

    const handleInputClear = (e: React.MouseEvent<HTMLLIElement>) => {
      onClear && onClear(e);
      e.stopPropagation();
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleBlur();
        onKeyPressEnter && onKeyPressEnter();
      }

      onKeyUp?.(e);
    };

    const valueLength = String(value).length;

    const defaultProps =
      type === 'number'
        ? {
            inputmode: 'numeric',
            pattern: '[0-9]*',
          }
        : {};

    return (
      <>
        <div
          {...stylex.props(styles.container)}
          ref={parentRef}
          onClick={onClick}
          data-type={dataType === '' ? name : dataType}
        >
          {label && (
            <Text variant='small1Regular' color={focus ? 'orangePrimary' : 'textTertiary'} as='label' mb={8}>
              {label}
            </Text>
          )}
          <input
            {...stylex.props(typographyStyles.body1, styles.input, focus ? styles.inputFocus : styles.inputBlur)}
            ref={mergeRefs([inputRef, parentRef])}
            data-cy={name}
            type={type === 'number' ? 'text' : type}
            name={name}
            maxLength={maxLength}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            autoComplete='off'
            disabled={disable}
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            {...defaultProps}
            {...restInputProps}
          />
          {isExistInputValue && (
            <i
              {...stylex.props(styles.clearIcon)}
              onClick={handleInputClear}
              data-type={dataType === '' ? name : dataType}
            >
              <IconCloseCircle width={24} height={28} fill={colorVars['--color-textTertiary']} />
            </i>
          )}
        </div>
        {useLengthInfo && (
          <p {...stylex.props(styles.valueLength)}>
            {valueLength}/{maxLength}자
          </p>
        )}
      </>
    );
  },
);

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  input: {
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    borderRadius: '0.8rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    height: '4rem',
    color: colorVars['--color-textPrimary'],
  },
  inputFocus: {
    backgroundColor: colorVars['--color-bgSurface'],
  },
  inputBlur: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  clearIcon: {
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: '1.2rem',
    bottom: 0,
    opacity: 0.5,
  },
  valueLength: {
    fontSize: '1.2rem',
    color: colorVars['--color-textDisabled'],
  },
});

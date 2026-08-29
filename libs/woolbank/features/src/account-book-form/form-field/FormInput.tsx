'use client';

import { mergeRefs } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import { ChangeEvent, InputHTMLAttributes, MouseEvent, forwardRef, useCallback, useRef, useState } from 'react';
import { IconChevronRight, IconCloseCircle } from '../../_shared/icons';

interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'type' | 'name' | 'maxLength' | 'onFocus' | 'onBlur' | 'onClick' | 'onChange' | 'readOnly'
  > {
  value?: string | number;
  type?: 'text' | 'number' | 'date' | 'range';
  name?: string;
  maxLength?: number;
  readOnly?: boolean;
  useLengthInfo?: boolean;
  disable?: boolean;
  dataType?: string;
  isShowCloseBtn?: boolean;
  enterKeyHint?: 'search' | 'enter' | 'done' | 'go' | 'next' | 'previous' | 'send';
  onClear?: (e: MouseEvent<HTMLLIElement>) => void;
  onFocusIn?: () => void;
  onFocusOut?: () => void;
  onKeyPressEnter?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
      name,
      type = 'text',
      maxLength = 999,
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
    const inputRef = useRef<HTMLInputElement>(null);
    const [focus, setFocus] = useState(false);
    const { onKeyUp, ...restInputProps } = rest;

    const handleFocus = useCallback(() => {
      setFocus(true);
      onFocusIn?.();
    }, [onFocusIn]);

    const handleBlur = useCallback(() => {
      setFocus(false);
      inputRef.current?.blur();
      onFocusOut?.();
    }, [onFocusOut]);

    const handleInputClear = (e: React.MouseEvent<HTMLLIElement>) => {
      onClear?.(e);
      e.stopPropagation();
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleBlur();
        onKeyPressEnter?.();
      }
      onKeyUp?.(e);
    };

    const isExistInputValue = value !== '' && isShowCloseBtn && !disable && focus;

    return (
      <div {...stylex.props(styles.container)} ref={parentRef} onClick={onClick} data-type={dataType === '' ? name : dataType}>
        <input
          {...stylex.props(typographyStyles.body2, styles.input)}
          ref={mergeRefs([inputRef, parentRef])}
          data-cy={name}
          type={type}
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
          {...restInputProps}
        />
        {isExistInputValue ? (
          <i {...stylex.props(styles.icon, styles.trashIcon)} onClick={handleInputClear} data-type={dataType === '' ? name : dataType}>
            <IconCloseCircle width={16} height={16} fill={colorVars['--color-textTertiary']} />
          </i>
        ) : (
          <i {...stylex.props(styles.icon)}>
            <IconChevronRight width={16} height={16} fill={colorVars['--color-textTertiary']} />
          </i>
        )}
      </div>
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
    background: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    height: '4rem',
    color: colorVars['--color-textPrimary'],
    '::placeholder': {
      fontSize: '15px',
      lineHeight: '21px',
      fontWeight: 400,
      color: colorVars['--color-textDisabled'],
    },
  },
  icon: {
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: '1.3rem',
    width: '1.6rem',
    height: '1.6rem',
  },
  trashIcon: {
    opacity: 0.5,
  },
});

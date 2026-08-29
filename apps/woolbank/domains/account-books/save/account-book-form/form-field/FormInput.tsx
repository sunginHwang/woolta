'use client';

import { mergeRefs } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type MouseEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import { IconCloseCircle } from '../../../../../components/atom/Icon';
import { IconChevronRight } from '../../../../../components/atom/Icon/ChevronRight';

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

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    marginBlock: '1rem',
    marginInline: 0,
  },
  input: {
    fontSize: '15px',
    lineHeight: '21px',
    fontWeight: 400,
    borderStyle: 'none',
    height: '4rem',
    color: colorVars['--color-gray900'],
    '::placeholder': {
      fontSize: '15px',
      lineHeight: '21px',
      fontWeight: 400,
      color: colorVars['--color-gray500'],
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
  trash: {
    opacity: 0.5,
  },
});

export const FormInput = forwardRef<HTMLInputElement, Props>(
  (
    {
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
    const isExistInputValue = value !== '' && isShowCloseBtn && !disable && focus;

    return (
      <div
        {...stylex.props(styles.container)}
        ref={parentRef}
        onClick={onClick}
        data-type={dataType === '' ? name : dataType}
      >
        <input
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
          onInput={(e) => e.preventDefault()}
          {...restInputProps}
          {...stylex.props(styles.input)}
        />
        {isExistInputValue ? (
          <i
            {...stylex.props(styles.icon, styles.trash)}
            onClick={handleInputClear}
            data-type={dataType === '' ? name : dataType}
          >
            <IconCloseCircle width={16} height={16} fill='#958d9e' />
          </i>
        ) : (
          <i {...stylex.props(styles.icon)}>
            <IconChevronRight width={16} height={16} fill={colors.gray600} />
          </i>
        )}
      </div>
    );
  },
);

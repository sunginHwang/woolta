'use client';

import { mergeRefs } from '@common';
import { typography } from '@wds';
import { ChangeEvent, HtmlHTMLAttributes, MouseEvent, forwardRef, useCallback, useRef, useState } from 'react';
import { styled, useTheme } from 'styled-components';
import { IconChevronRight, IconCloseCircle } from '../../_shared/icons';

interface Props
  extends Omit<
    HtmlHTMLAttributes<HTMLInputElement>,
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
    const { colors } = useTheme();
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
      <SC.Container ref={parentRef} $isFocus={focus} onClick={onClick} data-type={dataType === '' ? name : dataType}>
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
          {...restInputProps}
        />
        {isExistInputValue ? (
          <i className='trash' onClick={handleInputClear} data-type={dataType === '' ? name : dataType}>
            <IconCloseCircle width={16} height={16} fill={colors.textTertiary} />
          </i>
        ) : (
          <i>
            <IconChevronRight width={16} height={16} fill={colors.textTertiary} />
          </i>
        )}
      </SC.Container>
    );
  },
);

const SC = {
  Container: styled.div<{ $isFocus: boolean }>`
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 1rem 0;

    .trash {
      opacity: 0.5;
    }

    input {
      background: transparent;

      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 100rem ${({ theme }) => theme.colors.bgSurface} inset;
        -webkit-text-fill-color: ${({ theme }) => theme.colors.textPrimary};
        transition: background-color 9999s ease-out;
      }
      ${typography.body2}
      border: none;
      height: 4rem;
      color: ${({ theme }) => theme.colors.textPrimary};

      &::placeholder {
        ${typography.body2}
        color: ${({ theme }) => theme.colors.textDisabled};
      }
    }

    i {
      cursor: pointer;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 0;
      bottom: 1.3rem;
      width: 1.6rem;
      height: 1.6rem;
    }
  `,
};

import { mergeRefs } from '@common';
import { Text, typography } from '@wds';
import { ChangeEvent, HtmlHTMLAttributes, MouseEvent, forwardRef, useCallback, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { IconCloseCircle } from '../atom/Icon';

interface Props
  extends Omit<
    HtmlHTMLAttributes<HTMLInputElement>,
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

    // ios 는 number 타입 안먹기때문에 추가 option 처리
    const defaultProps =
      type === 'number'
        ? {
            inputmode: 'numeric',
            pattern: '[0-9]*',
          }
        : {};

    return (
      <>
        <SC.Container ref={parentRef} $isFocus={focus} onClick={onClick} data-type={dataType === '' ? name : dataType}>
          {label && (
            <Text variant='small1Regular' color={focus ? 'orangePrimary' : 'gray600'} as='label' mb={8}>
              {label}
            </Text>
          )}
          <input
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
            <i onClick={handleInputClear} data-type={dataType === '' ? name : dataType}>
              <IconCloseCircle width={24} height={28} fill='#958d9e' />
            </i>
          )}
        </SC.Container>
        {useLengthInfo && (
          <SC.ValueLength>
            {valueLength}/{maxLength}자
          </SC.ValueLength>
        )}
      </>
    );
  },
);

const SC = {
  Container: styled.div<{ $isFocus: boolean }>`
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 1rem 0;

    input {
      ${typography.body1}
      border: 0.1rem solid ${({ theme }) => theme.colors.gray150};
      background-color: ${({ $isFocus, theme }) => ($isFocus ? '#F5EFF4' : theme.colors.gray150)};
      border-radius: 0.8rem;
      padding: 0 1rem;
      height: 4rem;
      color: #27173e;
    }

    i {
      cursor: pointer;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 1.2rem;
      bottom: 0;
      opacity: 0.5;
    }
  `,
  ValueLength: styled.p`
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.gray500};
  `,
};

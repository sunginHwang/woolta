import { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

export const Switch = ({ className, style, checked, disabled, ...rest }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <SC.Container className={className} style={style} $checked={checked} $disabled={disabled}>
      <SC.Checkbox {...rest} type='checkbox' checked={checked} disabled={disabled} />
    </SC.Container>
  );
};

const SC = {
  Container: styled.div<{
    $checked?: boolean;
    $disabled?: boolean;
  }>`
    transition: background-color 300ms;
    position: relative;
    width: 4.1rem;
    height: 2rem;
    background-color: ${({ $checked, theme }) => ($checked ? theme.colors.orangePrimary : theme.colors.gray200)};
    border-radius: 15px;
    display: flex;
    align-items: center;
    padding: 2px;
    opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};

    &::before {
      transition: transform 300ms;
      content: '';
      width: 1.8rem;
      height: 1.8rem;
      background-color: ${({ theme }) => theme.colors.white};
      border-radius: 100%;
      transform: translateX(${({ $checked }) => ($checked ? '120%' : '0')});
    }
  `,
  Checkbox: styled.input`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
  `,
};

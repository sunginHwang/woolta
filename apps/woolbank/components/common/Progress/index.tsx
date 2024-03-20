import { gray500 } from '@wds';
import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
  percent: number;
  color: string;
  label: string | number;
  labelSuffix?: string;
  labelPrefix?: string;
  startMessage?: string;
  endMessage?: string;
  messageColor?: string;
}

/**
 * 공통 - 프로그레스 영역
 * @component
 */

export const Progress: FC<Props> = ({
  percent,
  color,
  label,
  labelPrefix = '',
  labelSuffix = '',
  startMessage = '',
  endMessage = '',
  messageColor = gray500,
}) => {
  return (
    <SC.ProgressWrapper>
      <SC.Label $percent={percent}>
        {labelPrefix}
        {label}
        {labelSuffix}
      </SC.Label>
      <SC.Progress>
        <SC.Bar $percent={percent} $color={color} />
      </SC.Progress>
      <SC.Info $color={messageColor}>
        <span>{startMessage}</span>
        <span>{endMessage}</span>
      </SC.Info>
    </SC.ProgressWrapper>
  );
};

const SC = {
  ProgressWrapper: styled.div`
    width: 100%;
  `,
  Label: styled.span<{ $percent: number }>`
    width: 5rem;
    max-width: 6rem;
    height: 3rem;
    left: ${({ $percent }) => $percent}%;
    top: -1.2rem;
    line-height: 3rem;
    text-align: center;
    background: ${({ theme }) => theme.colors.red500};
    color: ${({ theme }) => theme.colors.white};
    font-size: 1.4rem;
    display: block;
    position: relative;
    transform: translate(-50%, 0);
    border-radius: 2.3rem;

    &:before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-top: 0.5rem solid ${({ theme }) => theme.colors.red500};
      border-left: 0.5rem solid transparent;
      border-right: 0.5rem solid transparent;
      top: 100%;
      left: 50%;
      margin-left: -0.5rem;
      margin-top: -0.1rem;
    }
  `,
  Progress: styled.div`
    height: 0.5rem;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.gray600};
    border-radius: 1.2rem;
  `,
  Bar: styled.div<{
    $percent: number;
    $color: string;
  }>`
    height: 0.5rem;
    border-radius: 1.2rem;
    width: ${({ $percent }) => $percent}%;
    background-color: ${({ $color }) => $color};
  `,
  Info: styled.div<{ $color: string }>`
    display: flex;
    width: 100%;
    margin-top: 0.5rem;
    justify-content: space-between;

    > span {
      font-size: 1.2rem;
      color: ${({ $color }) => $color};
    }
  `,
};

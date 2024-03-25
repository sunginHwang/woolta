import { Text } from '@wds';
import { FC, HTMLAttributes } from 'react';
import { styled } from 'styled-components';

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  text: string;
}

/**
 * 가계부 레이블 필터 - 레이블 텍스트
 * @component
 */
const Label: FC<Props> = ({ text, onClick, ...rest }) => {
  return (
    <SC.Label onClick={onClick}>
      <Text variant='small1Regular' color='gray900' as='span' {...rest}>
        {text}
      </Text>
    </SC.Label>
  );
};

export default Label;

const SC = {
  Label: styled.div`
    display: inline;
    border-radius: 1.3rem;
    padding: 0.8rem 1.5rem;
    background-color: ${({ theme }) => theme.colors.gray150};
    margin-right: 1rem;
  `,
};

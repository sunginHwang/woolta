import styled from '@emotion/styled';
import { Text } from '@wds';
import { FC, HTMLAttributes } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  text: string;
}

const Label: FC<Props> = ({ text, ...rest }) => {
  return (
    <SC.Label variant='small1Regular' color='gray900' as='span' {...rest}>
      {text}
    </SC.Label>
  );
};

export default Label;

const SC = {
  Label: styled(Text)`
    border-radius: 1.3rem;
    padding: 0.8rem 1.5rem;
    background-color: ${({ theme }) => theme.colors.gray150};
    margin-right: 1rem;
  `,
};

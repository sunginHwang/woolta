import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { HTMLAttributes } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  text: string;
}

const styles = stylex.create({
  label: {
    display: 'inline',
    borderRadius: '1.3rem',
    paddingBlock: '0.8rem',
    paddingInline: '1.5rem',
    backgroundColor: colorVars['--color-gray150'],
    marginRight: '1rem',
  },
});

/**
 * 가계부 레이블 필터 - 레이블 텍스트
 * @component
 */
export const Label = ({ text, onClick, ...rest }: Props) => {
  return (
    <div {...stylex.props(styles.label)} onClick={onClick}>
      <Text variant='small1Regular' color='gray900' as='span' {...rest}>
        {text}
      </Text>
    </div>
  );
};

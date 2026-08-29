import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { FiCheckSquare } from 'react-icons/fi';

export const EmptyView = () => {
  return (
    <div {...stylex.props(styles.empty)}>
      <FiCheckSquare size={28} />
      <Text as='p' variant='body3' color='textTertiary' alignment='center'>
        할 일을 선택하면
        <br />
        상세 내용이 표시돼요
      </Text>
    </div>
  );
};

const styles = stylex.create({
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.2rem',
    height: '100%',
    color: colorVars['--color-textDisabled'],
  },
});

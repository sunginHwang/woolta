import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';

interface Props {
  message: string;
}

export const Empty = ({ message }: Props) => {
  return <div {...stylex.props(styles.emptyList)}>{message}</div>;
};

const styles = stylex.create({
  emptyList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: colorVars['--color-gray600'],
    fontSize: '1.8rem',
    height: '30%',
  },
});

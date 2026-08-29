import * as stylex from '@stylexjs/stylex';
import type { FC } from 'react';
import { HashLoader } from 'react-spinners';

interface Props {
  isLoading: boolean;
}

const styles = stylex.create({
  container: {
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    verticalAlign: 'middle',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  loader: {
    zIndex: 1001,
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

const Loading: FC<Props> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.loader)}>
        <HashLoader color='#6E827F' loading />
      </div>
    </div>
  );
};

export default Loading;

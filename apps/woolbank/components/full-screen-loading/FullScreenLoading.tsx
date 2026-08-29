import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { ClipLoader } from 'react-spinners';
import Deem from '../atom/Deem';

interface Props {
  loading?: boolean;
  message?: string;
}

export const FullScreenLoading = ({ loading = false, message }: Props) => {
  return (
    <Deem visible={loading}>
      <div {...stylex.props(styles.spinnerLoading)}>
        <ClipLoader color='#f25e5e' size={40} />
        {message && (
          <Text variant='small1Regular' color='white' as='p' xstyle={styles.message}>
            {message}
          </Text>
        )}
      </div>
    </Deem>
  );
};

const styles = stylex.create({
  spinnerLoading: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: '2rem',
    opacity: 0.7,
  },
});

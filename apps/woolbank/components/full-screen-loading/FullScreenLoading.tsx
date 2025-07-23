import { Text } from '@wds';
import { ClipLoader } from 'react-spinners';
import { styled, useTheme } from 'styled-components';
import Deem from '../atom/Deem';

interface Props {
  loading?: boolean;
  message?: string;
}

export const FullScreenLoading = ({ loading = false, message }: Props) => {
  const { colors } = useTheme();

  return (
    <Deem visible={loading}>
      <SC.SpinnerLoading>
        <ClipLoader color={colors.orangePrimary} size={40} />
        {message && (
          <Text className='message' variant='small1Regular' color='white' as='p'>
            {message}
          </Text>
        )}
      </SC.SpinnerLoading>
    </Deem>
  );
};

const SC = {
  SpinnerLoading: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .message {
      margin-top: 2rem;
      opacity: 0.7;
    }
  `,
};

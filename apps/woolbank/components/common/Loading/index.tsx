import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Text } from '@wds';
import { FC } from 'react';
import { ClipLoader } from 'react-spinners';
import Deem from '../Modal/Deem';

interface Props {
  loading: boolean;
  message?: string;
}

const Loading: FC<Props> = ({ loading, message }) => {
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

export default Loading;

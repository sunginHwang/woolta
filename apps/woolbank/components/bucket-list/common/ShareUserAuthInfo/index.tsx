import { Text } from '@wds';
import styled from 'styled-components';

export const ShareUserAuthInfo = () => {
  return (
    <SC.Container>
      <div>
        <Text variant='title2Bold' color='gray900' as='h2' alignment='center' mt={16}>
          공유 코드 유저는
          <br /> 사용 불가능한 페이지 입니다.
        </Text>
        <Text variant='body2' color='gray600' as='h2' alignment='center' mt={20} mb={16}>
          계정으로 로그인하여
          <br /> 사용해보세요.!!
        </Text>
      </div>
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    padding: 3rem 1.6rem 1.6rem 1.6rem;

    > div {
      padding: 2rem 0;
      border-radius: 0.8rem;
      background-color: ${({ theme }) => theme.colors.pink050};
    }
  `,
};

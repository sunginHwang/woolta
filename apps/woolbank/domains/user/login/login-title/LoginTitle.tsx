import { Text } from '@wds';
import styled from 'styled-components';

/**
 * 로그인 페이지 제목
 * @component
 */
export const LoginTitle = () => {
  return (
    <SC.LoginTitle>
      <Text variant='title1Bold' color='gray900' as='h2'>
        로그인
      </Text>
    </SC.LoginTitle>
  );
};

const SC = {
  LoginTitle: styled.div`
    margin-top: 5rem;
    margin-bottom: 4rem;
  `,
};

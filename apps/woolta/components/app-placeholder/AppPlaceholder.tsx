'use client';

import { Text } from '@wds';
import { styled } from 'styled-components';

interface Props {
  title: string;
  description: string;
}

const AppPlaceholder = ({ title, description }: Props) => {
  return (
    <SC.Container>
      <Text as='h1' variant='title3Bold' color='textPrimary'>
        {title}
      </Text>
      <Text variant='body2' color='textSecondary' mt={8}>
        {description}
      </Text>
    </SC.Container>
  );
};

export default AppPlaceholder;

const SC = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  `,
};

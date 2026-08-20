'use client';

import { styled } from 'styled-components';
import layouts from '../_shared/layouts';
import { Content } from './content/Content';
import { Title } from './title/Title';

export const Post = () => {
  return (
    <SC.Container>
      <Title />
      <Content />
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    text-align: left;
    margin-top: 3.2rem;

    @media screen and (max-width: ${layouts.mobileWidth}) {
      padding: 0 2rem 0 2rem;
    }

    @media screen and (max-width: ${layouts.phoneWidth}) {
      padding: 0 1.6rem 0 1.6rem;
    }
  `,
};

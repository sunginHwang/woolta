import { Suspense } from 'react';
import { styled } from 'styled-components';
import { ChipsLoading } from '../../common/chips/ChipsLoading';
import { Categories } from './Categories';
import { Content } from './Content';
import { Title } from './Title';

export const PostEditor = () => {
  return (
    <SC.Container>
      <Title />
      <Suspense fallback={<ChipsLoading />}>
        <Categories />
      </Suspense>
      <Content />
    </SC.Container>
  );
};


const SC = {
  Container: styled.div`
    width: 100%;
    height: 100%;
  `,
};

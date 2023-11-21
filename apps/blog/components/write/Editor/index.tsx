import styled from '@emotion/styled';
import Categories from './Categories';
import Content from './Content';
import Title from './Title';

const Editor = () => {
  return (
    <SC.Container>
      <Title />
      <Categories />
      <Content />
    </SC.Container>
  );
};

export default Editor;

const SC = {
  Container: styled.div`
    width: 100%;
    height: 100%;
  `,
};

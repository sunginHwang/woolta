import * as stylex from '@stylexjs/stylex';
import { Suspense } from 'react';
import { ChipsLoading } from '../../common/Chips/ChipsLoading';
import { Categories } from './Categories';
import { Content } from './Content';
import { Title } from './Title';

const styles = stylex.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export const PostEditor = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <Title />
      <Suspense fallback={<ChipsLoading />}>
        <Categories />
      </Suspense>
      <Content />
    </div>
  );
};

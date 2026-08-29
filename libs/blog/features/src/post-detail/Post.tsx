'use client';

import * as stylex from '@stylexjs/stylex';
import { Content } from './content/Content';
import { Title } from './title/Title';

const styles = stylex.create({
  container: {
    textAlign: 'left',
    marginTop: '3.2rem',
    paddingBlock: 0,
    paddingInline: {
      default: 0,
      '@media (max-width: 1024px)': '2rem',
      '@media (max-width: 450px)': '1.6rem',
    },
  },
});

export const Post = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <Title />
      <Content />
    </div>
  );
};

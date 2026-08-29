'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { makeArray } from '../_shared/utils/array';

const styles = stylex.create({
  container: {
    maxWidth: '1200px',
    marginBlock: 0,
    marginInline: 'auto',
    paddingLeft: {
      default: 0,
      '@media (max-width: 1024px)': '2rem',
      '@media (max-width: 450px)': '1rem',
    },
    paddingRight: {
      default: 0,
      '@media (max-width: 1024px)': '2rem',
      '@media (max-width: 450px)': '1rem',
    },
  },
  postItem: {
    textAlign: 'left',
    paddingBottom: {
      default: '1em',
      '@media (max-width: 450px)': '0.5em',
    },
    paddingTop: {
      default: '1.7em',
      '@media (max-width: 450px)': '1.2em',
    },
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-gray600'],
  },
  line: {
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
});

export const PostListSkeleton = () => {
  return (
    <div {...stylex.props(styles.container)}>
      {makeArray(10).map((index) => (
        <div key={index} {...stylex.props(styles.postItem)}>
          <div {...stylex.props(styles.line)}>
            <SkeletonBar width='65%' height='2.88rem' />
          </div>
          <div {...stylex.props(styles.line)}>
            <SkeletonBar width='60%' height='1.7rem' />
            <SkeletonBar width='80%' height='1.7rem' />
            <SkeletonBar width='40%' height='1.7rem' />
          </div>
          <div {...stylex.props(styles.line)}>
            <SkeletonBar width='15%' height='1.28rem' />
          </div>
        </div>
      ))}
    </div>
  );
};

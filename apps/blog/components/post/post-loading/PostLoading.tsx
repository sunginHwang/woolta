'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import { colorVars } from '@wds/tokens.stylex';

const styles = stylex.create({
  container: {
    textAlign: 'left',
    maxWidth: '1200px',
    marginBlock: 0,
    marginInline: 'auto',
    paddingLeft: {
      default: null,
      '@media screen and (max-width: 1024px)': '2rem',
      '@media screen and (max-width: 450px)': '1rem',
    },
    paddingRight: {
      default: null,
      '@media screen and (max-width: 1024px)': '2rem',
      '@media screen and (max-width: 450px)': '1rem',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-bgSecondary'],
  },
  title: {
    marginTop: '3rem',
    marginInline: 0,
    marginBottom: '5rem',
  },
  subInfo: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  content: {
    marginTop: '3.2rem',
  },
});

export const PostLoading = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.header)}>
        <SkeletonBar {...stylex.props(styles.title)} width='65%' height='2.6rem' />
        <div {...stylex.props(styles.subInfo)}>
          <SkeletonBar width='147px' height='1.6rem' />
        </div>
      </div>
      <SkeletonBar {...stylex.props(styles.content)} width='100%' height='100rem' />
    </div>
  );
};

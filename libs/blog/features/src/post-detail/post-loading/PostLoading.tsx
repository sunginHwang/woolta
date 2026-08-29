'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import { colorVars } from '@wds/tokens.stylex';

const styles = stylex.create({
  container: {
    textAlign: 'left',
    marginTop: '2rem',
    paddingBlock: {
      default: 0,
      '@media (max-width: 1024px)': 0,
    },
    paddingInline: {
      default: 0,
      '@media (max-width: 1024px)': '2rem',
      '@media (max-width: 450px)': '1.6rem',
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
  titleBar: {
    marginTop: '3rem',
    marginBottom: '5rem',
    marginInline: 0,
  },
  subInfo: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  contentBar: {
    marginTop: '3.2rem',
  },
});

export const PostLoading = () => {
  const titleSx = stylex.props(styles.titleBar);
  const contentSx = stylex.props(styles.contentBar);

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.header)}>
        <SkeletonBar className={titleSx.className} width='65%' height='2.6rem' />
        <div {...stylex.props(styles.subInfo)}>
          <SkeletonBar width='147px' height='1.6rem' />
        </div>
      </div>
      <SkeletonBar className={contentSx.className} width='100%' height='100rem' />
    </div>
  );
};

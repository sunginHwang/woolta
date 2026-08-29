'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { layoutConsts } from '../../../style/layouts.stylex';
import { makeArray } from '../../../utils/array';

const styles = stylex.create({
  container: {
    maxWidth: layoutConsts.contentMaxWidth,
    marginBlock: 0,
    marginInline: 'auto',
    paddingLeft: { default: null, '@media screen and (max-width: 1024px)': '2rem' },
    paddingRight: { default: null, '@media screen and (max-width: 1024px)': '2rem' },
  },
  // phoneWidth(450px) 는 mobileWidth(1024px) 보다 좁아 뒤에 와야 last-wins 로 덮는다
  containerPhone: {
    paddingLeft: { default: null, '@media screen and (max-width: 450px)': '1rem' },
    paddingRight: { default: null, '@media screen and (max-width: 450px)': '1rem' },
  },
  postItem: {
    textAlign: 'left',
    paddingBottom: { default: '1em', '@media screen and (max-width: 450px)': '0.5em' },
    paddingTop: { default: '1.7em', '@media screen and (max-width: 450px)': '1.2em' },
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-gray600'],
  },
  line: {
    marginBottom: '1.5rem',
  },
  // 원본의 `* + * { margin-top: 0.5rem }` — 자손 선택자를 못 쓰므로 두 번째 이후 항목에 직접 준다
  stacked: {
    marginTop: '0.5rem',
  },
});

export const PostListSkeleton = () => {
  return (
    <div {...stylex.props(styles.container, styles.containerPhone)}>
      {makeArray(10).map((index) => (
        <div key={index} {...stylex.props(styles.postItem)}>
          <div {...stylex.props(styles.line)}>
            <SkeletonBar width='65%' height='2.88rem' />
          </div>
          <div {...stylex.props(styles.line)}>
            <SkeletonBar width='60%' height='1.7rem' />
            <SkeletonBar width='80%' height='1.7rem' xstyle={styles.stacked} />
            <SkeletonBar width='40%' height='1.7rem' xstyle={styles.stacked} />
          </div>
          <div {...stylex.props(styles.line)}>
            <SkeletonBar width='15%' height='1.28rem' />
          </div>
        </div>
      ))}
    </div>
  );
};

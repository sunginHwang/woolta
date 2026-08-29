'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import { colorVars } from '@wds/tokens.stylex';

export default function Loading() {
  const { className: titleCls } = stylex.props(styles.headerTitle);

  return (
    <>
      <header {...stylex.props(styles.header)}>
        <SkeletonBar className={titleCls} width='100%' height='5.2rem' radius={18} />
        <SkeletonBar width='100%' height='8rem' radius={18} />
        <div {...stylex.props(styles.bar)} />
      </header>
      <main {...stylex.props(styles.content)}>
        {[...Array(10)].map((_, index) => {
          return (
            <div {...stylex.props(styles.item)} key={index}>
              <div {...stylex.props(styles.itemTop)}>
                <SkeletonBar width='9rem' height='3rem' />
                <SkeletonBar width='6rem' height='2.1rem' />
              </div>
              <SkeletonBar width='100%' height='6.3rem' radius={18} />
            </div>
          );
        })}
      </main>
    </>
  );
}

const styles = stylex.create({
  header: {
    paddingTop: '3rem',
    paddingInline: '1.6rem',
    paddingBottom: 0,
  },
  headerTitle: {
    marginBottom: '2rem',
  },
  bar: {
    backgroundColor: colorVars['--color-gray100'],
    height: '0.7rem',
    marginTop: '2rem',
  },
  content: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
  item: {
    marginTop: '3rem',
  },
  itemTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
});

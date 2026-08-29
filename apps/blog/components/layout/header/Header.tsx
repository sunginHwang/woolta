import { useScrollDirection } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import Link from 'next/link';

const styles = stylex.create({
  header: {
    position: 'sticky',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '4.8rem',
    height: {
      default: '4.8rem',
      '@media screen and (max-width: 1024px)': '4.8rem',
    },
    top: 0,
    right: 0,
    left: 0,
    zIndex: zIndexConsts.header,
    backgroundColor: colorVars['--color-white'],
    color: colorVars['--color-customGray'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-bgSecondary'],
    paddingInline: '1.6rem',
    transitionProperty: {
      default: null,
      '@media screen and (max-width: 1024px)': 'all',
    },
    transitionDuration: {
      default: null,
      '@media screen and (max-width: 1024px)': '0.2s',
    },
    transitionTimingFunction: {
      default: null,
      '@media screen and (max-width: 1024px)': 'ease-in-out',
    },
  },
  headerHidden: {
    top: {
      default: 0,
      '@media screen and (max-width: 1024px)': '-6rem',
    },
    borderBottomWidth: {
      default: '1px',
      '@media screen and (max-width: 1024px)': 0,
    },
    borderBottomStyle: {
      default: 'solid',
      '@media screen and (max-width: 1024px)': 'none',
    },
    borderBottomColor: {
      default: colorVars['--color-bgSecondary'],
      '@media screen and (max-width: 1024px)': 'transparent',
    },
  },
  headerLogo: {
    fontWeight: 'bolder',
    fontSize: '2rem',
    cursor: 'pointer',
  },
});

export const Header = () => {
  const scroll_direction = useScrollDirection();
  const isHideHeader = scroll_direction === 'down';

  return (
    <div {...stylex.props(styles.header, isHideHeader && styles.headerHidden)}>
      <Link href='/'>
        <p {...stylex.props(styles.headerLogo)}>woolta</p>
      </Link>
    </div>
  );
};

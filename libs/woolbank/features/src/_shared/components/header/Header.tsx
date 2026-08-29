'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { PropsWithChildren, ReactNode } from 'react';
import { layout } from '../../style/layout';
import SubHeader from './SubHeader';

interface Props extends PropsWithChildren {
  title: string | ReactNode;
  iconColor?: string;
  useBackButton?: boolean;
  onBackClick?: () => void;
  right?: React.ReactNode | string;
  bgColor?: string;
}

const dynamicStyles = stylex.create({
  innerBgColor: (bgColor: string) => ({
    backgroundColor: bgColor,
  }),
});

/**
 * 페이지 헤더 영역
 * @component
 */
const _Header = ({ title, right, bgColor }: Props) => {
  const isTextTitle = typeof title === 'string';
  const resolvedBgColor = bgColor ?? colorVars['--color-white'];

  return (
    <header {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.inner, dynamicStyles.innerBgColor(resolvedBgColor))}>
        {isTextTitle && (
          <Text variant='title4Bold' color='grayPrimary' data-cy='title'>
            {title}
          </Text>
        )}
        {!isTextTitle && title}
        <div {...stylex.props(styles.rightHeader)}>{right}</div>
      </div>
    </header>
  );
};

const styles = stylex.create({
  container: {
    position: 'sticky',
    left: 0,
    top: 0,
    width: '100%',
    zIndex: zIndexConsts.header,
  },
  inner: {
    height: layout.headerHeight,
    paddingLeft: '1.6rem',
    paddingRight: '1.6rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightHeader: {
    paddingTop: '0.4rem',
    color: colorVars['--color-graySecondary'],
  },
});

export const Header = Object.assign(_Header, {
  Sub: SubHeader,
});

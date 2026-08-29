'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import Link from 'next/link';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof Link>;

/**
 * 추가버튼 -  우측 하단 고정
 * @component
 */
export const AddButton = ({ ...rest }: Props) => {
  return (
    <aside>
      <Link data-cy='addButton' {...rest} {...stylex.props(typographyStyles.title1Bold, styles.container)}>
        +
      </Link>
    </aside>
  );
};

const styles = stylex.create({
  container: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 'calc(env(safe-area-inset-bottom, 0px) + 8rem)',
    right: '2rem',
    width: '5rem',
    height: '5rem',
    color: colorVars['--color-white'],
    backgroundColor: colorVars['--color-red500'],
    borderRadius: '100%',
    boxShadow: '0.2rem 0.2rem 0.5rem 0.2rem rgba(0, 0, 0, 0.16)',
    zIndex: zIndexConsts.floatButton,
  },
});

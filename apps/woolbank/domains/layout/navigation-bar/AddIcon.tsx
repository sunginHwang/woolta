'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import Link from 'next/link';
import { useUserInfo } from '../../../hooks/queries/useUserInfo';

const styles = stylex.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '4rem',
    height: '4rem',
    color: colorVars['--color-white'],
    backgroundColor: colorVars['--color-red500'],
    borderRadius: '100%',
    boxShadow: '0.2rem 0.2rem 0.5rem 0.2rem rgba(0, 0, 0, 0.16)',
  },
});

export const AddButton = () => {
  const { isShareUser } = useUserInfo();

  if (isShareUser) {
    return null;
  }

  return (
    <Link
      {...stylex.props(typographyStyles.title1Bold, styles.container)}
      href='/account-books/save'
      data-cy='addButton'
    >
      +
    </Link>
  );
};

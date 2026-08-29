'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  onClick?: () => void;
  children?: ReactNode;
}

export const FormField = ({ title, onClick, children }: Props) => {
  return (
    <div {...stylex.props(styles.formLabel)} onClick={onClick}>
      <Text xstyle={styles.label} variant='body3' color='textTertiary'>
        {title}
      </Text>
      <div {...stylex.props(styles.info)}>
        <div {...stylex.props(styles.item)}>{children}</div>
      </div>
    </div>
  );
};

const styles = stylex.create({
  formLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '5.2rem',
  },
  label: {
    width: '16rem',
  },
  info: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flex: 1,
  },
});

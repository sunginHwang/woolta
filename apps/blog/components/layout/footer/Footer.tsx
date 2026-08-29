import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { ComponentProps } from 'react';
import { useLayout } from '../hooks/useLayout';

const styles = stylex.create({
  container: {
    height: '8rem',
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorVars['--color-white'],
    borderTopWidth: '0.1rem',
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-bgSecondary'],
    color: colorVars['--color-blogPrimary'],
    textAlign: 'center',
    paddingTop: '1.6rem',
    paddingBottom: '3rem',
    paddingInline: 0,
  },
});

const text_style: Pick<ComponentProps<typeof Text>, 'variant' | 'color'> = {
  variant: 'body3',
  color: 'graySecondary',
};

export const Footer = () => {
  const { isEditMode } = useLayout();

  if (!isEditMode) {
    return null;
  }

  return (
    <div {...stylex.props(styles.container)}>
      <Text {...text_style} mb={10}>
        Copyright © 2018 woolta.com
      </Text>
      <Text {...text_style}>gommpo111@gmail.com</Text>
    </div>
  );
};

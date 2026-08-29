'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';

interface Props {
  title: string;
  description: string;
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

const AppPlaceholder = ({ title, description }: Props) => {
  return (
    <div {...stylex.props(styles.container)}>
      <Text as='h1' variant='title3Bold' color='textPrimary'>
        {title}
      </Text>
      <Text variant='body2' color='textSecondary' mt={8}>
        {description}
      </Text>
    </div>
  );
};

export default AppPlaceholder;

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { ReactNode } from 'react';

interface Props {
  title: string;
  onClick?: () => void;
  children?: ReactNode;
}

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

export const FormField = ({ title, onClick, children }: Props) => {
  return (
    <div {...stylex.props(styles.formLabel)} onClick={onClick}>
      <Text className='label' variant='body3' color='gray600' xstyle={styles.label}>
        {title}
      </Text>
      <div {...stylex.props(styles.info)}>
        <div {...stylex.props(styles.item)}>{children}</div>
      </div>
    </div>
  );
};

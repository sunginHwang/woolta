import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import noData from './images/no_data.svg';

interface Props {
  msg: string;
}

/**
 * 데이터 없는 경우 노출 영역
 * @component
 */

export const EmptyInfo = ({ msg }: Props) => {
  return (
    <div {...stylex.props(styles.emptyData)}>
      <img src={noData} alt='emptyDataImg' style={{ width: '60%', margin: '4rem 0', height: 'auto' }} />
      <Text variant='body1' color='grayInactive' as='p' alignment='center' xstyle={styles.text}>
        {msg}
      </Text>
    </div>
  );
};

const styles = stylex.create({
  emptyData: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    paddingInline: '2rem',
    marginTop: '2rem',
  },
});

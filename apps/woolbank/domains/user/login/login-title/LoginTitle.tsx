import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';

const styles = stylex.create({
  loginTitle: {
    marginTop: '5rem',
    marginBottom: '4rem',
  },
});

/**
 * 로그인 페이지 제목
 * @component
 */
export const LoginTitle = () => {
  return (
    <div {...stylex.props(styles.loginTitle)}>
      <Text variant='title1Bold' color='gray900' as='h2'>
        로그인
      </Text>
    </div>
  );
};

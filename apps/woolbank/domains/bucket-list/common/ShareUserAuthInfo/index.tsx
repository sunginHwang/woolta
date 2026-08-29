import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';

const styles = stylex.create({
  container: {
    paddingTop: '3rem',
    paddingRight: '1.6rem',
    paddingBottom: '1.6rem',
    paddingLeft: '1.6rem',
  },
  innerBox: {
    paddingBlock: '2rem',
    paddingInline: 0,
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-pink050'],
  },
});

export const ShareUserAuthInfo = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.innerBox)}>
        <Text variant='title2Bold' color='gray900' as='h2' alignment='center' mt={16}>
          공유 코드 유저는
          <br /> 사용 불가능한 페이지 입니다.
        </Text>
        <Text variant='body2' color='gray600' as='h2' alignment='center' mt={20} mb={16}>
          계정으로 로그인하여
          <br /> 사용해보세요.!!
        </Text>
      </div>
    </div>
  );
};

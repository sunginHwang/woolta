'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '1.6rem',
  },
  retryButton: {
    paddingBlock: '0.8rem',
    paddingInline: '1.6rem',
    borderRadius: '0.8rem',
    fontSize: '1.3rem',
    color: colorVars['--color-interactivePrimary'],
    backgroundColor: {
      default: colorVars['--color-bgSurfaceSecondary'],
      ':hover': colorVars['--color-borderSubtle'],
    },
  },
});

interface Props {
  error: Error;
  /** 해당 세그먼트를 다시 렌더한다 */
  reset: () => void;
}

/**
 * 캘린더 화면의 에러 경계.
 * 일정·공유 조회가 suspense 라 실패는 throw 로 올라오고 여기서 받는다.
 */
export default function CalendarError({ reset }: Props) {
  return (
    <div {...stylex.props(styles.container)}>
      <Text as='p' variant='body3' color='textTertiary' alignment='center'>
        캘린더를 불러오지 못했어요
        <br />
        잠시 후 다시 시도해주세요
      </Text>
      <button type='button' {...stylex.props(styles.retryButton)} onClick={reset}>
        다시 시도
      </button>
    </div>
  );
}

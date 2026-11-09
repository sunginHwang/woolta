import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import { colorVars } from '@wds/tokens.stylex';

const styles = stylex.create({
  page: {
    minHeight: '100dvh',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '5.6rem',
    paddingInline: '1.6rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    paddingTop: '0.4rem',
    paddingInline: '1.6rem',
  },
});

/**
 * 정기지출 화면 로딩 스켈레톤 — 요약 카드·이체 일정 카드 자리를 잡아 둔다.
 * @component
 */
const RegularExpenditureSkeleton = () => (
  <div {...stylex.props(styles.page)}>
    <div {...stylex.props(styles.header)}>
      <SkeletonBar width='8rem' height='2.4rem' />
    </div>
    <div {...stylex.props(styles.content)}>
      <SkeletonBar width='100%' height='22rem' radius={16} />
      <SkeletonBar width='100%' height='40rem' radius={16} />
    </div>
  </div>
);

export default RegularExpenditureSkeleton;

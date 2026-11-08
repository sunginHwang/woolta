import * as stylex from '@stylexjs/stylex';
import { darkSemanticTokens, lightSemanticTokens } from '../../lib/style/colors';
import type { ShadowTokens } from '../../lib/style/shadows';
import { darkShadows, lightShadows } from '../../lib/style/shadows';
import { typographyStyles } from '../../lib/style/typography.stylex';

/** Foundations/Shadows 문서용 블록 — 라이트/다크 배경 위에서 같은 토큰을 나란히 비교한다 */

const styles = stylex.create({
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(28rem, 1fr))', gap: '1.6rem' },
  panel: { padding: '2.4rem', borderRadius: '1.2rem' },
  panelTitle: { marginBottom: '1.6rem' },
  box: {
    height: '8rem',
    borderRadius: '0.8rem',
    marginBottom: '1.6rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: { fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' },
});

const dynamic = stylex.create({
  panel: (bg: string, color: string) => ({ backgroundColor: bg, color }),
  box: (shadow: string, bg: string) => ({ boxShadow: shadow, backgroundColor: bg }),
});

const Panel = ({
  title,
  shadows,
  bg,
  surface,
  text,
}: {
  title: string;
  shadows: ShadowTokens;
  bg: string;
  surface: string;
  text: string;
}) => (
  <div {...stylex.props(styles.panel, dynamic.panel(bg, text))}>
    <div {...stylex.props(typographyStyles.title5Bold, styles.panelTitle)}>{title}</div>
    {(Object.keys(shadows) as Array<keyof ShadowTokens>).map((key) => (
      <div key={key}>
        <div {...stylex.props(typographyStyles.body3, styles.box, dynamic.box(shadows[key], surface))}>{key}</div>
        <p {...stylex.props(typographyStyles.small1Regular, styles.code)}>{shadows[key]}</p>
      </div>
    ))}
  </div>
);

export const ShadowSamples = () => (
  <div {...stylex.props(styles.row)}>
    <Panel
      title='Light'
      shadows={lightShadows}
      bg={lightSemanticTokens.bgPage}
      surface={lightSemanticTokens.bgSurface}
      text={lightSemanticTokens.textPrimary}
    />
    <Panel
      title='Dark'
      shadows={darkShadows}
      bg={darkSemanticTokens.bgPage}
      surface={darkSemanticTokens.bgSurface}
      text={darkSemanticTokens.textPrimary}
    />
  </div>
);

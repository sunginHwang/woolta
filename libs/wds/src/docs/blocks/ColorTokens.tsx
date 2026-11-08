import * as stylex from '@stylexjs/stylex';
import type { SemanticColorTokens } from '../../lib/style/colors';
import { darkSemanticTokens, lightSemanticTokens, palette } from '../../lib/style/colors';
import { colorVars } from '../../lib/style/tokens.stylex';
import { typographyStyles } from '../../lib/style/typography.stylex';

/**
 * Foundations/Colors 문서용 블록.
 * palette(Base) 와 semanticTokens(Semantic) 를 소스 그대로 읽어 그리므로 값이 어긋나지 않는다.
 */

const styles = stylex.create({
  section: { marginBottom: '3.2rem' },
  groupTitle: {
    marginBottom: '1.2rem',
    color: colorVars['--color-textPrimary'],
    textTransform: 'capitalize',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))',
    gap: '1.2rem',
  },
  swatch: {
    height: '5.6rem',
    borderRadius: '0.8rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
  },
  name: { marginTop: '0.6rem', color: colorVars['--color-textPrimary'] },
  value: { color: colorVars['--color-textTertiary'], fontFamily: 'ui-monospace, monospace' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    paddingBlock: '0.8rem',
    paddingInline: '0.8rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderDefault'],
    color: colorVars['--color-textSecondary'],
  },
  td: {
    paddingBlock: '0.8rem',
    paddingInline: '0.8rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderFaint'],
    color: colorVars['--color-textPrimary'],
    verticalAlign: 'middle',
  },
  groupRow: {
    paddingTop: '2rem',
    paddingBottom: '0.4rem',
    paddingInline: '0.8rem',
    color: colorVars['--color-textSecondary'],
  },
  pair: { display: 'inline-flex', alignItems: 'center', gap: '0.8rem' },
  chip: {
    width: '3.6rem',
    height: '2.4rem',
    borderRadius: '0.4rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(128, 128, 128, 0.4)',
    flexShrink: 0,
  },
  code: {
    fontFamily: 'ui-monospace, monospace',
    color: colorVars['--color-textSecondary'],
  },
});

const dynamic = stylex.create({
  bg: (color: string) => ({ backgroundColor: color }),
});

const Swatch = ({ name, value }: { name: string; value: string }) => (
  <div>
    <div {...stylex.props(styles.swatch, dynamic.bg(value))} />
    <div {...stylex.props(typographyStyles.body4Medium, styles.name)}>{name}</div>
    <div {...stylex.props(typographyStyles.small1Regular, styles.value)}>{value}</div>
  </div>
);

/** Base 토큰 — palette.ts 의 모든 그룹을 스케일 순서대로 보여준다 */
export const PaletteTable = () => (
  <div>
    {Object.entries(palette).map(([group, scale]) => (
      <section key={group} {...stylex.props(styles.section)}>
        <h3 {...stylex.props(typographyStyles.title5Bold, styles.groupTitle)}>{group}</h3>
        <div {...stylex.props(styles.grid)}>
          {typeof scale === 'string' ? (
            <Swatch name={group} value={scale} />
          ) : (
            Object.entries(scale).map(([step, value]) => <Swatch key={step} name={`${group}.${step}`} value={value} />)
          )}
        </div>
      </section>
    ))}
  </div>
);

const SEMANTIC_GROUPS: Array<{ prefix: string; label: string; usage: string }> = [
  { prefix: 'text', label: 'Text', usage: '글자색. 위계(primary/secondary/tertiary)와 상태(active/inactive/disabled)' },
  { prefix: 'bg', label: 'Background', usage: '페이지·표면·떠 있는 레이어·오버레이 배경' },
  { prefix: 'border', label: 'Border', usage: '구분선과 테두리. 강도별(faint/subtle/default/strong)' },
  { prefix: 'interactive', label: 'Interactive', usage: '버튼·링크 등 사용자가 누르는 요소의 기본/hover/disabled' },
  { prefix: 'brand', label: 'Brand', usage: 'Woolta 브랜드 핑크. 강조 포인트에만 쓴다' },
  { prefix: 'status', label: 'Status', usage: '성공/경고/오류/정보 피드백' },
];

const semanticKeys = Object.keys(lightSemanticTokens) as Array<keyof SemanticColorTokens>;

/** Semantic 토큰 — 라이트/다크 값을 나란히 비교한다 */
export const SemanticTokenTable = () => (
  <table {...stylex.props(typographyStyles.body3, styles.table)}>
    <thead>
      <tr>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>토큰</th>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>Light</th>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>Dark</th>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>StyleX</th>
      </tr>
    </thead>
    <tbody>
      {SEMANTIC_GROUPS.map(({ prefix, label, usage }) => (
        <GroupRows key={prefix} prefix={prefix} label={label} usage={usage} />
      ))}
    </tbody>
  </table>
);

const GroupRows = ({ prefix, label, usage }: { prefix: string; label: string; usage: string }) => {
  const keys = semanticKeys.filter((key) => key.startsWith(prefix));

  return (
    <>
      <tr>
        <td colSpan={4} {...stylex.props(typographyStyles.body4Medium, styles.groupRow)}>
          {label} — {usage}
        </td>
      </tr>
      {keys.map((key) => (
        <tr key={key}>
          <td {...stylex.props(styles.td)}>{key}</td>
          <td {...stylex.props(styles.td)}>
            <span {...stylex.props(styles.pair)}>
              <span {...stylex.props(styles.chip, dynamic.bg(lightSemanticTokens[key]))} />
              <span {...stylex.props(typographyStyles.small1Regular, styles.code)}>{lightSemanticTokens[key]}</span>
            </span>
          </td>
          <td {...stylex.props(styles.td)}>
            <span {...stylex.props(styles.pair)}>
              <span {...stylex.props(styles.chip, dynamic.bg(darkSemanticTokens[key]))} />
              <span {...stylex.props(typographyStyles.small1Regular, styles.code)}>{darkSemanticTokens[key]}</span>
            </span>
          </td>
          <td {...stylex.props(styles.td)}>
            <span {...stylex.props(typographyStyles.small1Regular, styles.code)}>colorVars['--color-{key}']</span>
          </td>
        </tr>
      ))}
    </>
  );
};

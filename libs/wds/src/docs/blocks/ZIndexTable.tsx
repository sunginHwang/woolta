import * as stylex from '@stylexjs/stylex';
import { colorVars } from '../../lib/style/tokens.stylex';
import { typographyStyles } from '../../lib/style/typography.stylex';
import { zIndex } from '../../lib/style/zIndex';

/** Foundations/Z-Index 문서용 블록 — zIndex.ts 를 값 오름차순으로 표시한다 */

const DESCRIPTION: Record<keyof typeof zIndex, string> = {
  navigationBar: '하단 네비게이션 바',
  header: '상단 헤더',
  phase: '페이지 전환 레이어',
  floatButton: '플로팅 액션 버튼',
  layer: '드롭다운·팝오버 등 일반 레이어',
  modalDeem: '모달과 딤(Confirm 포함)',
  fullDeem: '전체 화면 딤(바텀시트)',
  notification: '토스트·알림. 항상 최상단',
};

const styles = stylex.create({
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
  },
  code: { fontFamily: 'ui-monospace, monospace', color: colorVars['--color-textSecondary'] },
});

const rows = (Object.entries(zIndex) as [keyof typeof zIndex, number][]).sort((a, b) => a[1] - b[1]);

export const ZIndexTable = () => (
  <table {...stylex.props(typographyStyles.body3, styles.table)}>
    <thead>
      <tr>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>토큰</th>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>값</th>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>용도</th>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>StyleX</th>
      </tr>
    </thead>
    <tbody>
      {rows.map(([key, value]) => (
        <tr key={key}>
          <td {...stylex.props(styles.td)}>{key}</td>
          <td {...stylex.props(styles.td)}>{value}</td>
          <td {...stylex.props(styles.td)}>{DESCRIPTION[key]}</td>
          <td {...stylex.props(typographyStyles.small1Regular, styles.td, styles.code)}>zIndexConsts.{key}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

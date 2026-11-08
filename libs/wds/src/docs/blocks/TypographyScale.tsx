import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect, useRef, useState } from 'react';
import { colorVars } from '../../lib/style/tokens.stylex';
import type { FontVarient } from '../../lib/style/typography.stylex';
import { typographyStyles } from '../../lib/style/typography.stylex';

/**
 * Foundations/Typography 문서용 블록.
 * 스케일 값은 typography.stylex.ts 에서 컴파일되어 클래스명만 남으므로,
 * 실제 렌더 결과를 getComputedStyle 로 읽어 표시한다 — 문서와 구현이 어긋나지 않는다.
 */

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
    paddingBlock: '1.2rem',
    paddingInline: '0.8rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderFaint'],
    color: colorVars['--color-textPrimary'],
    verticalAlign: 'middle',
  },
  sample: { color: colorVars['--color-textPrimary'], whiteSpace: 'nowrap' },
  spec: { color: colorVars['--color-textTertiary'], fontFamily: 'ui-monospace, monospace', whiteSpace: 'nowrap' },
});

const variants = Object.keys(typographyStyles) as FontVarient[];

const SAMPLE = '다람쥐 헌 쳇바퀴에 타고파 Woolta 1234';

const Row = ({ variant }: { variant: FontVarient }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [spec, setSpec] = useState('');

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { fontSize, lineHeight, fontWeight } = getComputedStyle(ref.current);
    setSpec(`${fontSize} / ${lineHeight} · ${fontWeight}`);
  }, []);

  return (
    <tr>
      <td {...stylex.props(typographyStyles.body4Medium, styles.td)}>{variant}</td>
      <td {...stylex.props(styles.td)}>
        <span ref={ref} {...stylex.props(typographyStyles[variant], styles.sample)}>
          {SAMPLE}
        </span>
      </td>
      <td {...stylex.props(typographyStyles.small1Regular, styles.td, styles.spec)}>{spec}</td>
    </tr>
  );
};

export const TypographyScale = () => (
  <table {...stylex.props(styles.table)}>
    <thead>
      <tr>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>variant</th>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>샘플</th>
        <th {...stylex.props(typographyStyles.body4Medium, styles.th)}>size / line-height · weight</th>
      </tr>
    </thead>
    <tbody>
      {variants.map((variant) => (
        <Row key={variant} variant={variant} />
      ))}
    </tbody>
  </table>
);

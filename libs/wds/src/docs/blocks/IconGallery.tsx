import * as stylex from '@stylexjs/stylex';
import { ICON_NAMES, icons } from '../../lib/icons';
import { colorVars } from '../../lib/style/tokens.stylex';
import { typographyStyles } from '../../lib/style/typography.stylex';

/** Foundations/Icons 문서용 블록 — icons 레코드를 그대로 읽어 그린다 */

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))',
    gap: '1.2rem',
  },
  cell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
    paddingBlock: '1.6rem',
    paddingInline: '0.8rem',
    borderRadius: '0.8rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderFaint'],
    color: colorVars['--color-textPrimary'],
  },
  name: {
    color: colorVars['--color-textSecondary'],
    fontFamily: 'ui-monospace, monospace',
    textAlign: 'center',
    wordBreak: 'break-all',
  },
  row: { display: 'flex', alignItems: 'center', gap: '2.4rem', color: colorVars['--color-textPrimary'] },
  item: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' },
  caption: { color: colorVars['--color-textTertiary'], fontFamily: 'ui-monospace, monospace' },
});

export const IconGallery = () => (
  <div {...stylex.props(styles.grid)}>
    {ICON_NAMES.map((name) => {
      const Icon = icons[name];
      return (
        <div key={name} {...stylex.props(styles.cell)}>
          <Icon size={24} />
          <span {...stylex.props(typographyStyles.small2Regular, styles.name)}>{name}</span>
        </div>
      );
    })}
  </div>
);

const SIZES = [16, 20, 24, 32] as const;

export const IconSizeRow = () => (
  <div {...stylex.props(styles.row)}>
    {SIZES.map((size) => (
      <div key={size} {...stylex.props(styles.item)}>
        <icons.IconPigOutline size={size} />
        <span {...stylex.props(typographyStyles.small1Regular, styles.caption)}>{size}px</span>
      </div>
    ))}
  </div>
);

const COLORS = [
  { label: 'textPrimary', value: colorVars['--color-textPrimary'] },
  { label: 'interactivePrimary', value: colorVars['--color-interactivePrimary'] },
  { label: 'textTertiary', value: colorVars['--color-textTertiary'] },
] as const;

export const IconColorRow = () => (
  <div {...stylex.props(styles.row)}>
    {COLORS.map(({ label, value }) => (
      <div key={label} {...stylex.props(styles.item)}>
        <icons.IconCircleCheck size={32} color={value} />
        <span {...stylex.props(typographyStyles.small1Regular, styles.caption)}>{label}</span>
      </div>
    ))}
  </div>
);
